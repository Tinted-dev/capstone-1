import axios from 'axios';

export interface Company {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  founded_year: number | null;
  logo_url: string | null;
  region: {
    id: number;
    name: string;
  };
  services: {
    id: number;
    name: string;
    description: string | null;
  }[];
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyFormData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  founded_year?: number;
  logo_url?: string;
  region_id: number;
  service_ids: number[];
}

export const getCompanies = async (
  page = 1,
  perPage = 10,
  regionId?: number,
  serviceId?: number
) => {
  let url = `/api/companies?page=${page}&per_page=${perPage}`;
  
  if (regionId) {
    url += `&region_id=${regionId}`;
  }
  
  if (serviceId) {
    url += `&service_id=${serviceId}`;
  }
  
  const response = await axios.get(url);
  return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
  const response = await axios.get(`/api/companies/${id}`);
  return response.data;
};

export const createCompany = async (data: CompanyFormData) => {
  const response = await axios.post('/api/companies', data);
  return response.data;
};

export const updateCompany = async (id: number, data: CompanyFormData) => {
  const response = await axios.put(`/api/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id: number) => {
  const response = await axios.delete(`/api/companies/${id}`);
  return response.data;
};