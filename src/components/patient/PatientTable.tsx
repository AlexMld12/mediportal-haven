
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, FileText, Home, Trash2, RefreshCw } from "lucide-react";
import { hasPermission } from '@/utils/permissions';
import PatientDetailsModal from './PatientDetailsModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [isDeletingPatient, setIsDeletingPatient] = useState<number | null>(null);

  const fetchPatientDetails = async (patientId: number) => {
    setIsLoading(patientId);
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
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
      const patient = patients.find(p => p.id === patientId);
      
      if (!patient || !patient.CNP) {
        throw new Error("Patient not found or missing CNP");
      }
      
      const response = await fetch(`http://132.220.27.51/angajati/medic/${patient.CNP}`, {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
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
  
  const handleDeletePatient = async (patient: Patient) => {
    if (!patient.CNP) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot delete patient without CNP"
      });
      return;
    }
    
    setIsDeletingPatient(patient.id);
    
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      const finalToken = authToken || token;
      
      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to delete patients"
        });
        return;
      }

      console.log(`Deleting patient with CNP ${patient.CNP}`);
      const response = await fetch(`http://132.220.27.51/angajati/medic/${patient.CNP}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete patient: ${response.status}`);
      }

      // Call the onRemovePatient callback to update the UI
      onRemovePatient(patient.id);
      
      toast({
        title: "Patient Removed",
        description: `${patient.prenume} ${patient.nume} has been removed successfully`
      });
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete patient. Please try again."
      });
    } finally {
      setIsDeletingPatient(null);
    }
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Bed ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.nume}, {patient.prenume}</TableCell>
                  <TableCell>{patient.room || 'Not assigned'}</TableCell>
                  <TableCell>{patient.id_pat || 'N/A'}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{patient.grupa_sange || 'Unknown'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fetchPatientDetails(patient.id)}
                        disabled={isLoading === patient.id}
                      >
                        {isLoading === patient.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            Loading...
                          </>
                        ) : (
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
                      
                      {(isReceptionist || isDoctor) && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePatient(patient)}
                          disabled={isDeletingPatient === patient.id}
                        >
                          {isDeletingPatient === patient.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
