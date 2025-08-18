# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file from the backend directory
COPY backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code from the backend directory
COPY backend/ .

# Run the web server when the container launches
# Note: Fly.io will override this with the command from fly.toml
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "app:app"]