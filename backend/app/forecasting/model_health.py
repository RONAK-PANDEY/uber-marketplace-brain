"""Model health checks + automatic fallback to the frozen baseline.  ALL DATA IS SYNTHETIC.

get_forecast(snapshot_history) -> (forecast, source, reason)
  source: "model" | "baseline";  reason: "OK" or "FALLBACK: ..."

Unhealthy if (a) inputs are stale (snapshot older than max_age min, or a zone missing
from the latest snapshot) or (b) rolling WAPE of the ML model's past forecasts vs
actuals exceeds wape_threshold. The ML model is shadow-scored every tick even while
in fallback, so it can recover automatically.
"""
from collections import deque

from . import baseline, demand_model
from .common import HORIZON, all_zones


class HealthMonitor:
    def __init__(self, max_age=5, wape_threshold=0.40, window=60, min_samples=30,
                 expected_zones=None, ml_predict=None, baseline_predict=None):
        self.max_age, self.wape_threshold = max_age, wape_threshold
        self.window, self.min_samples = window, min_samples
        self.expected_zones = expected_zones
        self.ml = ml_predict or demand_model.predict
        self.base = baseline_predict or baseline.predict
        self.reset()

    def reset(self):
        self.pending = {}                       # tick made -> ML forecast
        self.scores = deque(maxlen=self.window)  # (abs_err_sum, actual_sum, n_zones)

    # ---- rolling error ----
    def rolling_wape(self):
        if len(self.scores) < self.min_samples:
            return None
        act = sum(s[1] for s in self.scores)
        return None if act <= 0 else sum(s[0] for s in self.scores) / act

    def rolling_mae(self):
        n = sum(s[2] for s in self.scores)
        return None if n == 0 else sum(s[0] for s in self.scores) / n

    def _resolve(self, history, tick):
        by_tick = {s["tick"]: s for s in history}
        for t0 in [t for t in self.pending if t + HORIZON <= tick]:
            fc = self.pending.pop(t0)
            win = [by_tick.get(t) for t in range(t0 + 1, t0 + HORIZON + 1)]
            if any(w is None for w in win):
                continue
            # only score zones that reported in every tick of the window
            zs = [z for z in fc if all(z in w["requests"] for w in win)]
            if not zs:
                continue
            act = {z: sum(w["requests"][z] for w in win) for z in zs}
            self.scores.append((sum(abs(fc[z] - act[z]) for z in zs), sum(act.values()), len(zs)))

    # ---- input checks ----
    def _stale_reason(self, history, zones, tick, now):
        age = now - tick
        if age > self.max_age:
            return f"stale inputs, snapshot {age} min old"
        latest = history[-1]["requests"]
        parts = []
        for z in zones:
            if z not in latest:
                n = 0
                for s in reversed(history):
                    if z in s["requests"]:
                        break
                    n += 1
                parts.append(f"zone {z} missing for {n} min")
        return ("stale inputs, " + "; ".join(parts)) if parts else None

    def get_forecast(self, snapshot_history, now_tick=None):
        if not snapshot_history:
            raise ValueError("empty snapshot_history")
        tick = snapshot_history[-1]["tick"]
        now = tick if now_tick is None else now_tick
        zones = self.expected_zones or all_zones(snapshot_history)

        stale = self._stale_reason(snapshot_history, zones, tick, now)
        if stale:
            return self.base(snapshot_history), "baseline", f"FALLBACK: {stale}"
        try:
            fc = self.ml(snapshot_history)
        except Exception as e:  # missing artifact, bad features, ...
            return self.base(snapshot_history), "baseline", f"FALLBACK: model error ({type(e).__name__}: {e})"

        self.pending.setdefault(tick, fc)
        self._resolve(snapshot_history, tick)
        w = self.rolling_wape()
        if w is not None and w > self.wape_threshold:
            return (self.base(snapshot_history), "baseline",
                    f"FALLBACK: rolling WAPE {w:.2f} > {self.wape_threshold:.2f}")
        return fc, "model", "OK"


_default = HealthMonitor()


def get_forecast(snapshot_history, now_tick=None):
    """Module-level convenience using a shared default monitor."""
    return _default.get_forecast(snapshot_history, now_tick)


def configure(**kw):
    global _default
    _default = HealthMonitor(**kw)
