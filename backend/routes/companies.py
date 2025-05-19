from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Company, Service, Region

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('', methods=['GET'])
def get_companies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    region_id = request.args.get('region_id', type=int)
    service_id = request.args.get('service_id', type=int)
    
    query = Company.query
    
    # Apply filters
    if region_id:
        query = query.filter_by(region_id=region_id)
    
    if service_id:
        query = query.join(Company.services).filter(Service.id == service_id)
    
    # Paginate results
    pagination = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'companies': [company.to_dict() for company in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
        'per_page': per_page
    }), 200

@companies_bp.route('/<int:id>', methods=['GET'])
def get_company(id):
    company = Company.query.get(id)
    
    if not company:
        return jsonify({'error': 'Company not found'}), 404
    
    return jsonify(company.to_dict()), 200

@companies_bp.route('', methods=['POST'])
@jwt_required()
def create_company():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name') or not data.get('region_id'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if region exists
    region = Region.query.get(data['region_id'])
    if not region:
        return jsonify({'error': 'Region not found'}), 404
    
    # Create company
    company = Company(
        name=data['name'],
        description=data.get('description'),
        address=data.get('address'),
        phone=data.get('phone'),
        email=data.get('email'),
        website=data.get('website'),
        founded_year=data.get('founded_year'),
        logo_url=data.get('logo_url'),
        user_id=user_id,
        region_id=data['region_id']
    )
    
    # Add services if provided
    service_ids = data.get('service_ids', [])
    if service_ids:
        services = Service.query.filter(Service.id.in_(service_ids)).all()
        company.services = services
    
    db.session.add(company)
    db.session.commit()
    
    return jsonify({
        'message': 'Company created successfully',
        'company': company.to_dict()
    }), 201

@companies_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_company(id):
    user_id = get_jwt_identity()
    company = Company.query.get(id)
    
    if not company:
        return jsonify({'error': 'Company not found'}), 404
    
    # Check if user is the owner
    if company.user_id != user_id:
        return jsonify({'error': 'Not authorized to update this company'}), 403
    
    data = request.get_json()
    
    # Update fields
    if 'name' in data:
        company.name = data['name']
    if 'description' in data:
        company.description = data['description']
    if 'address' in data:
        company.address = data['address']
    if 'phone' in data:
        company.phone = data['phone']
    if 'email' in data:
        company.email = data['email']
    if 'website' in data:
        company.website = data['website']
    if 'founded_year' in data:
        company.founded_year = data['founded_year']
    if 'logo_url' in data:
        company.logo_url = data['logo_url']
    if 'region_id' in data:
        # Check if region exists
        region = Region.query.get(data['region_id'])
        if not region:
            return jsonify({'error': 'Region not found'}), 404
        company.region_id = data['region_id']
    
    # Update services if provided
    if 'service_ids' in data:
        services = Service.query.filter(Service.id.in_(data['service_ids'])).all()
        company.services = services
    
    db.session.commit()
    
    return jsonify({
        'message': 'Company updated successfully',
        'company': company.to_dict()
    }), 200

@companies_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_company(id):
    user_id = get_jwt_identity()
    company = Company.query.get(id)
    
    if not company:
        return jsonify({'error': 'Company not found'}), 404
    
    # Check if user is the owner
    if company.user_id != user_id:
        return jsonify({'error': 'Not authorized to delete this company'}), 403
    
    db.session.delete(company)
    db.session.commit()
    
    return jsonify({'message': 'Company deleted successfully'}), 200