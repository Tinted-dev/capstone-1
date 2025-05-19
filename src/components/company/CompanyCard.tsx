import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Company } from '../../api/companies';
import Card from '../common/Card';
import { defaultCompanyLogo } from '../../config';

interface CompanyCardProps {
  company: Company;
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <img
          src={company.logo_url || defaultCompanyLogo}
          alt={`${company.name} logo`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-md">
            {company.region.name}
          </div>
        </div>
      </div>
      
      <Card.Body>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {company.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {company.description || 'No description available.'}
        </p>
        
        <div className="space-y-2 mb-4">
          {company.address && (
            <div className="flex items-start text-sm">
              <MapPin size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{company.address}</span>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center text-sm">
              <Phone size={16} className="text-gray-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{company.phone}</span>
            </div>
          )}
          
          {company.email && (
            <div className="flex items-center text-sm">
              <Mail size={16} className="text-gray-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{company.email}</span>
            </div>
          )}
          
          {company.founded_year && (
            <div className="flex items-center text-sm">
              <Calendar size={16} className="text-gray-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Founded in {company.founded_year}</span>
            </div>
          )}
        </div>
        
        {company.services.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Services:</div>
            <div className="flex flex-wrap gap-2">
              {company.services.map(service => (
                <span 
                  key={service.id}
                  className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
      
      <Card.Footer className="flex justify-between">
        <Link
          to={`/companies/${company.id}`}
          className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 text-sm font-medium"
        >
          View Details
        </Link>
        
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm flex items-center"
          >
            Website
            <ExternalLink size={14} className="ml-1" />
          </a>
        )}
      </Card.Footer>
    </Card>
  );
}

export default CompanyCard;