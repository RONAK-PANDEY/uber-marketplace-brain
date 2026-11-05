"""Thin adapter between this package and YOUR simulator.  ALL DATA IS SYNTHETIC.

Adapts engine.py snapshots and event scripts to the contract expected by forecasting/.
"""
from typing import Any, Dict, List, Optional

try:
    from app.simulator.engine import Engine
except ImportError:
    try:
        from ..simulator.engine import Engine
    except ImportError:
        from engine import Engine


def adapt_snapshot(snap: Dict[str, Any]) -> Dict[str, Any]:
    """Convert numpy array snapshot fields from Engine.snapshot() to dicts with zone keys."""
    if not isinstance(snap, dict):
        return snap
    requests = snap.get("requests")
    idle = snap.get("idle_drivers", snap.get("idle"))
    incoming = snap.get("incoming_drivers", snap.get("incoming"))
    finishing = snap.get("finishing_15")
    unfulfilled = snap.get("unfulfilled")

    req_dict = {i: int(v) for i, v in enumerate(requests)} if hasattr(requests, "__len__") and not isinstance(requests, dict) else (requests or {})
    idle_dict = {i: int(v) for i, v in enumerate(idle)} if hasattr(idle, "__len__") and not isinstance(idle, dict) else (idle or {})
    inc_dict = {i: int(v) for i, v in enumerate(incoming)} if hasattr(incoming, "__len__") and not isinstance(incoming, dict) else (incoming or {})
    fin_dict = {i: int(v) for i, v in enumerate(finishing)} if hasattr(finishing, "__len__") and not isinstance(finishing, dict) else (finishing or {})
    unf_dict = {i: int(v) for i, v in enumerate(unfulfilled)} if hasattr(unfulfilled, "__len__") and not isinstance(unfulfilled, dict) else (unfulfilled or {})

    adapted = dict(snap)
    adapted["tick"] = snap.get("t", snap.get("tick", 0))
    adapted["requests"] = req_dict
    adapted["idle"] = idle_dict
    adapted["incoming"] = inc_dict
    adapted["finishing_15"] = fin_dict
    adapted["unfulfilled"] = unf_dict
    return adapted


def build_events(specs):
    """ADAPT: map event spec dicts like
    {"type": "stadium_end"|"surge"|"rain", "zone": int, "start": tick, "duration": min, "magnitude": float}
    onto whatever events.py expects."""
    if not specs:
        return {}
    script = {}
    for sp in specs:
        start = sp.get("start", 0)
        dur = sp.get("duration", 30)
        mag = sp.get("magnitude", 1.0)
        kind = sp.get("type")
        zone = sp.get("zone", 0)
        if kind == "rain":
            fn = lambda e, d=dur, m=mag: e.events.trigger_rain(heavy=(m > 1.5), duration=d)
        elif kind == "stadium_end":
            fn = lambda e, z=zone, d=dur, m=mag: e.events.trigger_stadium_end(z, duration=d, magnitude=m)
        elif kind == "surge":
            fn = lambda e, z=zone, d=dur, m=mag: e.events.trigger_surge(z, multiplier=m, duration=d)
        else:
            continue
        script[start] = fn
    return script


def _wrap_policy(policy):
    """ADAPT policy callback from [(from, to, n)] into engine.reposition calls."""
    if policy is None:
        return None
    def wrapped(engine, raw_snap):
        adapted = adapt_snapshot(raw_snap)
        moves = policy(adapted)
        if moves:
            for item in moves:
                if len(item) == 3:
                    from_z, to_z, n = item
                    idle_ids = engine.idle_ids(from_z)[:n]
                    for d_id in idle_ids:
                        engine.reposition(d_id, to_z)
    return wrapped


def make_engine(seed, policy=None, events=None):
    """Construct Engine with a fixed seed and wrapped policy callback."""
    return Engine(seed=seed, policy=_wrap_policy(policy))


def run(seed, ticks, policy=None, events=None):
    """Run `ticks` minutes; returns (engine, [snapshot per tick])."""
    script = build_events(events)
    eng = make_engine(seed, policy, events)
    snaps = []
    for _ in range(ticks):
        if eng.t in script:
            script[eng.t](eng)
        eng.step()
        snaps.append(adapt_snapshot(eng.snapshot()))
    return eng, snaps


def totals(engine, snaps):
    """Total and fulfilled requests."""
    reqs = getattr(engine, "stats", {}).get("requests", 0)
    matched = getattr(engine, "stats", {}).get("matched", 0)
    if reqs > 0 or matched > 0:
        return {"total_requests": int(reqs), "fulfilled_requests": int(matched)}
    total = sum(sum(s["requests"].values()) for s in snaps)
    unf = sum(sum(s["unfulfilled"].values()) for s in snaps)
    return {"total_requests": int(total), "fulfilled_requests": int(total - unf)}
