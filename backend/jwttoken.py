from datetime import datetime, timedelta
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
import json 

SECRET_KEY = json.load(open('secrets.json','r'))['JWT_access_Key']

# Algorith for encryption
ALGORITHM = "HS256"

# 24 Hours expiry time
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# TokenData has username
class TokenData(BaseModel):
    username: Optional[str] = None

# Creating the access token with the given expiry time.
def create_access_token(data: dict):
    """
    This function creates an access token by encoding the given data as a JSON Web Token (JWT) and adding an "exp" field set to the current time plus the value of ACCESS_TOKEN_EXPIRE_MINUTES.

    Args:

    data: a dictionary of data to include in the JWT.
    Returns:

    The JWT as a bytes object.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token:str,credentials_exception):
    """
    This function verifies the given JWT and returns a TokenData object if the token is valid. If the token is invalid or has expired, a JWTError is raised.

    Args:

    token: the JWT to verify.
    credentials_exception: the exception to raise if the token is invalid or has expired.
    Returns:

    A TokenData object containing the username included in the JWT.
    Raises:

    JWTError: if the token is invalid or has expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
        return token_data
    except JWTError:
        raise credentials_exception