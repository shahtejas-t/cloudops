from flask import Flask

from config import Config

UPLOAD_FOLDER = 'C:\\Users\\GS-3715\\cloudops\\cloudops\\app\\uploads'
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize Flask extensions here
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    # Register blueprints here
    from app.main import blueprint as main_bp
    app.register_blueprint(main_bp)

    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app