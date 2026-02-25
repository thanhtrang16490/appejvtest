/**
 * Mobile Menu Functionality
 * Extracted from BaseLayout.astro
 */

function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button') as HTMLElement | null;
  const menuClose = document.getElementById('mobile-menu-close') as HTMLElement | null;
  const menu = document.getElementById('mobile-menu') as HTMLElement | null;
  const overlay = document.getElementById('mobile-menu-overlay') as HTMLElement | null;
  const menuLinks = document.querySelectorAll('.mobile-menu-link');

  if (!menuButton || !menuClose || !menu || !overlay) {
    return;
  }

  function openMenu() {
    if (!menu || !overlay) return;
    menu.classList.remove('-translate-y-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    menuClose?.focus();
  }

  function closeMenu() {
    if (!menu || !overlay) return;
    menu.classList.add('-translate-y-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    menuButton?.focus();
  }

  menuButton.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Keyboard navigation - ESC to close
  document.addEventListener('keydown', (e: Event) => {
    const keyboardEvent = e as KeyboardEvent;
    if (keyboardEvent.key === 'Escape' && !menu.classList.contains('-translate-y-full')) {
      closeMenu();
    }
  });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
  let lastScroll = 0;
  const header = document.querySelector('header');
  
  if (!header) {
    return;
  }

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('shadow-sm');
      header.classList.remove('bg-white/70');
      header.classList.add('bg-white/90');
    } else {
      header.classList.remove('shadow-sm');
      header.classList.remove('bg-white/90');
      header.classList.add('bg-white/70');
    }
    
    lastScroll = currentScroll;
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
  });
} else {
  initMobileMenu();
  initHeaderScroll();
}

