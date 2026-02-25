/**
 * Homepage Animations
 * Extracted from index.astro
 */

/**
 * Count-up Animation for Statistics
 */
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length === 0) {
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = entry.target as HTMLElement;
        const shouldCountUp = target.dataset.countup === 'true';
        
        if (shouldCountUp) {
          const finalValue = parseInt(target.dataset.target || '0');
          const suffix = target.dataset.suffix || '';
          const duration = 2000;
          const steps = 60;
          const increment = finalValue / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
              target.textContent = finalValue.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              target.textContent = Math.floor(current).toLocaleString() + suffix;
            }
          }, duration / steps);
          
          target.classList.add('counted');
        }
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach((stat) => observer.observe(stat));
}

/**
 * Scroll Reveal Animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (revealElements.length === 0) {
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Parallax Scroll Effects
 */
function initParallax() {
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Parallax layers in hero
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    parallaxLayers.forEach((layer) => {
      const element = layer as HTMLElement;
      const speed = parseFloat(element.dataset.speed || '0.5');
      const yPos = -(scrolled * speed);
      (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
    });
    
    // Parallax text elements
    const parallaxTexts = document.querySelectorAll('.parallax-text');
    parallaxTexts.forEach((text) => {
      const element = text as HTMLElement;
      const speed = parseFloat(element.dataset.speed || '0.3');
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
    
    // Hide scroll indicator after scrolling
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      if (scrolled > 100) {
        scrollIndicator.classList.add('opacity-0', 'pointer-events-none');
      } else {
        scrollIndicator.classList.remove('opacity-0', 'pointer-events-none');
      }
    }
    
    // Scale effect on sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top / window.innerHeight);
      
      if (scrollProgress > 0 && scrollProgress < 1) {
        const scale = 0.95 + (scrollProgress * 0.05);
        
        if (section.id !== 'hero-section') {
          (section as HTMLElement).style.transform = `scale(${Math.min(scale, 1)})`;
        }
      }
    });
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

/**
 * Sticky CTA Bar
 */
function initStickyCTA() {
  const stickyCTA = document.getElementById('sticky-cta');
  if (!stickyCTA) {
    return;
  }
  
  let lastScroll = 0;
  const heroHeight = window.innerHeight;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show sticky CTA after scrolling past hero
    if (currentScroll > heroHeight && currentScroll > lastScroll) {
      stickyCTA.classList.remove('translate-y-full');
    } else if (currentScroll < lastScroll || currentScroll < heroHeight) {
      stickyCTA.classList.add('translate-y-full');
    }
    
    lastScroll = currentScroll;
  });
}

/**
 * Tab Switching
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) {
    return;
  }
  
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = (button as HTMLElement).dataset.tab;
      
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => {
        btn.classList.remove('active', 'bg-white/20');
      });
      tabContents.forEach((content) => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active', 'bg-white/20');
      const content = document.getElementById(`${tabName}-tab`);
      if (content) {
        content.classList.add('active');
      }
    });
  });
}

/**
 * Hero Fade-in Animation
 */
function initHeroAnimation() {
  const heroElements = document.querySelectorAll('.hero-fade-in');
  
  if (heroElements.length === 0) {
    return;
  }
  
  // Elements already have CSS animation, this just ensures they trigger
  // Could be enhanced with IntersectionObserver if needed
}

/**
 * Initialize all homepage animations
 */
function initHomepageAnimations() {
  initCountUp();
  initScrollReveal();
  initParallax();
  initStickyCTA();
  initTabs();
  initHeroAnimation();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepageAnimations);
} else {
  initHomepageAnimations();
}

