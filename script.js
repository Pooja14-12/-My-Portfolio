/**
 * Portfolio JavaScript
 * Handles Night/Light Mode Theme Toggle, Vertical Sidebar Navigation,
 * Scrollspy for 8 sections, Interactive Chat, and Accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Night Mode / Theme Toggle Logic (Dual Toggle Synchronization)
  // --------------------------------------------------------------------------
  const themeToggleBtns = [
    document.getElementById('theme-toggle'),
    document.getElementById('sidebar-theme-toggle')
  ].filter(Boolean);

  const rootElement = document.documentElement;
  const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check stored theme preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  
  if (savedTheme) {
    setTheme(savedTheme, false);
  } else {
    const detectedTheme = themeMediaQuery.matches ? 'dark' : 'light';
    updateThemeAria(detectedTheme);
  }

  // Listen for browser/OS theme changes dynamically
  themeMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      const detectedTheme = e.matches ? 'dark' : 'light';
      updateThemeAria(detectedTheme);
    }
  });

  // Attach click listener to all theme toggles (mobile topbar & vertical sidebar)
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentActiveTheme = rootElement.getAttribute('data-theme') || 
        (themeMediaQuery.matches ? 'dark' : 'light');
      
      const nextTheme = currentActiveTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme, true);
    });
  });

  function setTheme(theme, save = true) {
    rootElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('portfolio-theme', theme);
    }
    updateThemeAria(theme);
  }

  function updateThemeAria(theme) {
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to night mode';
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Vertical Sidebar Mobile Drawer & Accessibility
  // --------------------------------------------------------------------------
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.pixel-sidebar .pixel-nav-link');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar on link click (for smooth mobile navigation)
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // Close sidebar on Escape key press (Accessibility)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
      if (sidebarToggleBtn) sidebarToggleBtn.focus();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Active Nav Link on Scroll (Scrollspy for 8 sections)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.pixel-sidebar-nav a[href="#${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          sidebarLinks.forEach(l => {
            l.classList.remove('active');
            l.removeAttribute('aria-current');
          });
          activeLink.classList.add('active');
          activeLink.setAttribute('aria-current', 'page');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 4. Interactive Chat Section (NPC Dialogue Simulator)
  // --------------------------------------------------------------------------
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatChips = document.getElementById('chat-chips');

  const botResponses = {
    stack: "⚡ Core Skills: Java, Python, ES6+ JavaScript, Semantic HTML5/CSS3, MySQL Relational DB, OOP & Data Structures.",
    availability: "💼 Availability: Actively seeking Software Engineering internships and fresher developer roles starting immediately!",
    education: "🎓 Education: B.E. in Computer Science & Engineering (Data Science) at AIT Chikkamagaluru (CGPA: 8.0).",
    contact: "✉️ Direct Channels: Reach Pooja via email at poojangowda2006@gmail.com or call +91 78997 22288."
  };

  function appendChatMessage(sender, text, isUser = false) {
    if (!chatMessages) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    
    const avatar = isUser ? '👤' : '👾';
    const senderName = isUser ? 'You' : 'PoojaBot';

    msgDiv.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-bubble">
        <span class="msg-sender">${senderName}:</span>
        <p>${text}</p>
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle Quick Chips
  if (chatChips) {
    chatChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.pixel-chip');
      if (!chip) return;
      
      const queryType = chip.getAttribute('data-query');
      const questionText = chip.textContent.trim();
      
      appendChatMessage('You', questionText, true);

      setTimeout(() => {
        const reply = botResponses[queryType] || "I'd love to help! Feel free to drop a message in the contact form below.";
        appendChatMessage('PoojaBot', reply, false);
      }, 400);
    });
  }

  // Handle Custom Input
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      appendChatMessage('You', userText, true);
      chatInput.value = '';

      setTimeout(() => {
        const lower = userText.toLowerCase();
        let reply = "Thanks for your message! You can also connect directly via the Contact form below or email poojangowda2006@gmail.com.";

        if (lower.includes('project') || lower.includes('plant')) {
          reply = "🌱 Featured Project: Smart Plant Monitoring System built with Lovable and responsive frontend tracking.";
        } else if (lower.includes('skill') || lower.includes('java') || lower.includes('python')) {
          reply = "⚡ Pooja excels in Java, Python, JavaScript, MySQL database schema design, and Object-Oriented Programming.";
        } else if (lower.includes('hire') || lower.includes('job') || lower.includes('intern')) {
          reply = "🎯 Pooja is currently open for engineering internships and full-time entry-level software positions!";
        }

        appendChatMessage('PoojaBot', reply, false);
      }, 500);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Dynamic Footer Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 6. Contact Form Submission Feedback
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Message Sent! ✓</span>';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 3000);
    });
  }

  // --------------------------------------------------------------------------
  // 7. Skills Category Filter Tabs
  // Clicking a .pixel-tab-btn updates aria-selected + .active class and
  // shows / hides .skill-inventory-card elements by their data-category attr.
  // --------------------------------------------------------------------------
  const tabBtns  = document.querySelectorAll('.pixel-tab-btn');
  const skillCards = document.querySelectorAll('.skill-inventory-card');

  if (tabBtns.length && skillCards.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // 1. Update tab state
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        // 2. Show / hide cards — toggle is-hidden class
        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          const shouldShow = (filter === 'all') || (category === filter);
          if (shouldShow) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Project Detail Modal
  // projectData maps each data-project-id to its full detail content.
  // openProjectModal(id) fills the shared modal with the matching data
  // and adds .is-open to show it. closeProjectModal() removes it.
  // Both are attached to window so HTML onclick attributes can call them.
  // --------------------------------------------------------------------------
  const projectData = {

    // ── Plant Monitoring System ────────────────────────────────────────────
    plant: {
      icon: '🌱',
      title: 'Smart Plant Monitoring System',
      type: 'Frontend / IoT Concept',
      year: '2025',
      github: 'https://github.com/Pooja14-12',
      description: `An intelligent plant care tracking web application that enables users to monitor soil moisture levels, schedule watering reminders, and receive personalized sunlight recommendations — all through a clean, interactive, and fully responsive user interface built with Lovable.`,
      features: [
        'Real-time soil moisture indicator dashboard',
        'Automated watering schedule calendar with reminders',
        'Sunlight and temperature recommendations per plant type',
        'Mobile-first responsive layout with intuitive UX',
        'IoT sensor data simulation for demonstration',
      ],
      tech: ['Lovable', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Responsive Design', 'IoT Concept'],
    },

    // ── Student Academic Record System ─────────────────────────────────────
    student: {
      icon: '📊',
      title: 'Student Academic Record System',
      type: 'Backend / Database',
      year: '2025',
      github: 'https://github.com/Pooja14-12',
      description: `A robust student record and academic performance management system built with Java and MySQL. Applies object-oriented design principles including encapsulation, inheritance, and polymorphism to model students, courses, and grade entities in a clean layered architecture.`,
      features: [
        'Full CRUD operations for student, course, and enrollment records',
        'GPA and CGPA computation engine using weighted grade logic',
        'Normalized MySQL schema (3NF) for data integrity',
        'OOP class hierarchy: Student → Undergraduate / Postgraduate',
        'Command-line interface for admin and academic staff',
      ],
      tech: ['Java', 'MySQL', 'JDBC', 'OOP Design', 'CRUD', 'DB Normalization'],
    },

    // ── Data Insight & Analytics Tool ─────────────────────────────────────
    analytics: {
      icon: '📈',
      title: 'Data Insight & Analytics Tool',
      type: 'Data Science / Python',
      year: '2025',
      github: 'https://github.com/Pooja14-12',
      description: `A Python-based data exploration and analysis suite that processes raw CSV datasets, performs automated data cleansing (null handling, duplicate removal, type coercion), computes descriptive statistical summaries, and generates intuitive visual reports to support data-driven decision-making.`,
      features: [
        'Automated dataset ingestion and null/duplicate handling',
        'Descriptive statistics: mean, median, mode, std dev, skewness',
        'Correlation heatmap and distribution histogram generation',
        'Outlier detection using IQR and Z-score methods',
        'Exportable summary reports in CSV and visual PNG formats',
      ],
      tech: ['Python 3', 'Pandas', 'NumPy', 'Matplotlib', 'Data Cleansing', 'Statistical Analysis'],
    },

    // ── Developer Portfolio Website ────────────────────────────────────────
    portfolio: {
      icon: '🎮',
      title: 'Developer Portfolio Website',
      type: 'Frontend / Full Design System',
      year: '2026',
      github: 'https://github.com/Pooja14-12',
      description: `This very portfolio website — fully designed and built from scratch without any CSS frameworks. Features a consistent pixel art retro aesthetic with chunky borders, 3D offset drop-shadows, and retro typography. Dark/Light mode auto-detected from the OS and togglable manually. Includes a skills inventory HUD, quest-log timeline, NPC chat terminal, and project modal gallery.`,
      features: [
        'Pixel art design system with CSS custom properties and tokens',
        'OS-detected and user-togglable Dark / Light theme',
        'Left fixed sidebar navigation with scrollspy and mobile drawer',
        'Skills section with category tabs and animated progress bars',
        'Quest-log timeline with dashed spine rail and icon nodes',
        'Interactive NPC chat with predefined bot responses',
        'Project gallery with modal detail overlays',
        'Contact form with accessible validation feedback',
      ],
      tech: ['Semantic HTML5', 'Vanilla CSS3', 'JavaScript (ES6+)', 'CSS Grid & Flexbox', 'IntersectionObserver', 'Pixel Art UI'],
    },
  };

  // Build and open the modal for a given project id
  window.openProjectModal = function (id) {
    const data = projectData[id];
    if (!data) return;

    const modal    = document.getElementById('project-modal');
    const iconEl   = document.getElementById('modal-icon');
    const titleEl  = document.getElementById('modal-title');
    const bodyEl   = document.getElementById('proj-modal-body');

    if (!modal || !iconEl || !titleEl || !bodyEl) return;

    // Populate topbar
    iconEl.textContent  = data.icon;
    titleEl.textContent = data.title;

    // Build modal body HTML
    const featuresHTML = data.features
      .map(f => `<li><span class="tl-bullet-icon" aria-hidden="true">▶</span>${f}</li>`)
      .join('');

    const tagsHTML = data.tech
      .map(t => `<span class="tl-tech-tag">${t}</span>`)
      .join('');

    bodyEl.innerHTML = `
      <div class="modal-meta-row">
        <span class="tl-event-chip chip-project" style="font-size:0.55rem">${data.type}</span>
        <span class="tl-date-badge">${data.year}</span>
      </div>
      <p class="tl-desc" style="margin-top:1rem">${data.description}</p>
      <div class="modal-section-head">Key Features</div>
      <ul class="tl-bullets modal-feature-list">${featuresHTML}</ul>
      <div class="modal-section-head">Tech Stack</div>
      <div class="tl-tech-tags">${tagsHTML}</div>
      <div class="modal-footer-actions">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer"
           class="proj-btn proj-btn-github" style="text-decoration:none">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          View on GitHub
        </a>
        <button type="button" class="proj-btn proj-btn-detail" onclick="closeProjectModal()">Close</button>
      </div>
    `;

    // Show the modal
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    const closeBtn = modal.querySelector('.proj-modal-close-btn');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 80);
  };

  // Close the modal and restore scroll
  window.closeProjectModal = function () {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('project-modal');
      if (modal && modal.classList.contains('is-open')) {
        closeProjectModal();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 8. Animate Skill Progress Bars on Scroll (IntersectionObserver)
  // Bars start at width:0 and grow to their target width once visible.
  // --------------------------------------------------------------------------
  const barFills = document.querySelectorAll('.pixel-skill-bar-fill');

  if (barFills.length && 'IntersectionObserver' in window) {
    // Cache target widths and zero them out initially
    barFills.forEach(fill => {
      fill.dataset.targetWidth = fill.style.width || '0%';
      fill.style.width = '0%';
    });

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          // Slight delay so all bars in the card animate together
          setTimeout(() => {
            fill.style.width = fill.dataset.targetWidth;
          }, 120);
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    barFills.forEach(fill => barObserver.observe(fill));
  }
});
