export const doctors = [
  { id: 'doc1', name: 'Dr. Emily Carter', specialty: 'Cattle' },
  { id: 'doc2', name: 'Dr. James Smith', specialty: 'Poultry' },
  { id: 'doc3', name: 'Dr. Olivia Chen', specialty: 'Swine' },
  { id: 'doc4', name: 'Dr. Benjamin Lee', specialty: 'Sheep & Goat' },
  { id: 'doc5', name: 'Dr. Sophia Rodriguez', specialty: 'General' },
  { id: 'doc6', name: 'Dr. William Johnson', specialty: 'Equine' },
];

export const animalTypes = [
  { value: 'cattle', label: 'Cattle' },
  { value: 'poultry', label: 'Poultry (Chicken, Turkey)' },
  { value: 'swine', label: 'Swine (Pig)' },
  { value: 'sheep_goat', label: 'Sheep & Goat' },
  { value: 'equine', label: 'Equine (Horse, Donkey)' },
  { value: 'other', label: 'Other' },
];

export const diseases = [
    {
        id: 'd1',
        name: 'Foot-and-Mouth Disease (FMD)',
        animalType: 'Cattle',
        description: 'A severe, highly contagious viral disease of cattle and swine. It can also affect sheep, goats, and other cloven-hoofed ruminants.',
        symptoms: ['Fever', 'Blisters on the tongue and lips, in and around the mouth, on the teats, and between the hooves', 'Loss of appetite', 'Drooling'],
        treatment: 'No specific cure. Supportive care and prevention through vaccination are key. Report immediately to authorities.'
    },
    {
        id: 'd2',
        name: 'Avian Influenza (Bird Flu)',
        animalType: 'Poultry',
        description: 'A viral infection that can infect not only birds but also humans and other animals. Highly pathogenic strains can be deadly.',
        symptoms: ['Sudden death without clinical signs', 'Lack of energy and appetite', 'Swelling of the head, eyelids, comb, and wattles', 'Purple discoloration of the wattles, combs, and legs'],
        treatment: 'No effective treatment. Culling of infected flocks is often necessary to control spread. Strict biosecurity is essential.'
    },
    {
        id: 'd3',
        name: 'Porcine Reproductive and Respiratory Syndrome (PRRS)',
        animalType: 'Swine',
        description: 'A viral disease in pigs that causes reproductive failure in breeding stock and respiratory tract illness in young pigs.',
        symptoms: ['Early farrowing, stillborn or weak piglets', 'Lethargy and fever in sows', 'Coughing and respiratory distress ("thumping") in piglets'],
        treatment: 'No specific treatment. Vaccination can help manage the disease. Improving management practices is crucial.'
    },
    {
        id: 'd4',
        name: 'Scrapie',
        animalType: 'Sheep & Goat',
        description: 'A fatal, degenerative disease affecting the central nervous system of sheep and goats.',
        symptoms: ['Behavioral changes (e.g., nervousness or aggression)', 'Intense itching and rubbing against objects', 'Loss of coordination', 'Weight loss despite normal appetite'],
        treatment: 'No cure or treatment. It is fatal. Infected animals must be culled. Breeding for genetic resistance is a key prevention strategy.'
    }
];

export const pastReports = [
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

export const hospitals = [
    { id: 'h1', name: 'County Vet Services', lat: 34.06, lng: -118.25 },
    { id: 'h2', name: 'Green Pastures Animal Hospital', lat: 34.04, lng: -118.22 },
    { id: 'h3', name: 'All Creatures Clinic', lat: 34.07, lng: -118.28 },
    { id: 'h4', name: 'Farm Animal Wellness Center', lat: 34.02, lng: -118.26 },
]
