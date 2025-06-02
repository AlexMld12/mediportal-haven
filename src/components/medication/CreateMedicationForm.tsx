
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Medication = {
  id: number;
  id_medicament: string;
  denumire: string;
  concentratie: string;
  forma_farmaceutica: string;
  pret: number;
  stoc: number;
  disponibilitate: boolean;
};

type CreateMedicationFormProps = {
  onCreateMedication: (medication: Omit<Medication, 'id'>) => void;
  onCancel: () => void;
};

const CreateMedicationForm: React.FC<CreateMedicationFormProps> = ({
  onCreateMedication,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    id_medicament: '',
    denumire: '',
    concentratie: '',
    forma_farmaceutica: '',
    pret: '',
    stoc: '',
    disponibilitate: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      disponibilitate: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_medicament || !formData.denumire || !formData.concentratie || !formData.forma_farmaceutica || !formData.pret || !formData.stoc) {
      return;
    }

    onCreateMedication({
      id_medicament: formData.id_medicament,
      denumire: formData.denumire,
      concentratie: formData.concentratie,
      forma_farmaceutica: formData.forma_farmaceutica,
      pret: parseFloat(formData.pret),
      stoc: parseInt(formData.stoc),
      disponibilitate: formData.disponibilitate
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">Add New Medication</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="id_medicament">Medication ID *</Label>
          <Input
            id="id_medicament"
            name="id_medicament"
            value={formData.id_medicament}
            onChange={handleInputChange}
            placeholder="Medication ID"
            required
          />
        </div>

        <div>
          <Label htmlFor="denumire">Name *</Label>
          <Input
            id="denumire"
            name="denumire"
            value={formData.denumire}
            onChange={handleInputChange}
            placeholder="Medication name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="concentratie">Concentration *</Label>
          <Input
            id="concentratie"
            name="concentratie"
            value={formData.concentratie}
            onChange={handleInputChange}
            placeholder="e.g., 250mg"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="forma_farmaceutica">Pharmaceutical Form *</Label>
          <Input
            id="forma_farmaceutica"
            name="forma_farmaceutica"
            value={formData.forma_farmaceutica}
            onChange={handleInputChange}
            placeholder="e.g., Tablet, Capsule"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="pret">Price *</Label>
          <Input
            id="pret"
            name="pret"
            type="number"
            step="0.01"
            value={formData.pret}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="stoc">Stock *</Label>
          <Input
            id="stoc"
            name="stoc"
            type="number"
            value={formData.stoc}
            onChange={handleInputChange}
            placeholder="0"
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="disponibilitate"
            checked={formData.disponibilitate}
            onCheckedChange={handleAvailabilityChange}
          />
          <Label htmlFor="disponibilitate">Available</Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Medication
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMedicationForm;
