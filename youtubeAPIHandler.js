const apiKey = 'AIzaSyABBJ6sUB5YrH4RXshZRQDYzxXQsmvQc7g';
const channelId = 'UCT7nBzxFHbvQVmclwNEVG1A';

const getUploadPlaylistId = async () => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items[0].contentDetails.relatedPlaylists.uploads;
};

const getLatestVideos = async () => {
  const uploadPlaylistId = await getUploadPlaylistId();
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=5&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const videos = data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.snippet.resourceId.videoId,
    publishedAt: item.snippet.publishedAt,
  }));
  return videos;
};

const createElements = async () => {
  const videos = await getLatestVideos();
  const container = document.getElementById('carouselTrack');
  container.innerHTML = '';

  videos.forEach(video => {
    const videoDiv = document.createElement('div');
    videoDiv.className = 'featuredVideo';
    videoDiv.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" style="text-decoration: none; color: inherit;">
        <img src="https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg" alt="${video.title}">
        <p>${video.title}</p>
      </a>
    `;
    container.appendChild(videoDiv);
  });
};

let currentIndex = 0;

const updateCarousel = () => {
  const container = document.getElementById('carouselTrack');
  const videoWidth = container.querySelector('.featuredVideo')?.offsetWidth || 320;
  const gap = 20; // margin-right da featuredVideo
  const scrollAmount = (videoWidth + gap) * currentIndex;

  container.style.transform = `translateX(-${scrollAmount}px)`;
};

document.getElementById('prevButton').addEventListener('click', () => {
  const container = document.getElementById('carouselTrack');
  const maxIndex = container.children.length - 1;
  currentIndex = Math.max(0, currentIndex - 1);
  updateCarousel();
});

document.getElementById('nextButton').addEventListener('click', () => {
  const container = document.getElementById('carouselTrack');
  const maxIndex = container.children.length - 1;
  currentIndex = Math.min(maxIndex, currentIndex + 1);
  updateCarousel();
});

// Inicializa o carrossel
window.onload = async () => {
  await createElements();
  updateCarousel();
};
