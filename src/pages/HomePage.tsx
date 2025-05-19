import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Award, Users, Truck, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import BackgroundSlider from '../components/BackgroundSlider';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden">
        <BackgroundSlider />
        <div className="relative py-16 md:py-24 px-6 max-w-4xl mx-auto text-center">
          <div className="animate-fade-in mb-4 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
              <Search className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Garbage Collection Company Directory
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Find the perfect waste management company for your needs, from residential garbage collection to commercial recycling services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/companies">
              <Button size="lg">
                Browse Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                  Join the Directory
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Connecting You with Waste Management Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive directory makes it easy to find, compare, and connect with garbage collection companies across all regions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Search className="h-8 w-8 text-green-600" />}
            title="Easy Search"
            description="Find companies by region, services, or name with our powerful search features."
          />
          
          <FeatureCard 
            icon={<Recycle className="h-8 w-8 text-green-600" />}
            title="Specialized Services"
            description="Filter by recycling, hazardous waste, or other specialized garbage collection services."
          />
          
          <FeatureCard 
            icon={<Award className="h-8 w-8 text-green-600" />}
            title="Verified Listings"
            description="All listings are verified to ensure you get accurate information."
          />
          
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-green-600" />}
            title="User Reviews"
            description="Read and write reviews to help others make informed decisions."
          />
          
          <FeatureCard 
            icon={<Truck className="h-8 w-8 text-green-600" />}
            title="Service Coverage"
            description="Check service areas and availability for each company in your region."
          />
          
          <FeatureCard 
            icon={<Search className="h-8 w-8 text-green-600" />}
            title="Waste Management Tips"
            description="Access expert guides on waste reduction, recycling, and proper disposal methods."
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-white rounded-xl py-16 px-6 shadow-sm border border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Find the Perfect Garbage Collection Service?
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Browse our comprehensive directory and connect with the right waste management company today.
          </p>
          
          <Link to="/companies">
            <Button size="lg">
              Explore Companies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default HomePage;