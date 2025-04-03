
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientBedAssignment from '@/components/patient/PatientBedAssignment';
import { hasPermission } from '@/utils/permissions';
import type { UserRole, Permission } from '@/utils/permissions';

type PatientSex = 'Male' | 'Female' | 'Other';
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
type PatientState = 'Stable' | 'Critical' | 'Improving' | 'Worsening' | 'Emergency';

type Patient = {
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

type Prescription = {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  notes: string;
};

type NewPatient = Omit<Patient, 'id' | 'prescriptions'> & {
  prescriptions?: Prescription[];
};

type NewPrescription = Omit<Prescription, 'id'>;

// Sample patients data
const SAMPLE_PATIENTS: Patient[] = [
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

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(SAMPLE_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isBedAssignmentModalOpen, setIsBedAssignmentModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Define the state for new patient
  const [newPatient, setNewPatient] = useState<NewPatient>({
    lastName: '',
    firstName: '',
    county: '',
    town: '',
    address: {
      street: '',
      streetNumber: '',
      flatNumber: ''
    },
    phoneNumber: '',
    email: '',
    profession: '',
    job: '',
    patientState: 'Stable',
    bedId: '',
    sex: 'Male',
    bloodType: 'O+',
    admissionDate: new Date().toISOString().split('T')[0],
  });

  // Define the state for new prescription
  const [newPrescription, setNewPrescription] = useState<NewPrescription>({
    medication: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    prescribedBy: '',
    notes: ''
  });
  
  // Using strings for role checking to match the type in permissions.ts
  const currentUserRole: UserRole = 'Receptionist';
  const isReceptionist = hasPermission(currentUserRole, 'assign_beds');
  const isDoctor = hasPermission(currentUserRole, 'manage_patients');
  
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.bedId.toLowerCase().includes(searchLower) ||
      patient.patientState.toLowerCase().includes(searchLower)
    );
  }).filter(patient => {
    if (activeTab === 'all') return true;
    if (activeTab === 'critical') return patient.patientState === 'Critical' || patient.patientState === 'Emergency';
    if (activeTab === 'stable') return patient.patientState === 'Stable' || patient.patientState === 'Improving';
    return true;
  });

  const handleAddPatient = () => {
    if (!newPatient.lastName || !newPatient.firstName || !newPatient.bedId) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    const newPatientId = Math.max(...patients.map(p => p.id), 0) + 1;
    
    const patientToAdd: Patient = {
      id: newPatientId,
      lastName: newPatient.lastName || '',
      firstName: newPatient.firstName || '',
      county: newPatient.county || '',
      town: newPatient.town || '',
      address: {
        street: newPatient.address?.street || '',
        streetNumber: newPatient.address?.streetNumber || '',
        flatNumber: newPatient.address?.flatNumber || ''
      },
      phoneNumber: newPatient.phoneNumber || '',
      email: newPatient.email || '',
      profession: newPatient.profession || '',
      job: newPatient.job || '',
      patientState: newPatient.patientState as PatientState || 'Stable',
      bedId: newPatient.bedId || '',
      sex: newPatient.sex as PatientSex || 'Male',
      bloodType: newPatient.bloodType as BloodType || 'O+',
      admissionDate: newPatient.admissionDate || new Date().toISOString().split('T')[0],
      prescriptions: []
    };

    setPatients([...patients, patientToAdd]);
    
    setNewPatient({
      lastName: '',
      firstName: '',
      county: '',
      town: '',
      address: {
        street: '',
        streetNumber: '',
        flatNumber: ''
      },
      phoneNumber: '',
      email: '',
      profession: '',
      job: '',
      patientState: 'Stable',
      bedId: '',
      sex: 'Male',
      bloodType: 'O+',
      admissionDate: new Date().toISOString().split('T')[0],
      prescriptions: []
    });
    
    setIsAddPatientModalOpen(false);
    
    toast({
      title: "Patient Added",
      description: `${patientToAdd.firstName} ${patientToAdd.lastName} has been added to bed ${patientToAdd.bedId}`
    });
  };

  const handleAddPrescription = () => {
    if (!selectedPatientId || !newPrescription.medication || !newPrescription.dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    setPatients(patients.map(patient => {
      if (patient.id === selectedPatientId) {
        const newPrescriptionId = Math.max(...patient.prescriptions.map(p => p.id), 0) + 1;
        
        const prescriptionToAdd: Prescription = {
          id: newPrescriptionId,
          medication: newPrescription.medication || '',
          dosage: newPrescription.dosage || '',
          frequency: newPrescription.frequency || '',
          startDate: newPrescription.startDate || new Date().toISOString().split('T')[0],
          endDate: newPrescription.endDate || '',
          prescribedBy: newPrescription.prescribedBy || 'Dr. Unknown',
          notes: newPrescription.notes || ''
        };

        return {
          ...patient,
          prescriptions: [...patient.prescriptions, prescriptionToAdd]
        };
      }
      return patient;
    }));

    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      prescribedBy: '',
      notes: ''
    });
    
    setIsPrescriptionModalOpen(false);
    
    toast({
      title: "Prescription Added",
      description: `New prescription added for patient`
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setNewPatient(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setNewPatient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePrescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPrescription(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewPatient(prev => ({ ...prev, [field]: value }));
  };

  const openPrescriptionModal = (patientId: number) => {
    setSelectedPatientId(patientId);
    setIsPrescriptionModalOpen(true);
  };

  const getPatientByBedId = (bedId: string) => {
    return patients.find(p => p.bedId === bedId);
  };

  const handleRemovePatientFromBed = (patientId: number) => {
    const patientName = patients.find(p => p.id === patientId)?.firstName + ' ' + patients.find(p => p.id === patientId)?.lastName;
    
    setPatients(patients.filter(p => p.id !== patientId));
    
    toast({
      title: "Patient Removed",
      description: `${patientName} has been removed from their bed`
    });
  };

  const handleBedAssignment = (data: { patientId: number, room: string, bedId: string }) => {
    setPatients(patients.map(patient => {
      if (patient.id === data.patientId) {
        return {
          ...patient,
          bedId: data.bedId,
          room: data.room
        };
      }
      return patient;
    }));
    
    toast({
      title: "Bed Assignment Updated",
      description: `Patient moved to ${data.room}, Bed ${data.bedId}`
    });
    
    setIsBedAssignmentModalOpen(false);
  };

  const openBedAssignmentModal = (patientId: number) => {
    setSelectedPatientId(patientId);
    setIsBedAssignmentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Patient Management</h2>
        <p className="text-gray-600 mt-1">
          Manage patient information, beds, and prescriptions
        </p>
      </div>
      
      {isReceptionist && (
        <PatientBedAssignment isReceptionist={true} />
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="stable">Stable</TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsAddPatientModalOpen(true)} disabled={!isReceptionist && !isDoctor}>
            Add New Patient
          </Button>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Patients</CardTitle>
                  <CardDescription>
                    Manage patient records and medical information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="patientSearch">Search Patients</Label>
                <Input 
                  id="patientSearch" 
                  placeholder="Search by name, bed ID, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Room</th>
                      <th className="text-left py-3 px-4 font-medium">Bed ID</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Blood Type</th>
                      <th className="text-left py-3 px-4 font-medium">Admission Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{patient.lastName}, {patient.firstName}</td>
                          <td className="py-3 px-4">{patient.room || 'Not assigned'}</td>
                          <td className="py-3 px-4">{patient.bedId}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              patient.patientState === 'Critical' || patient.patientState === 'Emergency'
                                ? 'bg-red-100 text-red-800'
                                : patient.patientState === 'Stable'
                                ? 'bg-green-100 text-green-800'
                                : patient.patientState === 'Improving'
                                ? 'bg-blue-100 text-blue-800'
                                : patient.patientState === 'Worsening'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {patient.patientState}
                            </span>
                          </td>
                          <td className="py-3 px-4">{patient.bloodType}</td>
                          <td className="py-3 px-4">{patient.admissionDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "View Patient",
                                    description: `Viewing details for ${patient.firstName} ${patient.lastName}`
                                  });
                                }}
                              >
                                View
                              </Button>
                              
                              {isDoctor && (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openPrescriptionModal(patient.id)}
                                >
                                  Prescribe
                                </Button>
                              )}
                              
                              {isReceptionist && (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openBedAssignmentModal(patient.id)}
                                >
                                  Assign Bed
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemovePatientFromBed(patient.id)}
                                disabled={!isReceptionist && !isDoctor}
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500">
                          No patients found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Critical Patients</CardTitle>
              <CardDescription>
                Patients requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Bed ID</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Blood Type</th>
                      <th className="text-left py-3 px-4 font-medium">Admission Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.filter(patient => patient.patientState === 'Critical' || patient.patientState === 'Emergency').length > 0 ? (
                      filteredPatients.filter(patient => patient.patientState === 'Critical' || patient.patientState === 'Emergency').map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{patient.lastName}, {patient.firstName}</td>
                          <td className="py-3 px-4">{patient.bedId}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              patient.patientState === 'Critical' || patient.patientState === 'Emergency'
                                ? 'bg-red-100 text-red-800'
                                : patient.patientState === 'Stable'
                                ? 'bg-green-100 text-green-800'
                                : patient.patientState === 'Improving'
                                ? 'bg-blue-100 text-blue-800'
                                : patient.patientState === 'Worsening'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {patient.patientState}
                            </span>
                          </td>
                          <td className="py-3 px-4">{patient.bloodType}</td>
                          <td className="py-3 px-4">{patient.admissionDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "View Patient",
                                    description: `Viewing details for ${patient.firstName} ${patient.lastName}`
                                  });
                                }}
                              >
                                View
                              </Button>
                              
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => openPrescriptionModal(patient.id)}
                              >
                                Prescribe
                              </Button>
                              
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemovePatientFromBed(patient.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-500">
                          No critical patients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stable" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Stable Patients</CardTitle>
              <CardDescription>
                Patients in stable or improving condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Bed ID</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Blood Type</th>
                      <th className="text-left py-3 px-4 font-medium">Admission Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.filter(patient => patient.patientState === 'Stable' || patient.patientState === 'Improving').length > 0 ? (
                      filteredPatients.filter(patient => patient.patientState === 'Stable' || patient.patientState === 'Improving').map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{patient.lastName}, {patient.firstName}</td>
                          <td className="py-3 px-4">{patient.bedId}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              patient.patientState === 'Critical' || patient.patientState === 'Emergency'
                                ? 'bg-red-100 text-red-800'
                                : patient.patientState === 'Stable'
                                ? 'bg-green-100 text-green-800'
                                : patient.patientState === 'Improving'
                                ? 'bg-blue-100 text-blue-800'
                                : patient.patientState === 'Worsening'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {patient.patientState}
                            </span>
                          </td>
                          <td className="py-3 px-4">{patient.bloodType}</td>
                          <td className="py-3 px-4">{patient.admissionDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "View Patient",
                                    description: `Viewing details for ${patient.firstName} ${patient.lastName}`
                                  });
                                }}
                              >
                                View
                              </Button>
                              
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => openPrescriptionModal(patient.id)}
                              >
                                Prescribe
                              </Button>
                              
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemovePatientFromBed(patient.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-500">
                          No stable or improving patients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Patient</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={newPatient.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={newPatient.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  name="county"
                  value={newPatient.county}
                  onChange={handleInputChange}
                  placeholder="County"
                />
              </div>
              
              <div>
                <Label htmlFor="town">Town</Label>
                <Input
                  id="town"
                  name="town"
                  value={newPatient.town}
                  onChange={handleInputChange}
                  placeholder="Town"
                />
              </div>
              
              <div>
                <Label htmlFor="address.street">Street</Label>
                <Input
                  id="address.street"
                  name="address.street"
                  value={newPatient.address?.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="address.streetNumber">Street Number</Label>
                  <Input
                    id="address.streetNumber"
                    name="address.streetNumber"
                    value={newPatient.address?.streetNumber}
                    onChange={handleInputChange}
                    placeholder="Number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address.flatNumber">Flat Number</Label>
                  <Input
                    id="address.flatNumber"
                    name="address.flatNumber"
                    value={newPatient.address?.flatNumber}
                    onChange={handleInputChange}
                    placeholder="Flat"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={newPatient.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newPatient.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  name="profession"
                  value={newPatient.profession}
                  onChange={handleInputChange}
                  placeholder="Profession"
                />
              </div>
              
              <div>
                <Label htmlFor="job">Job</Label>
                <Input
                  id="job"
                  name="job"
                  value={newPatient.job}
                  onChange={handleInputChange}
                  placeholder="Job"
                />
              </div>
              
              <div>
                <Label htmlFor="patientState">Patient State *</Label>
                <Select 
                  value={newPatient.patientState} 
                  onValueChange={(value) => handleSelectChange('patientState', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stable">Stable</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Improving">Improving</SelectItem>
                    <SelectItem value="Worsening">Worsening</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="bedId">Bed ID *</Label>
                <Input
                  id="bedId"
                  name="bedId"
                  value={newPatient.bedId}
                  onChange={handleInputChange}
                  placeholder="Bed ID"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Select 
                  value={newPatient.sex} 
                  onValueChange={(value) => handleSelectChange('sex', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select 
                  value={newPatient.bloodType} 
                  onValueChange={(value) => handleSelectChange('bloodType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  value={newPatient.admissionDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddPatientModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPatient}>
                Add Patient
              </Button>
            </div>
          </div>
        </div>
      )}

      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Prescription</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="medication">Medication *</Label>
                <Input
                  id="medication"
                  name="medication"
                  value={newPrescription.medication}
                  onChange={handlePrescriptionInputChange}
                  placeholder="Medication name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={newPrescription.dosage}
                  onChange={handlePrescriptionInputChange}
                  placeholder="e.g., 250mg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  name="frequency"
                  value={newPrescription.frequency}
                  onChange={handlePrescriptionInputChange}
                  placeholder="e.g., Every 8 hours"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newPrescription.startDate}
                    onChange={handlePrescriptionInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newPrescription.endDate}
                    onChange={handlePrescriptionInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="prescribedBy">Prescribed By</Label>
                <Input
                  id="prescribedBy"
                  name="prescribedBy"
                  value={newPrescription.prescribedBy}
                  onChange={handlePrescriptionInputChange}
                  placeholder="Doctor's name"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={newPrescription.notes}
                  onChange={handlePrescriptionInputChange}
                  placeholder="Additional notes"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsPrescriptionModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPrescription}>
                  Add Prescription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBedAssignmentModalOpen && selectedPatientId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Assign Bed to Patient</h3>
            
            <PatientBedAssignment 
              patientId={selectedPatientId}
              patientName={
                patients.find(p => p.id === selectedPatientId)?.firstName + ' ' + 
                patients.find(p => p.id === selectedPatientId)?.lastName
              }
              onAssignmentComplete={handleBedAssignment}
              isReceptionist={isReceptionist}
            />
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsBedAssignmentModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
