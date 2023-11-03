from config import Config
import requests

class WatsonHelper:
         # Singleton class
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(WatsonHelper, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        self.api_key = Config.WATSONX_API_KEY
        self.token_url = "https://iam.cloud.ibm.com/identity/token"
        self.scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/8c6d6928-bb3f-404b-ae28-77fb005d5c87/predictions?version=2021-05-01"
        self.model_url = "https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29"
        self.token = ""

    def get_token(self):
        print(self.api_key, "*******************")
        token_response = requests.post(self.token_url, data={
                                       "apikey": self.api_key, "grant_type": 'urn:ibm:params:oauth:grant-type:apikey'})
        self.token = token_response.json()["access_token"]
        return self.token

