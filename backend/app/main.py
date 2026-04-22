from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers.auth import router as auth_router
from app.routers.tasks import router as tasks_router
from app.routers.psychologist import router as psychologist_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TCC App API",
    description="API para suporte à Terapia Cognitivo-Comportamental",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(psychologist_router)


@app.get("/", tags=["Status"])
def root():
    return {"status": "ok", "message": "TCC App API está rodando"}
