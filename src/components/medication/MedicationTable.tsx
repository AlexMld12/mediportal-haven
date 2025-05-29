
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Medication = {
  id: number;
  nume: string;
  concentratie: string;
  forma_farmaceutica: string;
  pret: number;
  disponibilitate: boolean;
};

type MedicationTableProps = {
  medications: Medication[];
  onRefresh: () => void;
};

const MedicationTable: React.FC<MedicationTableProps> = ({ medications, onRefresh }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Medications List</h3>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Concentration</TableHead>
              <TableHead>Pharmaceutical Form</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.length > 0 ? (
              medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.nume}</TableCell>
                  <TableCell>{medication.concentratie}</TableCell>
                  <TableCell>{medication.forma_farmaceutica}</TableCell>
                  <TableCell>${medication.pret}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      medication.disponibilitate
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {medication.disponibilitate ? 'Available' : 'Unavailable'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No medications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicationTable;
