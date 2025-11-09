from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, SQLModel, Session, create_engine, select


# ---------- Models ----------
class TodoBase(SQLModel):
    title: str
    completed: bool = False


class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class TodoCreate(TodoBase): ...


class TodoRead(TodoBase):
    id: int


class TodoUpdate(SQLModel):
    title: Optional[str] = None
    completed: Optional[bool] = None


# ---------- App & DB ----------
app = FastAPI(title="FastAPI TODO API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://127.0.0.1",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///./todos.db", echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# ---------- Routes ----------
@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/todos", response_model=List[TodoRead])
def list_todos():
    with Session(engine) as session:
        return session.exec(select(Todo).order_by(Todo.id.desc())).all()


@app.post("/todos", response_model=TodoRead, status_code=201)
def create_todo(payload: TodoCreate):
    with Session(engine) as session:
        todo = Todo.from_orm(payload)
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo


# TODO  patch and put whats the difference


@app.patch("/todos/{todo_id}", response_model=TodoRead)
def update_todo(todo_id: int, payload: TodoUpdate):
    with Session(engine) as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            raise HTTPException(404, "Todo not found")
        if payload.title is not None:
            todo.title = payload.title
        if payload.completed is not None:
            todo.completed = payload.completed
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    with Session(engine) as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            raise HTTPException(404, "Todo not found")
        session.delete(todo)
        session.commit()
        return None