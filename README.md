# Tour Maker Demo (Backend)

## Quick Description

Tour Maker is a NestJS + GraphQL platform that automates the creation of personalized walking tours. It layers OpenStreetMap data, Google Gemini generative content, OpenRouteService routing, and pgvector-powered recommendations to deliver itineraries that balance narrative depth with optimal walking paths.

## Features

- **End-to-end AI pipeline**: Overpass fetches raw POIs, Gemini ranks and annotates them, while OpenRouteService generates the final GeoJSON route ready for map overlays.
- **Asynchronous job orchestration**: Tour creation runs in the background, guarded by cache-based locks to prevent concurrent requests per user, and completion events are emitted through PubSub.
- **Preference-driven recommendations**: User embeddings built from declared interests power pgvector similarity queries that surface the most relevant community tours.
- **Modular GraphQL architecture**: Cities, categories, tours, and users live in dedicated modules with resolvers, DTOs, and validation layers for maintainable expansion.
- **Security & request context**: Custom guards, interceptors, CLS context propagation, and validation pipes keep authentication/authorization consistent across the stack.
- **Operational readiness**: Environment schema validation (Joi), TypeORM migrations, Dockerized Postgres with pgvector, and caching abstractions streamline deployment and maintenance.

## Prerequisites

- Node.js 20.x (LTS) and Yarn.
- Docker Desktop to run the PostgreSQL + pgvector container.
- External service credentials:
  - `OPENROUTE_SERVICE_API_KEY` – walking directions.
  - `GEMINI_API_KEY` – AI copy generation and POI curation.
- `.env` file in the project root.

## Getting Started

1. **Clone & install**
   ```bash
   git clone https://github.com/stas-m2muchcoffee/tour-maker-backend-demo.git
   cd tour-maker-backend-demo
   yarn install
   ```
2. **Configure environment**
   - reate `.env` in the project root and set the variables described in `.env.example`;
   - Verify API keys and database credentials; the config schema (Joi) will fail fast if something is missing.
3. **Start PostgreSQL with pgvector**
   ```bash
   docker compose -f docker-compose-local.yml up -d
   ```
4. **Run database migrations (and any seed scripts)**
   ```bash
   yarn db:up
   ```
5. **Launch the API**
   ```bash
   yarn start:dev          # watch mode
   # or
   yarn build && yarn start:prod
   ```
6. **Explore the schema**
   Navigate to `http://localhost:PORT/graphql` to inspect the auto-generated schema and documentation.

## Usage

- **Authenticate & authorize**: Register users, sign in to obtain JWTs, and send them via the `Authorization` header for all subsequent GraphQL calls.
- **Load catalog data**: Fetch cities and categories on startup so the UI can present relevant filters and selections.
- **Kick off tour generation**: Submit a tour creation request with the traveler’s chosen city and interests. The server acknowledges immediately while the AI pipeline runs in the background.
- **Monitor background jobs**: Store the returned job identifier (or rely on the server-sent completion events) to update UI states such as “Generating tour…” and show errors if the AI pipeline fails.
- **Surface recommendations**: Use the recommendation endpoint to present a carousel of high-similarity tours drawn from other users once embeddings are available.
- **Maintain preferences**: Provide UI to edit interest tags, triggering embedding refreshes so recommendations stay aligned with the traveler’s latest tastes.

## Used Technologies and Services

- NestJS, Apollo GraphQL Server, CLS middleware for request-scoped context, and custom interceptors/guards/pipes.
- TypeORM + PostgreSQL 17 (pgvector extension) for relational data and similarity search.
- Google Gemini (`@google/genai`) for POI selection heuristics and narrative copy generation.
- OpenRouteService for accurate pedestrian routing and GeoJSON output.
- Overpass API (OpenStreetMap) for up-to-date POI catalogs per city/category.
- Cache Manager + PubSub for background job coordination and client notifications.
- Tooling: Axios for HTTP calls, ESLint + Prettier for lint/format, Docker Compose for local infrastructure.
