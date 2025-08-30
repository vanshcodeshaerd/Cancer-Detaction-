/**
 * Data Management System for Cancer Detection Portal
 */

class DataManager {
    constructor() {
        this.storageKeys = {
            patients: 'cancer_portal_patients',
            reports: 'cancer_portal_reports',
            activities: 'cancer_portal_activities'
        };
        this.init();
    }

    init() {
        this.initializeSampleData();
    }

    initializeSampleData() {
        if (!this.getPatients().length) {
            this.savePatients(this.getSamplePatients());
        }
        if (!this.getReports().length) {
            this.saveReports(this.getSampleReports());
        }
    }

    getSamplePatients() {
        return [
            {
                id: 'P001',
                firstName: 'Sarah',
                lastName: 'Mitchell',
                age: 45,
                gender: 'female',
                contact: '+1-555-0123',
                medicalHistory: 'Family history of breast cancer',
                symptoms: 'Lump in right breast, occasional pain',
                status: 'active',
                lastVisit: '2024-01-15',
                createdAt: '2024-01-10T10:00:00Z',
                doctorId: 'dr.smith'
            },
            {
                id: 'P002',
                firstName: 'Michael',
                lastName: 'Chen',
                age: 62,
                gender: 'male',
                contact: '+1-555-0124',
                medicalHistory: 'Smoker for 30 years',
                symptoms: 'Persistent cough, chest pain',
                status: 'critical',
                lastVisit: '2024-01-20',
                createdAt: '2024-01-12T14:30:00Z',
                doctorId: 'dr.johnson'
            }
        ];
    }

    getSampleReports() {
        return [
            {
                id: 'R001',
                patientId: 'P001',
                patientName: 'Sarah Mitchell',
                reportType: 'scan',
                reportDate: '2024-01-15',
                findings: '2.5cm mass detected in right breast',
                recommendations: 'Immediate biopsy recommended',
                status: 'critical',
                createdAt: '2024-01-15T14:30:00Z',
                doctorId: 'dr.smith'
            }
        ];
    }

    getPatients() {
        try {
            const patients = localStorage.getItem(this.storageKeys.patients);
            return patients ? JSON.parse(patients) : [];
        } catch (error) {
            return [];
        }
    }

    savePatients(patients) {
        try {
            localStorage.setItem(this.storageKeys.patients, JSON.stringify(patients));
            return true;
        } catch (error) {
            return false;
        }
    }

    addPatient(patientData) {
        const patients = this.getPatients();
        const newPatient = {
            ...patientData,
            id: this.generateId('P'),
            createdAt: new Date().toISOString(),
            doctorId: 'dr.smith'
        };
        patients.push(newPatient);
        this.savePatients(patients);
        return newPatient;
    }

    getReports() {
        try {
            const reports = localStorage.getItem(this.storageKeys.reports);
            return reports ? JSON.parse(reports) : [];
        } catch (error) {
            return [];
        }
    }

    saveReports(reports) {
        try {
            localStorage.setItem(this.storageKeys.reports, JSON.stringify(reports));
            return true;
        } catch (error) {
            return false;
        }
    }

    addReport(reportData) {
        const reports = this.getReports();
        const newReport = {
            ...reportData,
            id: this.generateId('R'),
            createdAt: new Date().toISOString(),
            doctorId: 'dr.smith'
        };
        reports.push(newReport);
        this.saveReports(reports);
        return newReport;
    }

    getDashboardStats() {
        const patients = this.getPatients();
        const reports = this.getReports();
        
        return {
            totalPatients: patients.length,
            totalReports: reports.length,
            criticalCases: patients.filter(p => p.status === 'critical').length,
            recoveryRate: patients.length > 0 ? Math.round((patients.filter(p => p.status === 'completed').length / patients.length) * 100) : 0
        };
    }

    generateId(prefix) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${prefix}${timestamp}${random}`.toUpperCase();
    }
}

const dataManager = new DataManager();
