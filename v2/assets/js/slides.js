// Common Slide Navigation System

// Global variables for slide navigation
let currentSlide = 1;
let totalSlides = 40;

// Function to stop audio before navigation
function stopAudioBeforeNavigation() {
    // Stop audio if audioPlayer exists (from audio-player.js)
    if (typeof audioPlayer !== 'undefined' && audioPlayer && audioPlayer.audio) {
        audioPlayer.pause();
    }
    // Also try to stop directly if audio element exists
    const audio = document.getElementById('slideAudio');
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// Function to check if audio is playing
function isAudioPlaying() {
    // Check audioPlayer first
    if (typeof audioPlayer !== 'undefined' && audioPlayer) {
        return audioPlayer.isPlaying;
    }
    // Fallback to direct audio element check
    const audio = document.getElementById('slideAudio');
    return audio && !audio.paused;
}

// Function to handle navigation with audio check
function handleNavigation(targetUrl) {
    const audio = document.getElementById('slideAudio');
    
    // If audio is already playing, navigate immediately
    if (isAudioPlaying()) {
        stopAudioBeforeNavigation();
        window.location.href = targetUrl;
        return;
    }
    
    // If audio exists but not playing, start it only (don't navigate)
    if (audio) {
        // Try to play audio
        audio.play().then(() => {
            // Update UI if audioPlayer exists
            if (typeof audioPlayer !== 'undefined' && audioPlayer) {
                audioPlayer.audioIcon.className = 'fas fa-pause text-lg';
                audioPlayer.audioText.textContent = '일시 정지';
                audioPlayer.isPlaying = true;
            }
        }).catch(error => {
            console.error('Audio play error:', error);
            // If audio fails to play, navigate anyway
            window.location.href = targetUrl;
        });
    } else {
        // No audio element, navigate immediately
        window.location.href = targetUrl;
    }
}

// Initialize slide navigation
function initSlideNavigation(slideNumber, prevSlide = null, nextSlide = null) {
    currentSlide = slideNumber;
    
    // Set up navigation functions
    window.goHome = function() {
        // Stop audio before navigating
        stopAudioBeforeNavigation();
        window.location.href = '../index.html';
    };
    
    window.previousSlide = function() {
        if (prevSlide) {
            handleNavigation(prevSlide);
        }
    };
    
    window.nextSlide = function() {
        if (nextSlide) {
            handleNavigation(nextSlide);
        }
    };
    
    // Set up keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Backspace') {
            e.preventDefault();
            window.previousSlide();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
            e.preventDefault();
            window.nextSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
            window.goHome();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            window.goHome();
        }
    });
    
    // Set up presentation clicker support
    document.addEventListener('click', function(e) {
        // Check if it's a button click (clicker usually sends Enter or Space)
        // Most presentation clickers send PageDown/PageUp or Arrow keys
        // This handles clickers that send mouse clicks
        if (e.target.tagName !== 'BUTTON' && 
            e.target.tagName !== 'A' && 
            e.target.tagName !== 'INPUT' &&
            e.target.tagName !== 'TEXTAREA' &&
            !e.target.closest('.nav-container') &&
            !e.target.closest('button')) {
            // Click on empty area advances to next slide
            window.nextSlide();
        }
    });
    
    // Handle mouse button navigation (for clickers that use mouse buttons)
    document.addEventListener('mouseup', function(e) {
        // Some clickers emulate browser back/forward buttons
        // Button 3 and 4 are for extended mouse buttons
        if (e.button === 3) {
            e.preventDefault();
            window.previousSlide();
        } else if (e.button === 4) {
            e.preventDefault();
            window.nextSlide();
        }
    });
    
    // Handle browser navigation buttons
    document.addEventListener('auxclick', function(e) {
        // Middle click and other auxiliary buttons
        if (e.button === 1) {
            e.preventDefault();
            // Middle click could go to home
            window.goHome();
        }
    });
    
    // Set up touch/swipe navigation for mobile
    setupTouchNavigation();
}

// Touch/swipe navigation setup
function setupTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                window.nextSlide();
            } else {
                // Swipe right - previous slide
                window.previousSlide();
            }
        }
    }
}

// Utility function to get previous slide number
function getPreviousSlide(currentSlideNumber) {
    if (currentSlideNumber <= 1) return null;
    return String(currentSlideNumber - 1).padStart(2, '0');
}

// Utility function to get next slide number
function getNextSlide(currentSlideNumber) {
    if (currentSlideNumber >= totalSlides) return null;
    return String(currentSlideNumber + 1).padStart(2, '0');
}

// Auto-initialize common slide features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add common slide enhancements
    setupSlideEnhancements();
});

// Common slide enhancements
function setupSlideEnhancements() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation fade-in effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add focus outline for accessibility
    const style = document.createElement('style');
    style.textContent = `
        .nav-btn:focus {
            outline: 2px solid #FEE500;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}