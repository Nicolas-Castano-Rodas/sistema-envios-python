from fastapi import APIRouter, HTTPException
from app.config.db import db
from app.auth.auth_utils import hash_password, verify_password, create_access_token
from app.auth.auth_schemas import UserRegister, UserLogin
from app.auth.auth_utils import verify_token
from fastapi import Depends

router = APIRouter()

# REGISTRO
@router.post("/register")
def register(user: UserRegister):
    existing_user = db.users.find_one({"email": user.email})
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    
    new_user = {
        "email": user.email,
        "password": hash_password(user.password)
    }
    
    db.users.insert_one(new_user)
    
    return {"message": "Usuario creado correctamente"}

# LOGIN
@router.post("/login")
def login(user: UserLogin):
    db_user = db.users.find_one({"email": user.email})
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    
    token = create_access_token({"sub": user.email})
    
    return {"access_token": token, "token_type": "bearer"}


@router.get("/shipments")
def get_shipments(user=Depends(verify_token)):
    # Aquí podrías usar user["sub"] para obtener el email del usuario y filtrar los envíos
    return {"message": f"Envíos para el usuario {user['sub']}"}