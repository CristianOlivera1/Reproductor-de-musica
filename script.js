//loader para celular
document.getElementById('loader').addEventListener('click', function () {
  // Oculta el loader
  this.style.display = 'none';
  const randomIndex = Math.floor(Math.random() * 61); 
   // Selecciona el elemento basado en el índice aleatorio
   const songElements = document.querySelectorAll('.song-img');
  
   // Verifica que el índice aleatorio esté dentro del rango de elementos disponibles
   if (randomIndex < songElements.length) {
     songElements[randomIndex].click();
   } else {
     console.log('El índice generado está fuera del rango de elementos disponibles.');
   }
});
//loader para celular

const navItems = document.querySelectorAll(".nav-item");

// Manejar clic en los elementos de navegación
navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
    navItem.classList.add("active");
  });
});

// Activar el botón por defecto al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const defaultActiveItem = document.querySelector(".nav-item.active");
  if (defaultActiveItem) {
    defaultActiveItem.classList.add("active");
  }
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
let currentSongIndex = -1; // Inicia sin ninguna canción seleccionada

// Actualizar información de la canción
function updateSongInfo(src, title = "", artist = "", cover = "") {
  audioPlayer.src = src;
  songName.textContent = title;
  artistName.textContent = artist;
  rotatingImage.src = cover;
  audioPlayer.play(); // Reproducir audio

  // Cambiar ícono a pausa
  controlIcon.classList.add("fa-pause");
  controlIcon.classList.remove("fa-play");
  startRotation();
}

/// Función para actualizar el estado de la canción actual en la lista
function updateCurrentSongState(state) {
  // Primero, eliminamos el estado de la canción que estaba en reproducción o pausa, excepto la actual
  document.querySelectorAll('.song').forEach((songElement, index) => {
    const overlayIcon = songElement.querySelector('.overlay i');
    const statusIcon = songElement.querySelector('.status-icon i');

    if (index !== currentSongIndex) {
      // Solo eliminamos el estado de las canciones que no son la actual
      songElement.classList.remove('playing', 'paused');
      overlayIcon.classList.remove('fa-pause', 'fa-play');
      statusIcon.classList.remove('fa-pause', 'fa-play');
      // Volvemos a agregar el ícono de play a todas las canciones que no están en reproducción
      overlayIcon.classList.add('fa-play');
      statusIcon.classList.add('fa-play');
    }
  });

  // Luego, aplicamos el estado a la canción actual
  const currentSongElement = document.querySelector(`.song:nth-child(${currentSongIndex + 1})`);
  const overlayIcon = currentSongElement.querySelector('.overlay i');
  const statusIcon = currentSongElement.querySelector('.status-icon i');

  if (state === 'playing') {
    currentSongElement.classList.add('playing');
    currentSongElement.classList.remove('paused');
    overlayIcon.classList.remove('fa-play');
    overlayIcon.classList.add('fa-pause'); // Mostrar icono de pausa
    statusIcon.classList.remove('fa-play');
    statusIcon.classList.add('fa-pause'); // Mostrar icono de pausa
  } else if (state === 'paused') {
    currentSongElement.classList.add('paused');
    currentSongElement.classList.remove('playing');
    overlayIcon.classList.remove('fa-pause');
    overlayIcon.classList.add('fa-play'); // Volver a icono de play
    statusIcon.classList.remove('fa-pause');
    statusIcon.classList.add('fa-play'); // Volver a icono de play
  }
}

//cambiar icono de play a pause al reproducir o pausar
document.querySelectorAll('.song').forEach((songElement, index) => {
  const overlayIcon = songElement.querySelector('.overlay i');
  const statusIcon = songElement.querySelector('.status-icon i');

  songElement.addEventListener('click', () => {
    const audioSrc = songElement.querySelector('.song-img').getAttribute('data-song-src');
    const title = songElement.querySelector(".song-title h2").textContent;
    const artist = songElement.querySelector(".song-title p").textContent;
    const cover = songElement.querySelector("img").src;

    if (audioPlayer.src !== audioSrc) {
      if (!audioPlayer.paused) {
        audioPlayer.pause();
      }

      audioPlayer.src = '';
      audioPlayer.load();
      audioPlayer.src = audioSrc;
      audioPlayer.load();
      audioPlayer.play().then(() => {
        updateSongInfo(audioSrc, title, artist, cover);

        const controlIcon = document.getElementById('controlIcon');
        controlIcon.classList.remove('fa-play');
        controlIcon.classList.add('fa-pause');
        startRotation();
        gifElement.src = originalGifSrc;

        currentSongIndex = index;

        updateCurrentSongState('playing');

        updateButtonsOnSongChange();

        const buttonId = getButtonIdFromIndex(index);
        if (buttonId) {
          updateButtonIcon(document.getElementById(buttonId), true);
          buttonStates[buttonId] = true;
        }
      }).catch((error) => {
        console.error('Error al reproducir la canción:', error);
      });

    } else {
      if (audioPlayer.paused) {
        audioPlayer.play();
        songElement.classList.remove('paused');
        songElement.classList.add('playing');
        overlayIcon.classList.remove('fa-play');
        overlayIcon.classList.add('fa-pause');
        statusIcon.classList.remove('fa-play');
        statusIcon.classList.add('fa-pause');

        const controlIcon = document.getElementById('controlIcon');
        controlIcon.classList.remove('fa-play');
        controlIcon.classList.add('fa-pause');
        startRotation();
        gifElement.src = originalGifSrc;

        const buttonId = getButtonIdFromIndex(index);
        if (buttonId) {
          updateButtonIcon(document.getElementById(buttonId), true);
          buttonStates[buttonId] = true;
        }
      } else {
        audioPlayer.pause();
        songElement.classList.remove('playing');
        songElement.classList.add('paused');
        overlayIcon.classList.remove('fa-pause');
        overlayIcon.classList.add('fa-play');
        statusIcon.classList.remove('fa-pause');
        statusIcon.classList.add('fa-play');

        const controlIcon = document.getElementById('controlIcon');
        controlIcon.classList.add('fa-play');
        controlIcon.classList.remove('fa-pause');
        pauseRotation();
        gifElement.src = staticImageSrc;

        const buttonId = getButtonIdFromIndex(index);
        if (buttonId) {
          updateButtonIcon(document.getElementById(buttonId), false);
          buttonStates[buttonId] = false;
        }
      }
    }
  });
});
//cambiar icono de play a pause al reproducir o pausar

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

  // Actualiza el color del progreso cada vez que cambia el tiempo de la canción
  const value = (progress.value / progress.max) * 100; // Calcula el porcentaje del progreso
  progress.style.background = `linear-gradient(to right, #0e869b ${value}%, rgba(200, 187, 255, 0.6) ${value}%)`;
});

// Actualiza el tiempo y color cuando el usuario interactúa con la barra de progreso
progress.addEventListener("input", function () {
  audioPlayer.currentTime = progress.value;

  const value = (progress.value / progress.max) * 100; // Calcula el porcentaje del progreso
  progress.style.background = `linear-gradient(to right, #0e869b ${value}%, rgba(200, 187, 255, 0.6) ${value}%)`;
});

audioPlayer.addEventListener("ended", function () {
  forwardSong();
});

// Cuando se cargan los metadatos del audio, establece la duración máxima
audioPlayer.addEventListener("loadedmetadata", function () {
  progress.max = audioPlayer.duration;
  durationDisplay.textContent = formatTime(audioPlayer.duration);
});

//ECUALIZADOR
// Variables para controlar el GIF
const gifElement = document.getElementById("music-gif");
const originalGifSrc = "https://github.com/CristianOlivera1/Reproductor-de-musica/raw/main/resources/img/ecualizador.gif";
const staticImageSrc = "https://github.com/CristianOlivera1/Reproductor-de-musica/raw/main/resources/img/ecualizadorIMG.png";

// Función para reproducir/pausar el audio
function playPause() {
  const controlIcon = document.getElementById('controlIcon');

  if (audioPlayer.paused) {
    // Reproducir audio
    audioPlayer.play();
    controlIcon.classList.add("fa-pause");
    controlIcon.classList.remove("fa-play");
    startRotation();
    gifElement.src = originalGifSrc; // Mostrar GIF al reproducir

    // Actualizar el estado de la canción actual en la lista
    updateCurrentSongState('playing');
    const buttonId = getButtonIdFromIndex(currentSongIndex);
    if (buttonId) {
      updateButtonIcon(document.getElementById(buttonId), true);
      buttonStates[buttonId] = true;
    }

  } else {
    // Pausar audio
    audioPlayer.pause();
    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");
    pauseRotation();
    gifElement.src = staticImageSrc; // Cambiar a imagen estática al pausar
    // Actualizar el estado de la canción actual en la lista
    updateCurrentSongState('paused');
    //sincronizar los iconos de reproduccion populay y los controles
    const buttonId = getButtonIdFromIndex(currentSongIndex);
    if (buttonId) {
      updateButtonIcon(document.getElementById(buttonId), false);
      buttonStates[buttonId] = false;
    }
  }
}
// Eventos de botones de control
playPauseButton.addEventListener("click", playPause);
forwardButton.addEventListener("click", forwardSong);
backwardButton.addEventListener("click", backwardSong);
function forwardSong() {
  // Cambiar a imagen estática al adelantar
  gifElement.src = staticImageSrc;

  // Cambiar la canción inmediatamente
  currentSongIndex = (currentSongIndex + 1) % document.querySelectorAll('.song-img').length;
  document.querySelectorAll('.song-img')[currentSongIndex].click();

  // Restaurar GIF después de 2 segundos
  setTimeout(() => {
    gifElement.src = originalGifSrc; // Restaurar GIF
  }, 500);
}

function backwardSong() {
  // Cambiar a imagen estática al retroceder
  gifElement.src = staticImageSrc;

  // Cambiar la canción inmediatamente
  currentSongIndex = (currentSongIndex - 1 + document.querySelectorAll('.song-img').length) % document.querySelectorAll('.song-img').length;
  document.querySelectorAll('.song-img')[currentSongIndex].click();

  // Restaurar GIF después de 1 segundos
  setTimeout(() => {
    gifElement.src = originalGifSrc; // Restaurar GIF
  }, 500);
}

// Iniciar con una cancion aleatoria
window.addEventListener('load', function () {
  // Verifica si la acción ya se ha realizado
  if (!localStorage.getItem('randomSongPlayed')) {
    const randomIndex = Math.floor(Math.random() * 61);
    const songImgs = document.querySelectorAll('.song-img');
    
    if (songImgs[randomIndex]) {
      songImgs[randomIndex].click();
    }
    
    // Marca la acción como realizada en el almacenamiento local
    localStorage.setItem('randomSongPlayed', 'true');
  }
});
// Iniciar con una cancion aleatoria

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
document.addEventListener('DOMContentLoaded', function () {
  const navItems = document.querySelectorAll('.nav-item');
  const body = document.body;

  navItems.forEach(item => {
    item.addEventListener('click', function () {
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
// Seleccionar los botones usando sus IDs
const myButton = document.getElementById('uno');
const myButton2 = document.getElementById('dos');
const myButton3 = document.getElementById('tres');
const myButton4 = document.getElementById('cuatro');
const myButton5 = document.getElementById('cinco');

// Objeto para almacenar el estado de los botones
const buttonStates = {
  uno: false,
  dos: false,
  tres: false,
  cuatro: false,
  cinco: false
};

// Función para actualizar el ícono del botón
function updateButtonIcon(button, isPlaying) {
  const icon = button.querySelector('i');
  if (isPlaying) {
    icon.classList.remove('fa-circle-play');
    icon.classList.add('fa-circle-pause');
  } else {
    icon.classList.remove('fa-circle-pause');
    icon.classList.add('fa-circle-play');
  }
}

// Función para manejar el clic en un botón
function handleClick(buttonId) {
  const button = document.getElementById(buttonId);
  const songIndex = parseInt(buttonId.replace('uno', '1').replace('dos', '5').replace('tres', '8').replace('cuatro', '10').replace('cinco', '12')); // Calcula el índice de la canción
  const isPlaying = buttonStates[buttonId];

  if (isPlaying) {
    audioPlayer.pause();
    updateButtonIcon(button, false);
    buttonStates[buttonId] = false; // Actualiza el estado
    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");
    pauseRotation();
    gifElement.src = staticImageSrc; // Cambiar a imagen estática al pausar
    // Actualizar el estado de la canción actual en la lista
    updateCurrentSongState('paused');
  } else {
    // Reproducir la canción y actualizar el ícono
    document.querySelectorAll('.song-img')[songIndex].click(); // Simula el clic en la imagen de la canción para reproducir
    updateButtonIcon(button, true);
    buttonStates[buttonId] = true; // Actualiza el estado
  }
}

// Agregar event listeners a los botones de la lista
myButton.addEventListener('click', () => handleClick('uno'));
myButton2.addEventListener('click', () => handleClick('dos'));
myButton3.addEventListener('click', () => handleClick('tres'));
myButton4.addEventListener('click', () => handleClick('cuatro'));
myButton5.addEventListener('click', () => handleClick('cinco'));

// Función para actualizar el estado de todos los botones a "detenido"
function updateButtonsOnSongChange() {
  // Primero, desactiva todos los botones
  for (let buttonId in buttonStates) {
    if (buttonStates[buttonId]) {
      const button = document.getElementById(buttonId);
      updateButtonIcon(button, false);
      buttonStates[buttonId] = false; // Actualiza el estado
    }
  }
}

// Función para obtener el ID del botón a partir del índice de la canción
function getButtonIdFromIndex(index) {
  switch (index) {
    case 1: return 'uno';
    case 5: return 'dos';
    case 8: return 'tres';
    case 10: return 'cuatro';
    case 12: return 'cinco';
    default: return null;
  }
}

// Event listener para manejar cuando la canción termina
audioPlayer.addEventListener('ended', () => {
  // Actualizar el estado de todos los botones a detenido
  updateButtonsOnSongChange();

  // Actualizar el estado de la canción actual en la lista
  updateCurrentSongState('paused');
});

//Autocomplete
// Array of songs with their songIndex and title
const songs = [
  { title: "Shaka Laka - 6ix9ine - 2:56", songIndex: 0 },
  { title: "Cicatrices - Airbag - 3:48", songIndex: 1 },
  { title: "BZRP Music Sessions 29 - C.R.O - 2:29", songIndex: 2 },
  { title: "Canser cxp - Canserbero - 1:09", songIndex: 3 },
  { title: "Maquiavélico - Canserbero - 4:55", songIndex: 4 },
  { title: "Querer Querernos - Canserbero - 3:58", songIndex: 5 },
  { title: "Cuando vayas conmigo - Canserbero - 3:28", songIndex: 6 },
  { title: "Let The Dream Come True - DJ Bobo - 4:01", songIndex: 7 },
  { title: "Not Afraid - Eminem - 5:23", songIndex: 8 },
  { title: "Tu Carcel (En Vivo) - Enanitos Verdes - 4:05", songIndex: 9 },
  { title: "Entre nosotros - Tiago PZK - 3:28", songIndex: 10 },
  { title: "Otra como tú - Eros Ramazzotti - 4:42", songIndex: 11 },
  { title: "In The End - Linkin Park - 3:38", songIndex: 12 },
  { title: "Empire State Of Mind - JAY-Z ft. Alicia Keys - 4:41", songIndex: 13 },
  { title: "Love Me Again - John Newman - 3:55", songIndex: 14 },
  { title: "BZRP Music Sessions 34 - KHEA - 3:21", songIndex: 15 },
  { title: "Creo Que - KHEA ft. Asan - 3:51", songIndex: 16 },
  { title: "Loca - KHEA ft. Duki & Cazzu - 3:42", songIndex: 17 },
  { title: "Lamento Boliviano - Enanitos Verdes - 3:42", songIndex: 18 },
  { title: "Mujer Amante - Rata Blanca - 5:51", songIndex: 19 },
  { title: "Laura no está - Nek - 3:58", songIndex: 20 },
  { title: "Numb - Linkin Park - 3:07", songIndex: 21 },
  { title: "The World is Yours to Take - Paulo Londra - 2:46", songIndex: 22 },
  { title: "Nena Maldición - Paulo Londra ft. Lenny Tavarez - 4:32", songIndex: 23 },
  { title: "Por Mil Noches - Airbag - 4:55", songIndex: 24 },
  { title: "Aún estás en mis sueños - Rata Blanca - 5:00", songIndex: 25 },
  { title: "Where Is The Love - The Black Eyed Peas - 4:10", songIndex: 26 },
  { title: "This is for you 💔 rip dad - YUNG CITY - 0:28", songIndex: 27 },
  { title: "BZRP Music Sessions 52 - QUEVEDO - 3:23", songIndex: 28 },
  { title: "METALLICA - YUNG BEEF - 3:45", songIndex: 29 },
  { title: "2º instrumental Sudametrica Cypher Trap Kodigo - Canserbero - 3:51", songIndex: 30 },
  { title: "6IX9INE Gotti - 6IX9INE - 4:13", songIndex: 31 },
  { title: "Jeremías 175 (VIDEO OFICIAL) - Canserbero - 5:26", songIndex: 32 },
  { title: "Mucho gusto Letra - Canserbero - 4:12", songIndex: 33 },
  { title: "Canserbero X Apache_Ready - Canserbero - 1:30", songIndex: 34 },
  { title: "EVERYBODY - 1994 - DJ BoBo - 3:50", songIndex: 35 },
  { title: "Te Quise (letra) - El paria - 3:31", songIndex: 36 },
  { title: "Es épico (Video) - Canserbero - 6:02", songIndex: 37 },
  { title: "Presidentes - Foyone feat. Akapellah - 3:06", songIndex: 38 },
  { title: "BZRP Music Sessions 10 - FRIJO - 2:09", songIndex: 39 },
  { title: "Junto al Amanecer - J Alvarez - 4:11", songIndex: 40 },
  { title: "Ayer Me Llamó Mi Ex ft. Lenny Santos - KHEA - 2:58", songIndex: 41 },
  { title: "Mami lo Siento - KHEA - 2:58", songIndex: 42 },
  { title: "La Forma En Que Me Miras - Super Yei x Myke Towers x Sammy x Lenny Tavarez x Rafa - 5:03", songIndex: 43 },
  { title: "La Ocasión - De La Ghetto, Arcangel, Ozuna, Anuel Aa - 5:35", songIndex: 44 },
  { title: "Lambo_Monkey - C.R.O - 1:49", songIndex: 45 },
  { title: "Lo Aprendido - Norick - 3:20", songIndex: 46 },
  { title: "Meñiques - Norick - 3:21", songIndex: 47 },
  { title: "Mi madre llora - Santa Fe - 0:59", songIndex: 48 },
  { title: "Brother Louie '98 (New Version) - Modern Talking - 3:28", songIndex: 49 },
  { title: "Grandes Pasos - Movimiento Original - 3:39", songIndex: 50 },
  { title: "Quién Diría - Norick - 2:95", songIndex: 51 },
  { title: "UNITY - RapperSchool - 4:42", songIndex: 52 },
  { title: "Dando Y Perdiendo (letra) - Rapsusklei con Canserbero - 3:14", songIndex: 53 },
  { title: "De Música Ligera (Official Video) - Soda Stereo - 3:30", songIndex: 54 },
  { title: "Stupid love story (Letra) - Canserbero - 4:16", songIndex: 55 },
  { title: "Think About the Way - Ice Mc - 4:18", songIndex: 56 },
  { title: "FEEL ME - Trueno - 3:50", songIndex: 57 },
  { title: "MAMICHULA - Trueno, Nicki Nicole, Bizarrap - 3:38", songIndex: 58 },
  { title: "Dias Tristes (Con Letra) - Warrior - 3:50", songIndex: 59 },
  { title: "Warrior Dj Deportado - Warrior - 3:50", songIndex: 60 }
];

const searchInput = document.getElementById("songSearch");
const autocompleteList = document.getElementById("autocomplete-list");

searchInput.addEventListener("input", function () {
  const input = this.value.toLowerCase();
  autocompleteList.innerHTML = ""; // Clear previous suggestions

  if (input.length > 0) {
    songs.forEach(song => {
      if (song.title.toLowerCase().includes(input)) {
        const songDiv = document.createElement("div");
        songDiv.textContent = song.title;

        // Handle click on the song selection
        songDiv.addEventListener("click", function () {
          // Use the songIndex to simulate the click on the corresponding song element
          document.querySelectorAll('.song-img')[song.songIndex].click();
        });

        autocompleteList.appendChild(songDiv);
      }
    });
  }
});

// Close the autocomplete list when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.matches("#songSearch")) {
    autocompleteList.innerHTML = "";  // Clear the list when clicked outside
  }
});
//Autocomplete