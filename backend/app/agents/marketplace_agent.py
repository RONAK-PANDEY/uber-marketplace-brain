"""
agents/marketplace_agent.py — Answers zone-level supply/demand questions.

Example queries:
  - "Which zones have the most unmet demand right now?"
  - "Should I move to Zone 7 before the stadium ends?"
  - "Is there a surge happening near me?"

TODO:
  - Build system prompt with current zone states, weather, events
  - Call LLM provider with grounded context
  - Parse LLM response into structured PositioningHint if applicable
  - Add tool calls: get_zone_demand(), get_active_events(), get_surge_zones()
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class MarketplaceAgent:
    """
    Specialist agent for marketplace-level questions.
    Has access to real-time zone states, demand forecasts, and events.
    """

    SYSTEM_PROMPT = """You are an expert ride-hailing marketplace analyst.
You have access to real-time data about supply, demand, and events across 12 city zones.
Answer driver questions with specific, actionable advice backed by the data provided.
Always mention the zone name and estimated demand. Be concise (2-3 sentences max).

TODO: Replace this with a refined prompt after testing.
"""

    def __init__(self) -> None:
        # TODO: inject LLMProvider and SimulatorEngine reference
        pass

    async def respond(self, query: str, context: Optional[dict] = None) -> str:
        """
        Generate a grounded response to a marketplace query.

        Args:
            query: Driver's natural language question.
            context: Dict with current marketplace state for grounding.

        Returns:
            LLM-generated response string.

        TODO: build prompt with zone states, demand forecasts, events
        TODO: add tool use for dynamic data lookup
        """
        # Stub response
        return (
            "TODO: implement MarketplaceAgent.respond(). "
            "This should return LLM-generated zone demand advice."
        )

    def _build_context_block(self, context: dict) -> str:
        """
        Convert marketplace state dict into a human-readable context block
        to inject into the LLM prompt.

        TODO: implement zone state → text formatting
        """
        return "TODO: format zone states, weather, events into prompt context"

