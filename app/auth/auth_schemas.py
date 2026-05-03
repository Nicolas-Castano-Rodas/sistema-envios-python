from pydantic import BaseModel, Field

class UserRegister(BaseModel):
    email: str
    password: str = Field(..., min_length=6, max_length=50)

class UserLogin(BaseModel):
    email: str
    password: str