// script.js

let currentSongIndex = 0; // Track the currently playing song
let currentPlaylist = []; // Track songs added to the current playlist
const audioElement = document.getElementById('audio');
const audioSource = document.getElementById('audio-source');
const songListElement = document.getElementById('song-list');
const playlistListElement = document.getElementById('playlist-list');
const genreFilter = document.getElementById('genre-filter');
const searchSongs = document.getElementById('search-songs');
const searchPlaylists = document.getElementById('search-playlists');
const newPlaylistName = document.getElementById('new-playlist-name');

function showSongs(genre = 'all') {
    songListElement.innerHTML = '';
    const filteredSongs = songs.filter(song => genre === 'all' || song.genre === genre);
    
    filteredSongs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerText = `${song.name} - ${song.artist}`;
        songItem.onclick = () => playSong(song.id);
        songListElement.appendChild(songItem);
    });
}

function playSong(id) {
    currentSongIndex = songs.findIndex(song => song.id === id);
    renderCurrentSong();
    audioElement.play();
}

function renderCurrentSong() {
    const currentSong = songs[currentSongIndex];
    audioSource.src = currentSong.source;
    audioElement.load(); // Load the new audio source
    updateSongCard(currentSong);
}

function updateSongCard(song) {
    const songCard = document.querySelector('.controls');
    songCard.querySelector('h4')?.remove(); // Remove existing song info
    const songInfo = document.createElement('h4');
    songInfo.innerText = `${song.name} by ${song.artist}`;
    songCard.prepend(songInfo); // Display current song info in the control section
}

function toggleTheme() {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
}

function addToPlaylist() {
    const currentSong = songs[currentSongIndex];
    if (!currentPlaylist.includes(currentSong)) {
        currentPlaylist.push(currentSong);
        renderPlaylists();
    }
}

function renderPlaylists() {
    playlistListElement.innerHTML = '';
    const playlistName = newPlaylistName.value.trim();
    if (playlistName) {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerText = playlistName;
        playlistItem.onclick = () => renderPlaylistSongs(playlistName);
        playlistListElement.appendChild(playlistItem);
        newPlaylistName.value = ''; // Clear input after creating
    }
}

function renderPlaylistSongs(playlistName) {
    const playlistSongs = currentPlaylist; // For simplicity, show currentPlaylist as the selected one
    songListElement.innerHTML = '';
    playlistSongs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerText = `${song.name} - ${song.artist}`;

        // Create a remove button for each song
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.onclick = () => removeFromPlaylist(index); // Call remove function
        songItem.appendChild(removeButton);

        songItem.onclick = () => playSong(song.id); // Play song on click
        songListElement.appendChild(songItem);
    });
}

function removeFromPlaylist(index) {
    currentPlaylist.splice(index, 1); // Remove song at the specified index
    renderPlaylistSongs(); // Re-render the playlist after removing
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    renderCurrentSong();
    audioElement.play();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    renderCurrentSong();
    audioElement.play();
}

// Event Listeners
document.getElementById('toggle-theme').onclick = toggleTheme;
document.getElementById('add-to-playlist').onclick = addToPlaylist;
document.getElementById('create-playlist').onclick = renderPlaylists;
document.getElementById('next').onclick = nextSong;
document.getElementById('prev').onclick = prevSong;

genreFilter.onchange = () => showSongs(genreFilter.value);
searchSongs.oninput = () => filterSongs(searchSongs.value);
searchPlaylists.oninput = () => filterPlaylists(searchPlaylists.value);

// Function to filter songs based on search input
function filterSongs(query) {
    const filteredSongs = songs.filter(song => song.name.toLowerCase().includes(query.toLowerCase()));
    showFilteredSongs(filteredSongs);
}

function showFilteredSongs(filteredSongs) {
    songListElement.innerHTML = '';
    filteredSongs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerText = `${song.name} - ${song.artist}`;
        songItem.onclick = () => playSong(song.id);
        songListElement.appendChild(songItem);
    });
}

// Function to filter playlists based on search input
function filterPlaylists(query) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        if (item.innerText.toLowerCase().includes(query.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initial song display
showSongs();
