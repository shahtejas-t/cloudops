from ibm_watson_machine_learning.foundation_models.utils.enums import ModelTypes
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
from ibm_watson_machine_learning.foundation_models.utils.enums import DecodingMethods
from ibm_watson_machine_learning.foundation_models import Model
from ibm_watson_machine_learning.foundation_models.extensions.langchain import WatsonxLLM
from config import Config

# embeddings = HuggingFaceEmbeddings()
class llama:
    def getModel(self):
        model_id = ModelTypes.LLAMA_2_70B_CHAT
        parameters = {
            GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
            GenParams.MIN_NEW_TOKENS: 1,
            GenParams.MAX_NEW_TOKENS: 250
        }

        model = Model(
            model_id=model_id,
            params=parameters,
            credentials={"url":Config.WATSONX_URL,"apikey":Config.WATSONX_API_KEY},
            project_id=Config.WATSONX_PROJECT_ID
        )

        llm = WatsonxLLM(model=model)
        return llm