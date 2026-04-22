from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Task, User
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskOut
from app.routers.deps import get_current_patient

router = APIRouter(prefix="/tasks", tags=["Tarefas"])


@router.get("/", response_model=List[TaskOut])
def list_tasks(
    user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    return db.query(Task).filter(Task.user_id == user.id).order_by(Task.id.desc()).all()


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    new_task = Task(
        titulo=task_data.titulo,
        descricao=task_data.descricao,
        data_prevista=task_data.data_prevista,
        user_id=user.id,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")
    return task


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")

    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")
    db.delete(task)
    db.commit()
