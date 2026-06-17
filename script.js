let videoFiles = [];
let index = 0;

async function loadPlaylist() {
  const res = await fetch("videos.json");
  const data = await res.json();

  videoFiles = data.videos;
  index = 0;

  renderPlaylist();
  playVideo();
}

function playVideo() {
  if (!videoFiles.length) return;

  videoPlayer.src = videoFiles[index];
  videoPlayer.play();

  updateActive();
}

function renderPlaylist() {
  playlist.innerHTML = "";

  videoFiles.forEach((src, i) => {
    const li = document.createElement("li");

    // cleaner display name
    li.textContent = decodeURIComponent(src.split("/").pop());

    li.onclick = () => {
      index = i;
      playVideo();
    };

    playlist.appendChild(li);
  });
}

function next() {
  index = (index + 1) % videoFiles.length;
  playVideo();
}

function prev() {
  index = (index - 1 + videoFiles.length) % videoFiles.length;
  playVideo();
}

function shuffle() {
  index = Math.floor(Math.random() * videoFiles.length);
  playVideo();
}

window.addEventListener("load", loadPlaylist);

videoPlayer.addEventListener("ended", next);
