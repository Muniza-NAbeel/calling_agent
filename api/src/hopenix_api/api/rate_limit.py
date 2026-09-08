from collections import defaultdict, deque
from dataclasses import dataclass
from threading import Lock
import time

from fastapi import Request


@dataclass(frozen=True)
class RateLimitDecision:
    allowed: bool
    retry_after_seconds: int


class InMemoryRateLimiter:
    """Small-process limiter for a single API instance.

    Deployments with multiple API instances should place this policy at the edge
    or replace the store with a shared rate-limit backend.
    """

    def __init__(self, limit: int, window_seconds: int) -> None:
        self._limit = limit
        self._window_seconds = window_seconds
        self._requests: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def check(self, key: str) -> RateLimitDecision:
        now = time.monotonic()
        cutoff = now - self._window_seconds
        with self._lock:
            timestamps = self._requests[key]
            while timestamps and timestamps[0] <= cutoff:
                timestamps.popleft()
            if len(timestamps) >= self._limit:
                retry_after = max(1, int(timestamps[0] + self._window_seconds - now))
                return RateLimitDecision(False, retry_after)
            timestamps.append(now)
            return RateLimitDecision(True, 0)

    def client_key(self, request: Request) -> str:
        return request.client.host if request.client else "unknown"
