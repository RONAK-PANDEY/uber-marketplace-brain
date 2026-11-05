"""Run the SAME seeded scenario with baseline vs proposed policy.  ALL DATA IS SYNTHETIC.

python -m evaluation.run_eval [--seed 2024] [--ticks 720] [--out results.json]
"""
import argparse
import json
import re
from collections import Counter

try:
    from app.forecasting import sim_adapter
    from app.forecasting import demand_model
    from app.forecasting.common import DATA_LABEL
    from app.forecasting.policy import ProposedPolicy, baseline_policy
except ImportError:
    try:
        from ..forecasting import sim_adapter
        from ..forecasting import demand_model
        from ..forecasting.common import DATA_LABEL
        from ..forecasting.policy import ProposedPolicy, baseline_policy
    except ImportError:
        import sim_adapter
        from forecasting import demand_model
        from forecasting.common import DATA_LABEL
        from forecasting.policy import ProposedPolicy, baseline_policy

EVAL_SEED = 2024
TICKS = 720
EVENTS = [  # ADAPT zone ids / fields in sim_adapter.build_events to match events.py
    {"type": "rain", "start": 120, "duration": 240, "magnitude": 1.0},
    {"type": "stadium_end", "zone": 2, "start": 300, "duration": 40, "magnitude": 4.0},
    {"type": "surge", "zone": 5, "start": 480, "duration": 30, "magnitude": 2.5},
]
SCENARIO = (f"{TICKS}-minute run: rain from t=120 for 240 min; stadium end in zone 2 at t=300 "
            "(40 min); demand surge in zone 5 at t=480 (30 min). Baseline policy = no repositioning.")


def rate(t):
    return t["fulfilled_requests"] / max(t["total_requests"], 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=EVAL_SEED)
    ap.add_argument("--ticks", type=int, default=TICKS)
    ap.add_argument("--out", default="results.json")
    a = ap.parse_args()

    art = demand_model.load()
    if art.get("train_seed") == a.seed:
        raise SystemExit("eval seed equals training seed; use a different --seed")

    eng_b, snaps_b = sim_adapter.run(a.seed, a.ticks, baseline_policy, EVENTS)
    tb = sim_adapter.totals(eng_b, snaps_b)
    pol = ProposedPolicy()
    eng_p, snaps_p = sim_adapter.run(a.seed, a.ticks, pol, EVENTS)
    tp = sim_adapter.totals(eng_p, snaps_p)

    same_demand = tb["total_requests"] == tp["total_requests"]
    rb, rp = rate(tb), rate(tp)
    n = len(pol.log)
    fb = [(t, r) for t, s, r in pol.log if s == "baseline"]
    reasons = Counter(re.sub(r"\d+(\.\d+)?", "#", r) for _, r in fb)
    results = {
        "data": DATA_LABEL,
        "seed": a.seed,
        "train_seed": art.get("train_seed"),
        "scenario": SCENARIO,
        "ticks": a.ticks,
        "baseline": {**tb, "fulfilment_rate": rb},
        "proposed": {**tp, "fulfilment_rate": rp},
        "baseline_fulfilment_rate": rb,
        "proposed_fulfilment_rate": rp,
        "gain_percentage_points": (rp - rb) * 100,
        "same_total_requests_both_runs": same_demand,
        "fallback": {
            "policy_calls": n,
            "fallback_calls": len(fb),
            "fallback_fraction": len(fb) / max(n, 1),
            "reasons_normalized": dict(reasons),
            "first_example_per_reason": {k: next(r for _, r in fb if re.sub(r"\d+(\.\d+)?", "#", r) == k)
                                         for k in reasons},
        },
    }
    with open(a.out, "w") as f:
        json.dump(results, f, indent=2, default=str)

    print(f"=== {DATA_LABEL} RESULTS (synthetic simulator, not real ride-hailing data) ===")
    print(f"seed={a.seed} (train seed={art.get('train_seed')})  ticks={a.ticks}")
    print(f"baseline fulfilment: {rb:.2%}   proposed: {rp:.2%}   gain: {(rp - rb) * 100:+.2f} pp")
    print(f"fallback used in {len(fb)}/{n} policy calls; reasons: {dict(reasons) or 'none'}")
    if not same_demand:
        print("WARNING: total requests differ between runs; demand depends on policy, comparison is not like-for-like")
    print(f"wrote {a.out}")


if __name__ == "__main__":
    main()
