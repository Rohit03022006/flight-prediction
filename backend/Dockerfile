# Stage 1: Build
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y build-essential gcc && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt && \
    apt-get purge -y build-essential gcc && apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*
COPY . .

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY --from=builder /app /app
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers", "3", "--threads", "4"]
