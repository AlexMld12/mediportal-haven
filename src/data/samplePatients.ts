
import { Patient, PatientState } from '@/types/patient';

// Sample patient data for development and testing
export const SAMPLE_PATIENTS: Patient[] = [
  {
    id: 1,
    CNP: "1234567890123",
    nume: "Popescu", // Changed from lastName to nume
    prenume: "Ion",
    judet: "Bucuresti",
    localitate: "Sector 1",
    strada: "Calea Victoriei",
    nr_strada: 10,
    scara: "A",
    apartament: 5,
    telefon: "0722123456",
    email: "ion.popescu@example.com",
    profesie: "Profesor",
    loc_de_munca: "Universitatea Bucuresti",
    patientState: "Stable",
    id_pat: "101",
    sex: "M",
    grupa_sange: "O",
    rh: "pozitiv",
    admissionDate: "2023-06-15",
    prescriptions: [
      {
        id: 1,
        medication: "Paracetamol",
        dosage: "500mg",
        frequency: "Every 6 hours",
        startDate: "2023-06-15",
        endDate: "2023-06-22",
        prescribedBy: "Dr. Alexandru",
        notes: "Take after meals"
      }
    ],
    room: "105"
  },
  {
    id: 2,
    CNP: "2234567890123",
    nume: "Ionescu", // Changed from lastName to nume
    prenume: "Ana",
    judet: "Cluj",
    localitate: "Cluj-Napoca",
    strada: "Strada Republicii",
    nr_strada: 15,
    scara: "B",
    apartament: 7,
    telefon: "0733234567",
    email: "ana.ionescu@example.com",
    profesie: "Inginer",
    loc_de_munca: "Tech SRL",
    patientState: "Critical",
    id_pat: "201",
    sex: "F",
    grupa_sange: "A",
    rh: "negativ",
    admissionDate: "2023-07-02",
    prescriptions: [],
    room: "201"
  },
  {
    id: 3,
    CNP: "3234567890123",
    nume: "Johnson", // Changed from lastName to nume
    prenume: "Emily",
    judet: "Pierce County",
    localitate: "Tacoma",
    strada: "Oak Avenue",
    nr_strada: 456,
    scara: "7C",
    apartament: 12,
    telefon: "(253) 555-6789",
    email: "emily.johnson@example.com",
    profesie: "Teacher",
    loc_de_munca: "Elementary School Teacher",
    patientState: "Improving",
    id_pat: "B202",
    sex: "Female",
    grupa_sange: "A",
    rh: "pozitiv",
    admissionDate: "2023-06-20",
    prescriptions: [
      {
        id: 2,
        medication: "Amoxicillin",
        dosage: "250mg",
        frequency: "Every 8 hours",
        startDate: "2023-06-20",
        endDate: "2023-06-30",
        prescribedBy: "Dr. Robert Chen",
        notes: "Complete entire course of antibiotics"
      }
    ],
    room: "205"
  }
];
