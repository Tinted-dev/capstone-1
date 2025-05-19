import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from models import db, User, Company, Region, Service
from routes.auth import auth_bp
from routes.companies import companies_bp
from routes.services import services_bp
from routes.regions import regions_bp
from routes.health import health_bp

def create_app():
    app = Flask(__name__)
    
    # Load config from environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///garbage_collection.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-me')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key-change-me')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 60 * 60 * 24  # 1 day

    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}})
    
    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(companies_bp, url_prefix='/api/companies')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(regions_bp, url_prefix='/api/regions')
    app.register_blueprint(health_bp, url_prefix='/api/health')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)