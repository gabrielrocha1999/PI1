from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    tipo = Column(String(20), nullable=False)  # "patient" | "psychologist"

    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text, nullable=True)
    data_prevista = Column(String(20), nullable=True)  # ISO date string YYYY-MM-DD
    concluida = Column(Boolean, default=False, nullable=False)
    satisfacao = Column(Integer, nullable=True)  # 1-5
    reflexao = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="tasks")
