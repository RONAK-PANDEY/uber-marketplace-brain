"""Predicted supply per zone.  ALL DATA IS SYNTHETIC.

supply = idle + incoming - finishing_trips   (per the spec: finishing trips leave the zone).
Can be negative; the policy treats it as-is.
"""


def predict_supply(snapshot):
    zones = set(snapshot.get("idle", {})) | set(snapshot.get("incoming", {})) | set(snapshot.get("finishing_15", {}))
    return {z: snapshot.get("idle", {}).get(z, 0)
               + snapshot.get("incoming", {}).get(z, 0)
               - snapshot.get("finishing_15", {}).get(z, 0)
            for z in sorted(zones)}
