"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const AdminPanelPage = () => {
  const { user, signOut } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, role, created_at')
          .neq('role', 'admin'); // Get only patients
        
        if (error) throw error;
        setPatients(data);
      } catch (error) {
        toast.error('Error al cargar pacientes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Panel de Administrador</h1>
            <p className="text-gray-600">Gestión de pacientes y su progreso</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={signOut} 
            className="text-lg"
          >
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle>Pacientes Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <p className="text-center">No hay pacientes registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Correo</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Último Acceso</TableCell>
                    </TableRow>
                  </TableHeader>
                  {patients.map(patient => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.role}</TableCell>
                      <TableCell>{new Date(patient.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>Resumen del progreso general</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total de pacientes: {patients.length}</p>
                <p className="text-sm text-gray-500">Registros semanales: En progreso</p>
                <p className="text-sm text-gray-500">Promedio de progreso: -</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;