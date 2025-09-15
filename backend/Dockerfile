FROM python:3.11-slim
FROM python:3.11-slim AS builder

# system deps (if you need build tools for some libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
WORKDIR /app

# copy pip requirements first for layer caching
COPY requirements.txt .
COPY requirements.txt .


# install deps
RUN apt-get update && \
RUN pip install --no-cache-dir -r requirements.txt
    apt-get install -y --no-install-recommends build-essential gcc && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt && \
    apt-get purge -y build-essential gcc && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# copy app and model
COPY . .

# Stage 2: Runtime
EXPOSE 5000
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY --from=builder /app /app


# production: use gunicorn
# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends libgomp1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers", "3", "--threads", "4"]
