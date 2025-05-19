from werkzeug.security import generate_password_hash
from models import db, User, Region, Service, Company

def seed_database():
    """Seed the database with initial data"""
    
    # Create admin user
    admin = User(
        username='admin',
        email='admin@example.com'
    )
    admin.set_password('admin123')
    db.session.add(admin)
    
    # Create regular user
    user = User(
        username='user',
        email='user@example.com'
    )
    user.set_password('user123')
    db.session.add(user)
    
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
        Service(
            name='Residential Waste Collection',
            description='Regular collection of household waste and garbage'
        ),
        Service(
            name='Commercial Waste Management',
            description='Comprehensive waste management solutions for businesses'
        ),
        Service(
            name='Recycling Services',
            description='Collection and processing of recyclable materials'
        ),
        Service(
            name='Hazardous Waste Disposal',
            description='Safe disposal of hazardous materials and chemicals'
        ),
        Service(
            name='Green Waste Collection',
            description='Collection and composting of yard waste and organic materials'
        ),
        Service(
            name='Construction Debris Removal',
            description='Removal and disposal of construction and demolition waste'
        ),
        Service(
            name='Electronic Waste Recycling',
            description='Proper disposal and recycling of electronic equipment'
        ),
        Service(
            name='Bulk Waste Pickup',
            description='Collection of large items and bulk waste materials'
        )
    ]
    db.session.add_all(services)
    
    # Commit to get IDs
    db.session.commit()
    
    # Create companies for admin
    admin_companies = [
        Company(
            name='EcoWaste Solutions',
            description='Leading provider of eco-friendly waste management solutions. We specialize in residential and commercial waste collection with a focus on sustainability.',
            address='123 Green Street, Eco City, EC 12345',
            phone='(555) 123-4567',
            email='info@ecowaste.example.com',
            website='https://ecowaste.example.com',
            founded_year=2010,
            logo_url='https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg',
            user_id=admin.id,
            region_id=regions[0].id,
            services=[services[0], services[2], services[4]]
        ),
        Company(
            name='Metro Waste Management',
            description='Full-service waste management company serving the metropolitan area. Offering comprehensive solutions for all your waste disposal needs.',
            address='456 Industrial Ave, Metro City, MC 67890',
            phone='(555) 987-6543',
            email='contact@metrowaste.example.com',
            website='https://metrowaste.example.com',
            founded_year=1995,
            logo_url='https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg',
            user_id=admin.id,
            region_id=regions[1].id,
            services=[services[1], services[3], services[5]]
        )
    ]
    db.session.add_all(admin_companies)
    
    # Create companies for regular user
    user_companies = [
        Company(
            name='Green Recycling Co',
            description='Specialized recycling services with a focus on environmental sustainability. We make recycling easy and accessible for everyone.',
            address='789 Recycle Road, Green Valley, GV 13579',
            phone='(555) 456-7890',
            email='info@greenrecycling.example.com',
            website='https://greenrecycling.example.com',
            founded_year=2015,
            logo_url='https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg',
            user_id=user.id,
            region_id=regions[2].id,
            services=[services[2], services[6], services[7]]
        ),
        Company(
            name='City Sanitation Services',
            description='Your trusted partner for urban waste management. Providing reliable and efficient sanitation services across the city.',
            address='321 Clean Street, Downtown, DT 97531',
            phone='(555) 321-0987',
            email='info@citysanitation.example.com',
            website='https://citysanitation.example.com',
            founded_year=2000,
            logo_url='https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg',
            user_id=user.id,
            region_id=regions[3].id,
            services=[services[0], services[1], services[4]]
        )
    ]
    db.session.add_all(user_companies)
    
    # Commit all changes
    db.session.commit()