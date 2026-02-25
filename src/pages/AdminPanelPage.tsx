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
    // Only fetch patients if user is admin
    if (user?.role === 'admin') {
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
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p className="text-center py-8">Cargando...</p>;

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder al panel de administrador.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-indigo-600 to-purple-600">
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

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
                  <TableHead>
                    <TableRow>
                      <TableCell>Correo</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Fecha de Registro</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map(patient => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Paciente
                          </span>
                        </TableCell>
                        <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <p className="text-sm text-gray-500">Resumen del progreso general</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total de pacientes: {patients.length}</p>
                <p className="text-sm text-gray-500">Registros semanales: En progreso</p>
                <p className="text-sm text-gray-500">Promedio de progreso: -</p>
              </div>
              
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Información del Administrador</h4>
                <p className="text-sm text-indigo-700">Email: {user.email}</p>
                <p className="text-sm text-indigo-700">Rol: Administrador</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;