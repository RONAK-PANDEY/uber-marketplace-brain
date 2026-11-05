"""LightGBM next-15-min demand model per zone.  ALL DATA IS SYNTHETIC.

Train:  python -m forecasting.demand_model --seed 7 --ticks 10080
"""
import argparse
import os
import pickle
import numpy as np

try:
    import lightgbm as lgb
except ImportError:
    lgb = None

try:
    import pandas as pd
except ImportError:
    pd = None

from .common import (DATA_LABEL, HORIZON, LAGS, MAX_LAG, all_zones, request_matrix,
                     time_feats, weather_value)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "artifacts", "demand_model.pkl")
FEATURES = ["zone", "lag_5", "lag_15", "lag_30", "lag_60", "hour", "dow", "weather"]
_cache = {}


def _frame(R, ts, hours, dows, wx, zones):
    """Feature rows for 'now' = row indices ts of request matrix R. hours/dows/wx aligned to ts."""
    Z, n = len(zones), len(ts)
    cs = np.vstack([np.zeros((1, Z)), np.cumsum(R, axis=0)])   # cs[t] = sum(R[:t])
    cols = {f"lag_{L}": (cs[ts + 1] - cs[ts + 1 - L]).ravel() for L in LAGS}
    df = pd.DataFrame(cols)
    df.insert(0, "zone", np.tile(np.arange(Z), n))
    df["hour"] = np.repeat(hours, Z)
    df["dow"] = np.repeat(dows, Z)
    df["weather"] = np.repeat(wx, Z)
    return df


def build_dataset(history):
    """history: list of snapshots from one simulator run -> DataFrame with target = requests in next 15 min."""
    zones = all_zones(history)
    R = request_matrix(history, zones)
    T, Z = R.shape
    ts = np.arange(MAX_LAG - 1, T - HORIZON)
    hd = np.array([time_feats(s) for s in history])
    wx = np.array([weather_value(s.get("weather")) for s in history])
    df = _frame(R, ts, hd[ts, 0], hd[ts, 1], wx[ts], zones)
    cs = np.vstack([np.zeros((1, Z)), np.cumsum(R, axis=0)])
    df["target"] = (cs[ts + HORIZON + 1] - cs[ts + 1]).ravel()
    df["t"] = np.repeat(ts, Z)
    df["zone_id"] = np.tile(np.array(zones, dtype=object), len(ts))
    return df


def train(df, path=MODEL_PATH, train_seed=None, seed=0):
    """Fit on first 80% of time, early-stop on last 20%. Saves artifact; returns (artifact, holdout_wape)."""
    zones = sorted(df["zone_id"].unique())
    df = df.sort_values("t")
    cut = df["t"].quantile(0.8)
    tr, va = df[df["t"] <= cut], df[df["t"] > cut]
    model = lgb.LGBMRegressor(objective="poisson", n_estimators=600, learning_rate=0.05,
                              num_leaves=31, min_child_samples=40, subsample=0.8,
                              subsample_freq=1, colsample_bytree=0.9, random_state=seed,
                              verbose=-1)
    model.fit(tr[FEATURES], tr["target"], eval_set=[(va[FEATURES], va["target"])],
              categorical_feature=["zone"], callbacks=[lgb.early_stopping(30, verbose=False)])
    pred = model.predict(va[FEATURES])
    wape = float(np.abs(pred - va["target"]).sum() / max(va["target"].sum(), 1e-9))
    art = {"model": model, "zones": zones, "data": DATA_LABEL,
           "train_seed": train_seed, "holdout_wape": wape}
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(art, f)
    _cache.pop(path, None)
    return art, wape


def load(path=MODEL_PATH):
    if path not in _cache:
        if os.path.exists(path):
            with open(path, "rb") as f:
                _cache[path] = pickle.load(f)
        else:
            try:
                from app.simulator.city import N_ZONES
            except ImportError:
                N_ZONES = 12
            _cache[path] = {
                "zones": list(range(N_ZONES)),
                "train_seed": None,
                "model": None,
            }
    return _cache[path]


def predict(snapshot_history, model_path=MODEL_PATH):
    """-> {zone: predicted requests in next 15 min}. (SYNTHETIC)"""
    art = load(model_path)
    zones = art["zones"]
    if art.get("model") is None or pd is None or lgb is None:
        try:
            from app.forecasting import baseline
        except ImportError:
            from . import baseline
        return baseline.predict(snapshot_history)
    hist = snapshot_history[-MAX_LAG:]
    R = request_matrix(hist, zones)
    if len(R) < MAX_LAG:                      # early in a run: left-pad with zeros
        R = np.vstack([np.zeros((MAX_LAG - len(R), len(zones))), R])
    last = hist[-1]
    hour, dow = time_feats(last)
    df = _frame(R, np.array([len(R) - 1]), np.array([hour]), np.array([dow]),
                np.array([weather_value(last.get("weather"))]), zones)
    p = np.clip(art["model"].predict(df[FEATURES]), 0, None)
    return {z: float(v) for z, v in zip(zones, p)}


if __name__ == "__main__":
    import sim_adapter
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=7, help="TRAINING seed (must differ from eval seed)")
    ap.add_argument("--ticks", type=int, default=10080)
    ap.add_argument("--out", default=MODEL_PATH)
    a = ap.parse_args()
    _, snaps = sim_adapter.run(a.seed, a.ticks, policy=None, events=None)
    art, wape = train(build_dataset(snaps), a.out, train_seed=a.seed)
    print(f"[{DATA_LABEL}] trained on seed={a.seed}, {a.ticks} ticks; holdout WAPE={wape:.3f}; saved {a.out}")
