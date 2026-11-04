"""Shared helpers for the forecasting package.  ALL DATA IS SYNTHETIC."""
import numpy as np

DATA_LABEL = "SYNTHETIC"
HORIZON = 15                 # forecast horizon, minutes
LAGS = (5, 15, 30, 60)       # lag windows, minutes
MAX_LAG = max(LAGS)

_WEATHER = {"clear": 0.0, "cloudy": 0.1, "drizzle": 0.4, "rain": 1.0,
            "heavy_rain": 2.0, "storm": 2.5}


def weather_value(w):
    """Map whatever the engine reports as weather to a single float (rain intensity)."""
    if w is None:
        return 0.0
    if isinstance(w, (int, float, np.number)):
        return float(w)
    if isinstance(w, dict):
        for k in ("rain", "rain_intensity", "intensity"):
            if k in w:
                return float(w[k])
        return 0.0
    return _WEATHER.get(str(w).lower(), 0.0)


def time_feats(s):
    """(hour_of_day, day_of_week). Uses snapshot keys if present, else derives from tick."""
    tick = int(s.get("tick", 0))
    return int(s.get("hour", (tick // 60) % 24)), int(s.get("dow", (tick // 1440) % 7))


def all_zones(history):
    zs = set()
    for s in history:
        zs.update(s["requests"].keys())
    return sorted(zs)


def request_matrix(history, zones):
    """(T, Z) matrix of per-tick requests; missing zone/tick entries count as 0."""
    return np.array([[s["requests"].get(z, 0) for z in zones] for s in history], dtype=float)
