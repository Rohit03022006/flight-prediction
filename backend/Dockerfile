# backend/Dockerfile
FROM python:3.11-slim

# system deps (if you need build tools for some libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy pip requirements first for layer caching
COPY requirements.txt .

# install deps
RUN pip install --no-cache-dir -r requirements.txt

# copy app and model
COPY . .

# expose port used by your Flask app
EXPOSE 5000

# production: use gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers", "3", "--threads", "4"]
