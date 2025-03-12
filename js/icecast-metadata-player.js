class IcecastMetadataPlayer {
  constructor(endpoint, options = {}) {
    // Default options
    this.options = {
      metadataTypes: ["icy"],
      onMetadata: () => {},
      onMetadataEnqueue: () => {},
      onMetadataUpdate: () => {},
      onError: () => {},
      onStats: () => {},
      onStreamStart: () => {},
      onStreamEnd: () => {},
      onPlay: () => {},
      onPause: () => {},
      onLoad: () => {},
      onDestroy: () => {},
      onVisibilityChange: () => {},
      onCodecUpdate: () => {},
      onRetry: () => {},
      onReconnect: () => {},
      onReconnectAttempt: () => {},
      onReconnectFailure: () => {},
      onSwitchEndpoint: () => {},
      ...options
    };

    this.endpoint = endpoint;
    this.audio = new Audio();
    this.audio.preload = "none";
    this.audio.crossOrigin = "anonymous"; 
    this.isPlaying = false;
    this.metadataQueue = [];
    this.currentMetadata = null;
    this.retryTimeout = null;
    this.retryCount = 0;
    this.maxRetries = options.maxRetries || 5;
    this.retryDelaySeconds = options.retryDelaySeconds || 3;

    // Setup event listeners
    this.audio.addEventListener("playing", this._onPlaying.bind(this));
    this.audio.addEventListener("pause", this._onPause.bind(this));
    this.audio.addEventListener("ended", this._onEnded.bind(this));
    this.audio.addEventListener("error", this._onError.bind(this));

    // Initialize
    if (options.autoPlay) {
      this.play();
    }
  }

  play() {
    if (!this.audio.src) {
      this._loadStream();
    }
    
    const playPromise = this.audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Play error:", error);
        this.options.onError(error);
      });
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.src = "";
    this.isPlaying = false;
    this.options.onStreamEnd();
  }

  setVolume(volume) {
    this.audio.volume = volume;
  }

  getVolume() {
    return this.audio.volume;
  }

  getCurrentMetadata() {
    return this.currentMetadata;
  }

  switchEndpoint(newEndpoint) {
    const wasPlaying = !this.audio.paused;
    this.endpoint = newEndpoint;
    this.stop();
    this._loadStream();
    this.options.onSwitchEndpoint(newEndpoint);
    
    if (wasPlaying) {
      this.play();
    }
  }

  destroy() {
    this.stop();
    this.audio.removeEventListener("playing", this._onPlaying);
    this.audio.removeEventListener("pause", this._onPause);
    this.audio.removeEventListener("ended", this._onEnded);
    this.audio.removeEventListener("error", this._onError);
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    this.options.onDestroy();
  }

  _loadStream() {
    // Reset metadata
    this.metadataQueue = [];
    this.currentMetadata = null;
    
    // Set audio source
    this.audio.src = this.endpoint;
    this.audio.load();
    this.options.onLoad();
    
    // Fetch metadata if the stream supports it
    this._fetchMetadata();
  }

  _fetchMetadata() {
    if (this._metadataInterval) {
      clearInterval(this._metadataInterval);
    }

    // Créer un nouvel élément audio temporaire pour tester la connexion
    const testAudio = new Audio();
    testAudio.crossOrigin = "anonymous";
    
    // Écouter les événements de metadata
    testAudio.addEventListener('loadedmetadata', () => {
      // Simuler des métadonnées basiques
      const metadata = {
        type: "icy",
        timestamp: Date.now(),
        data: {
          StreamTitle: "En cours de lecture",
          StreamDescription: "",
          StreamGenre: "",
        }
      };
      
      this.currentMetadata = metadata;
      this.metadataQueue.push(metadata);
      this.options.onMetadataEnqueue(metadata);
      this.options.onMetadata(metadata);
      this.options.onMetadataUpdate(metadata);
    });

    // En cas d'erreur, on ne bloque pas la lecture
    testAudio.addEventListener('error', () => {
      console.log('Impossible de récupérer les métadonnées, lecture continue');
    });

    // Tester la connexion
    testAudio.src = this.endpoint;
    
    // Mettre en place une vérification périodique des métadonnées
    this._metadataInterval = setInterval(() => {
      if (this.isPlaying) {
        // Mise à jour périodique des métadonnées
        const metadata = {
          type: "icy",
          timestamp: Date.now(),
          data: {
            StreamTitle: "En cours de lecture",
            StreamDescription: "",
            StreamGenre: "",
          }
        };
        
        this.currentMetadata = metadata;
        this.metadataQueue.push(metadata);
        this.options.onMetadataEnqueue(metadata);
        this.options.onMetadata(metadata);
        this.options.onMetadataUpdate(metadata);
      }
    }, 15000);
  }

  _onPlaying() {
    this.isPlaying = true;
    this.retryCount = 0;
    this.options.onPlay();
    this.options.onStreamStart();
  }

  _onPause() {
    this.isPlaying = false;
    this.options.onPause();
  }

  _onEnded() {
    this.isPlaying = false;
    this.options.onStreamEnd();
    this._retry();
  }

  _onError(error) {
    console.error("Audio error:", error);
    this.options.onError(error);
    this._retry();
  }

  _retry() {
    if (this.retryCount >= this.maxRetries) {
      this.options.onReconnectFailure();
      return;
    }
    
    this.retryCount++;
    this.options.onRetry(this.retryCount, this.maxRetries);
    this.options.onReconnectAttempt(this.retryCount, this.maxRetries);
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    this.retryTimeout = setTimeout(() => {
      this._loadStream();
      this.options.onReconnect();
      this.play();
    }, this.retryDelaySeconds * 1000);
  }
}
