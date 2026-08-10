/* app.js - Portfolio UI Interactions, Filtering, Modals, Counters & Theme Management */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  initThemeToggle();
  initMobileDrawer();
  initCounterObserver();
  initProjectFilters();
  initProjectModals();
  initScrollSpy();
  initContactForms();
});

// 1. Theme Management (Dark / Light)
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('kk_portfolio_theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    updateThemeIcons(true);
  } else {
    document.documentElement.classList.remove('light-mode');
    updateThemeIcons(false);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem('kk_portfolio_theme', isLight ? 'light' : 'dark');
      updateThemeIcons(isLight);
    });
  });
}

function updateThemeIcons(isLight) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  const labels = document.querySelectorAll('.theme-toggle-label');

  icons.forEach(icon => {
    if (isLight) {
      icon.className = 'fas fa-sun text-amber-400 theme-toggle-icon';
    } else {
      icon.className = 'fas fa-moon text-cyan-400 theme-toggle-icon';
    }
  });

  labels.forEach(label => {
    label.textContent = isLight ? 'Light' : 'Dark';
  });
}

// 2. Mobile Drawer Navigation (Right Side)
function initMobileDrawer() {
  const menuOpenBtn = document.getElementById('mobileMenuOpen');
  const menuCloseBtn = document.getElementById('mobileMenuClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.remove('translate-x-full');
    drawerBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.add('translate-x-full');
    drawerBackdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 3. Counter Animation on Scroll
function initCounterObserver() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalVal = parseInt(target.getAttribute('data-target') || '0', 10);
        animateValue(target, 0, finalVal, 1500);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerHTML = end;
    }
  };
  window.requestAnimationFrame(step);
}

// 4. Project Filtering
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-semibold', 'shadow-lg');
        b.classList.add('bg-slate-800/80', 'text-slate-300', 'hover:bg-slate-700');
      });

      btn.classList.remove('bg-slate-800/80', 'text-slate-300', 'hover:bg-slate-700');
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-semibold', 'shadow-lg');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'block';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 5. Detailed Project Case Study Modals
const projectDataDetails = {
  p1: {
    title: 'Executive Business Intelligence Dashboard',
    category: 'Business Intelligence & SQL',
    tools: ['Power BI', 'SQL', 'Excel', 'Power Query', 'DAX'],
    problem: 'Executive leadership lacked real-time visibility into cross-departmental sales performance, delayed monthly revenue reporting by 12 days, and struggled with disparate data silos.',
    approach: 'Designed a unified star-schema data warehouse in SQL Server, built automated Power Query ETL pipelines, and developed high-impact executive Power BI dashboards with dynamic RLS security.',
    process: [
      'Engineered normalized database tables and dimensional models.',
      'Constructed complex DAX measures for YoY growth and trailing 12-month revenue.',
      'Configured automated daily incremental data refreshes.'
    ],
    insights: 'Identified a 23% underperforming customer segment and high-margin product bundling opportunities previously hidden in static spreadsheets.',
    results: [
      'Reduced monthly executive reporting cycle from 12 days to real-time (instant updates).',
      'Boosted gross profit margin visibility across 5 key geographic territories.'
    ],
    takeaways: 'Automated BI pipelines drastically reduce decision bottlenecks and align cross-functional teams around single-source-of-truth KPIs.'
  },
  p2: {
    title: 'Customer Behavior & Segmentation Analysis',
    category: 'Python & Data Analytics',
    tools: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'SQL'],
    problem: 'E-commerce platform experienced rising customer churn (4.2% monthly) and lacked actionable customer lifecycle grouping for targeted marketing campaigns.',
    approach: 'Executed RFM (Recency, Frequency, Monetary) analytics and K-Means clustering algorithm in Python to segment 50,000+ customer records into distinct actionable personas.',
    process: [
      'Cleaned raw transactional data, handling outliers and missing fields.',
      'Computed RFM scores and validated cluster counts using Silhouette analysis.',
      'Built automated Seaborn visualization plots for stakeholder presentation.'
    ],
    insights: 'Top 15% VIP customers contributed 62% of net revenue, while 20% of mid-tier customers were on the verge of slipping away due to lack of re-engagement.',
    results: [
      'Tailored re-engagement campaign reduced churn by 18% within 90 days.',
      'Increased VIP repeat purchase frequency by 2.4x.'
    ],
    takeaways: 'Statistical clustering enables data-backed marketing personalization that directly protects customer lifetime value.'
  },
  p3: {
    title: 'Sales Performance Analytics',
    category: 'SQL & Power BI',
    tools: ['SQL', 'Power BI', 'Excel', 'DAX'],
    problem: 'Sales management suffered from manual daily Excel aggregation, resulting in inconsistent KPI definitions and poor tracking of sales representative quotas.',
    approach: 'Created robust SQL stored procedures for daily transaction aggregation and built an interactive Power BI sales rep leaderboard with target vs. actual variance analysis.',
    process: [
      'Standardized sales performance KPIs across all regional branches.',
      'Formulated time-intelligence DAX functions for dynamic fiscal period comparisons.',
      'Published interactive dashboards to Power BI Service with automated alert triggers.'
    ],
    insights: 'Discovered that sales cycle duration was 40% shorter when technical pre-sales specialists were brought into negotiations during week 2.',
    results: [
      'Saved 15+ hours per week of manual reporting for regional sales managers.',
      'Improved sales quota attainment rate by 14.5% overall.'
    ],
    takeaways: 'Clear KPI visualization and transparent leaderboard analytics drive healthy sales accountability and operational efficiency.'
  },
  p4: {
    title: 'Automated Data Cleaning & ETL Pipeline',
    category: 'Python Data Engineering',
    tools: ['Python', 'Pandas', 'SQL', 'Power Query', 'APIs'],
    problem: 'Raw data coming from 4 different SaaS vendors contained inconsistencies, missing values, duplicate entries, and mismatched date formatting, causing frequent dashboard errors.',
    approach: 'Developed an automated Python ETL script utilizing Pandas and SQL staging tables to systematically validate, sanitize, and normalize multi-source feeds before database insertion.',
    process: [
      'Implemented automated regex validation for email and phone numbers.',
      'Created deduplication algorithms and automated missing-value imputation.',
      'Added logging mechanisms to alert data engineers on schema mismatches.'
    ],
    insights: 'Over 12% of incoming records suffered from formatting errors that previously corrupted downstream BI metrics.',
    results: [
      'Achieved 99.95% data cleanliness rate before analytical ingestion.',
      'Eliminated manual spreadsheet reconciliation completely.'
    ],
    takeaways: 'Automated data validation at the ingestion layer is the foundational bedrock of reliable business intelligence.'
  },
  p5: {
    title: 'Academic Data Analysis & Visualization',
    category: 'Academic Research & Data Science',
    tools: ['Python', 'Jupyter', 'Pandas', 'Matplotlib', 'Statsmodels', 'Academic'],
    problem: 'Academic study analyzing multivariate socio-economic factors influencing regional technology adoption rates across diverse demographics.',
    approach: 'Performed exploratory data analysis, correlation matrices, and multivariate linear regression modeling on public datasets to evaluate hypotheses.',
    process: [
      'Formulated statistical hypothesis tests (p-value, t-test, ANOVA).',
      'Visualized feature importance and residuals using Matplotlib & Seaborn.',
      'Authored comprehensive research report and technical presentation deck.'
    ],
    insights: 'Infrastructure accessibility and foundational digital literacy accounted for over 74% of variance in technology adoption metrics.',
    results: [
      'Presented findings at technical academic symposium with high distinction.',
      'Created reproducible Jupyter Notebook workflow shared with research department.'
    ],
    takeaways: 'Rigorous statistical methodology ensures data insights are scientifically robust and actionable.'
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const modalContent = document.getElementById('modalContentArea');

  if (!modal || !modalContent) return;

  const viewBtns = document.querySelectorAll('.view-project-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pid = btn.getAttribute('data-project');
      const p = projectDataDetails[pid];
      if (!p) return;

      modalContent.innerHTML = `
        <div class="space-y-6">
          <!-- Header -->
          <div class="border-b border-slate-800 pb-4">
            <span class="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
              ${p.category}
            </span>
            <h3 class="text-2xl font-bold text-slate-100">${p.title}</h3>
            <div class="flex flex-wrap gap-2 mt-3">
              ${p.tools.map(t => `<span class="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-md border border-slate-700">${t}</span>`).join('')}
            </div>
          </div>

          <!-- Problem & Approach -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h4 class="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <i class="fas fa-exclamation-triangle"></i> The Problem
              </h4>
              <p class="text-slate-300 text-sm leading-relaxed">${p.problem}</p>
            </div>
            <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h4 class="text-sm font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <i class="fas fa-lightbulb"></i> The Approach
              </h4>
              <p class="text-slate-300 text-sm leading-relaxed">${p.approach}</p>
            </div>
          </div>

          <!-- Process -->
          <div>
            <h4 class="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">Implementation Steps</h4>
            <ul class="space-y-2 text-sm text-slate-300">
              ${p.process.map(step => `
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-emerald-400 mt-1"></i>
                  <span>${step}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Insights & Results -->
          <div class="bg-cyan-950/30 border border-cyan-500/20 p-4 rounded-xl">
            <h4 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="fas fa-chart-line"></i> Key Results & Business Value
            </h4>
            <p class="text-slate-300 text-sm mb-3"><strong>Key Insight:</strong> ${p.insights}</p>
            <ul class="space-y-1.5 text-sm text-slate-300">
              ${p.results.map(r => `
                <li class="flex items-center gap-2 font-mono text-cyan-300">
                  <i class="fas fa-arrow-right text-cyan-400 text-xs"></i>
                  <span>${r}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Key Takeaways -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Key Takeaway</h4>
            <p class="text-slate-300 text-sm italic">"${p.takeaways}"</p>
          </div>
        </div>
      `;

      modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }
}

// 6. ScrollSpy Nav Highlighting
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-400', 'font-bold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-cyan-400', 'font-bold');
      }
    });
  });
}

// 7. Contact Form Submission Toast
function initContactForms() {
  const forms = document.querySelectorAll('.contact-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Send Message';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
      }

      setTimeout(() => {
        alert('Thank you for reaching out, Kavish Koradia will get back to you shortly!');
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }, 1200);
    });
  });
}
