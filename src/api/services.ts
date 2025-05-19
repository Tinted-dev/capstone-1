import axios from 'axios';

export interface Service {
  id: number;
  name: string;
  description: string | null;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await axios.get('/api/services');
  return response.data;
};