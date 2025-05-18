
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { hasPermission } from '@/utils/permissions';
import type { Patient } from '@/types/patient';
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
  
  return (
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
                        onViewPatient(patient.id);
                      }}
                    >
                      View
                    </Button>
                    
                    {isDoctor && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => onPrescribe(patient.id)}
                      >
                        Prescribe
                      </Button>
                    )}
                    
                    {isReceptionist && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => onAssignBed(patient.id)}
                      >
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
  );
};

export default PatientTable;
