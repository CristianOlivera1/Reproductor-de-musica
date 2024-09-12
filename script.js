const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item) => {
      item.className = "nav-item";
    });
    navItem.className = "nav-item active";
  });
});


const containers = document.querySelectorAll(".containers");

containers.forEach((container) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const step = (x - startX) * 0.6;
    container.scrollLeft = scrollLeft - step;
  });

  container.addEventListener("mouseup", () => {
    isDragging = false;
  });

  container.addEventListener("mouseleave", () => {
    isDragging = false;
  });
});

// Variables de control para el reproductor de audio
const progress = document.getElementById("progress");
const controlIcon = document.getElementById("controlIcon");
const playPauseButton = document.querySelector(".play-pause-btn");
const forwardButton = document.querySelector(".controls button.forward");
const backwardButton = document.querySelector(".controls button.backward");
const rotatingImage = document.getElementById("rotatingImage");
const songName = document.querySelector(".music-player h2");
const artistName = document.querySelector(".music-player p");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

let rotating = false;
let currentRotation = 0;
let rotationInterval;

// Reproductor de audio
const audioPlayer = new Audio();
let currentSongIndex = 0;

// Actualizar información de la canción
function updateSongInfo(src, title = "", artist = "", cover = "") {
  audioPlayer.src = src;
  songName.textContent = title;
  artistName.textContent = artist;
  rotatingImage.src = cover;
  audioPlayer.play(); // Reproducir audio
  controlIcon.classList.add("fa-pause");
  controlIcon.classList.remove("fa-play");
  startRotation();
}

// Manejar el clic en las imágenes de la canción
document.querySelectorAll('.song-img').forEach((songImage, index) => {
  songImage.addEventListener('click', () => {
    const audioSrc = songImage.getAttribute('data-song-src'); // Obtén la fuente del audio usando data-song-src
    
    if (audioPlayer.src !== audioSrc) {
      const title = songImage.nextElementSibling.querySelector("h2").textContent;
      const artist = songImage.nextElementSibling.querySelector("p").textContent;
      const cover = songImage.querySelector("img").src;
      
      updateSongInfo(audioSrc, title, artist, cover); // Actualizar información
      currentSongIndex = index; // Actualizar el índice actual
    } else {
      playPause(); // Reproducir o pausar
    }
  });
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function startRotation() {
  if (!rotating) {
    rotating = true;
    rotationInterval = setInterval(rotateImage, 50);
  }
}

function pauseRotation() {
  clearInterval(rotationInterval);
  rotating = false;
}

function rotateImage() {
  currentRotation += 1;
  rotatingImage.style.transform = `rotate(${currentRotation}deg)`;
}

// Eventos del reproductor de audio
audioPlayer.addEventListener("timeupdate", function () {
  progress.value = audioPlayer.currentTime;
  currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("ended", function () {
  forwardSong();
});

audioPlayer.addEventListener("loadedmetadata", function () {
  progress.max = audioPlayer.duration;
  durationDisplay.textContent = formatTime(audioPlayer.duration);
});

// Función para reproducir/pausar el audio
function playPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    controlIcon.classList.add("fa-pause");
    controlIcon.classList.remove("fa-play");
    startRotation();
  } else {
    audioPlayer.pause();
    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");
    pauseRotation();
  }
}

// Eventos de botones de control
playPauseButton.addEventListener("click", playPause);

progress.addEventListener("input", function () {
  audioPlayer.currentTime = progress.value;
});

forwardButton.addEventListener("click", forwardSong);
backwardButton.addEventListener("click", backwardSong);

function forwardSong() {
  currentSongIndex = (currentSongIndex + 1) % document.querySelectorAll('.song-img').length;
  document.querySelectorAll('.song-img')[currentSongIndex].click();
}

function backwardSong() {
  currentSongIndex = (currentSongIndex - 1 + document.querySelectorAll('.song-img').length) % document.querySelectorAll('.song-img').length;
  document.querySelectorAll('.song-img')[currentSongIndex].click();
}

// Iniciar con la primera canción
document.querySelectorAll('.song-img')[0].click();


//POPULAR PLAYLIST
var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  speed: 600,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 10,
    stretch: 120,
    depth: 200,
    modifier: 1,
    slideShadows: false,
  },
  on: {
    click(event) {
      swiper.slideTo(this.clickedIndex);
    },
  },
  pagination: {
    el: ".swiper-pagination",
  },
});
// CONFIGURAR LA IMAGEN COMO DJ
const albumCover = document.querySelector('.album-cover');
const image = albumCover.querySelector('img');
let isSpinning = false;
let isDragging = false;
let startAngle = 0;
let currentRotation2 = 0;
let rotationTimeout;

// Convertir la rotación actual en grados
function getRotationDegrees() {
  const style = window.getComputedStyle(albumCover);
  const matrix = new WebKitCSSMatrix(style.transform);
  return Math.round(Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI));
}

// Iniciar la rotación automática y detenerla después de 2 segundos
function startAutomaticRotation() {
  albumCover.classList.add('rotating');
  isSpinning = true;
  clearTimeout(rotationTimeout); // Limpiar cualquier timeout previo
  rotationTimeout = setTimeout(() => {
    if (isSpinning) {
      albumCover.classList.remove('rotating');
      isSpinning = false;
    }
  }, 2000); // Detener la rotación después de 2 segundos
}

// Iniciar el arrastre con ratón o toque
function startDragging(e) {
  isDragging = true;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  startAngle = Math.atan2(clientY - albumCover.getBoundingClientRect().top, clientX - albumCover.getBoundingClientRect().left) * (180 / Math.PI);
  e.preventDefault(); // Prevenir selección de texto o zoom en dispositivos táctiles
  albumCover.style.cursor = 'grabbing';
  startAutomaticRotation(); // Iniciar la rotación automática al interactuar
}

// Actualizar la rotación durante el arrastre
function rotateAlbumCover(e) {
  if (isDragging) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const currentAngle = Math.atan2(clientY - albumCover.getBoundingClientRect().top, clientX - albumCover.getBoundingClientRect().left) * (180 / Math.PI);
    const deltaAngle = currentAngle - startAngle;
    currentRotation2 = getRotationDegrees() + deltaAngle;
    albumCover.style.transform = `rotate(${currentRotation2}deg)`;
    startAngle = currentAngle;
  }
}

// Detener el arrastre
function stopDragging() {
  if (isDragging) {
    isDragging = false;
    albumCover.style.cursor = 'grab'; // Restaurar el cursor
  }
}

// Iniciar/Detener la rotación automática al hacer clic o tocar
albumCover.addEventListener('click', () => {
  if (!isSpinning) {
    startAutomaticRotation();
  } else {
    albumCover.classList.remove('rotating');
    isSpinning = false;
    clearTimeout(rotationTimeout); // Limpiar el timeout si se detiene manualmente
  }
});

// Controladores de ratón
albumCover.addEventListener('mousedown', startDragging);
window.addEventListener('mousemove', rotateAlbumCover);
window.addEventListener('mouseup', stopDragging);

// Controladores táctiles (para móviles)
albumCover.addEventListener('touchstart', startDragging);
window.addEventListener('touchmove', rotateAlbumCover);
window.addEventListener('touchend', stopDragging);

playPauseButton.addEventListener("click", playPause);

//Buscador
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('songSearch');
  const songContainer = document.querySelector('.song-container');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const songs = songContainer.querySelectorAll('.song');

    songs.forEach(song => {
      const title = song.querySelector('.song-title h2').textContent.toLowerCase();
      const artist = song.querySelector('.song-title p').textContent.toLowerCase();
      if (title.includes(query) || artist.includes(query)) {
        song.style.display = '';
      } else {
        song.style.display = 'none';
      }
    });
  });
});

//cambiar fondo
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const body = document.body;

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const bgNumber = this.getAttribute('data-bg');
      body.classList.remove(
        'background-1', 'background-2', 'background-3',
        'background-4', 'background-5', 'background-6',
        'background-7', 'background-8', 'background-9',
        'background-10', 'background-11', 'background-12',
        'background-13', 'background-14', 'background-15'
      );
      body.classList.add(`background-${bgNumber}`);
    });
  });
});