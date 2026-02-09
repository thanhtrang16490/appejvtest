.PHONY: build run test clean install dev

# Build the application
build:
	@echo "Building..."
	@go build -o bin/server cmd/server/main.go

# Run the application
run:
	@echo "Running..."
	@go run cmd/server/main.go

# Run in development mode with hot reload (requires air)
dev:
	@echo "Running in development mode..."
	@air

# Install dependencies
install:
	@echo "Installing dependencies..."
	@go mod download
	@go mod tidy

# Run tests
test:
	@echo "Running tests..."
	@go test -v ./...

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf bin/
	@go clean

# Format code
fmt:
	@echo "Formatting code..."
	@go fmt ./...

# Lint code
lint:
	@echo "Linting code..."
	@golangci-lint run

# Install air for hot reload
install-air:
	@echo "Installing air..."
	@go install github.com/cosmtrek/air@latest

# Generate swagger docs (if using swag)
swagger:
	@echo "Generating swagger docs..."
	@swag init -g cmd/server/main.go
