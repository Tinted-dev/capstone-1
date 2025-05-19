from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Region

regions_bp = Blueprint('regions', __name__)

@regions_bp.route('', methods=['GET'])
def get_regions():
    regions = Region.query.all()
    return jsonify([region.to_dict() for region in regions]), 200

@regions_bp.route('/<int:id>', methods=['GET'])
def get_region(id):
    region = Region.query.get(id)
    
    if not region:
        return jsonify({'error': 'Region not found'}), 404
    
    return jsonify(region.to_dict()), 200

@regions_bp.route('', methods=['POST'])
@jwt_required()
def create_region():
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if region already exists
    if Region.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Region with this name already exists'}), 409
    
    # Create region
    region = Region(
        name=data['name']
    )
    
    db.session.add(region)
    db.session.commit()
    
    return jsonify({
        'message': 'Region created successfully',
        'region': region.to_dict()
    }), 201