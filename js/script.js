const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const volumeControl = document.getElementById('volume');
const radioSelect = document.getElementById('radio-select');
const radioName = document.getElementById('radio-name');
const radioStatus = document.getElementById('radio-status');
const radioLogo = document.getElementById('radio-logo');
const currentTrack = document.getElementById('current-track');
const themeToggle = document.getElementById('theme-toggle');

let isPlaying = false;
let hasPlayedFirstTime = false; // Pour détecter la première sélection
let icecastPlayer = null; // Instance du lecteur Icecast

// Charger le thème sauvegardé depuis localStorage
let isDarkTheme = localStorage.getItem('theme') === 'dark';
if (isDarkTheme) {
    document.body.classList.remove('nord-light');
    document.body.classList.add('nord-dark');
    themeToggle.checked = true;
}

// Initialisation au démarrage : pas de "Chargement..."
currentTrack.textContent = 'Aucune radio sélectionnée';

// Charger la dernière radio écoutée depuis localStorage
const lastRadio = localStorage.getItem('lastRadio');
if (lastRadio) {
    for (let i = 0; i < radioSelect.options.length; i++) {
        if (radioSelect.options[i].value === lastRadio) {
            radioSelect.selectedIndex = i;
            changeRadio(); // Charger la dernière radio automatiquement
            break;
        }
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);
volumeControl.addEventListener('input', adjustVolume);
radioSelect.addEventListener('change', changeRadio);
themeToggle.addEventListener('change', toggleTheme);

// Gestion de l'erreur du logo
radioLogo.addEventListener('error', () => {
    radioLogo.src = 'radio-logo.svg'; // Fallback au SVG si l'image ne charge pas
});

function togglePlayPause() {
    if (!icecastPlayer) return;

    if (isPlaying) {
        icecastPlayer.pause();
        playPauseBtn.textContent = '▶️';
        radioStatus.textContent = 'Arrêté';
    } else {
        icecastPlayer.play();
        playPauseBtn.textContent = '⏸️';
        radioStatus.textContent = 'En cours de lecture';
    }
    isPlaying = !isPlaying;
}

function adjustVolume() {
    if (icecastPlayer) {
        icecastPlayer.setVolume(volumeControl.value);
    }
}

function changeRadio() {
    const selectedOption = radioSelect.options[radioSelect.selectedIndex];
    if (!selectedOption.value) {
        radioName.textContent = 'Sélectionne une radio';
        radioStatus.textContent = 'Arrêté';
        radioLogo.src = 'radio-logo.svg';
        currentTrack.textContent = 'Aucune radio sélectionnée';
        
        // Arrêter le lecteur existant s'il y en a un
        if (icecastPlayer) {
            icecastPlayer.destroy();
            icecastPlayer = null;
        }
        
        isPlaying = false;
        playPauseBtn.textContent = '▶️';
        return;
    }

    const logoUrl = selectedOption.getAttribute('data-logo');
    const stationName = selectedOption.getAttribute('data-name');
    const streamUrl = selectedOption.value;
    
    radioName.textContent = stationName;
    radioLogo.src = logoUrl || 'radio-logo.svg'; // Utilise l'URL ou fallback
    currentTrack.textContent = 'Chargement des métadonnées...';
    radioStatus.textContent = 'Chargement...';

    // Sauvegarder la radio sélectionnée dans localStorage
    localStorage.setItem('lastRadio', streamUrl);

    // Détruire l'ancien lecteur s'il existe
    if (icecastPlayer) {
        icecastPlayer.destroy();
    }

    // Créer une nouvelle instance du lecteur Icecast avec des callbacks pour les métadonnées
    icecastPlayer = new IcecastMetadataPlayer(streamUrl, {
        metadataTypes: ["icy", "ogg"], // Prendre en charge les deux types de métadonnées
        onMetadata: handleMetadata,
        onError: handlePlayerError,
        onStreamStart: () => {
            radioStatus.textContent = 'En cours de lecture';
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
        },
        onStreamEnd: () => {
            radioStatus.textContent = 'Arrêté';
            playPauseBtn.textContent = '▶️';
            isPlaying = false;
        },
        onPlay: () => {
            radioStatus.textContent = 'En cours de lecture';
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
        },
        onPause: () => {
            radioStatus.textContent = 'Arrêté';
            playPauseBtn.textContent = '▶️';
            isPlaying = false;
        },
        onReconnectAttempt: (attempt, max) => {
            radioStatus.textContent = `Reconnexion (${attempt}/${max})...`;
        },
        onReconnectFailure: () => {
            radioStatus.textContent = 'Échec de reconnexion';
            currentTrack.textContent = 'Erreur de connexion';
        }
    });

    // Définir le volume initial
    icecastPlayer.setVolume(volumeControl.value);

    // Lancer la lecture automatiquement lors de la première sélection
    if (!hasPlayedFirstTime) {
        icecastPlayer.play();
        hasPlayedFirstTime = true;
    } else if (isPlaying) {
        icecastPlayer.play();
    }
}

function handleMetadata(metadata) {
    console.log('Métadonnées reçues:', metadata);
    
    if (metadata && metadata.data) {
        // Pour l'instant, on affiche simplement que la radio est en cours de lecture
        // car les métadonnées ne sont pas disponibles à cause des restrictions CORS
        currentTrack.textContent = 'Radio en cours de lecture';
    } else {
        currentTrack.textContent = 'Radio en cours de lecture';
    }
}

function handlePlayerError(error) {
    console.error('Erreur du lecteur:', error);
    radioStatus.textContent = 'Erreur de lecture';
    currentTrack.textContent = 'Erreur de métadonnées';
}

function toggleTheme() {
    isDarkTheme = themeToggle.checked;
    document.body.classList.toggle('nord-dark', isDarkTheme);
    document.body.classList.toggle('nord-light', !isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}
