'use client';

import { DiagnoseAnimalHealthOutput } from "@/ai/flows/diagnose-animal-health";

export type Report = {
    id?: string;
    animalType: string;
    date: string;
    assignedDoctor: string;
    status: 'Resolved' | 'Pending' | 'Urgent';
    symptoms?: string;
    image?: string | null;
    diagnosis?: DiagnoseAnimalHealthOutput | null;
};

let reports: Report[] = [
    {
        id: 'VC-001',
        animalType: 'Cattle',
        date: '2024-05-15',
        assignedDoctor: 'Dr. Emily Carter',
        status: 'Resolved'
    },
    {
        id: 'VC-002',
        animalType: 'Poultry',
        date: '2024-06-01',
        assignedDoctor: 'Dr. James Smith',
        status: 'Resolved'
    },
    {
        id: 'VC-003',
        animalType: 'Cattle',
        date: '2024-06-20',
        assignedDoctor: 'Dr. Emily Carter',
        status: 'Pending'
    },
    {
        id: 'VC-004',
        animalType: 'Swine',
        date: '2024-07-02',
        assignedDoctor: 'Dr. Olivia Chen',
        status: 'Urgent'
    },
    {
        id: 'VC-005',
        animalType: 'Sheep & Goat',
        date: '2024-07-10',
        assignedDoctor: 'Dr. Benjamin Lee',
        status: 'Pending'
    },
];

let nextId = 6;

// Function to get reports, ensuring it runs on the client
export const getReports = (): Report[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedReports = localStorage.getItem('vetconnect_reports');
  if (storedReports) {
    reports = JSON.parse(storedReports);
    const maxId = reports.reduce((max, r) => {
        const idNum = parseInt(r.id?.split('-')[1] || '0');
        return idNum > max ? idNum : max;
    }, 0);
    nextId = maxId + 1;
  }
  return reports;
};

const saveReports = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vetconnect_reports', JSON.stringify(reports));
  }
};


export const addReport = (report: Omit<Report, 'id'>) => {
    getReports(); // Ensure reports are loaded from localStorage
    const newId = `VC-${String(nextId++).padStart(3, '0')}`;
    const newReport: Report = { ...report, id: newId };
    reports.unshift(newReport);
    saveReports();
};

export const updateReportDoctor = (reportId: string, doctorName: string) => {
    getReports();
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if(reportIndex !== -1) {
        reports[reportIndex].assignedDoctor = doctorName;
        saveReports();
    }
}
