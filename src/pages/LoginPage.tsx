"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LoginPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Cuenta creada exitosamente. Por favor inicia sesión.');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast.success('¡Bienvenido de vuelta!');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud');
      toast.error('Error al procesar la solicitud');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Únete a nuestra comunidad de salud' : 'Accede a tu cuenta'}
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@paciente.com"
                disabled={loading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
              disabled={loading}
            >
              {loading ? 'Cargando...' : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>
            
            <div className="mt-4">
              {isSignUp ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsSignUp(false)} 
                  className="w-full"
                >
                  ¿Ya tienes cuenta? Iniciar Sesión
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsSignUp(true)} 
                  className="w-full"
                >
                  ¿Aún no tienes cuenta? Crear Cuenta
                </Button>
              )}
            </div>
          </div>
          
          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center mb-2">Demo credentials:</p>
            <p className="text-xs text-gray-600 text-center">Email: CorinaAraya@demo.com</p>
            <p className="text-xs text-gray-600 text-center">Password: AppCorina2026$</p>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default LoginPage;