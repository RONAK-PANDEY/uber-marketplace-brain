"""Thin adapter between this package and YOUR simulator.  ALL DATA IS SYNTHETIC.

I did not have your engine's source, so everything engine-specific lives here.
Edit the three functions marked ADAPT; nothing else should need to change.

Assumed snapshot (dict, one per tick) -- keys used by forecasting/:
  tick:int, [hour:int, dow:int, optional], weather: float|str|dict,
  requests:{zone:int}      new requests this tick
  idle:{zone:int}, incoming:{zone:int}, finishing_15:{zone:int}
  unfulfilled:{zone:int}   requests that went unserved this tick
  active_events: list (unused by the models)
Assumed policy contract: policy(snapshot) -> [(from_zone, to_zone, n_drivers), ...]
"""


def build_events(specs):
    """ADAPT: map event spec dicts like
    {"type": "stadium_end"|"surge"|"rain", "zone": int, "start": tick, "duration": min, "magnitude": float}
    onto whatever events.py expects. specs=None -> the engine's default/random events."""
    return specs


def make_engine(seed, policy=None, events=None):
    """ADAPT: construct your engine with a fixed seed and the policy callback."""
    from engine import Engine                       # ADAPT import / constructor
    return Engine(seed=seed, policy=_wrap_policy(policy), events=build_events(events))


def _wrap_policy(policy):
    """ADAPT if your engine wants a different move format than [(from, to, n)]."""
    return policy


def run(seed, ticks, policy=None, events=None):
    """Run `ticks` minutes; returns (engine, [snapshot per tick])."""
    eng = make_engine(seed, policy, events)
    snaps = [eng.step() for _ in range(ticks)]      # ADAPT: eng.step() must return the snapshot
    return eng, snaps


def totals(engine, snaps):
    """Total and fulfilled requests. Prefers engine counters if they exist (ADAPT names),
    else derives fulfilled = requests - unfulfilled summed over ticks."""
    t, f = getattr(engine, "total_requests", None), getattr(engine, "fulfilled_requests", None)
    if t is not None and f is not None:
        return {"total_requests": int(t), "fulfilled_requests": int(f)}
    total = sum(sum(s["requests"].values()) for s in snaps)
    unf = sum(sum(s["unfulfilled"].values()) for s in snaps)
    return {"total_requests": int(total), "fulfilled_requests": int(total - unf)}
