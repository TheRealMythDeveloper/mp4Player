const videoPlayer = document.getElementById("videoPlayer");
const playlist = document.getElementById("playlist");
const pickFolderBtn = document.getElementById("pickFolder");

let videoFiles = [];
let index = 0;

// Load and play video
async function playVideo() {
  if (videoFiles.length === 0) return;

  const file = await videoFiles[index].getFile();
  const url = URL.createObjectURL(file);

  videoPlayer.src = url;
  videoPlayer.play();

  updateActive();
}

// Next video
function next() {
  if (videoFiles.length === 0) return;
  index = (index + 1) % videoFiles.length;
  playVideo();
}

// Previous video
function prev() {
  if (videoFiles.length === 0) return;
  index = (index - 1 + videoFiles.length) % videoFiles.length;
  playVideo();
}

// Shuffle video
function shuffle() {
  if (videoFiles.length === 0) return;
  index = Math.floor(Math.random() * videoFiles.length);
  playVideo();
}

// Highlight active video in playlist
function updateActive() {
  const items = playlist.querySelectorAll("li");
  items.forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

// Pick folder
pickFolderBtn.addEventListener("click", async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    videoFiles = [];
    playlist.innerHTML = "";
    index = 0;

    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && entry.name.endsWith(".mp4")) {
        videoFiles.push(entry);
      }
    }

    videoFiles.forEach((fileHandle, i) => {
      const li = document.createElement("li");
      li.textContent = fileHandle.name;
      li.onclick = () => {
        index = i;
        playVideo();
      };
      playlist.appendChild(li);
    });

   
  } catch (err) {
    console.log("Folder selection cancelled or failed.", err);
  }
  videoPlayer.addEventListener("ended", next);
});