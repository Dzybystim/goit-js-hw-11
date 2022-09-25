import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchImages } from "./fetchImages";

const formElement = document.querySelector('.search-form');
const galleryElement = document.querySelector('.gallery');
const loadMoreButtonElement = document.querySelector('.load-more')
let page = 1;
let limit = 40;
let searchText = "";

//////////////////////////////////////////////////////////////Включаю и выключаю кнопку Load More

function loadMoreOn () {
    loadMoreButtonElement.style.display = 'block';
}

function loadMoreOff () {
    loadMoreButtonElement.style.display = 'none';
}

////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////// Убираю дефолтные настройки

function removeDefaultSettings (event) {
    event.preventDefault();
}
/////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////Удаляю при новом вызове прошлый запрос

function removeGalleryItem () {
    let galleryItemElement = document.querySelectorAll('.gallery__item')

    if(galleryItemElement) {
        galleryItemElement.forEach(function(element){
            element.remove()
        })
    }
}
////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////Создаю карточки для фото

function createCard (webformatURL,largeImageURL,tags,likes,views,comments,downloads) {
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
}
//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////Сообщение если закончились фотографии

function messageIfRanOutOfPhotos (totalHits) {
    let limitImage = totalHits/limit

    if (page>=limitImage) {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    loadMoreOff ()
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////

loadMoreOff () ///// Прячем кнопку Load More сразу вначале

////////////////////////////////////////////////////////////////////Функция при Submit по кнопки Search
function search(event) {

    removeDefaultSettings (event)
    
    loadMoreOff ()

    removeGalleryItem ()


    searchText = formElement.elements.searchQuery.value.trim();
    page = 1;

    async function doStuff() {
        try{
            const data = await fetchImages(searchText,page,limit)

            if(data.totalHits===0||searchText==="") {
              return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
   
            data.hits.map( ({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => {
              createCard (webformatURL,largeImageURL,tags,likes,views,comments,downloads)
              loadMoreOn ()

            })

            messageIfRanOutOfPhotos (data.totalHits)

            let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
            lightbox.refresh()

            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            
        }
        catch (error) {
            console.log(error.message)
        }
    }
    doStuff()
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

formElement.addEventListener('submit', search);/// Слушаем событие Submit по кнопке Search

/////////////////////////////////////////////////////////////////////////////////Функция при Клике по кнопке Load More

function loadMore(event) {
    removeDefaultSettings (event);

    page += 1

    async function doStuff() {
        try{
            const data = await fetchImages(searchText,page,limit);
    
            if(data.totalHits===0||searchText==="") {
              return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
            
            data.hits.map( ({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => {
              createCard (webformatURL,largeImageURL,tags,likes,views,comments,downloads)
              loadMoreOn ()
            })

            messageIfRanOutOfPhotos (data.totalHits)

            let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
            lightbox.refresh()
        }
        catch (error) {
            console.log(error.message)
        }
    }
    doStuff()

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


loadMoreButtonElement.addEventListener('click', loadMore)///// Слушаем событие Клик по кнопке LoadMore