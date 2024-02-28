from config import Config
import requests
import openai

class WatsonHelper:
         # Singleton class
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(WatsonHelper, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        self.api_key = Config.OPEN_API_KEY
    
    def get_prediction(self, input):
        openai.api_key = self.api_key
        instruction_prompt = """
            Identify the CLI command from result
            
            Return the output as only CLI command as string
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages = [
                { 'role':'system','content':instruction_prompt},
                {'role':'user', 'content':input}
            ])

        command = response.choices[0].message.content
        return command


