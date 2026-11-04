"""
tests/test_engine.py — Smoke tests for the simulator engine.

TODO:
  - Add test for tick count increment
  - Add test that demand is generated (total_requests increases)
  - Add test for driver state transitions
  - Add test that fulfilment_rate stays in [0, 1]
  - Add seeded reproducibility test (same seed → same state at tick N)
"""

import pytest
from app.simulator.engine import SimulatorEngine


def test_engine_initialises():
    """Engine should initialise without errors."""
    engine = SimulatorEngine(seed=42, n_drivers=10)
    assert engine.tick_count == 0
    assert len(engine.drivers) == 10


def test_single_tick():
    """A single tick should increment tick_count and return a valid state."""
    engine = SimulatorEngine(seed=42, n_drivers=5)
    state = engine.tick()
    assert state.tick == 1
    assert 0.0 <= state.fulfilment_rate <= 1.0
    assert len(state.zones) == 12


def test_reproducibility():
    """Two engines with the same seed should produce identical states at tick 10."""
    engine_a = SimulatorEngine(seed=99, n_drivers=20)
    engine_b = SimulatorEngine(seed=99, n_drivers=20)
    for _ in range(10):
        state_a = engine_a.tick()
        state_b = engine_b.tick()
    assert state_a.total_requests == state_b.total_requests
    assert state_a.completed_requests == state_b.completed_requests


def test_fulfilment_rate_range():
    """Fulfilment rate should stay between 0 and 1 over many ticks."""
    engine = SimulatorEngine(seed=7, n_drivers=15)
    for _ in range(50):
        state = engine.tick()
        assert 0.0 <= state.fulfilment_rate <= 1.0


# TODO: add test for EventEngine (event fires at correct tick)
# TODO: add test for BaselineForecaster (forecast equals last-15-min sum)
# TODO: add test for AntiCrowdingFilter (caps recommendations per zone)

