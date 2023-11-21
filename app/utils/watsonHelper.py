from config import Config
import requests
import json
import os

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
        self.dataset_path = "cliDataset.json"

    def read_commands_from_json(self, file_path):
        try:
            with open(file_path, 'r') as file:
                commands_list = json.load(file)
            return commands_list
        except FileNotFoundError:
            current_working_directory = os.getcwd()
            print(f"Current Working Directory: {current_working_directory}")
            print(f"File not found: {file_path}")
        
    def get_token(self):
        print(self.api_key, "*******************")
        token_response = requests.post(self.token_url, data={
                                       "apikey": self.api_key, "grant_type": 'urn:ibm:params:oauth:grant-type:apikey'})
        self.token = token_response.json()["access_token"]
        return self.token

    def get_prediction(self, input):
        url = "https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29"

        commands = self.read_commands_from_json(self.dataset_path)
        datasetStr = ""
        if commands:
            print("Commands read successfully:")
            datasetStr = "Create cli for resource creation"
            for command in commands:
                datasetStr = datasetStr + "\n\nInput:\n" + command['Input'] + "\n\nOutput:\n" + command['Output']
            # print(datasetStr)

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + self.get_token(),
        }

        data = {
            "model_id": "google/flan-ul2",
            "input": datasetStr + "\n\nInput:\n" + input + "\n\nOutput:\n",
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": 100,
                "min_new_tokens": 0,
                "stop_sequences": [],
                "repetition_penalty": 1
            },
            "project_id": Config.WATSONX_PROJECT_ID
        }

        response = requests.post(url, headers=headers, json=data)

        print(response.status_code)
        print(response.json())
        return response.json()