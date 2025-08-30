class AIPredictionManager {
    constructor() {
        this.predictionForm = null;
        this.resultsCard = null;
        this.sampleData = this.getSampleData();
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.addSampleDataButton();
    }

    setupElements() {
        this.predictionForm = document.getElementById('predictionForm');
        this.resultsCard = document.getElementById('predictionResults');
    }

    setupEventListeners() {
        if (this.predictionForm) {
            this.predictionForm.addEventListener('submit', (e) => this.handlePrediction(e));
        }

        const clearBtn = document.getElementById('clearPredictionForm');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }

        const saveBtn = document.getElementById('savePredictionBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.savePrediction());
        }

        const newPredictionBtn = document.getElementById('newPredictionBtn');
        if (newPredictionBtn) {
            newPredictionBtn.addEventListener('click', () => this.showForm());
        }
    }

    addSampleDataButton() {
        const formCard = document.querySelector('.prediction-form-card');
        if (formCard) {
            const sampleBtn = document.createElement('button');
            sampleBtn.type = 'button';
            sampleBtn.className = 'sample-data-btn';
            sampleBtn.innerHTML = '<i class="fas fa-magic"></i> Load Sample Data';
            sampleBtn.addEventListener('click', () => this.loadSampleData());
            formCard.style.position = 'relative';
            formCard.appendChild(sampleBtn);
        }
    }

    getSampleData() {
        return {
            // Benign sample data
            benign: {
                radius_mean: 12.46,
                texture_mean: 24.04,
                perimeter_mean: 83.97,
                area_mean: 475.9,
                smoothness_mean: 0.1186,
                compactness_mean: 0.07926,
                concavity_mean: 0.04556,
                concave_points_mean: 0.01938,
                symmetry_mean: 0.1759,
                fractal_dimension_mean: 0.06154,
                radius_se: 0.3866,
                texture_se: 1.428,
                perimeter_se: 3.311,
                area_se: 33.81,
                smoothness_se: 0.007257,
                compactness_se: 0.009719,
                concavity_se: 0.01149,
                concave_points_se: 0.003338,
                symmetry_se: 0.01767,
                fractal_dimension_se: 0.002985,
                radius_worst: 13.71,
                texture_worst: 33.28,
                perimeter_worst: 88.6,
                area_worst: 566.3,
                smoothness_worst: 0.1314,
                compactness_worst: 0.08953,
                concavity_worst: 0.06601,
                concave_points_worst: 0.02701,
                symmetry_worst: 0.1893,
                fractal_dimension_worst: 0.06835
            },
            // Malignant sample data
            malignant: {
                radius_mean: 17.99,
                texture_mean: 10.38,
                perimeter_mean: 122.8,
                area_mean: 1001,
                smoothness_mean: 0.1184,
                compactness_mean: 0.2776,
                concavity_mean: 0.3001,
                concave_points_mean: 0.1471,
                symmetry_mean: 0.2419,
                fractal_dimension_mean: 0.07871,
                radius_se: 1.095,
                texture_se: 0.9053,
                perimeter_se: 8.589,
                area_se: 153.4,
                smoothness_se: 0.006399,
                compactness_se: 0.04904,
                concavity_se: 0.05373,
                concave_points_se: 0.01587,
                symmetry_se: 0.03003,
                fractal_dimension_se: 0.006193,
                radius_worst: 25.38,
                texture_worst: 17.33,
                perimeter_worst: 184.6,
                area_worst: 2019,
                smoothness_worst: 0.1622,
                compactness_worst: 0.6656,
                concavity_worst: 0.7119,
                concave_points_worst: 0.2654,
                symmetry_worst: 0.4601,
                fractal_dimension_worst: 0.1189
            }
        };
    }

    loadSampleData() {
        const type = Math.random() > 0.5 ? 'malignant' : 'benign';
        const data = this.sampleData[type];
        
        Object.keys(data).forEach(key => {
            const input = this.predictionForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });

        componentManager.showNotification(
            `Loaded ${type} sample data`, 
            'info', 
            3000
        );
    }

    clearForm() {
        if (this.predictionForm) {
            this.predictionForm.reset();
            this.clearValidationErrors();
        }
        this.hideResults();
    }

    clearValidationErrors() {
        const errorFields = this.predictionForm.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) errorDiv.remove();
        });
    }

    validateForm() {
        this.clearValidationErrors();
        let isValid = true;
        const requiredFields = this.predictionForm.querySelectorAll('input[type="number"]');

        requiredFields.forEach(field => {
            const value = parseFloat(field.value);
            if (isNaN(value) || value < 0) {
                this.showFieldError(field, 'Please enter a valid positive number');
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    async handlePrediction(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            componentManager.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        const formData = new FormData(this.predictionForm);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        this.showLoading();

        try {
            // Simulate AI prediction (replace with actual API call)
            const result = await this.simulatePrediction(data);
            this.showResults(result);
        } catch (error) {
            componentManager.showNotification('Prediction failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async simulatePrediction(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simple prediction logic based on key features
        const radiusMean = parseFloat(data.radius_mean);
        const textureMean = parseFloat(data.texture_mean);
        const areaMean = parseFloat(data.area_mean);
        const concavityMean = parseFloat(data.concavity_mean);

        // Calculate a simple risk score
        let riskScore = 0;
        riskScore += (radiusMean > 15) ? 20 : 0;
        riskScore += (textureMean > 20) ? 15 : 0;
        riskScore += (areaMean > 700) ? 25 : 0;
        riskScore += (concavityMean > 0.1) ? 30 : 0;

        // Normalize to 0-100
        riskScore = Math.min(100, Math.max(0, riskScore));

        const isMalignant = riskScore > 50;
        const confidence = Math.abs(riskScore - 50) * 2; // Higher confidence for extreme values

        return {
            prediction: isMalignant ? 'Malignant' : 'Benign',
            confidence: Math.round(confidence),
            riskLevel: this.getRiskLevel(riskScore),
            recommendation: this.getRecommendation(isMalignant, riskScore),
            riskScore: Math.round(riskScore),
            features: data
        };
    }

    getRiskLevel(score) {
        if (score < 20) return 'Very Low';
        if (score < 40) return 'Low';
        if (score < 60) return 'Medium';
        if (score < 80) return 'High';
        return 'Very High';
    }

    getRecommendation(isMalignant, score) {
        if (isMalignant) {
            if (score > 80) return 'Immediate biopsy and treatment recommended';
            if (score > 60) return 'Biopsy recommended, schedule follow-up';
            return 'Further testing recommended';
        } else {
            if (score < 20) return 'Regular monitoring, no immediate concerns';
            if (score < 40) return 'Continue regular check-ups';
            return 'Monitor closely, consider additional tests';
        }
    }

    showLoading() {
        const formCard = document.querySelector('.prediction-form-card');
        if (formCard) {
            formCard.innerHTML = `
                <div class="prediction-loading">
                    <div class="spinner"></div>
                    <p>Analyzing patient data with AI...</p>
                    <div class="prediction-progress">
                        <div class="prediction-progress-bar" style="width: 100%"></div>
                    </div>
                </div>
            `;
        }
    }

    hideLoading() {
        // Reload the form content
        location.reload();
    }

    showResults(result) {
        if (this.resultsCard) {
            // Update result elements
            document.getElementById('predictionScore').textContent = `${result.confidence}%`;
            document.getElementById('predictionResult').textContent = result.prediction;
            document.getElementById('predictionResult').className = `result-value ${result.prediction.toLowerCase()}`;
            document.getElementById('riskLevel').textContent = result.riskLevel;
            document.getElementById('recommendation').textContent = result.recommendation;

            // Show results card
            this.resultsCard.style.display = 'block';
            this.resultsCard.scrollIntoView({ behavior: 'smooth' });

            // Store result for saving
            this.currentResult = result;

            componentManager.showNotification(
                `Prediction completed: ${result.prediction}`, 
                result.prediction === 'Benign' ? 'success' : 'warning'
            );
        }
    }

    hideResults() {
        if (this.resultsCard) {
            this.resultsCard.style.display = 'none';
        }
    }

    showForm() {
        this.hideResults();
        this.clearForm();
        document.querySelector('.prediction-form-card').scrollIntoView({ behavior: 'smooth' });
    }

    savePrediction() {
        if (!this.currentResult) {
            componentManager.showNotification('No prediction to save', 'error');
            return;
        }

        // Create a new report entry
        const report = {
            id: dataManager.generateId(),
            patientId: 'ai-prediction',
            reportType: 'ai-prediction',
            uploadDate: new Date().toISOString(),
            findings: `AI Prediction: ${this.currentResult.prediction} (${this.currentResult.confidence}% confidence)`,
            recommendations: this.currentResult.recommendation,
            cancerType: 'Breast Cancer',
            status: this.currentResult.prediction === 'Malignant' ? 'critical' : 'active',
            aiData: this.currentResult
        };

        // Add to reports
        dataManager.addReport(report);

        componentManager.showNotification(
            'Prediction saved to patient records', 
            'success'
        );

        // Update dashboard stats
        if (typeof dashboard !== 'undefined') {
            dashboard.loadDashboardData();
        }
    }
}

// Initialize AI Prediction Manager
const aiPrediction = new AIPredictionManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPredictionManager;
}
