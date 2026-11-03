// Cache the player elements used by the playback and playlist controls.
const player = document.querySelector(".wrapper");
const albumArtwork = player.querySelector(".photoarea img");
const songTitle = player.querySelector(".songdetailsarea .name");
const artistName = player.querySelector(".songdetailsarea .artist");
const audioPlayer = player.querySelector("#main-audio");
const playPauseButton = player.querySelector(".playandpause");
const previousButton = player.querySelector("#previous");
const nextButton = player.querySelector("#nextone");
const progressBar = player.querySelector(".progressbar");
const progressArea = player.querySelector(".progressarea");
const playlist = player.querySelector(".musiclist");
const playlistButton = player.querySelector("#queue");
const closePlaylistButton = playlist.querySelector("#closebutton");

let currentSongIndex = 0;

// Load the initial track after the page and its resources have loaded.
window.addEventListener("load", () => {
    loadSong(currentSongIndex);
});

/**
 * Update the player display and audio source for a track.
 * @param {number} index - The track's position in the allMusic array.
 */
function loadSong(index) {
    songTitle.innerText = allMusic[index].name;
    artistName.innerText = allMusic[index].artist;
    albumArtwork.src = `Song_Images/${allMusic[index].img}.jpg`;
    audioPlayer.src = `Songs/${allMusic[index].src}.mp3`;
}

// Start playback and update the play/pause control.
function playSong() {
    player.classList.add("paused");
    playPauseButton.querySelector("i").innerText = "pause";
    audioPlayer.play();
}

// Pause playback and update the play/pause control.
function pauseSong() {
    player.classList.remove("paused");
    playPauseButton.querySelector("i").innerText = "play_arrow";
    audioPlayer.pause();
}

// Advance to the next track, wrapping to the first track at the end.
function playNextSong() {
    currentSongIndex++;

    if (currentSongIndex > allMusic.length - 1) {
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);
    playSong();
}

// Return to the previous track, wrapping to the last track at the beginning.
function playPreviousSong() {
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = allMusic.length - 1;
    }

    loadSong(currentSongIndex);
    playSong();
}

// Toggle playback when the central control is clicked.
playPauseButton.addEventListener("click", () => {
    const isPaused = player.classList.contains("paused");
    isPaused ? pauseSong() : playSong();
});

nextButton.addEventListener("click", () => {
    playNextSong();
});

previousButton.addEventListener("click", () => {
    playPreviousSong();
});

// Keep the progress bar and elapsed-time display in sync with playback.
audioPlayer.addEventListener("timeupdate", (event) => {
    const currentTime = event.target.currentTime;
    const songDuration = event.target.duration;
    const progressWidth = (currentTime / songDuration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    const currentTimeDisplay = player.querySelector(".currenttime");
    const durationDisplay = player.querySelector(".duration");

    audioPlayer.addEventListener("loadeddata", () => {
        const audioLength = audioPlayer.duration;
        const totalMinutes = Math.floor(audioLength / 60);
        let totalSeconds = Math.floor(audioLength % 60);

        if (totalSeconds < 10) {
            totalSeconds = `0${totalSeconds}`;
        }

        durationDisplay.innerText = `${totalMinutes}:${totalSeconds}`;
    });

    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);

    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }

    currentTimeDisplay.innerText = `${currentMinutes}:${currentSeconds}`;
});

// Seek to the position corresponding to the clicked point on the progress area.
progressArea.addEventListener("click", (event) => {
    const progressWidth = progressArea.clientWidth;
    const clickedPosition = event.offsetX;
    const songDuration = audioPlayer.duration;

    audioPlayer.currentTime = (clickedPosition / progressWidth) * songDuration;
    playSong();
});

// Cycle between playlist repeat, single-track repeat, and shuffle modes.
const repeatButton = player.querySelector("#repeatlist");
repeatButton.addEventListener("click", () => {
    const repeatMode = repeatButton.innerText;

    switch (repeatMode) {
        case "repeat":
            repeatButton.innerText = "repeat_one";
            repeatButton.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatButton.innerText = "shuffle";
            repeatButton.setAttribute("title", "Playlist shuffle");
            break;
        case "shuffle":
            repeatButton.innerText = "repeat";
            repeatButton.setAttribute("title", "Playlist looped");
            break;
    }
});

// Choose the next action when the current track finishes.
audioPlayer.addEventListener("ended", () => {
    const repeatMode = repeatButton.innerText;

    switch (repeatMode) {
        case "repeat":
            playNextSong();
            break;
        case "repeat_one":
            audioPlayer.currentTime = 0;
            loadSong(currentSongIndex);
            playSong();
            break;
        case "shuffle":
            let randomSongIndex = Math.floor(Math.random() * allMusic.length);

            do {
                randomSongIndex = Math.floor(Math.random() * allMusic.length);
            } while (currentSongIndex == randomSongIndex);

            currentSongIndex = randomSongIndex;
            loadSong(currentSongIndex);
            playSong();
            break;
    }
});

// Show or hide the playlist panel.
playlistButton.addEventListener("click", () => {
    playlist.classList.toggle("show");
});

closePlaylistButton.addEventListener("click", () => {
    playlistButton.click();
});

// Build playlist entries from the song data and display each track's duration.
const playlistItems = player.querySelector("ul");

for (let index = 0; index < allMusic.length - 1; index++) {
    const song = allMusic[index];
    const playlistItem = `<li>
                    <div class="row">
                        <span>${song.name}</span>
                        <p>${song.artist}</p>
                    </div>
                    <audio class="${song.src}" src="Songs/${song.src}.mp3"></audio>
                    <span id="${song.src}" class="audiodur">4:16</span>
                </li>`;

    playlistItems.insertAdjacentHTML("beforeend", playlistItem);

    const currentPlaylistItem = playlistItems.lastElementChild;
    const playlistDuration = currentPlaylistItem.querySelector(".audiodur");
    const playlistAudio = currentPlaylistItem.querySelector("audio");

    playlistAudio.addEventListener("loadeddata", () => {
        const audioLength = playlistAudio.duration;
        const totalMinutes = Math.floor(audioLength / 60);
        let totalSeconds = Math.floor(audioLength % 60);

        if (totalSeconds < 10) {
            totalSeconds = `0${totalSeconds}`;
        }

        playlistDuration.innerText = `${totalMinutes}:${totalSeconds}`;
    });
}
