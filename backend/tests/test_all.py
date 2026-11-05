import time
import jwt
import pytest

try:
    from app.agents import tools
    from app.agents.assistant import Assistant
    from app.agents.base import Context
    from app.agents.router import Router, rule_classify
    from app.recommender.anti_crowding import AntiCrowding
    from app.agents.llm.cache import ResponseCache
    from app.agents.llm.key_rotator import KeyRotator
    from app.agents.llm.provider import GeminiHTTPError, LLMProvider
    from app.recommender.positioning import STAY, ZoneState, accept, recommend
except ImportError:
    import tools
    from agents.assistant import Assistant
    from agents.base import Context
    from agents.router import Router, rule_classify
    from anti_crowding import AntiCrowding
    from llm.cache import ResponseCache
    from llm.key_rotator import KeyRotator
    from llm.provider import GeminiHTTPError, LLMProvider
    from positioning import STAY, ZoneState, accept, recommend

SECRET = "s3cret"


def tok(sub):
    return jwt.encode({"sub": sub, "exp": int(time.time()) + 60}, SECRET, algorithm="HS256")


class FakeBackend:
    def zone_forecast(self, z):
        return {"Z1": {"zone": "Z1", "demand": 40, "supply": 25, "congestion": 0.3}}.get(z)
    def driver_earnings(self, d):
        return {"D1": {"week_total": 12500, "trips": 61}}.get(d)
    def onboarding_checklist(self, d):
        return {"D1": [{"item": "Upload licence", "done": True}, {"item": "Vehicle inspection", "done": False}]}.get(d)


class DeadProvider(LLMProvider):  # forces template tier
    def __init__(self):
        super().__init__(rotator=KeyRotator([]))
    def _call_ollama(self, p, s): raise OSError("down")


@pytest.fixture(autouse=True)
def setup(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", SECRET)
    tools.set_backend(FakeBackend())


ZONES = {"A": ZoneState("A", 10, 10), "B": ZoneState("B", 30, 10, 0.2), "C": ZoneState("C", 30, 10, 0.2)}
travel = lambda a, b: 5.0


def test_positioning_moves_then_stays_when_no_gain():
    r = recommend("A", ZONES, travel)
    assert r["destination"] in ("B", "C") and "score" in r["reason"]
    assert recommend("B", ZONES, travel)["destination"] == STAY or recommend("B", ZONES, travel)["destination"] == "C"
    flat = {"A": ZoneState("A", 10, 10), "B": ZoneState("B", 10, 10)}
    assert recommend("A", flat, travel)["destination"] == STAY


def test_anti_crowding_spreads_drivers():
    ac = AntiCrowding()
    first = recommend("A", ZONES, travel, driver_id="d1", crowding=ac)
    accept(first, "d1", ac)
    second = recommend("A", ZONES, travel, driver_id="d2", crowding=ac)
    assert second["destination"] != first["destination"]
    ac.release("d1")
    assert ac.pending(first["destination"]) == 0


def test_anti_crowding_ttl():
    t = [0.0]
    ac = AntiCrowding(ttl_s=10, clock=lambda: t[0])
    ac.record_acceptance("d1", "B")
    t[0] = 11
    assert ac.pending("B") == 0


def test_router_rules_and_llm_unclear():
    assert rule_classify("how much did I earn this week?") == "earnings"
    assert rule_classify("which documents do I need?") == "onboarding"
    assert Router(DeadProvider()).classify("hmm?") == (None, "unclear")


def test_router_llm_when_rules_unclear():
    p = DeadProvider()
    p._try_ollama = lambda prompt, system: "earnings"
    assert Router(p).classify("what's in my wallet") == ("earnings", "llm")


def test_earnings_rejects_other_driver_and_grounds():
    a = Assistant(DeadProvider())
    ok = a.ask("how much did I earn?", Context("D1", tok("D1")))
    assert "12500" in ok["answer"] and ok["tool_calls"][0]["tool"] == "get_driver_earnings"
    assert "token" not in str(ok["tool_calls"])
    bad = a.ask("how much did driver D2 earn?", Context("D1", tok("D1")))
    assert "can't share" in bad["answer"] and bad["tool_calls"][0]["error"] == "unauthorized"
    with pytest.raises(tools.AuthError):
        tools.get_driver_earnings("D2", tok("D1"))
    with pytest.raises(tools.AuthError):
        tools.get_driver_earnings("D1", "garbage")


def test_no_data_means_idk():
    a = Assistant(DeadProvider())
    assert a.ask("demand in zone Z9?", Context("D1", tok("D1")))["answer"] == "I don't know."
    assert a.ask("what are my earnings", Context("D7", tok("D7")))["answer"] == "I don't know."


def test_marketplace_and_onboarding_templates():
    a = Assistant(DeadProvider())
    assert "demand 40" in a.ask("demand in zone Z1?", Context("D1", tok("D1")))["answer"]
    assert "Vehicle inspection" in a.ask("onboarding checklist", Context("D1", tok("D1")))["answer"]


def test_llm_answer_with_invented_number_is_discarded():
    p = DeadProvider()
    p._try_ollama = lambda prompt, system: "You earned 99999 this week."
    out = Assistant(p).ask("how much did I earn?", Context("D1", tok("D1")))
    assert "12500" in out["answer"]


def test_key_rotation():
    t = [0.0]
    r = KeyRotator(["k1", "k2", "k3"], clock=lambda: t[0])
    assert [r.acquire() for _ in range(4)] == ["k1", "k2", "k3", "k1"]
    r.report_rate_limited("k2", 30)
    r.report_invalid("k3")
    assert {r.acquire() for _ in range(3)} == {"k1"}
    t[0] = 31
    assert {r.acquire() for _ in range(2)} == {"k1", "k2"}


def test_provider_chain_and_cache():
    calls = []
    p = LLMProvider(rotator=KeyRotator(["k1", "k2"]), cache=ResponseCache())
    p._call_ollama = lambda pr, s: (_ for _ in ()).throw(OSError())
    def gem(key, pr, s):
        calls.append(key)
        if key == "k1":
            raise GeminiHTTPError(429, retry_after=60)
        return "hello"
    p._call_gemini = gem
    r = p.generate("q", fallback="T")
    assert (r.text, r.source) == ("hello", "gemini") and calls == ["k1", "k2"]
    r2 = p.generate("q", fallback="T")
    assert r2.cached and len(calls) == 2
    p._call_gemini = lambda *a: (_ for _ in ()).throw(GeminiHTTPError(500))
    assert p.generate("other", fallback="T").source == "template"
