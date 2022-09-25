const axios = require('axios');
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchImages } from "./fetchImages";

const formElement = document.querySelector('.search-form');
const galleryElement = document.querySelector('.gallery');
const loadMoreButtonElement = document.querySelector('.load-more')
let page = 1;
let limit = 40;



loadMoreButtonElement.style.display = 'none';

function search(event) {
    event.preventDefault();
    
    loadMoreButtonElement.style.display = 'none';
    let galleryItemElement = document.querySelectorAll('.gallery__item')

    if(galleryItemElement) {
        galleryItemElement.forEach(function(element){
            element.remove()
        })
    }

    let searchText = formElement.elements.searchQuery.value;
    page = 1;

    fetchImages(searchText,page,limit)
    .then(data =>{
        
       
        if(data.totalHits===0||searchText==="") {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
       
        data.hits.map( ({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => {
            let card = `
            <a class="gallery__item" href="${largeImageURL}">
            <div class="photo-card">
             <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image__item"/>
             <div class="info">
             <p class="info-item">
                <b>Likes</b><br>${likes}
             </p>
             <p class="info-item">
                <b>Views</b><br>${views}
             </p>
             <p class="info-item">
                <b>Comments</b><br>${comments}
             </p>
             <p class="info-item">
                <b>Downloads</b><br>${downloads}
             </p>
             </div>
            </div>
            </a>
            `
            galleryElement.insertAdjacentHTML('beforeend', card)
            loadMoreButtonElement.style.display = 'block';

    })



    let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
    lightbox.refresh()

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    })
    .catch(error => console.log(error.message))
}


formElement.addEventListener('submit', search);



function loadMore(event) {
    event.preventDefault();

    let searchText = formElement.elements.searchQuery.value;
    page += 1

    fetchImages(searchText,page,limit)
    .then(data =>{
        let limitImage = data.totalHits/limit

        if (page>limitImage) {
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        }
        
        if(data.totalHits===0||searchText==="") {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
       
        data.hits.map( ({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => {
            let card = `
            <a class="gallery__item" href="${largeImageURL}">
            <div class="photo-card">
             <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image__item"/>
             <div class="info">
             <p class="info-item">
                <b>Likes</b><br>${likes}
             </p>
             <p class="info-item">
                <b>Views</b><br>${views}
             </p>
             <p class="info-item">
                <b>Comments</b><br>${comments}
             </p>
             <p class="info-item">
                <b>Downloads</b><br>${downloads}
             </p>
             </div>
            </div>
            </a>
            `
            galleryElement.insertAdjacentHTML('beforeend', card)
            loadMoreButtonElement.style.display = 'block';

    })
})
}



loadMoreButtonElement.addEventListener('click', loadMore)