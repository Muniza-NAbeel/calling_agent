import logging
from typing import cast

from contextlib import asynccontextmanager
from uuid import uuid4
from typing import cast

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import RequestResponseEndpoint

from hopenix_api.api.rate_limit import InMemoryRateLimiter
from hopenix_api.api.routes import router
from hopenix_api.api_models import ErrorResponse, VoiceAgentUnavailableError
from hopenix_api.infrastructure.settings import get_settings


logger = logging.getLogger("hopenix_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()

    app.state.rate_limiter = InMemoryRateLimiter(
        settings.rate_limit_requests,
        settings.rate_limit_window_seconds,
    )

    logger.info("api_started")

    yield

    logger.info("api_stopped")


app = FastAPI(
    title="Hopenix Calling API",
    version="0.1.0",
    lifespan=lifespan,
    responses={
        400: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
)


settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type", "X-Request-ID"],
    expose_headers=["Retry-After", "X-Request-ID"],
)


@app.middleware("http")
async def request_context(
    request: Request,
    call_next: RequestResponseEndpoint,
) -> Response:
    request_id = request.headers.get("X-Request-ID") or uuid4().hex
    request.state.request_id = request_id

    try:
        response = await call_next(request)
    except Exception:
        logger.exception(
            "request_failed method=%s path=%s request_id=%s",
            request.method,
            request.url.path,
            request_id,
        )

        response = JSONResponse(
            status_code=500,
            content={
                "error": "internal_server_error",
                "message": "The request could not be completed.",
                "request_id": request_id,
            },
        )

    response.headers["X-Request-ID"] = request_id

    logger.info(
        "request_complete method=%s path=%s status=%s request_id=%s",
        request.method,
        request.url.path,
        response.status_code,
        request_id,
    )

    return response


def error_response(
    request: Request,
    error: str,
    message: str,
    status_code: int,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    response = JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            error=error,
            message=message,
            request_id=request.state.request_id,
        ).model_dump(),
        headers=dict(headers) if headers else None,
    )

    response.headers["X-Request-ID"] = request.state.request_id

    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    message = exc.detail

    headers: dict[str, str] | None = (
        cast(dict[str, str], exc.headers)
        if exc.headers
        else None
    )

    return error_response(
        request,
        f"http_{exc.status_code}",
        message,
        exc.status_code,
        headers,
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    _exc: RequestValidationError,
) -> JSONResponse:
    return error_response(
        request,
        "validation_error",
        "The request data is invalid.",
        422,
    )


@app.exception_handler(VoiceAgentUnavailableError)
async def voice_agent_unavailable_handler(
    request: Request,
    _exc: VoiceAgentUnavailableError,
) -> JSONResponse:
    return error_response(
        request,
        "voice_agent_unavailable",
        "The voice agent is not configured.",
        503,
    )


app.include_router(router)