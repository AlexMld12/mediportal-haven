
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientBedAssignment from '@/components/patient/PatientBedAssignment';
import PatientTable from '@/components/patient/PatientTable';
import AddPatientForm from '@/components/patient/AddPatientForm';
import AddPrescriptionForm from '@/components/patient/AddPrescriptionForm';
import { SAMPLE_PATIENTS } from '@/data/samplePatients';
import { hasPermission } from '@/utils/permissions';
import type { Patient, NewPatient, NewPrescription, PatientState } from '@/types/patient';
import type { UserRole } from '@/utils/permissions';

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
      sex: newPatient.sex || 'Male',
      bloodType: newPatient.bloodType || 'O+',
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
        
        const prescriptionToAdd = {
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
  
  const handleViewPatient = (patientId: number) => {
    // In a real app, this would navigate to a patient details page
    toast({
      title: "View Patient",
      description: `Viewing details for patient #${patientId}`
    });
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
              
              <PatientTable 
                patients={filteredPatients}
                onViewPatient={handleViewPatient}
                onPrescribe={openPrescriptionModal}
                onAssignBed={openBedAssignmentModal}
                onRemovePatient={handleRemovePatientFromBed}
                userRole={currentUserRole}
              />
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
              <PatientTable 
                patients={filteredPatients.filter(patient => 
                  patient.patientState === 'Critical' || patient.patientState === 'Emergency'
                )}
                onViewPatient={handleViewPatient}
                onPrescribe={openPrescriptionModal}
                onAssignBed={openBedAssignmentModal}
                onRemovePatient={handleRemovePatientFromBed}
                userRole={currentUserRole}
              />
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
              <PatientTable 
                patients={filteredPatients.filter(patient => 
                  patient.patientState === 'Stable' || patient.patientState === 'Improving'
                )}
                onViewPatient={handleViewPatient}
                onPrescribe={openPrescriptionModal}
                onAssignBed={openBedAssignmentModal}
                onRemovePatient={handleRemovePatientFromBed}
                userRole={currentUserRole}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddPatientForm 
            newPatient={newPatient}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onAddPatient={handleAddPatient}
            onCancel={() => setIsAddPatientModalOpen(false)}
          />
        </div>
      )}

      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddPrescriptionForm 
            newPrescription={newPrescription}
            onInputChange={handlePrescriptionInputChange}
            onAddPrescription={handleAddPrescription}
            onCancel={() => setIsPrescriptionModalOpen(false)}
          />
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
