"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Target, Ruler, Scale } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Goals {
  startDate: Date | undefined;
  endDate: Date | undefined;
  initialWeight: number;
  targetWeight: number;
  initialWaist: number;
  targetWaist: number;
  height: number;
}

const GoalsPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goals>({
    startDate: new Date(),
    endDate: undefined,
    initialWeight: 0,
    targetWeight: 0,
    initialWaist: 0,
    targetWaist: 0,
    height: 0,
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('weightLossGoals');
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals);
      setGoals({
        ...parsed,
        startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
        endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
      });
    }
  }, []);

  const handleSave = () => {
    if (!goals.startDate || !goals.endDate || !goals.initialWeight || !goals.targetWeight || !goals.initialWaist || !goals.targetWaist || !goals.height) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (goals.targetWeight >= goals.initialWeight) {
      toast.error('El peso objetivo debe ser menor al peso inicial');
      return;
    }

    if (goals.targetWaist >= goals.initialWaist) {
      toast.error('La cintura objetivo debe ser menor a la cintura inicial');
      return;
    }

    localStorage.setItem('weightLossGoals', JSON.stringify(goals));
    toast.success('Metas guardadas exitosamente');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Metas de Peso</h1>
          <p className="text-gray-600">Configura tus objetivos para comenzar tu journey</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
                Fechas del Programa
              </CardTitle>
              <CardDescription>Define la duración de tu plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !goals.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {goals.startDate ? format(goals.startDate, "PPP") : "Selecciona fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={goals.startDate}
                      onSelect={(date) => setGoals({ ...goals, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Finalización</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !goals.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {goals.endDate ? format(goals.endDate, "PPP") : "Selecciona fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={goals.endDate}
                      onSelect={(date) => setGoals({ ...goals, endDate: date })}
                      initialFocus
                      disabled={(date) => date < (goals.startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Medidas Iniciales
              </CardTitle>
              <CardDescription>Tus medidas actuales y objetivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={goals.height || ''}
                  onChange={(e) => setGoals({ ...goals, height: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 165"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialWeight">Peso Inicial (kg)</Label>
                <Input
                  id="initialWeight"
                  type="number"
                  step="0.1"
                  value={goals.initialWeight || ''}
                  onChange={(e) => setGoals({ ...goals, initialWeight: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 75.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight">Peso Objetivo (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={goals.targetWeight || ''}
                  onChange={(e) => setGoals({ ...goals, targetWeight: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 65.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialWaist">Cintura Inicial (cm)</Label>
                <Input
                  id="initialWaist"
                  type="number"
                  step="0.1"
                  value={goals.initialWaist || ''}
                  onChange={(e) => setGoals({ ...goals, initialWaist: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWaist">Cintura Objetivo (cm)</Label>
                <Input
                  id="targetWaist"
                  type="number"
                  step="0.1"
                  value={goals.targetWaist || ''}
                  onChange={(e) => setGoals({ ...goals, targetWaist: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 75"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => navigate('/')} className="px-8">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 text-lg">
            Guardar Metas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;