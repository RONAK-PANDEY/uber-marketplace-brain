"""
api/admin.py — REST endpoints for the Admin Dashboard.

Endpoints:
  GET  /api/admin/state              — Full marketplace snapshot
  POST /api/admin/scenario/:name     — Trigger a scripted scenario
  GET  /api/admin/metrics            — Fulfilment rate vs baseline
  GET  /api/admin/llm_health         — LLM provider status
  POST /api/admin/reset              — Reset simulation to tick 0

TODO:
  - Add admin JWT auth (require_admin dependency)
  - Add scenario management (list available, trigger by name)
  - Add evaluation trigger endpoint (runs run_eval.py async)
"""

from fastapi import APIRouter, Depends
from typing import Optional

router = APIRouter()

AVAILABLE_SCENARIOS = ["stadium_surge", "rain_burst", "stale_model"]


@router.get("/state")
async def get_full_state() -> dict:
    """
    Return the full current marketplace state.

    TODO: query engine.get_state() and return as dict
    TODO: add require_admin dependency
    """
    return {"note": "TODO: return engine.get_state()"}


@router.post("/scenario/{scenario_name}")
async def trigger_scenario(scenario_name: str) -> dict:
    """
    Trigger one of the scripted demo scenarios.

    Available: stadium_surge, rain_burst, stale_model

    TODO: validate scenario_name against AVAILABLE_SCENARIOS
    TODO: call EventEngine.trigger_event() with appropriate event params
    TODO: for stale_model scenario, mock Ollama failure
    """
    if scenario_name not in AVAILABLE_SCENARIOS:
        return {"error": f"Unknown scenario. Available: {AVAILABLE_SCENARIOS}"}
    return {
        "scenario": scenario_name,
        "status": "triggered",
        "note": "TODO: implement scenario trigger logic",
    }


@router.get("/metrics")
async def get_metrics() -> dict:
    """
    Return current fulfilment rate vs baseline comparison.

    TODO: query engine for completed/total counts
    TODO: query BaselineForecaster for baseline prediction accuracy
    TODO: compute delta_fr (pp improvement over baseline)
    """
    return {
        "fulfilment_rate": 0.0,
        "baseline_fulfilment_rate": 0.0,
        "delta_fr_pp": 0.0,
        "total_requests": 0,
        "completed_requests": 0,
        "note": "TODO: connect to engine metrics",
    }


@router.get("/llm_health")
async def get_llm_health() -> dict:
    """
    Return LLM provider health status.

    TODO: query ModelHealthMonitor.status_dict()
    """
    return {
        "active_provider": "TODO",
        "status": "TODO",
        "fallback_count": 0,
        "note": "TODO: connect to ModelHealthMonitor",
    }


@router.post("/reset")
async def reset_simulation() -> dict:
    """
    Reset the simulation to tick 0 with the same seed.

    TODO: reinitialize SimulatorEngine with original seed
    TODO: clear all pending requests and driver states
    WARNING: This is destructive — add a confirmation param
    """
    return {"status": "reset", "note": "TODO: implement engine reset"}

