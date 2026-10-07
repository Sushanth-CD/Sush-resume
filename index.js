/* ==========================================================
   index.js — Navigation Drawer, ScrollSpy & Interactive Chat
   ========================================================== */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. Mobile Drawer Navigation & Backdrop
     ---------------------------------------------------------- */
  const sidebar = document.getElementById('sidebar-nav');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  const navLinks = document.querySelectorAll('.pro-sidebar .nav-link, .sidebar-menu .nav-link');

  function openMenu() {
    sidebar?.classList.add('is-open');
    toggleBtn?.classList.add('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    backdrop?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar?.classList.remove('is-open');
    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    backdrop?.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop?.addEventListener('click', closeMenu);

  // Close menu with Escape key for keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('is-open')) {
      closeMenu();
      toggleBtn?.focus();
    }
  });

  // Close mobile drawer when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeMenu();
      }
    });
  });

  // Close drawer and restore body scroll if window is resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && sidebar?.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ----------------------------------------------------------
     2. Active Link Highlight on Scroll (ScrollSpy)
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const navOffset = window.innerWidth < 992 ? 80 : 180;
    const scrollY = window.scrollY + navOffset;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ----------------------------------------------------------
     3. Interactive AI Twin Module (Chat with AI Sushanth)
     ----------------------------------------------------------
     Allows visitors to interact directly with an AI simulation of Sushanth CD.
     Handles message dispatch, dynamic timestamps, simulated typing indicators,
     and provides full documentation for external API (OpenAI/Gemini) integration.
     ---------------------------------------------------------- */
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  const chipButtons = document.querySelectorAll('.chat-chip-btn');
  const chatSendBtn = document.getElementById('chat-send-btn');

  // Simulated Knowledge Base representing the portfolio owner (Sushanth CD)
  const SUSH_KNOWLEDGE_BASE = [
    {
      keywords: ['about', 'who are you', 'yourself', 'background', 'intro', 'bio'],
      reply: "Hello! I'm an AI simulation of Sushanth CD. I'm an undergraduate software engineer specializing in Artificial Intelligence & Machine Learning (AIML). I'm passionate about building production-grade ML pipelines, mastering complex data structures in Java, and engineering responsive web software!"
    },
    {
      keywords: ['churn', 'customer', 'customer churn', 'prediction', 'model'],
      reply: "My Customer Churn Prediction System is an end-to-end Machine Learning pipeline achieving 90.1% accuracy! I performed thorough exploratory data analysis, engineered contract and tenure features, optimized Logistic Regression & Random Forest classifiers with GridSearchCV, and deployed an interactive Streamlit dashboard for real-time risk scoring."
    },
    {
      keywords: ['algo', 'algorithm', 'dsa', 'data structure', 'java', 'tree', 'graph'],
      reply: "I maintain a rigorous focus on Data Structures & Algorithms with 100+ implementations in Java and Python. My Algorithmic Suite includes custom AVL trees, Red-Black trees, graph traversals (Dijkstra, Prim's), and automated Big-O empirical complexity benchmarking suites."
    },
    {
      keywords: ['eda', 'analytics', 'dashboard', 'data science', 'seaborn', 'visual'],
      reply: "My Exploratory Data Science & Analytics Dashboard automates statistical profiling (skewness, kurtosis, VIF), correlation heatmaps, and outlier detection with Pandas and Seaborn, speeding up dataset exploration by up to 10x."
    },
    {
      keywords: ['skill', 'stack', 'tech', 'language', 'tools', 'python', 'libraries'],
      reply: "My core technical stack includes Python, Java, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, Streamlit, Git & GitHub, and VS Code. I focus heavily on machine learning pipelines, system design principles, and asymptotic code optimization."
    },
    {
      keywords: ['testimonial', 'feedback', 'review', 'recommend', 'endorse', 'mentor', 'peer'],
      reply: "I've received generous endorsements from university faculty mentors and engineering peers praising my analytical depth in ML models, clean Git pull-request workflows, and disciplined software craftsmanship. You can read them right in the Testimonials section above!"
    },
    {
      keywords: ['education', 'college', 'btech', 'degree', 'study', 'university'],
      reply: "I'm currently pursuing a Bachelor of Technology (B.Tech) specializing in Artificial Intelligence & Machine Learning (AIML). My coursework covers supervised/unsupervised learning, neural architectures, relational databases, and discrete mathematics."
    },
    {
      keywords: ['goal', 'career', 'aim', 'future', 'role', 'job', 'hire', 'internship'],
      reply: "I'm actively targeting Machine Learning Engineer and Software Developer roles where I can transform complex ML models into scalable, production-ready applications. Feel free to connect if you have an opportunity!"
    },
    {
      keywords: ['contact', 'email', 'reach', 'message', 'touch', 'connect', 'linkedin', 'github'],
      reply: "You can send me a message directly through the Contact form below, or connect with me on GitHub, LinkedIn, and Twitter/X. I respond promptly to collaboration inquiries!"
    }
  ];

  /* ==========================================================================
     OPENAI / EXTERNAL API INTEGRATION INSTRUCTIONS:
     --------------------------------------------------------------------------
     Currently, `getAIResponse()` uses the local simulated knowledge base below.
     To integrate a real LLM API (such as OpenAI's GPT-4o-mini or Gemini):

     STEP 1: Backend API Proxy (Production Security)
       * NEVER put your private OPENAI_API_KEY in client-side frontend code.
       * Set up a lightweight serverless endpoint (e.g., Express, Next.js /api/chat,
         or Cloudflare Worker).
       
       Example Node.js backend handler:
       ```javascript
       app.post('/api/chat', async (req, res) => {
         const { message } = req.body;
         const completion = await fetch('https://api.openai.com/v1/chat/completions', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
           },
           body: JSON.stringify({
             model: 'gpt-4o-mini',
             messages: [
               {
                 role: 'system',
                 content: 'You are an AI twin of Sushanth CD, a Software Engineer & AIML Specialist...'
               },
               { role: 'user', content: message }
             ],
             temperature: 0.7,
             max_tokens: 350
           })
         });
         const data = await completion.json();
         res.json({ reply: data.choices[0].message.content });
       });
       ```

     STEP 2: Client-side Hook
       * In `getAIResponse(userQuery)` below, replace the local lookup with:
       ```javascript
       async function getAIResponse(userQuery) {
         try {
           const res = await fetch('/api/chat', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ message: userQuery })
           });
           const data = await res.json();
           return data.reply;
         } catch (err) {
           console.error('API connection failed, falling back to local KB:', err);
           return generateLocalReply(userQuery); // Graceful fallback
         }
       }
       ```
     ========================================================================== */

  // Local rule-based fallback generator simulating AI Sushanth
  function generateLocalReply(userText) {
    const lower = userText.toLowerCase();

    for (const entry of SUSH_KNOWLEDGE_BASE) {
      if (entry.keywords.some((kw) => lower.includes(kw))) {
        return entry.reply;
      }
    }

    return "Thanks for asking! As an AI version of Sushanth, I specialize in Machine Learning pipelines, Data Structures & Algorithms, and full-stack software development. You can explore my featured projects, read the testimonials, or leave a note via the contact form below!";
  }

  // Appends a new message bubble (User or AI) to the display area
  function appendMessage(senderName, text, isBot = false) {
    if (!chatMessages) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isBot ? 'bot' : 'user'}`;

    const header = document.createElement('div');
    header.className = 'bubble-header';

    const avatar = document.createElement('span');
    avatar.className = 'bubble-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = isBot ? '🤖' : '👤';

    const senderSpan = document.createElement('span');
    senderSpan.className = 'chat-sender';
    senderSpan.textContent = isBot ? 'AI Sushanth' : 'You';

    const timeEl = document.createElement('time');
    timeEl.className = 'message-time';
    timeEl.textContent = timeStr;

    header.appendChild(avatar);
    header.appendChild(senderSpan);
    header.appendChild(timeEl);

    const p = document.createElement('p');
    p.textContent = text;

    bubble.appendChild(header);
    bubble.appendChild(p);
    chatMessages.appendChild(bubble);

    // Smoothly scroll message container to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Simulates sending and receiving a message with typing animation
  function handleUserMessage(text) {
    const query = text.trim();
    if (!query) return;

    // 1. Display visitor's message immediately
    appendMessage('You', query, false);

    // 2. Display typing indicator while simulating AI response delay
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
    }
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 3. Simulated AI response delay (450ms - 750ms)
    // NOTE: If using an external API (OpenAI/Gemini), replace setTimeout with await fetch()
    const simulatedDelay = 550;
    setTimeout(() => {
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }

      const reply = generateLocalReply(query);
      appendMessage('AI Sushanth', reply, true);
    }, simulatedDelay);
  }

  // Handle Form Submission
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!chatInput) return;
    const value = chatInput.value;
    chatInput.value = '';
    handleUserMessage(value);
  });

  // Handle Quick Question Chips
  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        handleUserMessage(query);
      }
    });
  });

  /* ----------------------------------------------------------
     4. Projects Showcase — Thumbnail to Detail View Connection
     ----------------------------------------------------------
     HOW EACH THUMBNAIL CONNECTS TO ITS DETAILED PROJECT VIEW:
     - Each project card contains a clickable thumbnail link (.project-thumb-link)
       and a "Detailed View" button (.btn-detail-trigger).
     - Both elements carry the attribute `data-modal-target="[modal-id]"` (e.g.,
       `data-modal-target="modal-project-churn"`).
     - When clicked, this script extracts the target ID and looks up the matching
       native HTML5 `<dialog id="[modal-id]">` element.
     - The script calls `dialog.showModal()` to open an accessible modal dialog
       with native focus trapping, keyboard Escape handling, and dimmed backdrop.
     - Event listeners on the close buttons and outside backdrop clicks handle
       dismissal and restore document scrolling.
     ---------------------------------------------------------- */
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const projectModals = document.querySelectorAll('dialog.project-detail-modal');

  // Wire each thumbnail and detail button to its respective modal dialog
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      if (!targetId) return;

      const targetModal = document.getElementById(targetId);
      if (targetModal && typeof targetModal.showModal === 'function') {
        targetModal.showModal();
        document.body.style.overflow = 'hidden';

        // Focus the primary close button for keyboard accessibility
        const closeBtn = targetModal.querySelector('.modal-close-btn');
        closeBtn?.focus();
      }
    });
  });

  // Wire modal close buttons, backdrop click dismissal, and scroll restoration
  projectModals.forEach((modal) => {
    // 1. Close button handlers inside the modal header/footer
    const closeButtons = modal.querySelectorAll('.modal-close-btn');
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.close();
      });
    });

    // 2. Click outside modal content (on the native backdrop) to dismiss
    modal.addEventListener('click', (event) => {
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent && !modalContent.contains(event.target)) {
        modal.close();
      }
    });

    // 3. Restore document scroll when modal closes (via close button, backdrop, or Escape key)
    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });

  /* ----------------------------------------------------------
     5. Contact Form Submission & Email Service Integration
     ----------------------------------------------------------
     Handles form validation, submission state, confirmation alerts,
     and provides full documentation for Resend API email integration.
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMessage = document.getElementById('contact-message');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const contactConfirmation = document.getElementById('contact-confirmation-msg');
  const confirmDismissBtn = document.getElementById('confirm-dismiss-btn');

  /* ==========================================================================
     RESEND API (EMAIL-SENDING SERVICE) INTEGRATION ARCHITECTURE:
     --------------------------------------------------------------------------
     To connect this form to Resend (https://resend.com) for real inbox delivery:

     STEP 1: Create a Secure Backend Handler (Node.js / Next.js / Cloudflare / Express)
       * Install the official Resend SDK: `npm install resend`
       * NEVER place your private `RESEND_API_KEY` into client-side code!
       * Create a serverless endpoint, e.g. `/api/send-email`:

       ```javascript
       // Server-side endpoint: POST /api/send-email
       import { Resend } from 'resend';

       const resend = new Resend(process.env.RESEND_API_KEY);

       export default async function handler(req, res) {
         if (req.method !== 'POST') {
           return res.status(405).json({ error: 'Method Not Allowed' });
         }

         const { name, email, message } = req.body;

         if (!name || !email || !message) {
           return res.status(400).json({ error: 'Missing required form fields.' });
         }

         try {
           const response = await resend.emails.send({
             from: 'Portfolio Contact <onboarding@resend.dev>', // or your verified custom domain
             to: ['sushanth.cd@example.com'],                   // Recipient portfolio address
             reply_to: email,                                   // Direct reply to the visitor's email
             subject: `New Portfolio Inquiry from ${name}`,
             html: `
               <h2>New Message from Sushanth CD Portfolio</h2>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
               <hr />
               <p><strong>Message:</strong></p>
               <p style="white-space: pre-wrap;">${message}</p>
             `
           });

           return res.status(200).json({ success: true, data: response });
         } catch (error) {
           console.error('Resend delivery failure:', error);
           return res.status(500).json({ error: error.message || 'Failed to dispatch email' });
         }
       }
       ```

     STEP 2: Client-side Dispatch Hook
       * Inside `handleContactSubmit(e)` below, replace the simulated delay with:
       ```javascript
       const response = await fetch('/api/send-email', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           name: contactName.value.trim(),
           email: contactEmail.value.trim(),
           message: contactMessage.value.trim()
         })
       });
       const data = await response.json();
       if (data.success) {
         // Show confirmation message card!
       }
       ```
     ========================================================================== */

  function handleContactSubmit(e) {
    e.preventDefault();

    const nameVal = contactName?.value.trim() || '';
    const emailVal = contactEmail?.value.trim() || '';
    const messageVal = contactMessage?.value.trim() || '';

    // Basic HTML5 validation safeguard
    if (!nameVal || !emailVal || !messageVal) {
      alert('Please fill out all required fields before sending.');
      return;
    }

    // 1. Indicate loading / sending state on the submit button
    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `
        <span class="btn-text">Sending Message...</span>
        <span class="btn-icon" aria-hidden="true">⏳</span>
      `;
    }

    // 2. Simulate sending network delay (or replace with `await fetch('/api/send-email')`)
    const simulatedNetworkDelay = 650;

    setTimeout(() => {
      // 3. Reset form inputs
      contactForm?.reset();

      // 4. Restore submit button text and state
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = `
          <span class="btn-text">Send Message</span>
          <span class="btn-icon" aria-hidden="true">✉</span>
        `;
      }

      // 5. Display the confirmation message card
      if (contactForm && contactConfirmation) {
        contactForm.style.display = 'none';
        contactConfirmation.style.display = 'flex';
        confirmDismissBtn?.focus();
      }
    }, simulatedNetworkDelay);
  }

  // Bind Form Submission
  contactForm?.addEventListener('submit', handleContactSubmit);

  // Allow visitor to dismiss confirmation and send another message
  confirmDismissBtn?.addEventListener('click', () => {
    if (contactForm && contactConfirmation) {
      contactConfirmation.style.display = 'none';
      contactForm.style.display = 'flex';
      contactName?.focus();
    }
  });

  /* ----------------------------------------------------------
     6. Scroll Reveal Animation System (Progressive Enhancement)
     ----------------------------------------------------------
     Observes cards, containers, and interactive blocks as they enter
     the viewport, smoothly transitioning them into view.
     Adheres to the `prefers-reduced-motion` accessibility standard.
     ---------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealTargets = document.querySelectorAll(`
    .about-avatar-card,
    .about-card-block,
    .skill-card,
    .timeline-card,
    .project-card,
    .testimonial-card,
    .pro-chat-window,
    .contact-info-card,
    .contact-form-wrapper
  `);

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Add staggered delay classes for sibling elements in grids
    const gridParents = document.querySelectorAll('.skills-grid, .projects-grid, .testimonials-grid, .timeline-container');
    gridParents.forEach((parent) => {
      const children = parent.querySelectorAll('.skill-card, .project-card, .testimonial-card, .timeline-card');
      children.forEach((child, idx) => {
        const staggerIndex = (idx % 3) + 1;
        child.classList.add(`reveal-delay-${staggerIndex}`);
      });
    });

    // Mark elements for initial hidden state only when observer is active
    revealTargets.forEach((el) => {
      el.classList.add('reveal-init');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealTargets.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     7. Hero Subtle Mouse Parallax Effect (Desktop Viewports)
     ----------------------------------------------------------
     Calculates cursor displacement over the hero viewport to create
     subtle 3D depth between the portrait and the glowing ambient mesh.
     Automatically disables on touch screens, small viewports (<992px),
     and when `prefers-reduced-motion` is enabled.
     ---------------------------------------------------------- */
  const heroSection = document.getElementById('hero');
  const heroPortrait = heroSection?.querySelector('.hero-portrait');
  const heroMesh = heroSection?.querySelector('.hero-bg-mesh');

  if (heroSection && heroPortrait && !prefersReducedMotion) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHoveringHero = false;
    let rAFId = null;

    function renderParallax() {
      // Smooth linear interpolation (lerp)
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (heroPortrait) {
        // Counter-shift portrait with subtle translation
        heroPortrait.style.transform = `translate3d(${currentX * 14}px, ${currentY * 14}px, 0)`;
      }
      if (heroMesh) {
        // Ambient background mesh translates in reverse direction for depth
        heroMesh.style.transform = `translate3d(${-currentX * 22}px, ${-currentY * 22}px, 0)`;
      }

      // Continue animation loop if hovering or still settling
      if (isHoveringHero || Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
        rAFId = requestAnimationFrame(renderParallax);
      } else {
        rAFId = null;
      }
    }

    heroSection.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 992) return;
      isHoveringHero = true;

      const rect = heroSection.getBoundingClientRect();
      // Normalized coordinates: -0.5 (left/top) to +0.5 (right/bottom)
      mouseX = ((e.clientX - rect.left) / rect.width) - 0.5;
      mouseY = ((e.clientY - rect.top) / rect.height) - 0.5;

      if (!rAFId) {
        rAFId = requestAnimationFrame(renderParallax);
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      isHoveringHero = false;
      mouseX = 0;
      mouseY = 0;
      if (!rAFId) {
        rAFId = requestAnimationFrame(renderParallax);
      }
    });
  }
})();


