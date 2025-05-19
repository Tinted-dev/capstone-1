from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Service

services_bp = Blueprint('services', __name__)

@services_bp.route('', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([service.to_dict() for service in services]), 200

@services_bp.route('/<int:id>', methods=['GET'])
def get_service(id):
    service = Service.query.get(id)
    
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    
    return jsonify(service.to_dict()), 200

@services_bp.route('', methods=['POST'])
@jwt_required()
def create_service():
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if service already exists
    if Service.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Service with this name already exists'}), 409
    
    # Create service
    service = Service(
        name=data['name'],
        description=data.get('description')
    )
    
    db.session.add(service)
    db.session.commit()
    
    return jsonify({
        'message': 'Service created successfully',
        'service': service.to_dict()
    }), 201