import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Globe, Mail, Phone, MapPin, Calendar, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { getCompany, deleteCompany, Company } from '../api/companies';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { defaultCompanyLogo } from '../config';

function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const companyData = await getCompany(parseInt(id));
          setCompany(companyData);
        }
      } catch (error) {
        toast.error('Failed to load company details');
        console.error('Failed to load company:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyDetails();
  }, [id]);
  
  const handleDelete = async () => {
    if (!company) return;
    
    try {
      setIsDeleting(true);
      await deleteCompany(company.id);
      toast.success('Company deleted successfully');
      navigate('/companies');
    } catch (error) {
      toast.error('Failed to delete company');
      console.error('Failed to delete company:', error);
      setIsDeleting(false);
    }
  };
  
  const isOwner = user && company && user.id === company.user_id;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Company Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The company you're looking for doesn't exist or has been removed.</p>
          <Link to="/companies">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/companies" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>
      </div>
      
      {/* Company Header */}
      <div className="relative mb-8">
        <div className="h-48 bg-white dark:bg-gray-800 rounded-t-lg">
          <img
            src={company.logo_url || defaultCompanyLogo}
            alt={`${company.name} banner`}
            className="w-full h-full object-cover rounded-t-lg opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-t-lg"></div>
        </div>
        
        <div className="relative -mt-16 flex flex-col items-center px-4">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full border-4 border-gray-50 dark:border-gray-900">
            <img
              src={company.logo_url || defaultCompanyLogo}
              alt={`${company.name} logo`}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{company.name}</h1>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-600/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                {company.region.name} Region
              </span>
              
              {company.founded_year && (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Est. {company.founded_year}
                </span>
              )}
            </div>
            
            {isOwner && (
              <div className="flex justify-center gap-3 mb-4">
                <Link to={`/companies/${company.id}/edit`}>
                  <Button size="sm" variant="secondary">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Company Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About</h2>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {company.description || 'No description available.'}
              </p>
            </Card.Body>
          </Card>
          
          {company.services.length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Services Offered</h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.services.map(service => (
                    <div key={service.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.description || 'No service description available.'}
                      </p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
        
        {/* Contact Info */}
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
            </Card.Header>
            <Card.Body className="space-y-4">
              {company.address && (
                <div className="flex">
                  <MapPin className="text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</div>
                    <div className="text-gray-900 dark:text-white">{company.address}</div>
                  </div>
                </div>
              )}
              
              {company.phone && (
                <div className="flex">
                  <Phone className="text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</div>
                    <div className="text-gray-900 dark:text-white">{company.phone}</div>
                  </div>
                </div>
              )}
              
              {company.email && (
                <div className="flex">
                  <Mail className="text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</div>
                    <a href={`mailto:${company.email}`} className="text-green-600 dark:text-green-400 hover:underline">
                      {company.email}
                    </a>
                  </div>
                </div>
              )}
              
              {company.website && (
                <div className="flex">
                  <Globe className="text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Website</div>
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 dark:text-green-400 hover:underline break-all"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              )}
              
              {!company.phone && !company.email && !company.address && !company.website && (
                <p className="text-gray-600 dark:text-gray-400">No contact information available.</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-start mb-4">
              <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Company</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete "{company.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete Company
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDetailPage;