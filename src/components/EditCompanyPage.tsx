import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCompany, updateCompany, CompanyFormData } from '../api/companies';
import CompanyForm from '../components/company/CompanyForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

function EditCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [initialData, setInitialData] = useState<CompanyFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const company = await getCompany(parseInt(id));
          
          // Check if user is the owner
          if (user && company.user_id !== user.id) {
            toast.error('You are not authorized to edit this company');
            navigate(`/companies/${id}`);
            return;
          }
          
          // Transform company data to form data
          setInitialData({
            name: company.name,
            description: company.description || '',
            address: company.address || '',
            phone: company.phone || '',
            email: company.email || '',
            website: company.website || '',
            founded_year: company.founded_year || undefined,
            logo_url: company.logo_url || '',
            region_id: company.region.id,
            service_ids: company.services.map(service => service.id)
          });
        }
      } catch (error) {
        toast.error('Failed to load company data');
        navigate('/companies');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompany();
  }, [id, navigate, user]);
  
  const handleSubmit = async (data: CompanyFormData) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateCompany(parseInt(id), data);
      toast.success('Company updated successfully');
      navigate(`/companies/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update company';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Company</h1>
      
      {initialData && (
        <CompanyForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitButtonText="Update Company"
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}

export default EditCompanyPage;