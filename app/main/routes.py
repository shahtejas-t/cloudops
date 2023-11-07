from app.main import blueprint
from flask import render_template, request, redirect
from config import Config
from app.utils.watsonHelper import WatsonHelper

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
