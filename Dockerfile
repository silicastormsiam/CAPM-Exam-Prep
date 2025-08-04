# File: Dockerfile
# Owner: Andrew Holland
# Purpose: Build Flask environment for CAPM Exam Prep backend
# Version: 1.5 (updated 2025-08-02)
# Change Log:
#   - 2025-08-02: Updated to copy all files for static serving at /volume1/CAPM_Exam, ensured dependencies (ID: dsm-deployment-20250802-16)
#   - 2025-08-02: Created Dockerfile for DSM deployment with Flask (ID: dsm-deployment-20250802-2)

FROM python:3.9-slim

WORKDIR /app

COPY . /app/

RUN pip install --no-cache-dir flask flask-cors

CMD ["python", "app.py"]