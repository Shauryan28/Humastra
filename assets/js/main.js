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

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });

  // Close when clicking nav links
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
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
