/**
 * Dashboard Functionality for Cancer Detection Portal
 */

class Dashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupThemeToggle();
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    checkAuth() {
        if (!auth.isAuthenticated) {
            window.location.href = 'index.html';
            return;
        }
        this.updateUserInfo();
    }

    updateUserInfo() {
        const user = auth.getCurrentUser();
        if (user) {
            document.getElementById('doctorName').textContent = user.name;
            document.getElementById('pageSubtitle').textContent = `Welcome back, ${user.name.split(' ')[1]}`;
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                console.log('Navigating to section:', section);
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        console.log('Showing section:', sectionName);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section found and activated:', sectionName);
        } else {
            console.error('Section not found:', sectionName);
        }

        // Add active class to nav item
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Update page title and subtitle
        this.updatePageHeader(sectionName);

        // Load section-specific data
        this.loadSectionData(sectionName);

        this.currentSection = sectionName;
    }

    updatePageHeader(sectionName) {
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        const titles = {
            dashboard: 'Dashboard',
            patients: 'Patient Management',
            'patient-registration': 'Patient Registration',
            reports: 'Report Management',
            'report-upload': 'Report Upload',
            analytics: 'Analytics & Insights',
            'ai-prediction': 'AI Cancer Prediction',
            settings: 'System Settings'
        };

        const subtitles = {
            dashboard: 'Welcome back, Doctor',
            patients: 'View and manage existing patient records',
            'patient-registration': 'Register new patients into the system',
            reports: 'View and manage existing patient reports',
            'report-upload': 'Upload new patient reports and medical findings',
            analytics: 'View insights and statistics',
            'ai-prediction': 'Enter patient data for AI-powered cancer prediction analysis',
            settings: 'Configure system preferences'
        };

        pageTitle.textContent = titles[sectionName] || 'Dashboard';
        pageSubtitle.textContent = subtitles[sectionName] || 'Welcome back, Doctor';
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'patients':
                this.loadPatientsData();
                break;
            case 'patient-registration':
                // Patient Registration section is handled by form submission
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'report-upload':
                this.loadReportUploadData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'ai-prediction':
                // AI Prediction section is handled by ai-prediction.js
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    loadDashboardData() {
        const stats = dataManager.getDashboardStats();
        
        // Update statistics
        document.getElementById('totalPatients').textContent = stats.totalPatients;
        document.getElementById('totalReports').textContent = stats.totalReports;
        document.getElementById('criticalCases').textContent = stats.criticalCases;
        document.getElementById('recoveryRate').textContent = stats.recoveryRate + '%';

        // Load recent activity
        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        const activities = [
            {
                type: 'patient_added',
                description: 'New patient Sarah Mitchell added',
                time: '2 hours ago',
                icon: 'fas fa-user-plus'
            },
            {
                type: 'report_uploaded',
                description: 'Scan report uploaded for Michael Chen',
                time: '4 hours ago',
                icon: 'fas fa-file-medical'
            },
            {
                type: 'status_updated',
                description: 'Patient status updated to critical',
                time: '6 hours ago',
                icon: 'fas fa-exclamation-triangle'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.description}</h4>
                    <p>System activity recorded</p>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    loadPatientsData() {
        const patients = dataManager.getPatients();
        this.updatePatientStats(patients);
        this.renderPatientsTable(patients);
        this.renderPatientsCards(patients);
        this.populatePatientSelect();
    }

    updatePatientStats(patients) {
        const total = patients.length;
        const active = patients.filter(p => p.status === 'active').length;
        const critical = patients.filter(p => p.status === 'critical').length;
        const pending = patients.filter(p => p.status === 'pending').length;

        document.getElementById('totalPatientsCount').textContent = total;
        document.getElementById('activePatientsCount').textContent = active;
        document.getElementById('criticalPatientsCount').textContent = critical;
        document.getElementById('pendingPatientsCount').textContent = pending;
    }

    renderPatientsTable(patients) {
        const tbody = document.getElementById('patientsTableBody');
        
        if (patients.length === 0) {
            this.showPatientsEmpty();
            return;
        }
        
        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td><strong>${patient.id}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 32px; height: 32px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 600;">
                            ${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight: 600; color: var(--text-color);">${patient.firstName} ${patient.lastName}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${patient.email || 'No email'}</div>
                        </div>
                    </div>
                </td>
                <td><strong>${patient.age}</strong> years</td>
                <td>
                    <span style="display: flex; align-items: center; gap: 0.25rem;">
                        <i class="fas fa-${patient.gender === 'male' ? 'mars' : patient.gender === 'female' ? 'venus' : 'genderless'}" style="color: ${patient.gender === 'male' ? '#3b82f6' : patient.gender === 'female' ? '#ec4899' : '#6b7280'};"></i>
                        ${patient.gender}
                    </span>
                </td>
                <td>${patient.contact || 'N/A'}</td>
                <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
                <td>${patient.lastVisit}</td>
                <td class="table-actions">
                    <button class="action-btn view" title="View Details" onclick="dashboard.viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Patient" onclick="dashboard.editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Patient" onclick="dashboard.deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderPatientsCards(patients) {
        const grid = document.getElementById('cardView');
        
        if (patients.length === 0) {
            grid.innerHTML = '';
            return;
        }
        
        grid.innerHTML = patients.map(patient => `
            <div class="patient-card">
                <div class="patient-header">
                    <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
                    <div class="patient-id">ID: ${patient.id}</div>
                </div>
                <div class="patient-body">
                    <div class="patient-info">
                        <div class="patient-info-item">
                            <label>Age</label>
                            <span>${patient.age} years</span>
                        </div>
                        <div class="patient-info-item">
                            <label>Gender</label>
                            <span>
                                <i class="fas fa-${patient.gender === 'male' ? 'mars' : patient.gender === 'female' ? 'venus' : 'genderless'}" style="color: ${patient.gender === 'male' ? '#3b82f6' : patient.gender === 'female' ? '#ec4899' : '#6b7280'}; margin-right: 0.25rem;"></i>
                                ${patient.gender}
                            </span>
                        </div>
                        <div class="patient-info-item">
                            <label>Contact</label>
                            <span>${patient.contact || 'N/A'}</span>
                        </div>
                        <div class="patient-info-item">
                            <label>Status</label>
                            <span><span class="status-badge status-${patient.status}">${patient.status}</span></span>
                        </div>
                        <div class="patient-info-item">
                            <label>Last Visit</label>
                            <span>${patient.lastVisit}</span>
                        </div>
                        <div class="patient-info-item">
                            <label>Blood Type</label>
                            <span>${patient.bloodType || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="patient-actions">
                        <button class="btn btn-secondary" onclick="dashboard.viewPatient('${patient.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-primary" onclick="dashboard.editPatient('${patient.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="dashboard.deletePatient('${patient.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showPatientsEmpty() {
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('cardView').style.display = 'none';
        document.getElementById('patientsEmpty').style.display = 'block';
    }

    switchView(viewType) {
        const tableView = document.getElementById('tableView');
        const cardView = document.getElementById('cardView');
        const tableBtn = document.querySelector('[data-view="table"]');
        const cardBtn = document.querySelector('[data-view="cards"]');
        
        // Update button states
        tableBtn.classList.toggle('active', viewType === 'table');
        cardBtn.classList.toggle('active', viewType === 'cards');
        
        // Show/hide views
        if (viewType === 'table') {
            tableView.style.display = 'block';
            cardView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            cardView.style.display = 'grid';
        }
    }

    clearFilters() {
        document.getElementById('patientSearch').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('ageFilter').value = '';
        document.getElementById('genderFilter').value = '';
        this.loadPatientsData(); // Reload with all patients
    }

    applyFilters() {
        const searchQuery = document.getElementById('patientSearch').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const ageFilter = document.getElementById('ageFilter').value;
        const genderFilter = document.getElementById('genderFilter').value;
        
        let patients = dataManager.getPatients();
        
        // Apply filters
        if (searchQuery) {
            patients = patients.filter(patient => 
                patient.firstName.toLowerCase().includes(searchQuery) ||
                patient.lastName.toLowerCase().includes(searchQuery) ||
                patient.id.toLowerCase().includes(searchQuery) ||
                (patient.contact && patient.contact.includes(searchQuery))
            );
        }
        
        if (statusFilter) {
            patients = patients.filter(patient => patient.status === statusFilter);
        }
        
        if (genderFilter) {
            patients = patients.filter(patient => patient.gender === genderFilter);
        }
        
        if (ageFilter) {
            patients = patients.filter(patient => {
                const age = parseInt(patient.age);
                switch(ageFilter) {
                    case '0-18': return age >= 0 && age <= 18;
                    case '19-30': return age >= 19 && age <= 30;
                    case '31-50': return age >= 31 && age <= 50;
                    case '51-70': return age >= 51 && age <= 70;
                    case '70+': return age > 70;
                    default: return true;
                }
            });
        }
        
        // Update display
        this.updatePatientStats(patients);
        this.renderPatientsTable(patients);
        this.renderPatientsCards(patients);
        
        // Show empty state if no results
        if (patients.length === 0) {
            this.showPatientsEmpty();
        } else {
            document.getElementById('patientsEmpty').style.display = 'none';
            document.getElementById('tableView').style.display = 'block';
        }
    }

    exportPatients() {
        const patients = dataManager.getPatients();
        if (patients.length === 0) {
            this.showNotification('No patients to export', 'warning');
            return;
        }
        
        // Create CSV content
        const headers = ['ID', 'First Name', 'Last Name', 'Age', 'Gender', 'Contact', 'Email', 'Status', 'Last Visit', 'Blood Type'];
        const csvContent = [
            headers.join(','),
            ...patients.map(patient => [
                patient.id,
                patient.firstName,
                patient.lastName,
                patient.age,
                patient.gender,
                patient.contact || '',
                patient.email || '',
                patient.status,
                patient.lastVisit,
                patient.bloodType || ''
            ].join(','))
        ].join('\n');
        
        // Download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patients_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Patients exported successfully!', 'success');
    }

    renderPatientsTable(patients) {
        const tbody = document.getElementById('patientsTableBody');
        
        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
                <td>${patient.lastVisit}</td>
                <td class="table-actions">
                    <button class="action-btn view" title="View Details" onclick="dashboard.viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Patient" onclick="dashboard.editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Patient" onclick="dashboard.deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    populatePatientSelect() {
        const select = document.getElementById('reportPatientSelect');
        const patients = dataManager.getPatients();
        
        select.innerHTML = '<option value="">Choose a patient...</option>' +
            patients.map(patient => 
                `<option value="${patient.id}">${patient.firstName} ${patient.lastName} (${patient.id})</option>`
            ).join('');
    }

    loadReportsData() {
        const reports = dataManager.getReports();
        this.renderReportsGrid(reports);
    }

    loadReportUploadData() {
        // Populate patient select dropdown
        this.populatePatientSelect();
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const reportDateInput = document.querySelector('input[name="reportDate"]');
        if (reportDateInput) {
            reportDateInput.value = today;
        }
        
        // Setup file upload functionality
        this.setupFileUpload();
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && fileInput) {
            // Drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                this.handleFileSelection(files);
            });
            
            // Click to browse
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files);
            });
        }
    }

    handleFileSelection(files) {
        if (files.length > 0) {
            const fileNames = Array.from(files).map(file => file.name).join(', ');
            this.showNotification(`Selected files: ${fileNames}`, 'success');
        }
    }

    renderReportsGrid(reports) {
        const grid = document.getElementById('reportsGrid');
        
        if (reports.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical"></i>
                    <h3>No Reports Yet</h3>
                    <p>Upload your first patient report to get started</p>
                    <button class="btn btn-primary" onclick="dashboard.showSection('report-upload')">
                        <i class="fas fa-upload"></i> Upload Report
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = reports.map(report => `
            <div class="report-card">
                <div class="report-header">
                    <h4 class="report-title">${report.patientName}</h4>
                    <div class="report-meta">
                        <span class="report-type">${report.reportType}</span>
                        <span class="report-date">${report.reportDate}</span>
                    </div>
                </div>
                <div class="report-body">
                    <div class="report-content">
                        <h4>Findings</h4>
                        <p>${report.findings}</p>
                    </div>
                    <div class="report-content">
                        <h4>Recommendations</h4>
                        <p>${report.recommendations}</p>
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-sm btn-secondary" onclick="dashboard.viewReport('${report.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.deleteReport('${report.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadAnalyticsData() {
        // Set default date range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
        
        // Load analytics charts
        if (window.chartManager) {
            chartManager.setupAnalyticsCharts();
        }
    }

    loadSettingsData() {
        // Load current settings
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.getElementById('darkModeToggle').checked = currentTheme === 'dark';
        
        // Load user profile data
        const user = auth.getCurrentUser();
        if (user) {
            document.getElementById('doctorNameInput').value = user.name;
            document.getElementById('specializationInput').value = user.specialization || 'Oncologist';
            document.getElementById('emailInput').value = user.email || 'dr.smith@hospital.com';
        }
    }

    setupEventListeners() {
        // Sidebar Toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Search functionality with debouncing
        const patientSearch = document.getElementById('patientSearch');
        if (patientSearch) {
            patientSearch.addEventListener('input', this.debounce((e) => this.handlePatientSearch(e.target.value), 300));
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        }

        // Age filter
        const ageFilter = document.getElementById('ageFilter');
        if (ageFilter) {
            ageFilter.addEventListener('change', (e) => this.handleAgeFilter(e.target.value));
        }

        // Gender filter
        const genderFilter = document.getElementById('genderFilter');
        if (genderFilter) {
            genderFilter.addEventListener('change', (e) => this.handleGenderFilter(e.target.value));
        }

        // Analytics date range
        const updateAnalyticsBtn = document.getElementById('updateAnalytics');
        if (updateAnalyticsBtn) {
            updateAnalyticsBtn.addEventListener('click', () => this.updateAnalytics());
        }

        // Settings
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => this.toggleTheme());
        }

        // Form submissions
        this.setupFormSubmissions();
    }

    setupFormSubmissions() {
        // Patient Registration Form
        const patientRegistrationForm = document.getElementById('patientRegistrationForm');
        if (patientRegistrationForm) {
            patientRegistrationForm.addEventListener('submit', (e) => this.handlePatientRegistration(e));
        }

        // Report Upload Form
        const reportUploadForm = document.getElementById('reportUploadForm');
        if (reportUploadForm) {
            reportUploadForm.addEventListener('submit', (e) => this.handleReportUpload(e));
        }

        // Profile Form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Clear Registration Form
        const clearRegistrationForm = document.getElementById('clearRegistrationForm');
        if (clearRegistrationForm) {
            clearRegistrationForm.addEventListener('click', () => this.clearRegistrationForm());
        }

        // Clear Upload Form
        const clearUploadForm = document.getElementById('clearUploadForm');
        if (clearUploadForm) {
            clearUploadForm.addEventListener('click', () => this.clearUploadForm());
        }
    }

    showUploadReportModal() {
        const modal = document.getElementById('uploadReportModal');
        modal.classList.add('show');
        this.setupModalClose(modal);
    }

    setupModalClose(modal) {
        const closeBtn = modal.querySelector('.close');
        const closeModalBtn = modal.querySelector('.close-modal');
        
        [closeBtn, closeModalBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    modal.classList.remove('show');
                });
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    handlePatientRegistration(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const patientData = Object.fromEntries(formData.entries());
        
        // Add default values for missing fields
        patientData.status = 'active';
        patientData.lastVisit = new Date().toLocaleDateString();
        
        const newPatient = dataManager.addPatient(patientData);
        if (newPatient) {
            this.showNotification('Patient registered successfully!', 'success');
            event.target.reset();
            // Optionally redirect to patients section
            setTimeout(() => {
                this.showSection('patients');
            }, 1500);
        } else {
            this.showNotification('Failed to register patient. Please try again.', 'error');
        }
    }

    clearRegistrationForm() {
        const form = document.getElementById('patientRegistrationForm');
        if (form) {
            form.reset();
            this.showNotification('Form cleared successfully!', 'info');
        }
    }

    handleReportUpload(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const reportData = Object.fromEntries(formData.entries());
        
        // Get patient name for display
        const patientSelect = document.getElementById('reportPatientSelect');
        const selectedOption = patientSelect.options[patientSelect.selectedIndex];
        const patientName = selectedOption ? selectedOption.text.split(' (')[0] : 'Unknown Patient';
        
        reportData.patientName = patientName;
        
        const newReport = dataManager.addReport(reportData);
        if (newReport) {
            this.showNotification('Report uploaded successfully!', 'success');
            event.target.reset();
            // Set default date back to today
            const reportDateInput = document.querySelector('input[name="reportDate"]');
            if (reportDateInput) {
                reportDateInput.value = new Date().toISOString().split('T')[0];
            }
            // Optionally redirect to reports section
            setTimeout(() => {
                this.showSection('reports');
            }, 1500);
        } else {
            this.showNotification('Failed to upload report. Please try again.', 'error');
        }
    }

    clearUploadForm() {
        const form = document.getElementById('reportUploadForm');
        if (form) {
            form.reset();
            // Set default date back to today
            const reportDateInput = document.querySelector('input[name="reportDate"]');
            if (reportDateInput) {
                reportDateInput.value = new Date().toISOString().split('T')[0];
            }
            this.showNotification('Upload form cleared successfully!', 'info');
        }
    }

    handleProfileUpdate(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const profileData = Object.fromEntries(formData.entries());
        
        auth.updateProfile(profileData);
        this.showNotification('Profile updated successfully!', 'success');
    }

    handlePatientSearch(query) {
        if (!query.trim()) {
            this.loadPatientsData();
            return;
        }
        
        const patients = dataManager.getPatients();
        const filteredPatients = patients.filter(patient => 
            patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
            patient.id.toLowerCase().includes(query.toLowerCase()) ||
            (patient.contact && patient.contact.includes(query))
        );
        
        this.updatePatientStats(filteredPatients);
        this.renderPatientsTable(filteredPatients);
        this.renderPatientsCards(filteredPatients);
        
        if (filteredPatients.length === 0) {
            this.showPatientsEmpty();
        } else {
            document.getElementById('patientsEmpty').style.display = 'none';
            document.getElementById('tableView').style.display = 'block';
        }
    }

    handleStatusFilter(status) {
        if (!status) {
            this.loadPatientsData();
            return;
        }
        
        const patients = dataManager.getPatients();
        const filteredPatients = patients.filter(patient => patient.status === status);
        
        this.updatePatientStats(filteredPatients);
        this.renderPatientsTable(filteredPatients);
        this.renderPatientsCards(filteredPatients);
        
        if (filteredPatients.length === 0) {
            this.showPatientsEmpty();
        } else {
            document.getElementById('patientsEmpty').style.display = 'none';
            document.getElementById('tableView').style.display = 'block';
        }
    }

    handleAgeFilter(ageRange) {
        if (!ageRange) {
            this.loadPatientsData();
            return;
        }
        
        const patients = dataManager.getPatients();
        const filteredPatients = patients.filter(patient => {
            const age = parseInt(patient.age);
            switch(ageRange) {
                case '0-18': return age >= 0 && age <= 18;
                case '19-30': return age >= 19 && age <= 30;
                case '31-50': return age >= 31 && age <= 50;
                case '51-70': return age >= 51 && age <= 70;
                case '70+': return age > 70;
                default: return true;
            }
        });
        
        this.updatePatientStats(filteredPatients);
        this.renderPatientsTable(filteredPatients);
        this.renderPatientsCards(filteredPatients);
        
        if (filteredPatients.length === 0) {
            this.showPatientsEmpty();
        } else {
            document.getElementById('patientsEmpty').style.display = 'none';
            document.getElementById('tableView').style.display = 'block';
        }
    }

    handleGenderFilter(gender) {
        if (!gender) {
            this.loadPatientsData();
            return;
        }
        
        const patients = dataManager.getPatients();
        const filteredPatients = patients.filter(patient => patient.gender === gender);
        
        this.updatePatientStats(filteredPatients);
        this.renderPatientsTable(filteredPatients);
        this.renderPatientsCards(filteredPatients);
        
        if (filteredPatients.length === 0) {
            this.showPatientsEmpty();
        } else {
            document.getElementById('patientsEmpty').style.display = 'none';
            document.getElementById('tableView').style.display = 'block';
        }
    }

    updateAnalytics() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            this.showNotification('Analytics updated!', 'success');
            if (window.chartManager) {
                chartManager.updateAnalyticsCharts(startDate, endDate);
            }
        } else {
            this.showNotification('Please select both start and end dates', 'error');
        }
    }

    // Patient actions
    viewPatient(patientId) {
        const patient = dataManager.getPatient(patientId);
        if (patient) {
            this.showNotification(`Viewing patient: ${patient.firstName} ${patient.lastName}`, 'info');
            // TODO: Implement patient detail view
        }
    }

    editPatient(patientId) {
        const patient = dataManager.getPatient(patientId);
        if (patient) {
            this.showNotification(`Editing patient: ${patient.firstName} ${patient.lastName}`, 'info');
            // TODO: Implement patient edit modal
        }
    }

    deletePatient(patientId) {
        if (confirm('Are you sure you want to delete this patient?')) {
            const deleted = dataManager.deletePatient(patientId);
            if (deleted) {
                this.showNotification('Patient deleted successfully!', 'success');
                this.loadPatientsData();
            } else {
                this.showNotification('Failed to delete patient', 'error');
            }
        }
    }

    // Report actions
    viewReport(reportId) {
        const report = dataManager.getReport(reportId);
        if (report) {
            this.showNotification(`Viewing report for: ${report.patientName}`, 'info');
            // TODO: Implement report detail view
        }
    }

    deleteReport(reportId) {
        if (confirm('Are you sure you want to delete this report?')) {
            const deleted = dataManager.deleteReport(reportId);
            if (deleted) {
                this.showNotification('Report deleted successfully!', 'success');
                this.loadReportsData();
            } else {
                this.showNotification('Failed to delete report', 'error');
            }
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
            
            // Adjust main content margin using CSS class
            if (mainContent) {
                if (sidebar.classList.contains('collapsed')) {
                    mainContent.classList.add('sidebar-collapsed');
                } else {
                    mainContent.classList.remove('sidebar-collapsed');
                }
            }
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            auth.logout();
            window.location.href = 'index.html';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
});
