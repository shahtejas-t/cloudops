from app.main import blueprint
from flask import render_template, request, redirect, jsonify, url_for
from config import Config
from werkzeug.utils import secure_filename
from app.utils.watsonHelper import WatsonHelper
from app.utils.scripts import executeCommands
from pathlib import Path

upload_folder = 'uploads/'

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

@blueprint.route('/executecommands', methods=['GET', 'POST'])
def execute_commands():
    data = request.get_json()
    command = data["executeMessage"]
    KEY_FILE = upload_folder + data["filename"]
    #KEY_FILE =  data["filename"]
    print(KEY_FILE)
    result = executeCommands(command, KEY_FILE)
    print(str(result))
    return jsonify(result)


@blueprint.route('/upload', methods = ['POST'])
def upload_file(): 
        if 'file' not in request.files:
             return jsonify({'error':'No file part'})
        file = request.files['file']
        if file.filename == '':
             return jsonify({'error':'Cannot process the file, please upload file.'})
        # Check if the directory exists, and create it if not
        Path(upload_folder).mkdir(parents=True, exist_ok=True)
        file.save(upload_folder + secure_filename(file.filename))
        return jsonify({'message':'File uploaded successfully'})

@blueprint.route('/predict', methods=['GET', 'POST'])
def get_prediction():
    if request.method == 'POST' and 'chat_message' in request.form:
        chat_message = request.form['chat_message']  
        return jsonify(WatsonHelper().get_prediction(chat_message).get('results')[0].get('generated_text'))
    return jsonify("Internal Server Error.")

@blueprint.route('/checkFileExists', methods = ['GET'])
def check_File():
    fileName = Path(upload_folder + "\\genai-based-application-547a204c911c.json")
    print(fileName)
    if fileName.exists() :
        return {"status":200 , "fileName" : "genai-based-application-547a204c911c.json"}
    return {"status":201 , "message" : "File not exists"}
