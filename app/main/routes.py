from app.main import blueprint
from flask import render_template
from config import Config
from app.utils.watsonHelper import WatsonHelper

@blueprint.route('/')
def index():
    return render_template('index.html')

@blueprint.route('/wat/')
def test_page():
    return '<br> URL : ' + Config.WATSONX_URL + '<br> API KEY : ' + Config.WATSONX_API_KEY + '<br> PROJECT_ID : ' + Config.WATSONX_PROJECT_ID + '<br> TOKEN : ' + WatsonHelper().get_token()
