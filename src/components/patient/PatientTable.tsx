
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, FileText, Home, Trash2 } from "lucide-react";
import { hasPermission } from '@/utils/permissions';
import PatientDetailsModal from './PatientDetailsModal';
import type { Patient, APIPatient } from '@/types/patient';
import type { UserRole } from '@/utils/permissions';

type PatientTableProps = {
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
  onPrescribe: (patientId: number) => void;
  onAssignBed: (patientId: number) => void;
  onRemovePatient: (patientId: number) => void;
  userRole: UserRole;
};

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onViewPatient,
  onPrescribe,
  onAssignBed,
  onRemovePatient,
  userRole
}) => {
  const { toast } = useToast();
  const isReceptionist = hasPermission(userRole, 'assign_beds');
  const isDoctor = hasPermission(userRole, 'manage_patients');
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<number | null>(null);

  const fetchPatientDetails = async (patientId: number) => {
    setIsLoading(patientId);
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const finalToken = authToken || token;
      
      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to view patient details"
        });
        return;
      }

      console.log(`Fetching details for patient ID ${patientId}`);
      const response = await fetch(`http://132.220.27.51/angajati/medic/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch patient details: ${response.status}`);
      }

      const data: APIPatient = await response.json();
      console.log("Patient API data:", data);
      
      // Find the patient in the current list to get additional data
      const currentPatient = patients.find(p => p.id === patientId);
      
      if (currentPatient) {
        const fullPatientData: Patient = {
          ...currentPatient,
          CNP: data.CNP,
          nume: data.nume,
          prenume: data.prenume,
          judet: data.judet,
          localitate: data.localitate,
          strada: data.strada,
          nr_strada: data.nr_strada,
          scara: data.scara,
          apartament: data.apartament,
          telefon: data.telefon,
          email: data.email,
          profesie: data.profesie,
          loc_de_munca: data.loc_de_munca,
          sex: data.sex as 'M' | 'F' | 'Other',
          grupa_sange: data.grupa_sange,
          rh: data.rh as 'pozitiv' | 'negativ',
          id_pat: data.id_pat
        };
        
        setSelectedPatient(fullPatientData);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch patient details. Please try again."
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  return (
    <>
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
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.nume}, {patient.prenume}</td>
                  <td className="py-3 px-4">{patient.room || 'Not assigned'}</td>
                  <td className="py-3 px-4">{patient.id_pat}</td>
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
                  <td className="py-3 px-4">{patient.grupa_sange}</td>
                  <td className="py-3 px-4">{patient.admissionDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fetchPatientDetails(patient.id)}
                        disabled={isLoading === patient.id}
                      >
                        {isLoading === patient.id ? 'Loading...' : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </>
                        )}
                      </Button>
                      
                      {isDoctor && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => onPrescribe(patient.id)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Prescribe
                        </Button>
                      )}
                      
                      {isReceptionist && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => onAssignBed(patient.id)}
                        >
                          <Home className="w-4 h-4 mr-1" />
                          Assign Bed
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onRemovePatient(patient.id)}
                        disabled={!isReceptionist && !isDoctor}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
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

      <PatientDetailsModal 
        patient={selectedPatient} 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
};

export default PatientTable;
