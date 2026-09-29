#!/bin/sh
set -e
cd "/Users/rajdeepsinghgolan/jacuzzi 2/client"
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi
echo "Starting Vite on port ${PORT:-3000}..."
exec ./node_modules/.bin/vite --port "${PORT:-3000}" --host 0.0.0.0
