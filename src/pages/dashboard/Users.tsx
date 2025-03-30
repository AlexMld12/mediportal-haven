
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const SAMPLE_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@mediport.hospital', role: 'Administrator', status: 'Active' },
  { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@mediport.hospital', role: 'Doctor', status: 'Active' },
  { id: 3, name: 'Robert Chen', email: 'robert.chen@mediport.hospital', role: 'Pharmacist', status: 'Active' },
  { id: 4, name: 'Emily Rodriguez', email: 'emily.rodriguez@mediport.hospital', role: 'Nurse', status: 'Inactive' },
  { id: 5, name: 'Michael Thompson', email: 'michael.thompson@mediport.hospital', role: 'Transport Tech', status: 'Active' },
];

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
};

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (userId: number) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        toast({
          title: `User ${newStatus}`,
          description: `${user.name} is now ${newStatus.toLowerCase()}`
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-600 mt-1">
          Manage system users and their permissions
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and access permissions
              </CardDescription>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => {
                  toast({
                    title: "Feature coming soon",
                    description: "User creation will be available in a future update."
                  });
                }}
              >
                Add New User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search Users</Label>
            <Input 
              id="search" 
              placeholder="Search by name, email, or role..."
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
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          user.role === 'Administrator' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'Doctor'
                            ? 'bg-blue-100 text-blue-800'
                            : user.role === 'Pharmacist'
                            ? 'bg-green-100 text-green-800'
                            : user.role === 'Nurse'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Edit User",
                                description: `Editing ${user.name} will be available soon.`
                              });
                            }}
                          >
                            Edit
                          </Button>
                          
                          <Button 
                            variant={user.status === 'Active' ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleStatusToggle(user.id)}
                          >
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No users found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
