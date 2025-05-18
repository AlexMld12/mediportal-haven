
import type { Patient } from '../types/patient';

// Sample patients data
export const SAMPLE_PATIENTS: Patient[] = [
  {
    id: 1,
    lastName: 'Smith',
    firstName: 'John',
    county: 'King County',
    town: 'Seattle',
    address: {
      street: 'Main Street',
      streetNumber: '123',
      flatNumber: '4B'
    },
    phoneNumber: '(206) 555-1234',
    email: 'john.smith@example.com',
    profession: 'Engineer',
    job: 'Software Developer',
    patientState: 'Stable',
    bedId: 'A101',
    sex: 'Male',
    bloodType: 'O+',
    admissionDate: '2023-06-15',
    prescriptions: [
      {
        id: 1,
        medication: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        startDate: '2023-06-15',
        endDate: '2023-06-22',
        prescribedBy: 'Dr. Sarah Johnson',
        notes: 'Take with food'
      }
    ]
  },
  {
    id: 2,
    lastName: 'Johnson',
    firstName: 'Emily',
    county: 'Pierce County',
    town: 'Tacoma',
    address: {
      street: 'Oak Avenue',
      streetNumber: '456',
      flatNumber: '7C'
    },
    phoneNumber: '(253) 555-6789',
    email: 'emily.johnson@example.com',
    profession: 'Teacher',
    job: 'Elementary School Teacher',
    patientState: 'Improving',
    bedId: 'B202',
    sex: 'Female',
    bloodType: 'A+',
    admissionDate: '2023-06-20',
    prescriptions: [
      {
        id: 2,
        medication: 'Amoxicillin',
        dosage: '250mg',
        frequency: 'Every 8 hours',
        startDate: '2023-06-20',
        endDate: '2023-06-30',
        prescribedBy: 'Dr. Robert Chen',
        notes: 'Complete entire course of antibiotics'
      }
    ]
  }
];
