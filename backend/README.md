# MediVerify Backend

FastAPI backend with EfficientNetB0 for medicine authenticity verification.

## Quick Start

```powershell
# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload --port 8000
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/verify` - Verify medicine image

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
