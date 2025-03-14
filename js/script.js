const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const volumeControl = document.getElementById('volume');
const radioSelect = document.getElementById('radio-select');
const radioName = document.getElementById('radio-name');
const radioStatus = document.getElementById('radio-status');
const radioLogo = document.getElementById('radio-logo');
const themeToggle = document.getElementById('theme-toggle');

let isPlaying = false;
let hasPlayedFirstTime = false; // Pour détecter la première sélection
let radios = []; // Pour stocker les radios chargées depuis le JSON
let choicesInstance = null; // Pour stocker l'instance de Choices.js

// Charger les radios depuis le fichier JSON
fetch('radios.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des radios');
        }
        return response.json();
    })
    .then(data => {
        radios = data;
        // Remplir le sélecteur avec les options
        populateRadioSelect();
        // Initialiser Choices.js
        initChoices();
        // Charger la dernière radio écoutée depuis localStorage
        loadLastRadio();
    })
    .catch(error => {
        console.error('Erreur:', error);
        radioStatus.textContent = 'Erreur de chargement des radios';
    });

// Fonction pour initialiser Choices.js
function initChoices() {
    choicesInstance = new Choices(radioSelect, {
        searchEnabled: true,
        searchPlaceholderValue: 'Rechercher une radio...',
        itemSelectText: '',
        noResultsText: 'Aucun résultat trouvé',
        noChoicesText: 'Aucune radio disponible',
        searchResultLimit: 50,
        renderChoiceLimit: 50,
        placeholder: true,
        placeholderValue: 'Choisir une radio',
        searchFields: ['label'],
        fuseOptions: {
            // Options pour la recherche floue
            threshold: 0.3, // Plus la valeur est basse, plus la correspondance doit être précise
            ignoreLocation: true, // Ignorer l'emplacement du terme dans la chaîne
            keys: ['label']
        }
    });

    // Écouter les changements de sélection
    radioSelect.addEventListener('choice', function() {
        changeRadio();
    });
}

// Fonction pour remplir le sélecteur avec les options de radio
function populateRadioSelect() {
    // Vider le sélecteur sauf l'option par défaut
    while (radioSelect.options.length > 1) {
        radioSelect.remove(1);
    }
    
    // Ajouter les radios depuis le tableau
    radios.forEach(radio => {
        const option = document.createElement('option');
        option.value = radio.value;
        option.textContent = radio.name;
        option.setAttribute('data-name', radio.name);
        option.setAttribute('data-logo', radio.logo);
        radioSelect.appendChild(option);
    });
}

// Fonction pour charger la dernière radio écoutée
function loadLastRadio() {
    const lastRadio = localStorage.getItem('lastRadio');
    if (lastRadio) {
        for (let i = 0; i < radioSelect.options.length; i++) {
            if (radioSelect.options[i].value === lastRadio) {
                // Mettre à jour la sélection dans Choices.js
                if (choicesInstance) {
                    choicesInstance.setChoiceByValue(lastRadio);
                } else {
                    radioSelect.selectedIndex = i;
                }
                changeRadio(); // Charger la dernière radio automatiquement
                break;
            }
        }
    }
}

// Charger le thème sauvegardé depuis localStorage
let isDarkTheme = localStorage.getItem('theme') === 'dark';
if (isDarkTheme) {
    document.body.classList.remove('nord-light');
    document.body.classList.add('nord-dark');
    themeToggle.checked = true;
}

// Ajouter les écouteurs d'événements
playPauseBtn.addEventListener('click', togglePlayPause);
volumeControl.addEventListener('input', adjustVolume);
radioSelect.addEventListener('change', changeRadio);
themeToggle.addEventListener('change', toggleTheme);

// Gestion des événements de l'audio
audioPlayer.addEventListener('playing', () => {
    radioStatus.textContent = 'En cours de lecture';
    playPauseBtn.textContent = '⏸️';
    isPlaying = true;
});

audioPlayer.addEventListener('pause', () => {
    radioStatus.textContent = 'Arrêté';
    playPauseBtn.textContent = '▶️';
    isPlaying = false;
});

audioPlayer.addEventListener('waiting', () => {
    radioStatus.textContent = 'Chargement...';
});

audioPlayer.addEventListener('error', (e) => {
    console.error('Erreur de lecture audio:', e);
    radioStatus.textContent = 'Erreur';
});

// Gestion de l'erreur du logo
radioLogo.addEventListener('error', () => {
    radioLogo.src = 'radio-logo.svg'; // Fallback au SVG si l'image ne charge pas
});

function togglePlayPause() {
    if (audioPlayer.paused) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Erreur lors de la lecture:', error);
            });
        }
    } else {
        audioPlayer.pause();
    }
}

function adjustVolume() {
    audioPlayer.volume = volumeControl.value;
}

function changeRadio() {
    const selectedOption = radioSelect.options[radioSelect.selectedIndex];
    if (!selectedOption.value) {
        radioName.textContent = 'Sélectionne une radio';
        radioStatus.textContent = 'Arrêté';
        radioLogo.src = 'radio-logo.svg';
        
        // Arrêter l'audio
        audioPlayer.pause();
        audioPlayer.src = '';
        audioPlayer.load();
        
        isPlaying = false;
        playPauseBtn.textContent = '▶️';
        return;
    }

    const logoUrl = selectedOption.getAttribute('data-logo');
    const stationName = selectedOption.getAttribute('data-name');
    const streamUrl = selectedOption.value;
    
    // Mettre à jour l'interface
    radioName.textContent = stationName;
    radioLogo.src = logoUrl || 'radio-logo.svg';
    radioStatus.textContent = 'Chargement...';

    // Sauvegarder la radio sélectionnée dans localStorage
    localStorage.setItem('lastRadio', streamUrl);

    // Mémoriser l'état de lecture actuel
    const shouldAutoPlay = !hasPlayedFirstTime || isPlaying;
    
    // Vérifier si le navigateur supporte le format audio
    if (!audioPlayer.canPlayType('audio/mpeg')) {
        radioStatus.textContent = 'Format audio non supporté par votre navigateur';
        console.error('Le navigateur ne supporte pas le format audio MP3');
        return;
    }

    // Configurer le lecteur audio
    audioPlayer.pause();
    audioPlayer.src = streamUrl;
    audioPlayer.load();

    // Définir le volume
    audioPlayer.volume = volumeControl.value;

    // Lancer la lecture si nécessaire
    if (shouldAutoPlay) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (!hasPlayedFirstTime) {
                    hasPlayedFirstTime = true;
                }
            }).catch(error => {
                console.warn("Erreur de lecture:", error);
                if (error.name === 'NotSupportedError') {
                    radioStatus.textContent = 'Format audio non supporté';
                } else if (error.name === 'NotAllowedError') {
                    radioStatus.textContent = 'Lecture bloquée par le navigateur. Cliquez sur ▶️';
                } else {
                    radioStatus.textContent = 'Erreur de lecture. Vérifiez la console';
                }
                isPlaying = false;
                playPauseBtn.textContent = '▶️';
            });
        }
    }
}

function toggleTheme() {
    isDarkTheme = themeToggle.checked;
    document.body.classList.toggle('nord-dark', isDarkTheme);
    document.body.classList.toggle('nord-light', !isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}
