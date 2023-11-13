from app.main import blueprint
from flask import render_template, request, redirect, jsonify, url_for
from config import Config
from werkzeug.utils import secure_filename
from app.utils.watsonHelper import WatsonHelper
from app.utils.scripts import executeCommands


@blueprint.route('/')
@blueprint.route('/login', methods=['GET', 'POST'])
def index():
    msg=''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'admin':
            msg = f'Welcome to index page {username}'
            return redirect("/chat")
        else:
            msg = 'Incorrect UserName or Password'
    return render_template('login.html',msg=msg)

@blueprint.route('/chat')
def user_Interaction():
    return render_template("index.html")



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

@blueprint.route('/upload', methods = ['POST'])
def upload_file():
        if 'file' not in request.files:
             return jsonify({'error':'No file part'})
        file = request.files['file']
        if file.filename == '':
             return jsonify({'error':'We cannot able to process, please upload file.'})
        file.save('utils/uploads/' + secure_filename(file.filename))
        return jsonify({'message':'File uploaded successfully'})
