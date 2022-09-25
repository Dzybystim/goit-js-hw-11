const axios = require('axios');

const URL = 'https://pixabay.com/api/';
const API_KEY = '30142714-7b10e34c120f858629a98df8c';

export async function fetchImages(name, page, limit) {
    try{
      const responce = await axios.get(`${URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${limit}&page=${page}`);
      return responce.data
    }
    catch (error) {
      console.error(error);
    }
}