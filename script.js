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
z
