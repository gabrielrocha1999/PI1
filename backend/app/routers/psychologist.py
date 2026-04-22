from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Task
from app.schemas.schemas import UserOut, TaskOut
from app.routers.deps import get_current_psychologist

router = APIRouter(prefix="/psychologist", tags=["Psicólogo"])


@router.get("/patients", response_model=List[UserOut])
def list_patients(
    _: User = Depends(get_current_psychologist),
    db: Session = Depends(get_db),
):
    return db.query(User).filter(User.tipo == "patient").order_by(User.name).all()


@router.get("/patients/{patient_id}", response_model=UserOut)
def get_patient(
    patient_id: int,
    _: User = Depends(get_current_psychologist),
    db: Session = Depends(get_db),
):
    patient = db.query(User).filter(User.id == patient_id, User.tipo == "patient").first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente não encontrado")
    return patient


@router.get("/patients/{patient_id}/tasks", response_model=List[TaskOut])
def get_patient_tasks(
    patient_id: int,
    _: User = Depends(get_current_psychologist),
    db: Session = Depends(get_db),
):
    patient = db.query(User).filter(User.id == patient_id, User.tipo == "patient").first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente não encontrado")
    return (
        db.query(Task)
        .filter(Task.user_id == patient_id)
        .order_by(Task.id.desc())
        .all()
    )
