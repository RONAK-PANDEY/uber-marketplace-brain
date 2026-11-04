"""
agents/onboarding_agent.py — Guides new drivers through their first rides.

Example queries:
  - "How does ride acceptance work?"
  - "I just completed my first ride — what's next?"
  - "What's the best zone to start in?"

TODO:
  - Define onboarding stages (account setup → first ride → first 10 rides)
  - Track which stage the driver is at (from DB)
  - Generate contextual guidance for each stage
  - Add proactive nudges (push when driver has been idle 10+ min)
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)

ONBOARDING_STAGES = [
    "account_created",
    "app_tutorial_complete",
    "first_ride_complete",
    "ten_rides_complete",
    "fully_onboarded",
]


class OnboardingAgent:
    """
    Specialist agent for new driver onboarding guidance.
    """

    SYSTEM_PROMPT = """You are a friendly onboarding guide for a new ride-hailing driver.
Explain things clearly and simply. Use bullet points for steps.
Reference the driver's current onboarding stage when answering.
Be encouraging and supportive — first rides are stressful!

TODO: refine with real onboarding flow content.
"""

    def __init__(self) -> None:
        # TODO: inject LLMProvider and DB session
        pass

    async def respond(self, query: str, context: Optional[dict] = None) -> str:
        """
        Generate onboarding guidance for a new driver.

        Args:
            query: New driver's question.
            context: Dict with driver_id, current onboarding stage, completed_rides.

        Returns:
            LLM-generated onboarding guidance string.

        TODO: determine current stage from context['completed_rides']
        TODO: generate stage-appropriate guidance
        TODO: mark stage as complete when driver progresses
        """
        return (
            "TODO: implement OnboardingAgent.respond(). "
            "This should return step-by-step onboarding guidance."
        )

    def get_stage(self, completed_rides: int) -> str:
        """
        Determine onboarding stage from completed ride count.

        TODO: add more nuanced stage detection (e.g., tutorial completion flag)
        """
        if completed_rides == 0:
            return "account_created"
        elif completed_rides < 1:
            return "app_tutorial_complete"
        elif completed_rides < 10:
            return "first_ride_complete"
        elif completed_rides < 50:
            return "ten_rides_complete"
        else:
            return "fully_onboarded"

