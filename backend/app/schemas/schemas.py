from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    senha: str
    tipo: str

    @field_validator("tipo")
    @classmethod
    def validate_tipo(cls, v: str) -> str:
        if v not in ("patient", "psychologist"):
            raise ValueError("Tipo deve ser 'patient' ou 'psychologist'")
        return v

    @field_validator("senha")
    @classmethod
    def validate_senha(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Senha deve ter pelo menos 6 caracteres")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    senha: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    tipo: str

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class TaskCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    data_prevista: Optional[str] = None

    @field_validator("titulo")
    @classmethod
    def validate_titulo(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Título não pode estar vazio")
        return v.strip()


class TaskUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    data_prevista: Optional[str] = None
    concluida: Optional[bool] = None
    satisfacao: Optional[int] = None
    reflexao: Optional[str] = None

    @field_validator("satisfacao")
    @classmethod
    def validate_satisfacao(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and (v < 1 or v > 5):
            raise ValueError("Satisfação deve ser entre 1 e 5")
        return v


class TaskOut(BaseModel):
    id: int
    titulo: str
    descricao: Optional[str]
    data_prevista: Optional[str]
    concluida: bool
    satisfacao: Optional[int]
    reflexao: Optional[str]
    user_id: int

    model_config = {"from_attributes": True}
