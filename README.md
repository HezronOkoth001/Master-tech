# Masters Tech

Masters Tech is a React + Vite business website and admin workspace, with a FastAPI backend and PostgreSQL database.

## Current features

- Public business website and portfolio.
- Admin dashboard for projects, clients, leads, tasks, invoices, payments, messages, reviews and settings.
- Project records are stored in PostgreSQL.
- The other workspace sections are now stored in PostgreSQL through the `/api/workspace/{section}` endpoints.
- Existing browser-only workspace records are imported into PostgreSQL the first time the updated dashboard loads, provided the matching database section is empty.

## Run the frontend

From the project root:

```bash
npm install
```

Copy `.env.example` to `.env` if you need to change the backend URL. The default local URL is:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then start Vite:

```bash
npm run dev
```

## Run the backend

Open a second terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

**Windows PowerShell**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install the backend packages:

```bash
pip install -r requirements.txt
```

Copy `.env.example` to `.env` inside the `backend` folder and set your PostgreSQL connection string. For example:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/masters_tech
```

Start the API from the `backend` folder:

```bash
python -m uvicorn main:app --reload
```

The API health check is available at `http://127.0.0.1:8000/health`, and the interactive API documentation is at `http://127.0.0.1:8000/docs`.

## Important security note

This is still a development-stage application. The admin dashboard and write API endpoints do not yet have administrator login/authentication. Run it locally only; do not expose or deploy the admin API publicly until authentication and authorization have been implemented and tested.

## Next development milestone

Implement administrator authentication, protect all admin write endpoints, and then test the complete application against the configured PostgreSQL database before deployment.
