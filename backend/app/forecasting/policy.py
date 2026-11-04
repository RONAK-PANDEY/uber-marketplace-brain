"""Repositioning policies.  ALL DATA IS SYNTHETIC.

Policy callback contract (see sim_adapter.py): policy(snapshot) -> [(from_zone, to_zone, n_drivers), ...]
"""
import math
from collections import deque

from .model_health import HealthMonitor
from .supply_model import predict_supply


def baseline_policy(snapshot):
    """No repositioning: idle drivers stay where they are."""
    return []


class ProposedPolicy:
    """Move idle drivers from forecast-surplus zones to forecast-deficit zones.

    gap[z] = forecast_demand[z] / demand_per_driver - predicted_supply[z]
    gap > 0 -> deficit (needs drivers); gap < 0 -> surplus (can donate, capped by idle).
    Because predicted supply already counts 'incoming' drivers, drivers already en route
    (including earlier repositioning, if the engine counts it) are not double-sent.
    """

    def __init__(self, monitor=None, min_gap=1.0, max_move_frac=0.5, demand_per_driver=1.0):
        self.monitor = monitor or HealthMonitor()
        self.min_gap, self.max_move_frac, self.dpd = min_gap, max_move_frac, demand_per_driver
        self.history = deque(maxlen=120)
        self.log = []                            # (tick, source, reason) per call

    def __call__(self, snapshot):
        self.history.append(snapshot)
        fc, source, reason = self.monitor.get_forecast(list(self.history), now_tick=snapshot["tick"])
        self.log.append((snapshot["tick"], source, reason))
        supply = predict_supply(snapshot)
        idle = snapshot.get("idle", {})
        gap = {z: fc.get(z, 0.0) / self.dpd - supply.get(z, 0) for z in supply}

        donors = {}
        for z, g in gap.items():
            if g <= -self.min_gap:
                cap = min(int(idle.get(z, 0) * self.max_move_frac), math.floor(-g))
                if cap > 0:
                    donors[z] = cap
        moves = []
        for z, g in sorted(((z, g) for z, g in gap.items() if g >= self.min_gap),
                           key=lambda x: -x[1]):
            need = int(round(g))
            for dz in sorted(donors, key=donors.get, reverse=True):
                if need <= 0:
                    break
                n = min(need, donors[dz])
                if n > 0:
                    moves.append((dz, z, n))
                    donors[dz] -= n
                    need -= n
        return moves
