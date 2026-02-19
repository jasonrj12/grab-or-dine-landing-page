// script.js - Enhanced with accessibility and UX improvements

// 1. Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

let scrollTicking = false;
function toggleBackToTop() {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      if (backToTopBtn) {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
      scrollTicking = false;
    });
  }
}

if (backToTopBtn) {
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 2. Featured Menu Carousel (if exists)
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let carouselIndex = 0;
let mobileCarouselInterval = null;

function isMobile() {
  return window.innerWidth <= 600;
}

function updateCarousel(options = { scroll: true }) {
  if (!carouselTrack || carouselItems.length === 0) return;

  if (isMobile()) {
    carouselItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === carouselIndex);
    });
    const item = carouselItems[carouselIndex];
    if (item && options.scroll) {
      carouselTrack.scrollTo({
        left: item.offsetLeft - carouselTrack.offsetLeft,
        behavior: 'smooth'
      });
    }
  } else {
    carouselItems.forEach(item => item.classList.remove('active'));
    const visibleItems = 2;
    const gap = 32;
    const itemWidth = carouselItems[0].offsetWidth;
    const offset = -carouselIndex * (itemWidth + gap);
    carouselTrack.style.transform = `translateX(${offset}px)`;
  }
}

function startMobileCarouselAutoSlide() {
  if (mobileCarouselInterval) clearInterval(mobileCarouselInterval);
  if (!isMobile() || !carouselTrack) return;
  mobileCarouselInterval = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselItems.length;
    updateCarousel({ scroll: true });
  }, 2500);
}

if (prevBtn && nextBtn && carouselTrack && carouselItems.length > 0) {
  prevBtn.addEventListener('click', () => {
    carouselIndex = Math.max(0, carouselIndex - 1);
    updateCarousel({ scroll: true });
  });
  nextBtn.addEventListener('click', () => {
    const visibleItems = 2;
    const maxIndex = isMobile() ? carouselItems.length - 1 : Math.max(0, carouselItems.length - visibleItems);
    carouselIndex = Math.min(maxIndex, carouselIndex + 1);
    updateCarousel({ scroll: true });
  });
}

// Debounced resize handler for better performance
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (mobileCarouselInterval) clearInterval(mobileCarouselInterval);
    if (isMobile() && carouselTrack) startMobileCarouselAutoSlide();
    updateCarousel({ scroll: false });
  }, 150);
}

window.addEventListener('resize', handleResize, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  if (isMobile() && carouselTrack) startMobileCarouselAutoSlide();
});

// 3. Newsletter Signup (if exists)
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMsg = document.getElementById('newsletterMsg');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      newsletterMsg.setAttribute('role', 'alert');
      return;
    }
    newsletterMsg.textContent = 'Thank you for subscribing!';
    newsletterMsg.setAttribute('role', 'status');
    newsletterEmail.value = '';
    setTimeout(() => newsletterMsg.textContent = '', 4000);
  });
}

// Footer Newsletter Signup - Removed

// 4. Improved Hamburger Menu for Mobile
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const hamburgerInput = hamburger ? hamburger.querySelector('input[type="checkbox"]') : null;
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  if (!hamburger || !hamburgerInput || !navLinks) {
    return;
  }

  function toggleMenu(isOpen) {
    if (isOpen) {
      navLinks.classList.add('open');
      hamburgerInput.checked = true;
      hamburgerInput.setAttribute('aria-expanded', 'true');
      if (navbar) navbar.classList.add('menu-open');
      // Only block vertical scroll on body, NOT using position:fixed (avoids mobile scroll kill)
      document.body.style.overflowY = 'hidden';
    } else {
      navLinks.classList.remove('open');
      hamburgerInput.checked = false;
      hamburgerInput.setAttribute('aria-expanded', 'false');
      if (navbar) navbar.classList.remove('menu-open');
      // Restore vertical scroll
      document.body.style.overflowY = '';
    }
  }

  // Listen to checkbox change event (fires when checkbox state changes via label click)
  hamburgerInput.addEventListener('change', function (e) {
    toggleMenu(e.target.checked);
  });

  // Close menu when clicking nav links
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
}

// Initialize hamburger menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHamburgerMenu);
} else {
  initHamburgerMenu();
}

// 5. Enhanced Dynamic Reviews Carousel
// Real 5-star reviews from Google Maps (https://maps.app.goo.gl/tGyus7PTG44EW3bv9)
const reviews = [
  {
    text: "I recently ordered from Grab or Dine Restaurant in New Barnet, and I was really impressed! The portions were huge - definitely great value for money. The food was absolutely delicious, and their chicken burgers are the best I've ever had. The prices are surprisingly low considering how generous the portions are. Highly recommend this place if you're after tasty food and great value!",
    name: "Andrew Saad",
    stars: 5
  },
  {
    text: "We tried for the first time Grab or dine and we really enjoyed the food. The truffle burger was very tasty ! The staff are very friendly. They also have srilankan dishes, will try next time. I recommend.",
    name: "Brian JOSEPH",
    stars: 5,
    isLocalGuide: true
  },
  {
    text: "It was massive and delicious food eaten i have today. Today i eat my favourite peri peri wings extra hot. Here is available biriyani burgers chips everything all food are halal. Thank you so much Protik brother to serve this delicious food ❤️",
    name: "Mohammod Abul Hasan",
    stars: 5
  },
  {
    text: "BBQ cheeseburger meal was very nice. Cooked to perfection and was very fresh. Service was really fast and staff were extremely friendly! Would very highly recommend!",
    name: "Andre Eleftheriou",
    stars: 5
  },
  {
    text: "10/10 would recommend every time the best place In New Barnet for food!! Always come here it is so nice and good quality and you will always leave with a warm feeling.",
    name: "Tony Merlin",
    stars: 5
  },
  {
    text: "very sweet guy absolutely love it here food is 10/10 make conversation and you'll have the time of your life",
    name: "Selma Telford",
    stars: 5
  },
  {
    text: "Just had a lovely meal including two chicken burgers and southern fried style chicken (which I was craving and not had in years!). Glad I tried it out and main man in there is very welcoming .. thank you for he hospitality bro.",
    name: "CF62 Home Related Works",
    stars: 5
  },
  {
    text: "Honestly, these chicken burgers were on another level. Perfectly cooked crispy on the outside, juicy on the inside and packed with flavour in every bite. The seasoning was spot-on, and the toppings were fresh and balanced, not overloaded like some places do. You can tell real care goes into making them. The bun was soft but held together beautifully, and the sauce tied everything together perfectly. Easily the best chicken burger I've had in a long time — I'm already planning my next visit! Highly recommend to anyone who loves a proper, well-made chicken burger.",
    name: "Louca Ioannou",
    stars: 5
  },
  {
    text: "Soooo popped in grab and dine for some dinner for the family and ordered peri peri whole chicken , combo maxi and nuggets and chips for the my little one. Waited 15 minutes and took it home to find the peri peri chicken was packed full of flavour, chicken wings and tenders were cooked to perfection and my little one enjoyed her nuggets and chips. She there the best nuggets in the world. Definatley ordering from grab and dine again. 5 *",
    name: "Terry Harmsworth",
    stars: 5,
    isLocalGuide: true
  },
  {
    text: "Chicken is tender and crispy and has a great southern American taste to it and it's lovely, food is also clean and they have lots of manners 😂",
    name: "Romeo Anvari",
    stars: 5
  },
  {
    text: "Really nice little place staffed by lovely people! food is really good and I love how they have sri lankan food as well. definitely give it a go",
    name: "Amanda \"Manda\" Beligoda",
    stars: 5
  },
  {
    text: "Great food, especially their peri peri chicken, great value and the guys there are really friendly.",
    name: "Max MacKenzie",
    stars: 5,
    isLocalGuide: true
  },
  {
    text: "I've been here a few times! The food is great, even the ones I wouldn't normally eat elsewhere. The customer service is 100%, can't ask for better. Pratik is a super nice gentle man!",
    name: "Obinna Amakor",
    stars: 5
  }
];
let reviewIndex = 0;
const reviewSlide = document.getElementById('reviewSlide');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');

function renderReview(idx) {
  if (!reviewSlide) return;
  const review = reviews[idx];
  const stars = '★'.repeat(review.stars);
  const localGuideBadge = review.isLocalGuide ? '<span class="review-local-guide">Local Guide</span>' : '';

  // Generate avatar color based on name for consistency
  const avatarColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  ];
  const avatarColor = avatarColors[idx % avatarColors.length];

  reviewSlide.innerHTML = `
    <div class="review-header">
      <div class="review-avatar" style="background: ${avatarColor};">
        <span class="review-avatar-initial">${review.name.charAt(0).toUpperCase()}</span>
      </div>
      <div class="review-meta">
        <div class="review-name-row">
          <span class="review-name">${review.name}</span>
          ${localGuideBadge}
        </div>
        <div class="review-rating-row">
          <div class="review-stars">${stars}</div>
        </div>
      </div>
    </div>
    <div class="review-text">${review.text}</div>
  `;
  reviewSlide.style.opacity = 0;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      reviewSlide.style.opacity = 1;
    });
  });
}

if (reviewSlide) {
  renderReview(reviewIndex);
}
if (reviewPrev) reviewPrev.addEventListener('click', () => {
  reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
  renderReview(reviewIndex);
});
if (reviewNext) reviewNext.addEventListener('click', () => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  renderReview(reviewIndex);
});

// Auto-rotate reviews
let reviewInterval = setInterval(() => {
  if (reviewSlide) {
    reviewIndex = (reviewIndex + 1) % reviews.length;
    renderReview(reviewIndex);
  }
}, 5000);

// Pause on hover
if (reviewSlide) {
  reviewSlide.addEventListener('mouseenter', () => clearInterval(reviewInterval));
  reviewSlide.addEventListener('mouseleave', () => {
    clearInterval(reviewInterval);
    reviewInterval = setInterval(() => {
      reviewIndex = (reviewIndex + 1) % reviews.length;
      renderReview(reviewIndex);
    }, 5000);
  });
}

// 6. Enhanced Order Modal with Focus Trap
const orderModal = document.getElementById('orderModal');
const orderModalClose = document.getElementById('orderModalClose');
const heroOrderBtn = document.getElementById('heroOrderBtn');
const orderNowBtns = document.querySelectorAll('.cta-btn');
const footerOrderBtn = document.getElementById('footerOrderBtn');
let lastFocusedElement = null;

function getFocusableElements() {
  if (!orderModal) return [];
  return Array.from(orderModal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

function trapFocus(e) {
  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
}

function openOrderModal() {
  if (orderModal) {
    lastFocusedElement = document.activeElement;

    // Store scroll position on html element (avoids position:fixed page-jump)
    const scrollY = window.scrollY;
    document.documentElement.setAttribute('data-scroll-y', scrollY);

    // Lock scroll using overflow only — no position:fixed (fixes mobile scroll kill)
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Prevent touch scrolling on iOS (only outside modal content)
    document.addEventListener('touchmove', preventScroll, { passive: false });

    orderModal.style.display = 'flex';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      });
    });

    document.addEventListener('keydown', trapFocus);
  }
}

function preventScroll(e) {
  // Allow scrolling within the modal content
  if (e.target.closest('.order-modal-content')) {
    return;
  }
  // Prevent scrolling on the background
  e.preventDefault();
}

function closeOrderModal() {
  if (orderModal) {
    orderModal.style.display = 'none';

    // Restore scroll
    const scrollY = parseInt(document.documentElement.getAttribute('data-scroll-y') || '0', 10);
    document.documentElement.removeAttribute('data-scroll-y');

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    // Always remove touch scroll prevention (even if something went wrong)
    document.removeEventListener('touchmove', preventScroll);

    // Restore scroll position
    window.scrollTo(0, scrollY);

    document.removeEventListener('keydown', trapFocus);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
}

orderNowBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openOrderModal();
    });
  }
});

// Footer order button
if (footerOrderBtn) {
  footerOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrderModal();
  });
}

if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
if (orderModal) {
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) closeOrderModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal.style.display === 'flex') {
      closeOrderModal();
    }
  });
}

// 7. Menu carousel dots and arrows (if on menu page)
(function () {
  const track = document.getElementById('menuCarouselTrack');
  const dotsWrap = document.getElementById('menuDots');
  const prev = document.getElementById('menuPrev');
  const next = document.getElementById('menuNext');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll('.menu-slide'));
  const dots = Array.from(dotsWrap.querySelectorAll('.menu-dot'));

  function setActiveDot(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function currentIndex() {
    const trackRect = track.getBoundingClientRect();
    let bestIdx = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const viewportCenter = window.innerWidth / 2;
      const dist = Math.abs(slideCenter - viewportCenter);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    return bestIdx;
  }

  function snapTo(index) {
    const slide = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActiveDot(currentIndex());
      ticking = false;
    });
  }, { passive: true });

  if (prev) prev.addEventListener('click', () => snapTo(currentIndex() - 1));
  if (next) next.addEventListener('click', () => snapTo(currentIndex() + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => snapTo(i)));

  setActiveDot(0);
})();

// 8. Delivergate API Configuration for Grab Or Dine
if (typeof DELIVERGATE_API === 'undefined') {
  var DELIVERGATE_API = {
    baseURL: 'https://pos.delivergate.com/api/v1/webshop',
    categoryId: 1, // Main menu category ID
    webshopBrand: 1,
    shop: 1,
    tenantCode: 'grabordine', // Correct tenant code from API headers
    timeout: 10000,

    // Build API URLs
    getCategoriesURL() {
      return `${this.baseURL}/categories/webshop-brand/${this.webshopBrand}/shop/${this.shop}`;
    },

    getMenuURL(categoryId) {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }
      return `${this.baseURL}/main-menu/${categoryId}/categories/webshop-brand/${this.webshopBrand}/shop/${this.shop}`;
    },

    // Fetch with timeout
    async fetchWithTimeout(url, options = {}) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': 'https://order.grabordine.co.uk',
            'Referer': 'https://order.grabordine.co.uk/',
            'x-tenant-code': this.tenantCode,
            ...options.headers
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => response.statusText);
          throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
    }
  };
}

// Format price for display
function formatPrice(price) {
  if (!price) return '';
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '';
  return `£${numPrice.toFixed(2)}`;
}

// Get category icon
function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('burger')) return 'fa-hamburger';
  if (name.includes('wrap')) return 'fa-burrito';
  if (name.includes('chicken') || name.includes('wing')) return 'fa-drumstick-bite';
  if (name.includes('fries') || name.includes('side')) return 'fa-utensils';
  if (name.includes('drink') || name.includes('beverage')) return 'fa-glass';
  if (name.includes('dessert') || name.includes('sweet')) return 'fa-cookie-bite';
  if (name.includes('deal') || name.includes('combo') || name.includes('meal')) return 'fa-tags';
  return 'fa-utensils';
}

// Store menu data globally for filtering
let allMenuItems = [];
let allCategories = {};
let currentActiveCategory = 'all';

// Active Category Management Function
function activeCategory(categoryName) {
  // If categoryName is provided, set it as active
  if (categoryName !== undefined && categoryName !== null) {
    currentActiveCategory = categoryName || 'all';

    // Update UI - remove active class from all buttons
    const allButtons = document.querySelectorAll('.category-filter-btn');
    allButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to the selected button
    const targetButton = document.querySelector(`.category-filter-btn[data-category="${currentActiveCategory}"]`);
    if (targetButton) {
      targetButton.classList.add('active');

      // Scroll the active button into view (for horizontal scrolling)
      // Use requestAnimationFrame for optimized smooth scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            targetButton.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          } catch (e) {
            // Fallback if scrollIntoView fails
            targetButton.scrollIntoView();
          }
        });
      });
    }

    return currentActiveCategory;
  }

  // If no argument provided, return the current active category
  const activeButton = document.querySelector('.category-filter-btn.active');
  if (activeButton && activeButton.dataset.category) {
    currentActiveCategory = activeButton.dataset.category;
  } else {
    // Fallback: ensure "All" is active if no active button found
    const allButton = document.querySelector('.category-filter-btn[data-category="all"]');
    if (allButton) {
      allButton.classList.add('active');
      currentActiveCategory = 'all';
    }
  }

  return currentActiveCategory || 'all';
}

// Render menu items by category with filtering support
function renderMenuItems(menuData, filterCategory = 'all', searchQuery = '') {
  const container = document.getElementById('dynamicMenuContainer');
  const loading = document.getElementById('menuLoading');
  const error = document.getElementById('menuError');
  const staticGallery = document.getElementById('staticMenuGallery');
  const searchFilter = document.getElementById('menuSearchFilter');
  const WEBSHOP_URL = 'https://order.grabordine.co.uk/food-menu';

  if (!container) return;

  try {
    // Hide loading and error states
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'none';

    // Hide static gallery when dynamic menu loads
    if (staticGallery) staticGallery.style.display = 'none';

    // Show search/filter section
    if (searchFilter) searchFilter.style.display = 'flex';

    // Store original data
    allMenuItems = menuData;

    // Clear container
    container.innerHTML = '';
    container.style.display = 'block';

    // Check if menuData has the expected structure
    if (!menuData || !Array.isArray(menuData)) {
      throw new Error('Invalid menu data structure');
    }

    // Group items by category
    const categories = {};

    menuData.forEach(item => {
      const categoryName = item.category ||
        item.category_name ||
        item.categoryName ||
        item.category?.name ||
        'Other';

      const categoryKey = typeof categoryName === 'string' ? categoryName : (categoryName?.name || 'Other');

      if (!categories[categoryKey]) {
        categories[categoryKey] = [];
      }
      categories[categoryKey].push(item);
    });

    // Store categories globally
    allCategories = categories;

    // Create category filter buttons
    createCategoryFilters(Object.keys(categories));

    // Initialize active category if not set
    if (!document.querySelector('.category-filter-btn.active')) {
      activeCategory(filterCategory);
    }

    // Filter items based on category and search
    let filteredCategories = {};
    Object.keys(categories).forEach(categoryName => {
      let items = categories[categoryName];

      // Filter by category
      if (filterCategory !== 'all' && categoryName !== filterCategory) {
        return;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(item => {
          const name = (item.name || item.title || item.item_name || '').toLowerCase();
          const description = (item.description || item.item_description || '').toLowerCase();
          return name.includes(query) || description.includes(query);
        });
      }

      if (items.length > 0) {
        filteredCategories[categoryName] = items;
      }
    });

    // Render each category
    Object.keys(filteredCategories).forEach(categoryName => {
      const categorySection = document.createElement('section');
      categorySection.className = 'menu-category-section';
      categorySection.setAttribute('aria-labelledby', `category-${categoryName.replace(/\s+/g, '-').toLowerCase()}`);

      const categoryId = `category-${categoryName.replace(/\s+/g, '-').toLowerCase()}`;
      const iconClass = getCategoryIcon(categoryName);

      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      categorySection.innerHTML = `
        <h2 id="${categoryId}" class="menu-category-title">
          <i class="fas ${iconClass}" aria-hidden="true"></i>
          ${escapeHtml(categoryName)}
        </h2>
        <div class="menu-items-grid" role="list">
          ${filteredCategories[categoryName].map(item => {
        const itemName = item.name || item.title || item.item_name || 'Unnamed Item';
        const itemDescription = (item.description || item.item_description || '').trim();
        const itemPrice = item.price || item.item_price || item.selling_price || '';
        const itemImage = item.image || item.image_url || item.item_image || item.photo_url || '';
        const itemId = item.id || item.item_id || '';
        const categoryIcon = getCategoryIcon(categoryName);
        const hasDescription = itemDescription && itemDescription.length > 0 && itemDescription !== 'null' && itemDescription !== 'undefined';

        return `
              <article class="menu-item-card" role="listitem" data-item-id="${escapeHtml(String(itemId))}">
                ${itemImage ? `
                  <div class="menu-item-image">
                    <img src="${escapeHtml(itemImage)}" alt="${escapeHtml(itemName)}" loading="lazy" decoding="async" onerror="this.style.display='none';">
                  </div>
                ` : ''}
                <div class="menu-item-content">
                  <div class="menu-item-category">
                    <i class="fas ${categoryIcon}" aria-hidden="true"></i>
                    ${escapeHtml(categoryName.toUpperCase())}
                  </div>
                  <h3 class="menu-item-name">${escapeHtml(itemName)}</h3>
                  ${hasDescription ? `<p class="menu-item-description">${escapeHtml(itemDescription)}</p>` : ''}
                </div>
                ${itemPrice ? `<div class="menu-item-price">${formatPrice(itemPrice)}</div>` : ''}
              </article>
            `;
      }).join('')}
        </div>
      `;

      container.appendChild(categorySection);
    });

    // Smooth scroll to first category section after render (if filtering)
    if (filterCategory !== 'all' && Object.keys(filteredCategories).length > 0) {
      requestAnimationFrame(() => {
        const firstCategory = container.querySelector('.menu-category-section');
        if (firstCategory) {
          firstCategory.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }

    // If no categories found, show message
    if (Object.keys(filteredCategories).length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="font-size: 1.1rem; margin: 0;">No items found matching your search.</p>
        </div>
      `;
    }

  } catch (err) {
    if (error) {
      error.style.display = 'block';
      error.innerHTML = `<p>Error loading menu: ${err.message}</p>`;
    }
    if (staticGallery) staticGallery.style.display = 'grid';
    container.style.display = 'none';
  }
}

// Create category filter buttons
function createCategoryFilters(categoryNames) {
  const filterContainer = document.getElementById('categoryFilterButtons');
  if (!filterContainer) return;

  // Remove only dynamically created category buttons (not the "All" button)
  const existingButtons = filterContainer.querySelectorAll('.category-filter-btn:not([data-category="all"])');
  existingButtons.forEach(btn => btn.remove());

  // Sort categories alphabetically
  const sortedCategories = [...categoryNames].sort();

  // Create and append category buttons
  sortedCategories.forEach(categoryName => {
    const button = document.createElement('button');
    button.className = 'category-filter-btn';
    button.setAttribute('data-category', categoryName);
    button.setAttribute('aria-label', `Filter by ${categoryName}`);
    button.innerHTML = `<span>${categoryName}</span>`;
    filterContainer.appendChild(button);
  });

  // Use event delegation on the container to handle all button clicks
  // This avoids duplicate listeners and works for dynamically added buttons
  if (!filterContainer.hasAttribute('data-listener-attached')) {
    filterContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.category-filter-btn');
      if (!button) return;

      // Get category and set it as active
      const category = button.dataset.category;
      activeCategory(category);

      // Get search query
      const searchInput = document.getElementById('menuSearchInput');
      const searchQuery = searchInput ? searchInput.value.trim() : '';

      // Filter and render
      renderMenuItems(allMenuItems, category, searchQuery);
    });

    filterContainer.setAttribute('data-listener-attached', 'true');
  }
}

// Initialize search and filter functionality
function initMenuSearchFilter() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearSearch = document.getElementById('clearSearch');
  const allFilterBtn = document.querySelector('.category-filter-btn[data-category="all"]');

  if (!searchInput) return;

  // Search input handler with optimized debouncing
  let searchTimeout;
  let searchRafId;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    if (searchRafId) cancelAnimationFrame(searchRafId);

    const query = e.target.value.trim();

    // Show/hide clear button immediately (no debounce needed)
    if (clearSearch) {
      clearSearch.style.display = query ? 'flex' : 'none';
    }

    // Debounce search with requestAnimationFrame for smoother performance
    searchRafId = requestAnimationFrame(() => {
      searchTimeout = setTimeout(() => {
        const category = activeCategory();
        renderMenuItems(allMenuItems, category, query);
      }, 300);
    });
  }, { passive: true });

  // Clear search handler
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      clearSearch.style.display = 'none';
      const category = activeCategory();
      renderMenuItems(allMenuItems, category, '');
      searchInput.focus();
    });
  }

  // All filter button handler
  if (allFilterBtn) {
    allFilterBtn.addEventListener('click', () => {
      activeCategory('all');
      const query = searchInput.value.trim();
      renderMenuItems(allMenuItems, 'all', query);
    });
  }
}

// Load menu from Delivergate API
async function loadMenu() {
  const loading = document.getElementById('menuLoading');
  const error = document.getElementById('menuError');
  const container = document.getElementById('dynamicMenuContainer');
  const staticGallery = document.getElementById('staticMenuGallery');

  if (!loading) return;

  // Show loading state
  loading.style.display = 'block';
  if (error) error.style.display = 'none';
  if (container) container.style.display = 'none';
  if (staticGallery) staticGallery.style.display = 'none';

  try {
    // Try menu endpoint first (main-menu/1/categories/...)
    const menuURL = DELIVERGATE_API.getMenuURL(1);

    let apiData = await DELIVERGATE_API.fetchWithTimeout(menuURL);

    // Process Delivergate API response
    let menuItems = [];

    // Handle categorized data structure: { data: { "Category Name": [items], ... } }
    if (apiData && apiData.data && typeof apiData.data === 'object' && !Array.isArray(apiData.data)) {
      Object.entries(apiData.data).forEach(([categoryName, items]) => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            menuItems.push({
              id: item.id || item.item_id || item.product_id,
              name: item.title || item.name || item.item_name || 'Unknown Item',
              description: item.description || item.item_description || '',
              price: item.price || item.item_price || item.selling_price || 0,
              image: item.image_url || item.image || item.item_image || '',
              category: categoryName
            });
          });
        } else if (items && typeof items === 'object') {
          // Handle nested structure where items might be in a sub-object
          const nestedItems = items.items || items.menu_items || items.products || [];
          if (Array.isArray(nestedItems)) {
            nestedItems.forEach(item => {
              menuItems.push({
                id: item.id || item.item_id || item.product_id,
                name: item.title || item.name || item.item_name || 'Unknown Item',
                description: item.description || item.item_description || '',
                price: item.price || item.item_price || item.selling_price || 0,
                image: item.image_url || item.image || item.item_image || '',
                category: categoryName
              });
            });
          }
        }
      });
    }
    // Handle categories array that might contain items or subcategories
    else if (apiData && Array.isArray(apiData)) {
      // Check if it's an array of categories with items
      const firstItem = apiData[0];
      if (firstItem && (firstItem.items || firstItem.menu_items || firstItem.products)) {
        apiData.forEach(category => {
          const categoryName = category.name || category.category_name || category.title || 'Other';
          const items = category.items || category.menu_items || category.products || [];
          items.forEach(item => {
            menuItems.push({
              id: item.id || item.item_id || item.product_id,
              name: item.title || item.name || item.item_name || 'Unknown Item',
              description: item.description || item.item_description || '',
              price: item.price || item.item_price || item.selling_price || 0,
              image: item.image_url || item.image || item.item_image || '',
              category: categoryName
            });
          });
        });
      } else {
        // Treat as direct array of items
        menuItems = apiData.map(item => ({
          id: item.id || item.item_id,
          name: item.name || item.item_name || item.title || 'Unnamed Item',
          description: item.description || item.item_description || '',
          price: item.price || item.item_price || item.selling_price || 0,
          image: item.image || item.image_url || item.item_image || '',
          category: item.category || item.category_name || 'Other'
        }));
      }
    } else if (apiData && apiData.data && Array.isArray(apiData.data)) {
      menuItems = apiData.data.map(item => ({
        id: item.id || item.item_id,
        name: item.name || item.item_name || item.title || 'Unnamed Item',
        description: item.description || item.item_description || '',
        price: item.price || item.item_price || item.selling_price || 0,
        image: item.image || item.image_url || item.item_image || '',
        category: item.category || item.category_name || 'Other'
      }));
    } else if (apiData && apiData.items && Array.isArray(apiData.items)) {
      menuItems = apiData.items.map(item => ({
        id: item.id || item.item_id,
        name: item.name || item.item_name || item.title || 'Unnamed Item',
        description: item.description || item.item_description || '',
        price: item.price || item.item_price || item.selling_price || 0,
        image: item.image || item.image_url || item.item_image || '',
        category: item.category || item.category_name || 'Other'
      }));
    }

    if (menuItems.length > 0) {
      renderMenuItems(menuItems);
      // Initialize search and filter after menu is rendered
      setTimeout(() => {
        initMenuSearchFilter();
        // Ensure "All" is active on initial load
        activeCategory('all');
      }, 100);
      loading.style.display = 'none';
    } else {
      throw new Error('No menu items found in API response');
    }

  } catch (err) {
    // Show static menu on error
    if (staticGallery) staticGallery.style.display = 'grid';
    if (container) container.style.display = 'none';
    if (error) {
      error.style.display = 'block';
      error.innerHTML = `
        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
        <p>Unable to load menu from API. Showing static menu.</p>
        <p style="font-size: 0.9rem; color: #999; margin-top: 0.5rem;">Error: ${err.message}</p>
        <button class="cta-btn" onclick="loadMenu()" style="margin-top: 1rem;">Retry</button>
      `;
    }
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

// Load menu when page loads (only on menu.html)
if (window.location.pathname.includes('menu.html') || document.querySelector('.menu-hero')) {
  document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
  });
}

// Update copyright year dynamically
document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Safety reset: clear any stuck scroll locks from previous sessions
  // (e.g. if the user refreshed while a modal was open)
  document.body.style.overflow = '';
  document.body.style.overflowY = '';
  document.body.style.overflowX = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.touchAction = '';
  document.body.classList.remove('modal-open');
  document.documentElement.removeAttribute('data-scroll-y');
});

// ============================================
// GSAP REMOVED - Animations handled via CSS
// ============================================