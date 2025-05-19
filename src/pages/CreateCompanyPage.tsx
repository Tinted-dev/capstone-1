import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCompany, CompanyFormData } from '../api/companies';
import CompanyForm from '../components/company/CompanyForm';

function CreateCompanyPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: CompanyFormData) => {
    try {
      setIsSubmitting(true);
      const response = await createCompany(data);
      toast.success('Company created successfully');
      navigate(`/companies/${response.company.id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create company';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Add a New Company</h1>
      
      <CompanyForm
        onSubmit={handleSubmit}
        submitButtonText="Create Company"
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default CreateCompanyPage;