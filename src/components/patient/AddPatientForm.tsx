
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewPatient } from '@/types/patient';

type AddPatientFormProps = {
  newPatient: NewPatient;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onAddPatient: () => void;
  onCancel: () => void;
};

const AddPatientForm: React.FC<AddPatientFormProps> = ({
  newPatient,
  onInputChange,
  onSelectChange,
  onAddPatient,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Add New Patient</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={newPatient.firstName}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="County"
          />
        </div>
        
        <div>
          <Label htmlFor="town">Town</Label>
          <Input
            id="town"
            name="town"
            value={newPatient.town}
            onChange={onInputChange}
            placeholder="Town"
          />
        </div>
        
        <div>
          <Label htmlFor="address.street">Street</Label>
          <Input
            id="address.street"
            name="address.street"
            value={newPatient.address?.street}
            onChange={onInputChange}
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
              onChange={onInputChange}
              placeholder="Number"
            />
          </div>
          
          <div>
            <Label htmlFor="address.flatNumber">Flat Number</Label>
            <Input
              id="address.flatNumber"
              name="address.flatNumber"
              value={newPatient.address?.flatNumber}
              onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="Email address"
          />
        </div>
        
        <div>
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            name="profession"
            value={newPatient.profession}
            onChange={onInputChange}
            placeholder="Profession"
          />
        </div>
        
        <div>
          <Label htmlFor="job">Job</Label>
          <Input
            id="job"
            name="job"
            value={newPatient.job}
            onChange={onInputChange}
            placeholder="Job"
          />
        </div>
        
        <div>
          <Label htmlFor="patientState">Patient State *</Label>
          <Select 
            value={newPatient.patientState} 
            onValueChange={(value) => onSelectChange('patientState', value)}
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
            onChange={onInputChange}
            placeholder="Bed ID"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="sex">Sex</Label>
          <Select 
            value={newPatient.sex} 
            onValueChange={(value) => onSelectChange('sex', value)}
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
            onValueChange={(value) => onSelectChange('bloodType', value)}
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
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAddPatient}>
          Add Patient
        </Button>
      </div>
    </div>
  );
};

export default AddPatientForm;
