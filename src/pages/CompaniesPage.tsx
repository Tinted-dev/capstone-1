import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Filter, Search } from 'lucide-react';
import { getCompanies } from '../api/companies';
import { getRegions, Region } from '../api/regions';
import { getServices, Service } from '../api/services';
import CompanyCard from '../components/company/CompanyCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Select from '../components/common/Select';
import { useAuth } from '../contexts/AuthContext';

function CompaniesPage() {
  const { isAuthenticated } = useAuth();
  
  // State for companies and pagination
  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);
  
  // State for filters
  const [regions, setRegions] = useState<Region[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await getCompanies(
        currentPage,
        perPage,
        selectedRegion ? parseInt(selectedRegion) : undefined,
        selectedService ? parseInt(selectedService) : undefined
      );
      
      setCompanies(response.companies);
      setTotalCompanies(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      toast.error('Failed to load companies');
      console.error('Failed to load companies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const [regionsData, servicesData] = await Promise.all([
        getRegions(),
        getServices()
      ]);
      
      setRegions(regionsData);
      setServices(servicesData);
    } catch (error) {
      toast.error('Failed to load filter options');
      console.error('Failed to load filter options:', error);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchFilterOptions();
  }, []);
  
  // Fetch companies when filters or pagination changes
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, selectedRegion, selectedService]);
  
  // Handle filter changes
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setCurrentPage(1);
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Search functionality coming soon!');
  };
  
  const handleClearFilters = () => {
    setSelectedRegion('');
    setSelectedService('');
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Filtered companies (client-side searching)
  const filteredCompanies = searchQuery
    ? companies.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : companies;
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies Directory</h1>
          <p className="text-gray-600">
            Browse and find waste management companies for your needs
          </p>
        </div>
        
        {isAuthenticated && (
          <Link to="/companies/create" className="mt-4 md:mt-0">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </Link>
        )}
      </div>
      
      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Find Companies</h2>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-gray-600 hover:text-gray-900 md:hidden"
          >
            <Filter className="mr-2 h-4 w-4" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            <Select
              options={regions.map(region => ({ value: region.id, label: region.name }))}
              value={selectedRegion}
              onChange={handleRegionChange}
              className="mb-0"
              label=""
            />
            
            <Select
              options={services.map(service => ({ value: service.id, label: service.name }))}
              value={selectedService}
              onChange={handleServiceChange}
              className="mb-0"
              label=""
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredCompanies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex rounded-md">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-l-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-900">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-r-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search query.
          </p>
          <Button onClick={handleClearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default CompaniesPage;