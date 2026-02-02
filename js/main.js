/**
 * Danubius IT Solutions - Main JavaScript
 * Handles navigation, animations, and form interactions
 */

(function() {
  'use strict';

  // ===================
  // DOM Ready
  // ===================
  document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormHandling();
    initSmoothScroll();
    initAccordions();
  });

  // ===================
  // Navigation
  // ===================
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const mobileMenu = document.querySelector('.nav__mobile');
    let lastScroll = 0;

    // Mobile menu toggle
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('nav__mobile--open');

        toggle.classList.toggle('nav__toggle--active');
        mobileMenu.classList.toggle('nav__mobile--open');
        toggle.setAttribute('aria-expanded', !isOpen);
        mobileMenu.setAttribute('aria-hidden', isOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      // Close menu when clicking a link
      const mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link');
      mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          toggle.classList.remove('nav__toggle--active');
          mobileMenu.classList.remove('nav__mobile--open');
          toggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });

      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('nav__mobile--open')) {
          toggle.classList.remove('nav__toggle--active');
          mobileMenu.classList.remove('nav__mobile--open');
          toggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }

    // Scroll effects for navigation
    if (nav) {
      window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 10) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }

        lastScroll = currentScroll;
      }, { passive: true });
    }
  }

  // ===================
  // Scroll Effects
  // ===================
  function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-section, .stagger-children');
    animatedElements.forEach(function(el) {
      observer.observe(el);
    });

    // Add fade-in-section class to cards and sections that should animate
    const cards = document.querySelectorAll('.card, .feature-card, .value-card, .blog-card');
    cards.forEach(function(card, index) {
      card.style.transitionDelay = (index % 3) * 100 + 'ms';
    });
  }

  // ===================
  // Animations
  // ===================
  function initAnimations() {
    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero__title, .hero__text, .hero__tags, .hero__cta');
    heroElements.forEach(function(el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';

      setTimeout(function() {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });

    // Animate hero visual
    const heroVisual = document.querySelector('.hero__visual');
    if (heroVisual) {
      heroVisual.style.opacity = '0';
      heroVisual.style.transform = 'translateX(20px)';

      setTimeout(function() {
        heroVisual.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateX(0)';
      }, 400);
    }

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-card__number, .stat-item__number');
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(stat) {
      statsObserver.observe(stat);
    });
  }

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/^([\d,]+\.?\d*)/);

    if (!match) return;

    const targetValue = parseFloat(match[1].replace(/,/g, ''));
    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const startTime = performance.now();
    const hasDecimal = text.includes('.');
    const hasComma = text.includes(',');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = targetValue * easeProgress;

      let displayValue;
      if (hasDecimal) {
        displayValue = currentValue.toFixed(1);
      } else {
        displayValue = Math.round(currentValue);
        if (hasComma && displayValue >= 1000) {
          displayValue = displayValue.toLocaleString();
        }
      }

      element.textContent = displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ===================
  // Form Handling
  // ===================
  function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = `
          <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="30 70" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          Sending...
        `;

        // Submit to Formspree
        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(function(response) {
          if (response.ok) {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            contactForm.reset();
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function(error) {
          alert('There was a problem sending your message. Please try again or email us directly.');
          console.error('Form error:', error);
        })
        .finally(function() {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        });
      });

      // Real-time validation feedback
      const inputs = contactForm.querySelectorAll('.form__input, .form__textarea');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          validateInput(input);
        });

        input.addEventListener('input', function() {
          if (input.classList.contains('input--error')) {
            validateInput(input);
          }
        });
      });
    }

    // Newsletter form handling
    const newsletterForms = document.querySelectorAll('form[onsubmit*="Newsletter"]');
    newsletterForms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        const button = form.querySelector('button');

        if (email && email.value) {
          button.textContent = 'Subscribed!';
          button.disabled = true;
          email.value = '';

          setTimeout(function() {
            button.textContent = 'Subscribe';
            button.disabled = false;
          }, 3000);
        }
      });
    });
  }

  function validateInput(input) {
    const isValid = input.checkValidity();

    if (isValid) {
      input.classList.remove('input--error');
      input.classList.add('input--valid');
    } else {
      input.classList.remove('input--valid');
      input.classList.add('input--error');
    }

    return isValid;
  }

  // ===================
  // Smooth Scroll
  // ===================
  function initSmoothScroll() {
    // Handle anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();

          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });

    // Handle page load with hash
    if (window.location.hash) {
      setTimeout(function() {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }

  // ===================
  // Utility Functions
  // ===================

  // Debounce function for scroll handlers
  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const context = this;
      const args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // ===================
  // Modern Accordions
  // ===================
  function initAccordions() {
    const accordions = document.querySelectorAll('.modern-accordion__trigger');

    accordions.forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const content = document.getElementById(this.getAttribute('aria-controls'));

        // Toggle aria-expanded
        this.setAttribute('aria-expanded', !isExpanded);

        // Toggle content visibility with smooth animation
        if (content) {
          content.setAttribute('aria-hidden', isExpanded);

          if (!isExpanded) {
            // Opening: set max-height to content height for smooth animation
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            // Closing: animate back to 0
            content.style.maxHeight = '0px';
          }
        }
      });

      // Handle keyboard navigation
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // ===================
  // Global Functions
  // ===================

  // Reset form (used by contact page)
  window.resetForm = function() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');

    if (form && success) {
      form.reset();
      form.style.display = 'flex';
      success.style.display = 'none';
    }
  };

})();
