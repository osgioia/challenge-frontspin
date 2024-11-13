# Call Tracking Microservice

This microservice tracks incoming calls and provides statistics about them. It uses Redis for caching and PostgreSQL for persistent storage.

## Technologies Used

- Node.js with TypeScript
- Express.js
- Redis
- PostgreSQL
- Docker & Docker Compose

## Getting Started

### Prerequisites

Make sure you have installed:
- Docker
- Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Start the services using Docker Compose:

This will start three containers:
- The Node.js application (port 3000)
- Redis (port 6379)
- PostgreSQL (port 5432)

## API Endpoints

### Create Call
```http
POST /create/:status
```

Creates a new call record with the specified status.

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | **Required**. Must be either 'success' or 'failure' |

#### Example Request
```bash
curl -X POST http://localhost:3000/create/success
```

#### Example Response
```json
{
    "message": "Call logged successfully"
}
```

### Get Statistics
```http
GET /stats/status
```

Returns statistics about all calls.

#### Example Request
```bash
curl http://localhost:3000/stats/status
```

#### Example Response
```json
{
    "total": 10,
    "success": 7,
    "failure": 3
}
```

## Environment Variables

The following environment variables are configured in the docker-compose.yml:
```yaml
REDIS_URL=redis://redis:6379
POSTGRES_HOST=postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=calls_db
```

## Database Schema

The service automatically creates a `call_log` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| path | VARCHAR | The endpoint called |
| startTime | TIMESTAMP | When the request started |
| finishTime | TIMESTAMP | When the request finished |
| result | ENUM | 'success' or 'failure' |
| createdAt | TIMESTAMP | Record creation timestamp |

## Features

- Real-time call tracking
- Redis caching for fast statistics retrieval
- Batch processing to PostgreSQL every 5 calls
- Docker containerization for easy deployment
- Scalable architecture

## Development

To run the project in development mode:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Testing the Application

You can test the endpoints using curl or any API testing tool like Postman:

1. Create a successful call:
```bash
curl -X POST http://localhost:3000/create/success
```

2. Create a failed call:
```bash
curl -X POST http://localhost:3000/create/failure
```

3. Get statistics:
```bash
curl http://localhost:3000/stats/status
```

## Troubleshooting

If you encounter any issues:

1. Check if all containers are running:
```bash
docker-compose ps
```

2. View logs:
```bash
docker-compose logs
```

3. Restart services:
```bash
docker-compose down
docker-compose up --build
```