#!/bin/bash

# Check if the server is healthy
if curl -sSf http://localhost:3000/health-check >/dev/null; then
  exit 0  # Exit with a success status code (container is healthy)
else
  exit 1  # Exit with a failure status code (container is unhealthy)
fi
