import axios from 'axios';
import { API_KEY, BASE_URL } from './refs';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export async function getBreeds() {
  const response = await axios.get('https://api.thecatapi.com/v1/breeds');
  return response.data;
}

export async function getCatByBreed(breedId) {
  const response = await axios.get(`${BASE_URL}?breed_id=${breedId}`);
  return response.data;
}
