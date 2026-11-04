import re

try:
    from app.agents.base import IDK, Context, Specialist, ToolBox, phrase
except ImportError:
    from .base import IDK, Context, Specialist, ToolBox, phrase

_ZONE = re.compile(r"\bzone\s*[:#]?\s*([A-Za-z0-9_-]+)", re.I)
# a driver ID named in the question (assumed to contain a digit, e.g. D1042)
_DRIVER = re.compile(r"\bdriver\s*(?:id)?\s*[:#]?\s*([A-Za-z0-9_-]*\d[A-Za-z0-9_-]*)", re.I)


class MarketplaceAgent(Specialist):
    name = "marketplace"
    allowed_tools = ("get_zone_forecast",)

    def _answer(self, question: str, ctx: Context, box: ToolBox) -> str:
        m = _ZONE.search(question)
        zone = (m.group(1) if m else None) or ctx.zone
        if not zone:
            return "I don't know which zone you mean. Tell me the zone ID."
        data = box.call("get_zone_forecast", zone_id=zone)
        if not data:
            return IDK
        gap = data["demand"] - data["supply"]
        template = (f"Zone {zone}: forecast demand {data['demand']}, supply {data['supply']} "
                    f"(net {gap:+g}), congestion {data.get('congestion', 'n/a')}.")
        return phrase(self.provider, question, data, template)


class EarningsAgent(Specialist):
    name = "earnings"
    allowed_tools = ("get_driver_earnings",)

    def _answer(self, question: str, ctx: Context, box: ToolBox) -> str:
        m = _DRIVER.search(question)
        requested = m.group(1) if m else ctx.driver_id  # a different ID is rejected by the tool
        data = box.call("get_driver_earnings", driver_id=requested, token=ctx.token)
        if not data:
            return IDK
        template = "Your earnings: " + ", ".join(f"{k.replace('_', ' ')} {v}" for k, v in data.items()) + "."
        return phrase(self.provider, question, data, template)


class OnboardingAgent(Specialist):
    name = "onboarding"
    allowed_tools = ("get_onboarding_checklist",)

    def _answer(self, question: str, ctx: Context, box: ToolBox) -> str:
        data = box.call("get_onboarding_checklist", driver_id=ctx.driver_id, token=ctx.token)
        if not data:
            return IDK
        todo = [i["item"] for i in data if not i.get("done")]
        template = ("Your onboarding is complete." if not todo else
                    f"{len(data) - len(todo)} of {len(data)} steps done. Remaining: " + "; ".join(todo) + ".")
        return phrase(self.provider, question, data, template)
