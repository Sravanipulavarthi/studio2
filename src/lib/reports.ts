'use client';

import { DiagnoseAnimalHealthOutput } from "@/ai/flows/diagnose-animal-health";

type Report = {
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

export const getReports = (): Report[] => {
  return reports;
};

export const addReport = (report: Omit<Report, 'id'>) => {
    const newId = `VC-${String(nextId++).padStart(3, '0')}`;
    const newReport: Report = { ...report, id: newId };
    reports.unshift(newReport);
};
