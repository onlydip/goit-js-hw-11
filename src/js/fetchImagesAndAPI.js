import axios from "axios";
const API_KEY = '31261198-fe46b6a70deec59cacc6dd08e';
let currentPage = 1;

async function fetchImages(query, perPage) {
  const response = await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`,
  );
  currentPage += 1;
  return response.data;
}

function resetPage() {
  currentPage = 1;
}

export { fetchImages, resetPage };
