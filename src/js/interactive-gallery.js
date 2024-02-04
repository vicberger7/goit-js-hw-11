import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formEl: document.querySelector('.js-search-form[data-id="1"]'),
  imageEl: document.querySelector('.js-image-container'),
};

function searchImage(imagename) {
  const BASE_URL = 'https://pixabay.com/api/';
  const searchParams = new URLSearchParams({
    key: '42138103-4c7bc70fd41b029843ebe333e',
    q: imagename,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  const PARAMS = `?${searchParams}`;
  const url = BASE_URL + PARAMS;

  return fetch(url)
    .then(res => res.json())
    .catch(error => {
      console.error(error);
    });
}

function displayImages(images, clearPrevious = true) {
  const imageContainer = document.querySelector('.js-image-container');

  if (clearPrevious) {
    imageContainer.innerHTML = '';
  }

  const galleryDiv = document.createElement('div');
  galleryDiv.classList.add('gallery');

  images.forEach(image => {
    const cardLink = document.createElement('a');
    cardLink.href = image.webformatURL;
    cardLink.classList.add('lightbox');

    const card = document.createElement('div');
    card.classList.add('image-card');

    const imgElement = document.createElement('img');
    imgElement.src = image.webformatURL;
    imgElement.alt = image.tags;

    card.appendChild(imgElement);

    const likesElement = document.createElement('span');
    likesElement.textContent = `Likes: ${image.likes}`;

    const viewsElement = document.createElement('span');
    viewsElement.textContent = `Views: ${image.views}`;

    const commentsElement = document.createElement('span');
    commentsElement.textContent = `Comments: ${image.comments}`;

    const downloadsElement = document.createElement('span');
    downloadsElement.textContent = `Downloads: ${image.downloads}`;

    card.appendChild(likesElement);
    card.appendChild(viewsElement);
    card.appendChild(commentsElement);
    card.appendChild(downloadsElement);

    imageContainer.appendChild(card);
  });
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.js-image-container a ', {
  captionsData: 'alt',
  captionDelay: 250,
});

lightbox.on('show.simplelightbox', function (e) {
  console.log('Lightbox is shown', e);
});

refs.formEl.addEventListener('submit', e => {
  e.preventDefault();

  const name = e.target.elements.query.value;

  if (!name) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть текст для пошуку',
    });
    return;
  }
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';

  searchImage(name)
    .then(data => {
      loader.style.display = 'none';
      if (data.hits.length === 0) {
        iziToast.error({
          title: 'Error',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        displayImages(data.hits);
      }
    })
    .catch(error => {
      console.error(error);
      loader.style.display = 'none';
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    });
});
