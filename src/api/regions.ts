import axios from 'axios';

export interface Region {
  id: number;
  name: string;
}

export const getRegions = async (): Promise<Region[]> => {
  const response = await axios.get('/api/regions');
  return response.data;
};