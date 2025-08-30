class ChartManager {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#2563eb',
            secondary: '#0891b2',
            success: '#059669',
            warning: '#d97706',
            danger: '#dc2626',
            light: '#f1f5f9',
            dark: '#1e293b'
        };
        this.init();
    }

    init() {
        this.loadChartJS();
    }

    loadChartJS() {
        // Load Chart.js from CDN if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                this.setupCharts();
            };
            document.head.appendChild(script);
        } else {
            this.setupCharts();
        }
    }

    setupCharts() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createCharts();
            });
        } else {
            this.createCharts();
        }
    }

    createCharts() {
        this.createPatientStatsChart();
        this.createCancerTypeChart();
        this.createMonthlyTrendsChart();
        this.createRecoveryRateChart();
    }

    createPatientStatsChart() {
        const ctx = document.getElementById('patientStatsChart');
        if (!ctx) return;

        const stats = dataManager.getDashboardStats();
        
        this.charts.patientStats = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Patients', 'Critical Cases', 'Recovery Rate'],
                datasets: [{
                    data: [stats.totalPatients, stats.criticalCases, stats.recoveryRate],
                    backgroundColor: [
                        this.chartColors.primary,
                        this.chartColors.danger,
                        this.chartColors.success
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                }
            }
        });
    }

    createCancerTypeChart() {
        const ctx = document.getElementById('cancerTypeChart');
        if (!ctx) return;

        const reports = dataManager.getReports();
        const cancerTypes = this.getCancerTypeDistribution(reports);

        this.charts.cancerType = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(cancerTypes),
                datasets: [{
                    label: 'Number of Cases',
                    data: Object.values(cancerTypes),
                    backgroundColor: this.chartColors.primary,
                    borderColor: this.chartColors.secondary,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Cases: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createMonthlyTrendsChart() {
        const ctx = document.getElementById('monthlyTrendsChart');
        if (!ctx) return;

        const reports = dataManager.getReports();
        const monthlyData = this.getMonthlyTrends(reports);

        this.charts.monthlyTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'New Cases',
                    data: monthlyData.data,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.hexToRgba(this.chartColors.primary, 0.1),
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.chartColors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `New Cases: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createRecoveryRateChart() {
        const ctx = document.getElementById('recoveryRateChart');
        if (!ctx) return;

        const stats = dataManager.getDashboardStats();
        const recoveryRate = stats.recoveryRate;
        const remainingRate = 100 - recoveryRate;

        this.charts.recoveryRate = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Recovery Rate', 'Remaining'],
                datasets: [{
                    data: [recoveryRate, remainingRate],
                    backgroundColor: [
                        this.chartColors.success,
                        this.chartColors.light
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });

        // Add center text
        const centerText = document.createElement('div');
        centerText.className = 'chart-center-text';
        centerText.innerHTML = `
            <div class="recovery-rate-display">
                <span class="rate-number">${recoveryRate}%</span>
                <span class="rate-label">Recovery Rate</span>
            </div>
        `;
        ctx.parentElement.style.position = 'relative';
        ctx.parentElement.appendChild(centerText);
    }

    getCancerTypeDistribution(reports) {
        const distribution = {};
        reports.forEach(report => {
            const type = report.cancerType || 'Unknown';
            distribution[type] = (distribution[type] || 0) + 1;
        });
        return distribution;
    }

    getMonthlyTrends(reports) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = new Array(12).fill(0);

        reports.forEach(report => {
            const date = new Date(report.uploadDate);
            const month = date.getMonth();
            monthlyCounts[month]++;
        });

        return {
            labels: months,
            data: monthlyCounts
        };
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    updateCharts() {
        // Update all charts with fresh data
        if (this.charts.patientStats) {
            const stats = dataManager.getDashboardStats();
            this.charts.patientStats.data.datasets[0].data = [
                stats.totalPatients, 
                stats.criticalCases, 
                stats.recoveryRate
            ];
            this.charts.patientStats.update();
        }

        if (this.charts.cancerType) {
            const reports = dataManager.getReports();
            const cancerTypes = this.getCancerTypeDistribution(reports);
            this.charts.cancerType.data.labels = Object.keys(cancerTypes);
            this.charts.cancerType.data.datasets[0].data = Object.values(cancerTypes);
            this.charts.cancerType.update();
        }

        if (this.charts.monthlyTrends) {
            const reports = dataManager.getReports();
            const monthlyData = this.getMonthlyTrends(reports);
            this.charts.monthlyTrends.data.datasets[0].data = monthlyData.data;
            this.charts.monthlyTrends.update();
        }

        if (this.charts.recoveryRate) {
            const stats = dataManager.getDashboardStats();
            const recoveryRate = stats.recoveryRate;
            const remainingRate = 100 - recoveryRate;
            this.charts.recoveryRate.data.datasets[0].data = [recoveryRate, remainingRate];
            this.charts.recoveryRate.update();

            // Update center text
            const centerText = document.querySelector('.recovery-rate-display .rate-number');
            if (centerText) {
                centerText.textContent = `${recoveryRate}%`;
            }
        }
    }

    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
}

// Initialize chart manager
const chartManager = new ChartManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
