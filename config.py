import os
from dotenv import load_dotenv

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
    WATSONX_URL = os.getenv("URL")
    WATSONX_PROJECT_ID = os.getenv("PROJECT_ID")
    OPEN_API_KEY = os.getenv("OPEN_API_KEY")