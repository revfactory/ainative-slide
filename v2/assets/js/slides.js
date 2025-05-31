// Common Slide Navigation System

// Global variables for slide navigation
let currentSlide = 1;
let totalSlides = 40;

// Initialize slide navigation
function initSlideNavigation(slideNumber, prevSlide = null, nextSlide = null) {
    currentSlide = slideNumber;
    
    // Set up navigation functions
    window.goHome = function() {
        window.location.href = '../index.html';
    };
    
    window.previousSlide = function() {
        if (prevSlide) {
            window.location.href = prevSlide;
        }
    };
    
    window.nextSlide = function() {
        if (nextSlide) {
            window.location.href = nextSlide;
        }
    };
    
    // Set up keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            window.previousSlide();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            window.nextSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
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