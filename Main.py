from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello CarrosMocanos.Com from FastAPI"}

@app.get("/ping")
def ping():
    return {"ping": "ok"}
