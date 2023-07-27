import './css/style.css';
import { fetchImages } from './js/fetchImagesAndAPI.js';
import { resetPage } from './js/fetchImagesAndAPI.js';
import { LoadMoreBTN } from './js/loadMoreBTN.js';
import { ImageMarkup } from './js/markup.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const Images =  fetchImages();
const BTN = new LoadMoreBTN({ selektor: '.load-more', hidden: true });
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

function onSearch(e) {
    e.preventDefault();

    const currentWord = e.currentTarget.elements.searchQuery.value.trim();
    if (currentWord === '') {
        return Notify.info(`Enter a word to search for images.`);
    }
    Images.searchQuery = currentWord;
    BTN.show();
    resetPage(); 
    clearImageContainer();
    fetchImages();
}

function clearImageContainer() {
    gallery.innerHTML = '';
}

function fetchImages() {
    BTN.disabled();
    Images.fetchImages().then(({ data }) => {
        if (data.total === 0) {
            Notify.info(`Sorry, there are no images matching your search query: ${Images.searchQuery}. Please try again.`);
            BTN.hide();
            return;
        }
        appendImagesMarkup(data);
        onPageScrolling();
        lightbox.refresh();
        const { totalHits } = data;

        if (gallery.children.length === totalHits) {
            Notify.info(`We're sorry, but you've reached the end of search results.`);
            BTN.hide();
        } else {
            BTN.enable();
            Notify.success(`Hooray! We found ${totalHits} images.`);
        }
    }).catch(handleError);
}

function handleError() {
    console.log('Error!');
}

function appendImagesMarkup(data) {
    gallery.insertAdjacentHTML('beforeend', ImageMarkup(data));
}

function onPageScrolling() {
    const cardHeight = gallery.offsetHeight;
    window.scrollTo({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

searchForm.addEventListener('submit', onSearch);
BTN.refs.button.addEventListener('click', fetchImages);
