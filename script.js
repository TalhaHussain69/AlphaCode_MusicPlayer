const songs = [
  {
    title: "Dil Nu",
    artist: "Ap Dhillon",
    art: "https://i.tribune.com.pk/media/images/sing11667379351-0/sing11667379351-0.jpg",
    src: "assets/songs/DilNu.mp3"
  },
  {
    title: "Kahani Suno",
    artist: "Kaifi Khalil",
    art: "https://tse4.mm.bing.net/th/id/OIP.Wy8toh7TS_iIPW1Q_033_wHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    src: "assets/songs/kahaniSuno.mp3"
  },
  {
    title: "Tera hone Lga Hon",
    artist: "Atif Aslam",
    art: "https://filmfare.wwmindia.com/content/2024/mar/atifaslam21709289369.jpg",
    src: "assets/songs/TeraHone.mp3"
  },
  {
    title: "Thodi Si Daru",
    artist: "Ap Dhillon",
    art: "https://tse4.mm.bing.net/th/id/OIP.TTthMkWvD2s7S4D7WAB9NAHaFY?r=0&w=620&h=450&rs=1&pid=ImgDetMain&o=7&rm=3",
    src: "assets/songs/ThodiSiDaaru.mp3"
  },
  {
    title: "Mad Love",
    artist: "Mabel",
    art: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Sweetener",
    artist: "Ariana Grande",
    art: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=400&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = true; 
let isMuted = false;
let lastVolume = 0.7;


const audio          = document.getElementById('audio');
const albumArt        = document.getElementById('albumArt');
const plArt           = document.getElementById('plArt');
const artWrap          = document.getElementById('artWrap');
const trackTitle       = document.getElementById('trackTitle');
const trackArtist      = document.getElementById('trackArtist');
const currentTimeEl    = document.getElementById('currentTime');
const durationTimeEl   = document.getElementById('durationTime');
const progressTrack    = document.getElementById('progressTrack');
const progressFill     = document.getElementById('progressFill');
const progressThumb    = document.getElementById('progressThumb');
const volumeTrack      = document.getElementById('volumeTrack');
const volumeFill       = document.getElementById('volumeFill');
const volumeThumb      = document.getElementById('volumeThumb');
const playBtn          = document.getElementById('playBtn');
const playIcon         = document.getElementById('playIcon');
const prevBtn          = document.getElementById('prevBtn');
const nextBtn          = document.getElementById('nextBtn');
const muteBtn          = document.getElementById('muteBtn');
const volIcon          = document.getElementById('volIcon');
const shuffleBtn        = document.getElementById('shuffleBtn');
const repeatBtn        = document.getElementById('repeatBtn');
const likeBtn          = document.getElementById('likeBtn');
const likeIcon         = document.getElementById('likeIcon');
const playlistEl       = document.getElementById('playlist');

const ICON_PLAY  = '<path d="M8 5v14l11-7z"/>';
const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

function renderPlaylist(){
  playlistEl.innerHTML = '';
  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.className = 'song-item' + (i === currentIndex ? ' active' : '');
    li.dataset.index = i;
    li.innerHTML = `
      <div class="song-info">
        <h5>${song.title}</h5>
        <p>${song.artist}</p>
      </div>
      <button class="btn-circle mini-play" aria-label="Play ${song.title}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          ${i === currentIndex && isPlaying ? ICON_PAUSE : ICON_PLAY}
        </svg>
      </button>
    `;
    li.addEventListener('click', () => {
      if (i === currentIndex){
        togglePlay();
      } else {
        loadTrack(i, true);
      }
    });
    playlistEl.appendChild(li);
  });
}


function loadTrack(index, autoplay){
  currentIndex = (index + songs.length) % songs.length;
  const song = songs[currentIndex];
  audio.src = song.src;
  albumArt.src = song.art;
  plArt.src = song.art;
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;
  currentTimeEl.textContent = '0:00';
  durationTimeEl.textContent = '0:00';
  progressFill.style.width = '0%';
  progressThumb.style.left = '0%';
  renderPlaylist();

  if (autoplay){
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack(){
  audio.play().catch(()=>{});
  isPlaying = true;
  playIcon.innerHTML = ICON_PAUSE;
  artWrap.classList.add('spin');
  renderPlaylist();
}

function pauseTrack(){
  audio.pause();
  isPlaying = false;
  playIcon.innerHTML = ICON_PLAY;
  artWrap.classList.remove('spin');
  renderPlaylist();
}

function togglePlay(){
  isPlaying ? pauseTrack() : playTrack();
}

function nextTrack(){
  let nextIndex;
  if (isShuffle){
    do { nextIndex = Math.floor(Math.random() * songs.length); }
    while (nextIndex === currentIndex && songs.length > 1);
  } else {
    nextIndex = currentIndex + 1;
  }
  loadTrack(nextIndex, true);
}

function prevTrack(){
  if (audio.currentTime > 3){
    audio.currentTime = 0;
    return;
  }
  loadTrack(currentIndex - 1, true);
}

function formatTime(sec){
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

audio.addEventListener('loadedmetadata', () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
  if (isRepeat){
    nextTrack();
  } else {
    pauseTrack();
  }
});

function seekTo(clientX){
  const rect = progressTrack.getBoundingClientRect();
  let pct = (clientX - rect.left) / rect.width;
  pct = Math.min(Math.max(pct, 0), 1);
  if (audio.duration){
    audio.currentTime = pct * audio.duration;
  }
  progressFill.style.width = (pct * 100) + '%';
  progressThumb.style.left = (pct * 100) + '%';
}

let isDraggingProgress = false;
progressTrack.addEventListener('mousedown', e => { isDraggingProgress = true; seekTo(e.clientX); });
window.addEventListener('mousemove', e => { if (isDraggingProgress) seekTo(e.clientX); });
window.addEventListener('mouseup', () => { isDraggingProgress = false; });

function setVolume(pct){
  pct = Math.min(Math.max(pct, 0), 1);
  audio.volume = pct;
  volumeFill.style.width = (pct * 100) + '%';
  volumeThumb.style.left = (pct * 100) + '%';
  isMuted = pct === 0;
  updateVolumeIcon();
  if (pct > 0) lastVolume = pct;
}

function updateVolumeIcon(){
  volIcon.innerHTML = isMuted
    ? '<path d="M16.5 12L21 16.5M21 12l-4.5 4.5"/><path d="M3 10v4h4l5 5V5L7 10H3z" fill="currentColor" stroke="none"/>'
    : '<path d="M3 10v4h4l5 5V5L7 10H3z"/><path d="M16.5 12c0-1.6-.9-3-2.2-3.7v7.4c1.3-.7 2.2-2.1 2.2-3.7z"/>';
}

function seekVolume(clientX){
  const rect = volumeTrack.getBoundingClientRect();
  let pct = (clientX - rect.left) / rect.width;
  setVolume(pct);
}

let isDraggingVolume = false;
volumeTrack.addEventListener('mousedown', e => { isDraggingVolume = true; seekVolume(e.clientX); });
window.addEventListener('mousemove', e => { if (isDraggingVolume) seekVolume(e.clientX); });
window.addEventListener('mouseup', () => { isDraggingVolume = false; });

muteBtn.addEventListener('click', () => {
  if (isMuted){
    setVolume(lastVolume || 0.7);
  } else {
    lastVolume = audio.volume;
    setVolume(0);
  }
});

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('on', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('on', isRepeat);
});

let liked = false;
likeBtn.addEventListener('click', () => {
  liked = !liked;
  likeIcon.setAttribute('fill', liked ? 'var(--pink)' : 'none');
  likeIcon.setAttribute('stroke', liked ? 'var(--pink)' : 'currentColor');
});

/* ===== Keyboard shortcuts ===== */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space'){ e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight'){ nextTrack(); }
  if (e.code === 'ArrowLeft'){ prevTrack(); }
});

/* ===== Init ===== */
setVolume(0.7);
loadTrack(0, false);