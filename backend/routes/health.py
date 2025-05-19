from flask import Blueprint, jsonify
from models import db, User, Company, Region, Service

health_bp = Blueprint('health', __name__)

@health_bp.route('', methods=['GET'])
def health_check():
    """Health check endpoint with count of records in each table"""
    
    try:
        user_count = User.query.count()
        company_count = Company.query.count()
        region_count = Region.query.count()
        service_count = Service.query.count()
        
        return jsonify({
            'status': 'ok',
            'message': 'API is running',
            'data': {
                'users': user_count,
                'companies': company_count,
                'regions': region_count,
                'services': service_count
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@health_bp.route('/seed', methods=['GET'])
def seed_data():
    """Endpoint to seed initial data for testing"""
    
    try:
        # Check if data already exists
        if User.query.count() > 0:
            return jsonify({
                'status': 'ok',
                'message': 'Data already seeded'
            }), 200
        
        # Create test user
        test_user = User(username='testuser', email='test@example.com')
        test_user.set_password('password123')
        db.session.add(test_user)
        
        # Create regions
        regions = [
            Region(name='North'),
            Region(name='South'),
            Region(name='East'),
            Region(name='West'),
            Region(name='Central')
        ]
        db.session.add_all(regions)
        
        # Create services
        services = [
            Service(name='Residential Waste Collection', 
                    description='Regular collection of household waste'),
            Service(name='Commercial Waste Collection', 
                    description='Waste collection services for businesses'),
            Service(name='Recycling Services', 
                    description='Collection and processing of recyclable materials'),
            Service(name='Hazardous Waste Disposal', 
                    description='Safe disposal of hazardous materials'),
            Service(name='Green Waste Collection', 
                    description='Collection of garden and landscape waste'),
            Service(name='E-Waste Recycling', 
                    description='Recycling of electronic equipment')
        ]
        db.session.add_all(services)
        
        # Commit to get IDs
        db.session.commit()
        
        # Create companies
        companies = [
            Company(
                name='EcoWaste Solutions',
                description='Eco-friendly waste management solutions for residential and commercial clients',
                address='123 Green St, Anytown, USA',
                phone='555-123-4567',
                email='info@ecowaste.example.com',
                website='https://ecowaste.example.com',
                founded_year=2010,
                logo_url='https://via.placeholder.com/150',
                user_id=test_user.id,
                region_id=regions[0].id
            ),
            Company(
                name='CleanCity Garbage',
                description='Full-service waste management company serving the metropolitan area',
                address='456 Clean Ave, Metropolis, USA',
                phone='555-987-6543',
                email='contact@cleancity.example.com',
                website='https://cleancity.example.com',
                founded_year=1995,
                logo_url='https://via.placeholder.com/150',
                user_id=test_user.id,
                region_id=regions[1].id
            ),
            Company(
                name='GreenBin Recycling',
                description='Specialized in recycling services with a focus on sustainability',
                address='789 Recycle Rd, Greenville, USA',
                phone='555-456-7890',
                email='hello@greenbin.example.com',
                website='https://greenbin.example.com',
                founded_year=2015,
                logo_url='https://via.placeholder.com/150',
                user_id=test_user.id,
                region_id=regions[2].id
            )
        ]
        db.session.add_all(companies)
        
        # Assign services to companies
        companies[0].services = [services[0], services[2], services[4]]
        companies[1].services = [services[0], services[1], services[3]]
        companies[2].services = [services[2], services[4], services[5]]
        
        db.session.commit()
        
        return jsonify({
            'status': 'ok',
            'message': 'Data seeded successfully',
            'data': {
                'users': User.query.count(),
                'companies': Company.query.count(),
                'regions': Region.query.count(),
                'services': Service.query.count()
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500