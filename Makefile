# Makefile for Mindwise AI Chatbot Platform

# Default target
.PHONY: help
help:
	@echo "Mindwise AI Chatbot Platform - Development Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make install        Install all dependencies"
	@echo "  make dev            Start both frontend and backend in development mode"
	@echo "  make dev-frontend   Start frontend in development mode"
	@echo "  make dev-backend    Start backend in development mode"
	@echo "  make test           Run tests for all applications"
	@echo "  make test-frontend  Run tests for frontend"
	@echo "  make test-backend   Run tests for backend"
	@echo "  make build          Build all applications"
	@echo "  make build-frontend Build frontend application"
	@echo "  make build-backend  Build backend application"
	@echo "  make docker         Start development environment with Docker"
	@echo "  make clean          Clean build artifacts"

# Install dependencies
.PHONY: install
install:
	npm install
	cd apps/frontend && npm install
	cd ../backend && npm install

# Development
.PHONY: dev
dev:
	@echo "Starting both frontend and backend in development mode..."
	@make dev-frontend & make dev-backend

.PHONY: dev-frontend
dev-frontend:
	cd apps/frontend && npm run dev

.PHONY: dev-backend
dev-backend:
	cd apps/backend && npm run dev

# Testing
.PHONY: test
test:
	npm test

.PHONY: test-frontend
test-frontend:
	cd apps/frontend && npm run test

.PHONY: test-backend
test-backend:
	cd apps/backend && npm run test

# Building
.PHONY: build
build:
	@make build-frontend
	@make build-backend

.PHONY: build-frontend
build-frontend:
	cd apps/frontend && npm run build

.PHONY: build-backend
build-backend:
	cd apps/backend && npm run build

# Docker
.PHONY: docker
docker:
	docker-compose up

.PHONY: docker-build
docker-build:
	docker-compose build

# Cleaning
.PHONY: clean
clean:
	cd apps/frontend && rm -rf .next out
	cd ../backend && rm -rf dist