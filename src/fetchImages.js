import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '30142714-7b10e34c120f858629a98df8c';

export function fetchImages(name, page, limit) {

    return fetch(`${URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${limit}&page=${page}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.status);
          }
        return response.json()})
    }
