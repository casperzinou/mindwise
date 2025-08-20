# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# --- CHANGE THIS LINE ---
# Copy the renamed dependencies file
COPY backend/backend-requirements.txt .

# --- AND CHANGE THIS LINE ---
# Install packages from the renamed file
RUN pip install --no-cache-dir -r backend-requirements.txt

# Copy the rest of the application's code
COPY backend/ .

# Expose the port the app runs on
EXPOSE 8080