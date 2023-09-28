import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { API_KEY, BASE_URL } from './refs';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    console.error(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

export async function fetchCatByBreed(breedId) {
  const response = await axios.get(`${BASE_URL}?breed_id=${breedId}`);
  return response.data;
}
