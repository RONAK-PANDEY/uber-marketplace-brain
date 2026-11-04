"""
agents/earnings_agent.py — Answers driver earnings and shift strategy questions.

Example queries:
  - "What's the best time to drive this week?"
  - "How much have I earned today vs yesterday?"
  - "Should I keep driving or log off?"

TODO:
  - Connect to driver earnings history (from DB)
  - Compute shift efficiency (earnings per hour)
  - Recommend optimal hours based on demand forecast + driver preferences
  - Handle earnings privacy carefully (only show own data)
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class EarningsAgent:
    """
    Specialist agent for driver earnings questions.
    Has access to the driver's personal earnings history and shift data.
    """

    SYSTEM_PROMPT = """You are a personal earnings coach for a ride-hailing driver.
You have access to this driver's earnings history, completed rides, and shift data.
Give specific, motivating advice based on their actual numbers.
Never make up earnings figures — use only the data provided.

TODO: refine this prompt with real driver data examples.
"""

    def __init__(self) -> None:
        # TODO: inject LLMProvider and DB session
        pass

    async def respond(self, query: str, context: Optional[dict] = None) -> str:
        """
        Generate a response about earnings or shift strategy.

        Args:
            query: Driver's question about earnings.
            context: Dict with driver_id, earnings history, current shift data.

        Returns:
            LLM-generated earnings advice string.

        TODO: fetch real earnings from DB (context['driver_id'])
        TODO: compute shift metrics (earnings/hr, acceptance rate, etc.)
        """
        return (
            "TODO: implement EarningsAgent.respond(). "
            "This should return personalized earnings analysis and advice."
        )

