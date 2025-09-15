# Stage 1: Build
FROM python:3.11-slim AS builder

# System dependencies for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy pip requirements first for layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# Copy app and model
COPY . .

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY --from=builder /app /app

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends libgomp1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers", "3", "--threads", "4"]
