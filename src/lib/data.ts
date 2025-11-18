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
    { id: 'h1', name: 'Apollo Animal Hospital, Vijayawada', lat: 16.5062, lng: 80.6480, address: 'Near Benz Circle, Vijayawada, AP', phone: '+918662474747', image: 'https://picsum.photos/seed/h1/600/400' },
    { id: 'h2', name: 'Govt. Veterinary Hospital, Guntur', lat: 16.3067, lng: 80.4365, address: 'Brodipet, Guntur, AP', phone: '+918632220033', image: 'https://picsum.photos/seed/h2/600/400' },
    { id: 'h3', name: 'Cure & Care Pet Clinic, Kurnool', lat: 15.8281, lng: 78.0373, address: 'N.R. Peta, Kurnool, AP', phone: '+919876543210', image: 'https://picsum.photos/seed/h3/600/400' },
    { id: 'h4', name: 'Sree Venkateswara Veterinary University, Kadapa', lat: 14.4674, lng: 78.8242, address: 'Pulivendula Road, Kadapa, AP', phone: '+918562244367', image: 'https://picsum.photos/seed/h4/600/400' },
    { id: 'h5', name: 'District Veterinary Hospital, Eluru', lat: 16.7139, lng: 81.1025, address: 'RR Pet, Eluru, AP', phone: '+918812230656', image: 'https://picsum.photos/seed/h5/600/400' },
    { id: 'h6', name: 'Olive\'s Pet Clinic, Hyderabad', lat: 17.3850, lng: 78.4867, address: 'Banjara Hills, Hyderabad, Telangana', phone: '+914023355544', image: 'https://picsum.photos/seed/h6/600/400' },
    { id: 'h7', name: 'Blue Cross Veterinary Hospital, Visakhapatnam', lat: 17.6868, lng: 83.2185, address: 'MVP Colony, Visakhapatnam, AP', phone: '+918912786939', image: 'https://picsum.photos/seed/h7/600/400' },
    { id: 'h8', name: 'Paws & Claws Pet Clinic, Tirupati', lat: 13.6288, lng: 79.4192, address: 'Korlagunta, Tirupati, AP', phone: '+919988776655', image: 'https://picsum.photos/seed/h8/600/400' },
];
