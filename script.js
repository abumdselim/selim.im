document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const heroSection = document.getElementById('hero');
  const scrollArrow = document.getElementById('scroll-arrow');
  const nextSection = document.getElementById('next-section');

  // Handle Sticky Header visibility
  const handleScroll = () => {
    // Show header only after scrolling past the hero section threshold
    // We can use the hero section height as the threshold
    const threshold = heroSection.offsetHeight * 0.5; // Show after 50% scroll or full scroll
    
    if (window.scrollY > threshold) {
      header.classList.add('is-visible');
    } else {
      header.classList.remove('is-visible');
    }
  };

  // Initial check in case user loaded halfway down the page
  handleScroll();

  // Listen to scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Handle Arrow Click for smooth scroll
  if (scrollArrow && nextSection) {
    scrollArrow.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get the top position of the next section
      const nextSectionTop = nextSection.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: nextSectionTop,
        behavior: 'smooth'
      });
    });
  }
});
