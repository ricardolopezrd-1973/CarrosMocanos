from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Vehicle(BaseModel):
    id: int
    make: str
    model: str
    year: int
    price: int


@app.get("/")
def read_root():
    return {"message": "Hello CarrosMocanos.Com from FastAPI"}


@app.get("/ping")
def ping():
    return {"ping": "ok"}


@app.get("/vehicle/{id}", response_model=Vehicle)
def get_vehicle(id: int):
    return Vehicle(id=id, make="Example", model="Car", year=2020, price=25000)
