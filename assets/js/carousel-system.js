/**
 * Professional Carousel System
 * Smooth, responsive carousel with touch support and professional design
 */

class CarouselSystem {
    constructor() {
        this.carousels = new Map();
        this.currentIndexes = new Map();
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initialized = false;
        
        console.log('🎠 Carousel System initialized');
    }
    
    /**
     * Create a carousel for a specific section
     */
    createCarousel(containerId, items, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return null;
        }
        
        const defaultOptions = {
            autoplay: false,
            autoplaySpeed: 5000,
            showDots: true,
            showArrows: true,
            infinite: true,
            responsive: true,
            touchSwipe: true,
            animationSpeed: 300
        };
        
        const config = { ...defaultOptions, ...options };
        
        // Clear container
        container.innerHTML = '';
        container.className = 'carousel-container relative overflow-hidden rounded-2xl';
        
        // Create carousel wrapper
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'carousel-wrapper flex transition-transform duration-300 ease-out';
        carouselWrapper.style.transform = 'translateX(0)';
        
        // Create carousel items
        items.forEach((item, index) => {
            const carouselItem = this.createCarouselItem(item, index);
            carouselWrapper.appendChild(carouselItem);
        });
        
        container.appendChild(carouselWrapper);
        
        // Create navigation arrows
        if (config.showArrows) {
            this.createNavigationArrows(container, containerId);
        }
        
        // Create dots navigation
        if (config.showDots) {
            this.createDotsNavigation(container, containerId, items.length);
        }
        
        // Add touch/swipe support
        if (config.touchSwipe) {
            this.addTouchSupport(carouselWrapper, containerId);
        }
        
        // Initialize carousel state
        this.carousels.set(containerId, {
            container,
            wrapper: carouselWrapper,
            items: items,
            config: config,
            currentIndex: 0,
            totalItems: items.length
        });
        
        this.currentIndexes.set(containerId, 0);
        
        // Start autoplay if enabled
        if (config.autoplay) {
            this.startAutoplay(containerId);
        }
        
        console.log(`✅ Carousel created for ${containerId} with ${items.length} items`);
        return containerId;
    }
    
    /**
     * Create individual carousel item
     */
    createCarouselItem(item, index) {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item flex-shrink-0 w-full h-full';
        carouselItem.style.minWidth = '100%';
        
        if (item.type === 'hero') {
            carouselItem.innerHTML = `
                <div class="hero-carousel-card relative h-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-emerald-600/20 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 cursor-pointer group overflow-hidden">
                    <!-- Enhanced Animated Background -->
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-emerald-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <!-- Enhanced Floating Particles -->
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="floating-particle particle-1"></div>
                        <div class="floating-particle particle-2"></div>
                        <div class="floating-particle particle-3"></div>
                        <div class="floating-particle particle-4"></div>
                        <div class="floating-particle particle-5"></div>
                    </div>
                    
                    <!-- Interactive Hover Glow -->
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    
                    <div class="relative z-10 h-full flex flex-col justify-center text-center">
                        <!-- Enhanced Hero Icon with Advanced Glow -->
                        <div class="text-center mb-6">
                            <div class="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-2xl relative overflow-hidden">
                                <span class="text-4xl relative z-10">${item.icon}</span>
                                <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-emerald-400 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                                <div class="absolute inset-0 bg-gradient-to-br from-purple-300/30 to-emerald-300/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                        </div>
                        
                        <!-- Enhanced Hero Title with Advanced Gradient -->
                        <h3 class="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-white via-purple-200 to-emerald-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-emerald-300 transition-all duration-500">
                            ${item.title}
                        </h3>
                        
                        <!-- Enhanced Hero Description -->
                        <p class="text-white/90 text-center text-lg mb-6 leading-relaxed group-hover:text-white transition-colors duration-500">
                            ${item.description}
                        </p>
                        
                        <!-- Enhanced Hero Highlight with Advanced Design -->
                        <div class="mb-6">
                            <span class="inline-block bg-gradient-to-r from-purple-500/40 to-emerald-500/40 text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-sm group-hover:from-purple-500/60 group-hover:to-emerald-500/60 group-hover:border-white/50 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                                ${item.highlight}
                            </span>
                        </div>
                        
                        <!-- Interactive Click Indicator -->
                        <div class="text-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                            <div class="inline-flex items-center space-x-2 text-white/80 group-hover:text-white">
                                <i data-lucide="mouse-pointer" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"></i>
                                <span class="text-sm font-medium">Click to Start</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Make entire carousel item clickable - no more button needed
            carouselItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎯 Hero carousel item clicked:', item.title);
                
                // Handle TOEIC application clicks
                switch(item.key) {
                    case 'toeicVocabulary':
                        if (window.app && window.app.showFlashcardModule) {
                            window.app.showFlashcardModule({ mode: 'spaced_repetition' });
                        } else if (window.startVocabularySession) {
                            window.startVocabularySession();
                        }
                        break;
                        
                    case 'toeicReading':
                        if (window.app && window.app.showReadingModule) {
                            window.app.showReadingModule();
                        } else if (window.startReadingSession) {
                            window.startReadingSession();
                        }
                        break;
                        

                    case 'toeicGrammar':
                        if (window.app && window.app.showGrammarModule) {
                            window.app.showGrammarModule();
                        } else if (window.startGrammarSession) {
                            window.startGrammarSession();
                        }
                        break;
                        
                    case 'toeicTestSimulator':
                        if (window.app && window.app.showTestSimulatorModule) {
                            window.app.showTestSimulatorModule();
                        } else if (window.startFullTest) {
                            window.startFullTest();
                        }
                        break;
                        
                    case 'toeicFlashcards':
                        if (window.app && window.app.showFlashcardModule) {
                            window.app.showFlashcardModule({ mode: 'flashcard_review' });
                        } else if (window.startVocabularySession) {
                            window.startVocabularySession();
                        }
                        break;
                        
                    default:
                        console.log('🎯 Unknown TOEIC module:', item.key);
                        break;
                }
            });
        } else if (item.type === 'game') {
            carouselItem.innerHTML = `
                <div class="game-carousel-card relative h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group">
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div class="relative z-10 h-full flex flex-col justify-between">
                        <!-- Game Icon -->
                        <div class="text-center mb-4">
                            <div class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                <span class="text-3xl">${item.icon}</span>
                            </div>
                        </div>
                        
                        <!-- Game Title -->
                        <h3 class="text-xl font-bold text-white text-center mb-2 group-hover:text-purple-200 transition-colors duration-300">
                            ${item.title}
                        </h3>
                        
                        <!-- Game Description -->
                        <p class="text-white/80 text-center text-sm mb-4 line-clamp-2">
                            ${item.description}
                        </p>
                        
                        <!-- Game Stats -->
                        <div class="flex justify-center space-x-4 text-xs text-white/60">
                            <span class="flex items-center">
                                <i data-lucide="target" class="w-3 h-3 mr-1"></i>
                                ${item.difficulty}
                            </span>
                            <span class="flex items-center">
                                <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                                ${item.duration}
                            </span>
                        </div>
                        
                        <!-- Play Button -->
                        <button class="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg" onclick="window.gameEngine.startGame('${item.gameMode}')">
                            <i data-lucide="play" class="w-4 h-4 inline mr-2"></i>
                            Play Now
                        </button>
                    </div>
                </div>
            `;
        } else if (item.type === 'feature') {
            carouselItem.innerHTML = `
                <div class="feature-carousel-card relative h-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group">
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div class="relative z-10 h-full flex flex-col justify-center text-center">
                        <!-- Feature Icon -->
                        <div class="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span class="text-2xl">${item.icon}</span>
                        </div>
                        
                        <!-- Feature Title -->
                        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors duration-300">
                            ${item.title}
                        </h3>
                        
                        <!-- Feature Description -->
                        <p class="text-white/80 text-sm">
                            ${item.description}
                        </p>
                    </div>
                </div>
            `;
        }
        
        return carouselItem;
    }
    
    /**
     * Create navigation arrows
     */
    createNavigationArrows(container, carouselId) {
        const arrowsContainer = document.createElement('div');
        arrowsContainer.className = 'carousel-arrows absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-20';
        
        // Previous arrow
        const prevArrow = document.createElement('button');
        prevArrow.className = 'carousel-arrow prev-arrow bg-white/10 backdrop-blur-lg text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 pointer-events-auto transform hover:scale-110';
        prevArrow.innerHTML = '<i data-lucide="chevron-left" class="w-6 h-6"></i>';
        prevArrow.onclick = () => this.previousSlide(carouselId);
        
        // Next arrow
        const nextArrow = document.createElement('button');
        nextArrow.className = 'carousel-arrow next-arrow bg-white/10 backdrop-blur-lg text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 pointer-events-auto transform hover:scale-110';
        nextArrow.innerHTML = '<i data-lucide="chevron-right" class="w-6 h-6"></i>';
        nextArrow.onclick = () => this.nextSlide(carouselId);
        
        arrowsContainer.appendChild(prevArrow);
        arrowsContainer.appendChild(nextArrow);
        container.appendChild(arrowsContainer);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Create dots navigation
     */
    createDotsNavigation(container, carouselId, totalItems) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20';
        
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-white' : 'bg-white/40'}`;
            dot.onclick = () => this.goToSlide(carouselId, i);
            dotsContainer.appendChild(dot);
        }
        
        container.appendChild(dotsContainer);
    }
    
    /**
     * Add touch/swipe support
     */
    addTouchSupport(wrapper, carouselId) {
        wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e, carouselId));
        wrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e, carouselId));
        wrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e, carouselId));
        
        // Mouse drag support
        wrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e, carouselId));
        wrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e, carouselId));
        wrapper.addEventListener('mouseup', (e) => this.handleMouseUp(e, carouselId));
        wrapper.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, carouselId));
    }
    
    /**
     * Touch event handlers
     */
    handleTouchStart(e, carouselId) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
    }
    
    handleTouchMove(e, carouselId) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        
        const carousel = this.carousels.get(carouselId);
        if (carousel) {
            const translateX = -(carousel.currentIndex * 100) - (diff / carousel.container.offsetWidth * 100);
            carousel.wrapper.style.transform = `translateX(${translateX}%)`;
        }
    }
    
    handleTouchEnd(e, carouselId) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide(carouselId);
            } else {
                this.previousSlide(carouselId);
            }
        } else {
            // Return to current position
            this.goToSlide(carouselId, this.currentIndexes.get(carouselId));
        }
    }
    
    /**
     * Mouse event handlers
     */
    handleMouseDown(e, carouselId) {
        this.startX = e.clientX;
        this.isDragging = true;
        e.preventDefault();
    }
    
    handleMouseMove(e, carouselId) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX;
        const diff = this.startX - this.currentX;
        
        const carousel = this.carousels.get(carouselId);
        if (carousel) {
            const translateX = -(carousel.currentIndex * 100) - (diff / carousel.container.offsetWidth * 100);
            carousel.wrapper.style.transform = `translateX(${translateX}%)`;
        }
    }
    
    handleMouseUp(e, carouselId) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide(carouselId);
            } else {
                this.previousSlide(carouselId);
            }
        } else {
            this.goToSlide(carouselId, this.currentIndexes.get(carouselId));
        }
    }
    
    handleMouseLeave(e, carouselId) {
        if (this.isDragging) {
            this.handleMouseUp(e, carouselId);
        }
    }
    
    /**
     * Navigation methods
     */
    nextSlide(carouselId) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return;
        
        let nextIndex = carousel.currentIndex + 1;
        if (nextIndex >= carousel.totalItems) {
            if (carousel.config.infinite) {
                nextIndex = 0;
            } else {
                nextIndex = carousel.totalItems - 1;
            }
        }
        
        this.goToSlide(carouselId, nextIndex);
    }
    
    previousSlide(carouselId) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return;
        
        let prevIndex = carousel.currentIndex - 1;
        if (prevIndex < 0) {
            if (carousel.config.infinite) {
                prevIndex = carousel.totalItems - 1;
            } else {
                prevIndex = 0;
            }
        }
        
        this.goToSlide(carouselId, prevIndex);
    }
    
    goToSlide(carouselId, index) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return;
        
        // Validate index
        if (index < 0 || index >= carousel.totalItems) {
            console.error(`❌ Invalid slide index: ${index}`);
            return;
        }
        
        // Update current index
        carousel.currentIndex = index;
        this.currentIndexes.set(carouselId, index);
        
        // Animate to slide
        const translateX = -(index * 100);
        carousel.wrapper.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        this.updateDots(carouselId, index);
        
        // Update arrows state
        this.updateArrows(carouselId, index);
        
        console.log(`🎠 Carousel ${carouselId} moved to slide ${index + 1}/${carousel.totalItems}`);
    }
    
    /**
     * Update navigation elements
     */
    updateDots(carouselId, activeIndex) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return;
        
        const dots = carousel.container.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.className = 'carousel-dot w-3 h-3 rounded-full transition-all duration-300 bg-white';
            } else {
                dot.className = 'carousel-dot w-3 h-3 rounded-full transition-all duration-300 bg-white/40';
            }
        });
    }
    
    updateArrows(carouselId, currentIndex) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return;
        
        const prevArrow = carousel.container.querySelector('.prev-arrow');
        const nextArrow = carousel.container.querySelector('.next-arrow');
        
        if (carousel.config.infinite) {
            // Always show arrows in infinite mode
            prevArrow.style.opacity = '1';
            nextArrow.style.opacity = '1';
        } else {
            // Hide arrows at boundaries
            prevArrow.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextArrow.style.opacity = currentIndex === carousel.totalItems - 1 ? '0.5' : '1';
        }
    }
    
    /**
     * Autoplay functionality
     */
    startAutoplay(carouselId) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel || !carousel.config.autoplay) return;
        
        carousel.autoplayInterval = setInterval(() => {
            this.nextSlide(carouselId);
        }, carousel.config.autoplaySpeed);
        
        console.log(`🎠 Autoplay started for carousel ${carouselId}`);
    }
    
    stopAutoplay(carouselId) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel || !carousel.autoplayInterval) return;
        
        clearInterval(carousel.autoplayInterval);
        carousel.autoplayInterval = null;
        
        console.log(`🎠 Autoplay stopped for carousel ${carouselId}`);
    }
    
    /**
     * Destroy carousel
     */
    destroyCarousel(carouselId) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return;
        
        // Stop autoplay
        this.stopAutoplay(carouselId);
        
        // Remove event listeners
        const wrapper = carousel.wrapper;
        wrapper.removeEventListener('touchstart', this.handleTouchStart);
        wrapper.removeEventListener('touchmove', this.handleTouchMove);
        wrapper.removeEventListener('touchend', this.handleTouchEnd);
        
        // Clear container
        carousel.container.innerHTML = '';
        
        // Remove from maps
        this.carousels.delete(carouselId);
        this.currentIndexes.delete(carouselId);
        
        console.log(`🗑️ Carousel ${carouselId} destroyed`);
    }
    
    /**
     * Get carousel info
     */
    getCarouselInfo(carouselId) {
        const carousel = this.carousels.get(carouselId);
        if (!carousel) return null;
        
        return {
            id: carouselId,
            currentIndex: carousel.currentIndex,
            totalItems: carousel.totalItems,
            config: carousel.config,
            isAutoplayActive: !!carousel.autoplayInterval
        };
    }
}

// Export to global scope
window.CarouselSystem = CarouselSystem;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.carouselSystem = new CarouselSystem();
    });
} else {
    window.carouselSystem = new CarouselSystem();
}

console.log('🎠 Carousel System loaded');
