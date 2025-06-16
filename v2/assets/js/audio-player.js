// Audio Player Functionality
class AudioPlayer {
    constructor(audioId = 'slideAudio', iconId = 'audioIcon', textId = 'audioText') {
        this.audio = document.getElementById(audioId);
        this.audioIcon = document.getElementById(iconId);
        this.audioText = document.getElementById(textId);
        this.isPlaying = false;
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Reset button when audio ends
        if (this.audio) {
            this.audio.addEventListener('ended', () => {
                this.resetButton();
            });
            
            // Handle audio errors
            this.audio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                this.resetButton();
                this.audioText.textContent = '오디오 로드 실패';
            });
        }
    }
    
    toggle() {
        if (!this.audio) {
            console.error('Audio element not found');
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play()
            .then(() => {
                this.audioIcon.className = 'fas fa-pause text-lg';
                this.audioText.textContent = '일시 정지';
                this.isPlaying = true;
            })
            .catch(error => {
                console.error('Play error:', error);
                this.audioText.textContent = '재생 오류';
            });
    }
    
    pause() {
        this.audio.pause();
        this.resetButton();
    }
    
    resetButton() {
        this.audioIcon.className = 'fas fa-play text-lg';
        this.audioText.textContent = '음성 재생';
        this.isPlaying = false;
    }
    
    // Additional utility methods
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    getCurrentTime() {
        return this.audio ? this.audio.currentTime : 0;
    }
    
    getDuration() {
        return this.audio ? this.audio.duration : 0;
    }
    
    seek(time) {
        if (this.audio) {
            this.audio.currentTime = time;
        }
    }
}

// Global audio player instance
let audioPlayer = null;

// Initialize audio player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = new AudioPlayer();
});

// Global function for onclick handler
function toggleAudio() {
    if (audioPlayer) {
        audioPlayer.toggle();
    } else {
        console.error('Audio player not initialized');
    }
}