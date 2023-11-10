from app.main import blueprint
from flask import render_template, request,jsonify
from config import Config
from app.utils.watsonHelper import WatsonHelper
from app.utils.scripts import executeCommands


@blueprint.route('/')
def index():
    return render_template('index.html')


@blueprint.route('/wat/')
def test_page():
    return '<br> URL : ' + Config.WATSONX_URL + '<br> API KEY : ' + Config.WATSONX_API_KEY + '<br> PROJECT_ID : ' + Config.WATSONX_PROJECT_ID + '<br> TOKEN : ' + WatsonHelper().get_token()


@blueprint.route('/executeCommands', methods=['GET', 'POST'])
def execute_commands():
    data = request.get_json()
    command = data["Command"]
    KEY_FILE = data["Key_File"]
    result = executeCommands(command, KEY_FILE)
    return jsonify(result)
