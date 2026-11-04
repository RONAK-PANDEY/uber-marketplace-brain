"""
api/rider.py — REST endpoints for the Rider App.

Endpoints:
  POST /api/rider/request    — Submit a ride request
  GET  /api/rider/status/:id — Get status of a ride request
  POST /api/rider/cancel/:id — Cancel a pending request
  POST /api/rider/chat       — Ask the marketplace agent a question

TODO:
  - Implement request creation (store in DB + engine)
  - Add ETA calculation (from driver location to pickup zone)
  - Add rider authentication (JWT)
  - Add WebSocket per-rider status updates
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

# from app.auth.jwt_handler import get_current_user  # TODO: enable auth

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class RideRequestCreate(BaseModel):
    pickup_zone_id: int
    dropoff_zone_id: int
    rider_id: str          # TODO: derive from JWT token instead


class ChatQuery(BaseModel):
    message: str
    rider_id: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/request")
async def create_ride_request(body: RideRequestCreate) -> dict:
    """
    Submit a new ride request.

    TODO: validate zone IDs (1–12)
    TODO: add to engine's pending_requests
    TODO: persist to DB
    TODO: return ETA estimate
    """
    return {
        "request_id": "TODO",
        "status": "pending",
        "estimated_wait_seconds": 0,
        "note": "TODO: implement ride request creation",
    }


@router.get("/status/{request_id}")
async def get_request_status(request_id: str) -> dict:
    """
    Get the current status of a ride request.

    TODO: query engine or DB for request status
    TODO: include driver ETA if matched
    """
    return {
        "request_id": request_id,
        "status": "TODO",
        "driver_eta_seconds": None,
        "note": "TODO: implement status lookup",
    }


@router.post("/cancel/{request_id}")
async def cancel_request(request_id: str) -> dict:
    """
    Cancel a pending ride request.

    TODO: remove from engine.pending_requests
    TODO: update DB record
    TODO: notify matched driver if already matched
    """
    return {"request_id": request_id, "status": "cancelled", "note": "TODO: implement"}


@router.post("/chat")
async def rider_chat(body: ChatQuery) -> dict:
    """
    Allow riders to ask questions (e.g., "Why is my wait so long?").

    TODO: route to appropriate agent via agents/router.py
    TODO: inject current marketplace context
    """
    return {
        "response": "TODO: implement rider chat via agent router",
        "agent_type": "TODO",
    }

