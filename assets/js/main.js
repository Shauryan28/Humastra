/**
 * HUMASTRA | Strategic Executive Search & Leadership Advisory
 * Core JavaScript Architecture: Lightweight, Accessible, Performant
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initAccordions();
  initInsightsFilter();
  initContactForm();
  initActiveNav();
});

/**
 * Header Scroll Elevation
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  // Ensure mobile drawer has a prominent CTA link
  if (!navMenu.querySelector('.mobile-drawer-cta-wrapper')) {
    const isSubfolder = window.location.pathname.includes('/insights/');
    const contactHref = isSubfolder ? '../contact.html' : 'contact.html';
    const ctaLi = document.createElement('li');
    ctaLi.className = 'mobile-drawer-cta-wrapper';
    ctaLi.innerHTML = `
      <a href="${contactHref}" class="btn btn-primary mobile-drawer-cta">
        Discuss a Search Mandate
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;
    navMenu.appendChild(ctaLi);
  }

  const closeMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking nav links
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside of nav menu on mobile
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Reset body overflow when resizing beyond mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && navMenu.classList.contains('open')) {
      closeMenu();
    }
  }, { passive: true });
}

/**
 * Active Navigation Indicator
 */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Accessible Accordions (FAQ & Methodologies)
 */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close sibling items for single accordion behavior
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Insights Category Filtering
 */
function initInsightsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const insightCards = document.querySelectorAll('.insight-card[data-category]');
  if (!filterButtons.length || !insightCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      insightCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Contact & Search Enquiry Form Management
 */
function initContactForm() {
  const form = document.getElementById('searchEnquiryForm');
  const alertBox = document.getElementById('formAlert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic Validation Check
    const name = form.querySelector('[name="fullName"]');
    const email = form.querySelector('[name="workEmail"]');
    const company = form.querySelector('[name="companyName"]');
    const mandate = form.querySelector('[name="mandateType"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name.value.trim() || !email.value.trim() || !company.value.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      alert('Please provide a valid corporate work email.');
      email.focus();
      return;
    }

    // UX Feedback on Submit
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Securing Mandate Details...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.className = 'form-alert success';
        alertBox.innerHTML = `
          <strong>Mandate Enquiry Registered with Discretion</strong><br>
          Thank you, ${name.value.trim()}. Your executive requirement has been securely submitted to HUMASTRA's senior advisory team. A Partner will reach out to ${email.value.trim()} within 24 business hours under strict confidentiality.
        `;
      }

      form.reset();
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });
}
