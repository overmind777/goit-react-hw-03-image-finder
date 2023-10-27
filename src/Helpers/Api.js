import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '39812277-da7cb5044774440b30a8e3132';

export const fetchImages = async params => {
  const { data } = await axios.get(`?key=${API_KEY}`, {
    params: { ...params },
  });
  return data;
};
