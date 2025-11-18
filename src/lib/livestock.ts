'use client';

export type Livestock = {
  id: string;
  name: string;
  species: string;
};

export type Reminder = {
  id: string;
  livestockId: string;
  vaccineName: string;
  reminderDate: Date;
};

let livestock: Livestock[] = [];
let reminders: Reminder[] = [];

let nextLivestockId = 1;
let nextReminderId = 1;

const isClient = typeof window !== 'undefined';

// Initialize from localStorage
const loadData = () => {
    if (!isClient) return;

    const storedLivestock = localStorage.getItem('vetconnect_livestock');
    if (storedLivestock) {
        livestock = JSON.parse(storedLivestock);
        nextLivestockId = livestock.length > 0 ? Math.max(...livestock.map(l => parseInt(l.id))) + 1 : 1;
    }
    const storedReminders = localStorage.getItem('vetconnect_reminders');
    if (storedReminders) {
        reminders = JSON.parse(storedReminders).map((r: Reminder) => ({...r, reminderDate: new Date(r.reminderDate)}));
        nextReminderId = reminders.length > 0 ? Math.max(...reminders.map(r => parseInt(r.id))) + 1 : 1;
    }
}

const saveData = () => {
    if (!isClient) return;
    localStorage.setItem('vetconnect_livestock', JSON.stringify(livestock));
    localStorage.setItem('vetconnect_reminders', JSON.stringify(reminders));
}

loadData();

// Livestock functions
export const getLivestock = (): Livestock[] => {
    loadData();
    return [...livestock];
};

export const addLivestock = (animal: Omit<Livestock, 'id'>) => {
    const newAnimal: Livestock = { ...animal, id: String(nextLivestockId++) };
    livestock.push(newAnimal);
    saveData();
};

export const deleteLivestock = (id: string) => {
    livestock = livestock.filter(l => l.id !== id);
    reminders = reminders.filter(r => r.livestockId !== id);
    saveData();
};

// Reminder functions
export const getReminders = (): Reminder[] => {
    loadData();
    return [...reminders];
};

export const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = { ...reminder, id: String(nextReminderId++) };
    reminders.push(newReminder);
    saveData();
};
