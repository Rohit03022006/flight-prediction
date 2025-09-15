# Stage 1: Build - Use regular Python image for more space
FROM python:3.11 AS builder

WORKDIR /app
COPY requirements.txt .

# Install Python dependencies
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# Copy app and model
COPY . .

# Stage 2: Runtime - Use slim for final image
FROM python:3.11-slim
WORKDIR /app

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY --from=builder /app /app

# Install minimal runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends libgomp1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers", "3", "--threads", "4"]
