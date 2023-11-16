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

    def get_prediction(self, input):
        url = "https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29"

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + self.get_token(),
        }

        data = {
            "model_id": "google/flan-ul2",
            "input": "Create cli for resource creation\n\nInput:\ncreate a vm demovm with 10gb of memory and 2 cpu\n\nOutput:\ngcloud compute instances create demovm --custom-cpu=2 --custom-memory=10\n\nInput:\ncreate a virtual machine with name demovm with 10gb of memory and 2 cpu\n\nOutput:\ngcloud compute instances create demovm --custom-cpu=2 --custom-memory=10\n\nInput:\ncreate a virtual machine with name demovm with 10gb of memory \n\nOutput:\ngcloud compute instances create demovm --custom-cpu=2 --custom-memory=10\n\nInput:\nI want to create a vm with name demovm1 with 15gb of memory\n\nOutput:\ngcloud compute instances create demovm1 --custom-memory=15\n\nInput:\ndelete vm demovm1\n\nOutput:\ngcloud compute instances delete  demovm1\n\nInput:\nremove vm demovm\n\nOutput:\ngcloud compute instances delete demovm\n\nInput:\ncreate a volume BUCKET_NAME\n\nOutput:\ngcloud storage buckets create gs://BUCKET_NAME\n\nInput:\ncreate a storage BUCKET_NAME\n\nOutput:\ngcloud storage buckets create gs://BUCKET_NAME\n\nInput:\ndelete volume BUCKET_NAME\n\nOutput:\ngcloud storage rm --recursive gs://BUCKET_NAME/\n\nInput:\nremove volume BUCKET_NAME\n\nOutput:\ngcloud storage rm --recursive gs://BUCKET_NAME/\n\nInput:\nI want to delete volume test1_vol\n\nOutput:\ngcloud storage rm --recursive gs:// test1_vol/\n\nInput:\nI want to remove volume test1_vol\n\nOutput:\ngcloud storage rm --recursive gs:// test1_vol/\n\nInput:\n" + input + "\n\nOutput:\n",
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