"""Frozen recent-demand baseline (no learning).  ALL DATA IS SYNTHETIC.

next-15-min demand = mean requests/min over the last N minutes * 15
"""
from .common import HORIZON, all_zones, request_matrix

N_MINUTES = 30


def predict(snapshot_history, n_minutes=N_MINUTES):
    recent = snapshot_history[-n_minutes:]
    zones = all_zones(recent)
    rate = request_matrix(recent, zones).mean(axis=0)
    return {z: float(r * HORIZON) for z, r in zip(zones, rate)}
