/* dashboards.js - Live Interactive BI Dashboard Rendering with Chart.js */

document.addEventListener('DOMContentLoaded', () => {
  initHeroMiniChart();
  initDashboardShowcase();
});

// 1. Hero Mini Chart Animation
function initHeroMiniChart() {
  const ctx = document.getElementById('heroMiniChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue Trend ($K)',
        data: [42, 58, 65, 78, 89, 105],
        borderColor: '#38bdf8',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const bg = context.chart.ctx.createLinearGradient(0, 0, 0, 150);
          bg.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
          bg.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
          return bg;
        },
        pointRadius: 3,
        pointBackgroundColor: '#38bdf8'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// 2. Interactive Dashboard Showcase (4 Domain Tabs)
let showcaseChart1 = null;
let showcaseChart2 = null;

const dashboardData = {
  sales: {
    chart1: {
      type: 'line',
      title: 'Quarterly Revenue & Profitability ($M)',
      labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
      datasets: [
        { label: 'Revenue ($M)', data: [1.2, 1.5, 1.8, 2.4, 2.7, 3.2], borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', fill: true, tension: 0.4 },
        { label: 'Profit ($M)', data: [0.35, 0.48, 0.62, 0.85, 0.98, 1.15], borderColor: '#818cf8', backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 }
      ]
    },
    chart2: {
      type: 'bar',
      title: 'Regional Revenue Contribution',
      labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
      datasets: [{ label: 'Sales ($K)', data: [850, 620, 940, 310, 480], backgroundColor: ['#38bdf8', '#818cf8', '#34d399', '#f59e0b', '#ec4899'], borderRadius: 6 }]
    },
    kpis: [
      { title: 'Total Revenue', value: '$3.2M', growth: '+28.4% YoY', icon: 'fa-dollar-sign', color: 'text-cyan-400' },
      { title: 'Gross Profit Margin', value: '35.9%', growth: '+4.2%', icon: 'fa-chart-line', color: 'text-violet-400' },
      { title: 'Avg Order Value', value: '$348', growth: '+12.1%', icon: 'fa-shopping-bag', color: 'text-emerald-400' },
      { title: 'Active Accounts', value: '4,820', growth: '+18.5%', icon: 'fa-users', color: 'text-amber-400' }
    ]
  },
  customer: {
    chart1: {
      type: 'doughnut',
      title: 'Customer Segmentation Distribution',
      labels: ['Enterprise VIP', 'Mid-Market', 'SMB Scale', 'Churn Risk', 'New Trial'],
      datasets: [{ label: 'Users', data: [35, 25, 20, 10, 10], backgroundColor: ['#38bdf8', '#818cf8', '#34d399', '#f43f5e', '#fbbf24'] }]
    },
    chart2: {
      type: 'bar',
      title: 'Monthly Retention Rate (%)',
      labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
      datasets: [{ label: 'Retention %', data: [100, 88, 82, 79, 76, 74], backgroundColor: '#34d399', borderRadius: 6 }]
    },
    kpis: [
      { title: 'Customer LTV', value: '$12,450', growth: '+15.2%', icon: 'fa-user-check', color: 'text-cyan-400' },
      { title: 'Monthly Churn', value: '1.4%', growth: '-0.6% MoM', icon: 'fa-user-minus', color: 'text-rose-400' },
      { title: 'NPS Score', value: '68 / 100', growth: '+5 pts', icon: 'fa-smile', color: 'text-emerald-400' },
      { title: 'Repeat Purchase Rate', value: '64.8%', growth: '+8.3%', icon: 'fa-sync-alt', color: 'text-violet-400' }
    ]
  },
  financial: {
    chart1: {
      type: 'line',
      title: 'Operating Cash Flow vs Expenses ($K)',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Operating Cash Flow', data: [450, 490, 520, 610, 680, 750], borderColor: '#34d399', tension: 0.3 },
        { label: 'OpEx', data: [310, 320, 315, 340, 350, 360], borderColor: '#f43f5e', borderDash: [5, 5], tension: 0.3 }
      ]
    },
    chart2: {
      type: 'doughnut',
      title: 'Cost Structure Breakdown',
      labels: ['R&D / Product', 'Sales & Marketing', 'Operations', 'G&A', 'Infrastructure'],
      datasets: [{ label: 'Cost %', data: [38, 28, 16, 10, 8], backgroundColor: ['#818cf8', '#38bdf8', '#fbbf24', '#a855f7', '#64748b'] }]
    },
    kpis: [
      { title: 'EBITDA Margin', value: '28.4%', growth: '+3.8%', icon: 'fa-wallet', color: 'text-emerald-400' },
      { title: 'CAC Payback', value: '5.2 Mo', growth: '-1.1 Mo', icon: 'fa-clock', color: 'text-cyan-400' },
      { title: 'Burn Multiple', value: '0.82x', growth: 'Optimal', icon: 'fa-fire', color: 'text-amber-400' },
      { title: 'ARR Growth', value: '$8.4M', growth: '+34% YoY', icon: 'fa-chart-pie', color: 'text-violet-400' }
    ]
  },
  operations: {
    chart1: {
      type: 'bar',
      title: 'Fulfillment & SLA Compliance Accuracy (%)',
      labels: ['Warehouse A', 'Warehouse B', 'Hub West', 'Hub East', 'Central DC'],
      datasets: [{ label: 'SLA Met %', data: [99.2, 97.8, 98.5, 96.4, 99.7], backgroundColor: '#38bdf8', borderRadius: 6 }]
    },
    chart2: {
      type: 'line',
      title: 'Average Order Processing Time (Hours)',
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      datasets: [{ label: 'Processing Time (hrs)', data: [6.4, 5.8, 4.9, 4.2, 3.8, 3.1], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', fill: true, tension: 0.4 }]
    },
    kpis: [
      { title: 'ETL Pipeline Uptime', value: '99.98%', growth: 'Zero Faults', icon: 'fa-server', color: 'text-emerald-400' },
      { title: 'Avg Order Cycle', value: '3.1 Hours', growth: '-51% Reduction', icon: 'fa-bolt', color: 'text-amber-400' },
      { title: 'Data Accuracy Rate', value: '99.95%', growth: '+0.12%', icon: 'fa-check-double', color: 'text-cyan-400' },
      { title: 'Inventory Turn Rate', value: '8.4x', growth: '+1.2x', icon: 'fa-boxes', color: 'text-violet-400' }
    ]
  }
};

function initDashboardShowcase() {
  const chart1Ctx = document.getElementById('showcaseChart1');
  const chart2Ctx = document.getElementById('showcaseChart2');
  if (!chart1Ctx || !chart2Ctx) return;

  // Render initial 'sales' tab
  renderDomainDashboard('sales');

  // Add click listeners to tab buttons
  const tabBtns = document.querySelectorAll('.dashboard-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active', 'border-cyan-400', 'text-cyan-400', 'bg-slate-800/80'));
      btn.classList.add('active', 'border-cyan-400', 'text-cyan-400', 'bg-slate-800/80');

      const domain = btn.getAttribute('data-domain');
      renderDomainDashboard(domain);
    });
  });
}

function renderDomainDashboard(domain) {
  const domainInfo = dashboardData[domain] || dashboardData.sales;

  // Update KPIs
  const kpiContainer = document.getElementById('dashboardKPIsContainer');
  if (kpiContainer) {
    kpiContainer.innerHTML = domainInfo.kpis.map(kpi => `
      <div class="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">${kpi.title}</p>
          <h4 class="text-xl font-bold text-slate-100 mt-1 font-mono">${kpi.value}</h4>
          <span class="text-xs font-semibold ${kpi.growth.includes('+') || kpi.growth.includes('Optimal') || kpi.growth.includes('Zero') ? 'text-emerald-400' : 'text-cyan-400'}">${kpi.growth}</span>
        </div>
        <div class="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center ${kpi.color}">
          <i class="fas ${kpi.icon} text-lg"></i>
        </div>
      </div>
    `).join('');
  }

  // Update Chart 1 Title
  const title1 = document.getElementById('chart1Title');
  if (title1) title1.textContent = domainInfo.chart1.title;

  // Update Chart 2 Title
  const title2 = document.getElementById('chart2Title');
  if (title2) title2.textContent = domainInfo.chart2.title;

  // Destroy old charts
  if (showcaseChart1) showcaseChart1.destroy();
  if (showcaseChart2) showcaseChart2.destroy();

  const ctx1 = document.getElementById('showcaseChart1');
  const ctx2 = document.getElementById('showcaseChart2');

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 } } },
      tooltip: { cornerRadius: 8, padding: 10 }
    },
    scales: {
      x: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  showcaseChart1 = new Chart(ctx1, {
    type: domainInfo.chart1.type,
    data: { labels: domainInfo.chart1.labels, datasets: domainInfo.chart1.datasets },
    options: domainInfo.chart1.type === 'doughnut' ? { responsive: true, maintainAspectRatio: false, plugins: commonOptions.plugins } : commonOptions
  });

  showcaseChart2 = new Chart(ctx2, {
    type: domainInfo.chart2.type,
    data: { labels: domainInfo.chart2.labels, datasets: domainInfo.chart2.datasets },
    options: domainInfo.chart2.type === 'doughnut' ? { responsive: true, maintainAspectRatio: false, plugins: commonOptions.plugins } : commonOptions
  });
}
