#!/bin/sh
set -e

echo "Running database migrations..."
alembic upgrade head

python -m app.scripts.create_admin
python -m app.scripts.seed_menu --yes

echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
