class ComponentManager {
    constructor() {
        this.notifications = [];
        this.modals = {};
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.createLoadingOverlay();
    }

    setupGlobalEventListeners() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.dataset.modal);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Handle window resize for responsive charts
        window.addEventListener('resize', () => {
            if (typeof chartManager !== 'undefined') {
                chartManager.resizeCharts();
            }
        });
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p class="loading-text">Loading...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('.loading-text');
        if (text) text.textContent = message;
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = this.createNotificationElement(message, type);
        document.body.appendChild(notification);

        // Add to notifications array
        this.notifications.push(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        return notification;
    }

    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="componentManager.removeNotification(this.parentElement.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        return notification;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    removeNotification(notification) {
        if (notification && notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
                // Remove from notifications array
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }

    showModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Set modal options
        if (options.title) {
            const titleElement = modal.querySelector('.modal-title');
            if (titleElement) titleElement.textContent = options.title;
        }

        if (options.content) {
            const contentElement = modal.querySelector('.modal-content');
            if (contentElement) contentElement.innerHTML = options.content;
        }

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Store modal reference
        this.modals[modalId] = modal;

        // Focus first input if exists
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Trigger custom event
        modal.dispatchEvent(new CustomEvent('modal:show', { detail: options }));
    }

    closeModal(modalId) {
        const modal = this.modals[modalId] || document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Remove from modals object
        delete this.modals[modalId];

        // Trigger custom event
        modal.dispatchEvent(new CustomEvent('modal:hide'));
    }

    closeAllModals() {
        Object.keys(this.modals).forEach(modalId => {
            this.closeModal(modalId);
        });
    }

    createDataTable(containerId, data, columns, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const table = document.createElement('table');
        table.className = 'data-table';

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title;
            if (column.width) th.style.width = column.width;
            if (column.sortable) {
                th.classList.add('sortable');
                th.addEventListener('click', () => this.sortTable(table, column.key));
            }
            headerRow.appendChild(th);
        });

        if (options.actions) {
            const actionTh = document.createElement('th');
            actionTh.textContent = 'Actions';
            actionTh.style.width = '120px';
            headerRow.appendChild(actionTh);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const tr = document.createElement('tr');
            
            columns.forEach(column => {
                const td = document.createElement('td');
                const value = row[column.key];
                
                if (column.render) {
                    td.innerHTML = column.render(value, row);
                } else if (column.type === 'status') {
                    td.innerHTML = this.createStatusBadge(value);
                } else if (column.type === 'date') {
                    td.textContent = this.formatDate(value);
                } else {
                    td.textContent = value || '';
                }
                
                tr.appendChild(td);
            });

            if (options.actions) {
                const actionTd = document.createElement('td');
                actionTd.innerHTML = this.createActionButtons(row, options.actions);
                tr.appendChild(actionTd);
            }

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);

        return table;
    }

    createStatusBadge(status) {
        const statusClasses = {
            'active': 'badge-success',
            'inactive': 'badge-warning',
            'critical': 'badge-danger',
            'recovered': 'badge-success',
            'under_treatment': 'badge-warning',
            'pending': 'badge-info'
        };

        const className = statusClasses[status] || 'badge-secondary';
        return `<span class="badge ${className}">${status.replace('_', ' ')}</span>`;
    }

    createActionButtons(row, actions) {
        return actions.map(action => {
            const button = document.createElement('button');
            button.className = `btn btn-sm btn-${action.type || 'secondary'}`;
            button.innerHTML = `<i class="fas ${action.icon}"></i>`;
            button.title = action.title;
            button.onclick = () => action.onClick(row);
            return button.outerHTML;
        }).join('');
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    sortTable(table, key) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.querySelector(`td[data-key="${key}"]`)?.textContent || '';
            const bValue = b.querySelector(`td[data-key="${key}"]`)?.textContent || '';
            return aValue.localeCompare(bValue);
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    createCard(title, content, options = {}) {
        const card = document.createElement('div');
        card.className = 'card';
        if (options.className) card.classList.add(options.className);

        card.innerHTML = `
            ${title ? `<div class="card-header">
                <h3 class="card-title">${title}</h3>
                ${options.headerActions ? `<div class="card-actions">${options.headerActions}</div>` : ''}
            </div>` : ''}
            <div class="card-body">
                ${content}
            </div>
            ${options.footer ? `<div class="card-footer">${options.footer}</div>` : ''}
        `;

        return card;
    }

    createFormField(type, name, label, options = {}) {
        const field = document.createElement('div');
        field.className = 'form-group';

        const labelElement = document.createElement('label');
        labelElement.htmlFor = name;
        labelElement.textContent = label;
        if (options.required) labelElement.innerHTML += ' <span class="required">*</span>';

        const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
        input.type = type;
        input.id = name;
        input.name = name;
        input.className = 'form-control';

        if (options.placeholder) input.placeholder = options.placeholder;
        if (options.required) input.required = true;
        if (options.value) input.value = options.value;
        if (options.min) input.min = options.min;
        if (options.max) input.max = options.max;
        if (options.step) input.step = options.step;

        if (type === 'select' && options.options) {
            const select = document.createElement('select');
            select.id = name;
            select.name = name;
            select.className = 'form-control';
            if (options.required) select.required = true;

            if (options.placeholder) {
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = options.placeholder;
                select.appendChild(placeholderOption);
            }

            options.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                if (options.value === option.value) optionElement.selected = true;
                select.appendChild(optionElement);
            });

            field.appendChild(labelElement);
            field.appendChild(select);
        } else {
            field.appendChild(labelElement);
            field.appendChild(input);
        }

        return field;
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize component manager
const componentManager = new ComponentManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentManager;
}
