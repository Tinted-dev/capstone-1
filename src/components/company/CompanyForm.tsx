import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertTriangle } from 'lucide-react';
import { getRegions } from '../../api/regions';
import { getServices } from '../../api/services';
import { CompanyFormData } from '../../api/companies';
import Card from '../common/Card';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import MultiSelect from '../common/MultiSelect';
import Button from '../common/Button';

interface CompanyFormProps {
  initialData?: CompanyFormData;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
}

function CompanyForm({
  initialData,
  onSubmit,
  submitButtonText,
  isLoading = false
}: CompanyFormProps) {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    founded_year: initialData?.founded_year || undefined,
    logo_url: initialData?.logo_url || '',
    region_id: initialData?.region_id || 0,
    service_ids: initialData?.service_ids || []
  });
  
  // Options for dropdown lists
  const [regions, setRegions] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load regions and services
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [regionsData, servicesData] = await Promise.all([
          getRegions(),
          getServices()
        ]);
        
        setRegions(regionsData);
        setServices(servicesData);
      } catch (error) {
        toast.error('Failed to load form options');
        console.error('Failed to load form options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'founded_year' ? (value ? parseInt(value) : undefined) : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle service selection
  const handleServicesChange = (selectedValues: number[]) => {
    setFormData(prev => ({
      ...prev,
      service_ids: selectedValues
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.region_id) {
      newErrors.region_id = 'Region is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {initialData ? 'Edit Company' : 'Add New Company'}
        </h2>
      </Card.Header>
      
      <form onSubmit={handleSubmit}>
        <Card.Body>
          {loadingOptions && (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">Loading form options...</p>
            </div>
          )}
          
          {!loadingOptions && (
            <>
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-4">Basic Information</h3>
                
                <Input
                  label="Company Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Enter company name"
                  required
                />
                
                <TextArea
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Enter company description"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Region *"
                    name="region_id"
                    value={formData.region_id || ''}
                    onChange={handleChange}
                    options={regions.map((region: any) => ({
                      value: region.id,
                      label: region.name
                    }))}
                    error={errors.region_id}
                    required
                  />
                  
                  <Input
                    label="Founded Year"
                    name="founded_year"
                    type="number"
                    value={formData.founded_year || ''}
                    onChange={handleChange}
                    placeholder="e.g., 2005"
                    min={1800}
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <MultiSelect
                  label="Services Offered"
                  options={services.map((service: any) => ({
                    value: service.id,
                    label: service.name
                  }))}
                  selectedValues={formData.service_ids}
                  onChange={handleServicesChange}
                />
              </div>
              
              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-4">Contact Information</h3>
                
                <Input
                  label="Address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  placeholder="Enter company address"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Enter company phone"
                  />
                  
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Enter company email"
                  />
                </div>
                
                <Input
                  label="Website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  error={errors.website}
                  placeholder="https://example.com"
                />
                
                <Input
                  label="Logo URL"
                  name="logo_url"
                  value={formData.logo_url || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="mr-2 text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-400">Please correct the following errors:</p>
                      <ul className="list-disc list-inside mt-1 text-sm text-red-700 dark:text-red-400">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card.Body>
        
        <Card.Footer className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit"
            isLoading={isLoading}
            disabled={loadingOptions || isLoading}
          >
            {submitButtonText}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}

export default CompanyForm;