// Pause ambient animations when tab is not visible (saves battery, feels pro)
document.addEventListener("visibilitychange", () => {
  const paused = document.hidden;
  document.documentElement.style.setProperty(
    "--anim-play",
    paused ? "paused" : "running"
  );
});

// Premium Visitor Counter
class VisitorAnalytics {
  constructor() {
    this.storageKey = 'imamah_analytics';
    this.initializeAnalytics();
    this.setupModal();
    this.updateDisplay();
  }

  initializeAnalytics() {
    const data = this.getAnalyticsData();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Initialize if first visit
    if (!data.firstVisit) {
      data.firstVisit = now;
      data.totalVisits = 0;
      data.dailyVisits = {};
      data.weeklyVisits = {};
      data.monthlyVisits = {};
    }

    // Track current visit
    data.totalVisits++;
    data.lastVisit = now;

    // Track daily visits
    if (!data.dailyVisits[today]) {
      data.dailyVisits[today] = 0;
    }
    data.dailyVisits[today]++;

    // Track weekly visits (current week)
    const weekStart = this.getWeekStart(now);
    if (!data.weeklyVisits[weekStart]) {
      data.weeklyVisits[weekStart] = 0;
    }
    data.weeklyVisits[weekStart]++;

    // Track monthly visits
    const monthStart = this.getMonthStart(now);
    if (!data.monthlyVisits[monthStart]) {
      data.monthlyVisits[monthStart] = 0;
    }
    data.monthlyVisits[monthStart]++;

    this.saveAnalyticsData(data);
  }

  getAnalyticsData() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveAnalyticsData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
  }

  getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  }

  getTodayVisits() {
    const data = this.getAnalyticsData();
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
    return data.dailyVisits[today] || 0;
  }

  getWeekVisits() {
    const data = this.getAnalyticsData();
    const weekStart = this.getWeekStart(new Date());
    return data.weeklyVisits[weekStart] || 0;
  }

  getMonthVisits() {
    const data = this.getAnalyticsData();
    const monthStart = this.getMonthStart(new Date());
    return data.monthlyVisits[monthStart] || 0;
  }

  getTotalVisits() {
    const data = this.getAnalyticsData();
    return data.totalVisits || 0;
  }

  updateDisplay() {
    // Update modal stats only
    const totalEl = document.getElementById('totalVisitors');

    if (totalEl) totalEl.textContent = this.getTotalVisits().toLocaleString();
  }

  setupModal() {
    const counter = document.getElementById('visitorCounter');
    const modal = document.getElementById('visitorModal');
    const closeBtn = document.getElementById('modalClose');
    const backdrop = document.getElementById('modalBackdrop');

    // Open modal
    if (counter) {
      counter.addEventListener('click', () => this.openModal());
      counter.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openModal();
        }
      });
    }

    // Close modal
    const closeModal = () => this.closeModal();
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  openModal() {
    const modal = document.getElementById('visitorModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Update stats when opening modal
      this.updateDisplay();
    }
  }

  closeModal() {
    const modal = document.getElementById('visitorModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Initialize visitor analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new VisitorAnalytics();
});
