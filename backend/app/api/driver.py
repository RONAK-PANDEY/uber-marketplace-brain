"""
api/driver.py — REST endpoints for the Driver App.

Endpoints:
  GET  /api/driver/hint/:driver_id    — Get current positioning hint
  POST /api/driver/hint/accept        — Accept a positioning hint
  POST /api/driver/hint/reject        — Reject a positioning hint
  GET  /api/driver/earnings/:driver_id— Get driver earnings summary
  POST /api/driver/chat               — Ask the earnings/onboarding agent

TODO:
  - Add driver authentication (JWT with 'driver' role)
  - Track hint acceptance rate per driver
  - Return richer earnings breakdown (by hour, by zone)
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class HintResponse(BaseModel):
    driver_id: str
    accepted: bool
    hint_id: Optional[str] = None


class DriverChatQuery(BaseModel):
    message: str
    driver_id: str


@router.get("/hint/{driver_id}")
async def get_positioning_hint(driver_id: str) -> dict:
    """
    Return the current positioning hint for a driver.

    TODO: query PositioningRecommender for this driver's current hint
    TODO: require driver JWT auth
    """
    return {
        "driver_id": driver_id,
        "action": "stay",
        "target_zone_id": None,
        "reason": "TODO: implement hint retrieval",
        "confidence": 0.0,
        "note": "TODO: connect to PositioningRecommender",
    }


@router.post("/hint/accept")
async def accept_hint(body: HintResponse) -> dict:
    """
    Record that a driver accepted their positioning hint.

    TODO: call AntiCrowdingFilter.record_acceptance(target_zone)
    TODO: persist acceptance in DB for recommendation analysis
    """
    return {"status": "recorded", "note": "TODO: implement acceptance tracking"}


@router.post("/hint/reject")
async def reject_hint(body: HintResponse) -> dict:
    """
    Record that a driver rejected their positioning hint.

    TODO: log rejection reason (if provided) for model improvement
    """
    return {"status": "recorded", "note": "TODO: implement rejection tracking"}


@router.get("/earnings/{driver_id}")
async def get_earnings(driver_id: str) -> dict:
    """
    Get current session earnings for a driver.

    TODO: query SimulatorEngine.drivers[driver_id] for stats
    TODO: query DB for historical earnings
    """
    return {
        "driver_id": driver_id,
        "session_earnings": 0.0,
        "completed_rides": 0,
        "earnings_per_hour": 0.0,
        "note": "TODO: connect to engine and DB",
    }


@router.post("/chat")
async def driver_chat(body: DriverChatQuery) -> dict:
    """
    Allow drivers to chat with the Explainable AI Assistant connected to Remote Ollama Server.
    Auto-routes to the optimal model based on query intent:
    - Numerical / Earnings / Math -> jaahas/qwen3.5-uncensored:4b
    - Causal / Why / Fairness / Deadhead -> huihui_ai/smallthinker-abliterated:3b
    - Operational / Navigation / General -> sam860/dolphin3-llama3.2:3b
    """
    import urllib.request
    import json
    import os

    ollama_url = os.environ.get("OLLAMA_URL", "http://10.151.32.198:11434").rstrip("/")
    msg = body.message.lower()

    if any(k in msg for k in ["earning", "fare", "rate", "fuel", "calc", "cost", "math", "money", "rupee", "payout", "bonus"]):
        model = "jaahas/qwen3.5-uncensored:4b"
        model_name = "Qwen 3.5 Uncensored (4B)"
        intent = "Numerical & Financial Precision"
    elif any(k in msg for k in ["why", "reason", "cause", "deadhead", "fair", "crowd", "explain", "because", "logic"]):
        model = "huihui_ai/smallthinker-abliterated:3b"
        model_name = "SmallThinker 3B"
        intent = "Deep Causal & Strategic Reasoning"
    else:
        model = "sam860/dolphin3-llama3.2:3b"
        model_name = "Dolphin3 LLaMA 3.2 (3B)"
        intent = "Fast Operational & Dispatch"

    system_prompt = (
        "You are CityPlus Driver Assistant, an AI expert helping ride-hailing drivers in Delhi NCR maximize their earnings and navigate surge zones.\n"
        "Driver Profile: Amit Kumar, DL 8C 7321, currently driving in Delhi NCR.\n"
        "Live Hotspots: Connaught Place (2.0x surge, ₹18.40/min), National Stadium North (2.4x surge, ₹17.10/min), Cyber City Gurugram (1.8x surge), Terminal 3 Airport (1.5x surge).\n\n"
        "Instructions:\n"
        "- If the driver asks a question about driving, trips, fares, earnings, surge hotspots, traffic, routes, deadhead empty miles, stadium dispersal, or EV charging in Delhi NCR, give a helpful, concise, and professional answer.\n"
        "- If the driver asks an off-topic question unrelated to driving, ride-hailing, or CityPlus (e.g., jokes, cooking, coding, history, general trivia, celebrities, homework, movies), you MUST respond with:\n"
        "\"I can assist only with CityPlus Driver marketplace operations, net earnings analysis, surge navigation, deadhead return risk, and trip dispatch strategy in Delhi NCR. Please ask a driver- or ride-hailing-related question.\""
    )

    payload = json.dumps({
        "model": model,
        "prompt": f"{system_prompt}\n\nQuestion: {body.message}\nAnswer:",
        "stream": False,
        "options": {"num_predict": 280, "temperature": 0.2}
    }).encode("utf-8")

    try:
        req = urllib.request.Request(f"{ollama_url}/api/generate", data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=45.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            text = (data.get("response") or "").strip()
            if not text and data.get("thinking"):
                text = data.get("thinking").strip()
            if text:
                return {
                    "response": text,
                    "model": model_name,
                    "model_id": model,
                    "intent": intent,
                    "source": "ollama-remote"
                }
    except Exception as exc:
        pass

    # Connection alert instead of fake pre-fed text
    return {
        "response": "⚠️ Could not reach Ollama model at 10.151.32.198:11434. Please ensure the Ollama server is running and accessible on the local network.",
        "model": model_name,
        "model_id": model,
        "intent": intent,
        "source": "offline-alert"
    }

