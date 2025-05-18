
export type PatientSex = 'Male' | 'Female' | 'Other';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type PatientState = 'Stable' | 'Critical' | 'Improving' | 'Worsening' | 'Emergency';

export type Patient = {
  id: number;
  lastName: string;
  firstName: string;
  county: string;
  town: string;
  address: {
    street: string;
    streetNumber: string;
    flatNumber: string;
  };
  phoneNumber: string;
  email: string;
  profession: string;
  job: string;
  patientState: PatientState;
  bedId: string;
  room?: string;
  sex: PatientSex;
  bloodType: BloodType;
  admissionDate: string;
  prescriptions: Prescription[];
};

export type Prescription = {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  notes: string;
};

export type NewPatient = Omit<Patient, 'id' | 'prescriptions'> & {
  prescriptions?: Prescription[];
};

export type NewPrescription = Omit<Prescription, 'id'>;
