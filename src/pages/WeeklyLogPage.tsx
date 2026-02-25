"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WeeklyLog {
  id: string;
  date: string;
  weight: number;
  waist: number;
  errors: number;
  physicalActivity: boolean;
  sleep: number;
  meditation: boolean;
  water: number;
  bodyWeightPerception: 'alta' | 'media' | 'baja';
  energy: 'alta' | 'media' | 'baja';
  sugarCraving: 'permanente' | 'frecuente' | 'poco' | 'nada';
}

const WeeklyLogPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<Omit<WeeklyLog, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    waist: 0,
    errors: 0,
    physicalActivity: false,
    sleep: 0,
    meditation: false,
    water: 0,
    bodyWeightPerception: 'media',
    energy: 'media',
    sugarCraving: 'poco',
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('weightLossGoals');
    if (!savedGoals) {
      toast.info('Primero configura tus metas');
      navigate('/goals');
      return;
    }
    setGoals(JSON.parse(savedGoals));
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.weight || !formData.waist) {
      toast.error('Por favor completa peso y cintura');
      return;
    }

    const newLog: WeeklyLog = {
      ...formData,
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
    };

    const existingLogs = JSON.parse(localStorage.getItem('weeklyLogs') || '[]');
    existingLogs.push(newLog);
    localStorage.setItem('weeklyLogs', JSON.stringify(existingLogs));

    toast.success('Registro guardado exitosamente');
    navigate('/');
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!goals) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Registro Semanal</h1>
          <p className="text-gray-600">Registra tus medidas y hábitos de la semana</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Fecha de Registro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Selecciona fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle>Medidas Corporales</CardTitle>
                <CardDescription>Peso y cintura de esta semana</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 72.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    value={formData.waist || ''}
                    onChange={(e) => handleInputChange('waist', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 88"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle>Hábitos Semanales</CardTitle>
                <CardDescription>¿Cómo te fue esta semana?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>¿Tuviste errores en el plan alimentario?</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.errors}
                    onChange={(e) => handleInputChange('errors', parseInt(e.target.value) || 0)}
                    placeholder="Número de veces"
                  />
                </div>

                <div className="space-y-2">
                  <Label>¿Realizaste actividad física?</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="physicalActivity"
                      checked={formData.physicalActivity}
                      onCheckedChange={(checked) => 
                        handleInputChange('physicalActivity', checked === true)
                      }
                    />
                    <Label htmlFor="physicalActivity" className="cursor-pointer">
                      Sí, realicé ejercicio
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleep">Horas de sueño (promedio)</Label>
                  <Input
                    id="sleep"
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.sleep}
                    onChange={(e) => handleInputChange('sleep', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 7.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>¿Meditaste/relajaste?</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meditation"
                      checked={formData.meditation}
                      onCheckedChange={(checked) => 
                        handleInputChange('meditation', checked === true)
                      }
                    />
                    <Label htmlFor="meditation" className="cursor-pointer">
                      Sí, practiqué meditación
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="water">Consumo de agua (litros/día)</Label>
                  <Input
                    id="water"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.water}
                    onChange={(e) => handleInputChange('water', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 2.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 shadow-lg">
              <CardHeader>
                <CardTitle>Autoevaluación</CardTitle>
                <CardDescription>¿Cómo te sientes?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>¿Cómo percibes tu peso corporal?</Label>
                  <RadioGroup
                    value={formData.bodyWeightPerception}
                    onValueChange={(value) => 
                      handleInputChange('bodyWeightPerception', value as 'alta' | 'media' | 'baja')
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alta" id="weight-alta" />
                      <Label htmlFor="weight-alta">Alta (inflado)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="weight-media" />
                      <Label htmlFor="weight-media">Media (normal)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="baja" id="weight-baja" />
                      <Label htmlFor="weight-baja">Baja (desinflado)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>¿Cómo está tu nivel de energía?</Label>
                  <RadioGroup
                    value={formData.energy}
                    onValueChange={(value) => 
                      handleInputChange('energy', value as 'alta' | 'media' | 'baja')
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alta" id="energy-alta" />
                      <Label htmlFor="energy-alta">Alta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="energy-media" />
                      <Label htmlFor="energy-media">Media</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="baja" id="energy-baja" />
                      <Label htmlFor="energy-baja">Baja</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>¿Qué tan frecuente es el impulso de azúcar/harinas?</Label>
                  <RadioGroup
                    value={formData.sugarCraving}
                    onValueChange={(value) => 
                      handleInputChange('sugarCraving', value as 'permanente' | 'frecuente' | 'poco' | 'nada')
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="permanente" id="craving-permanente" />
                      <Label htmlFor="craving-permanente">Permanente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="frecuente" id="craving-frecuente" />
                      <Label htmlFor="craving-frecuente">Frecuente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poco" id="craving-poco" />
                      <Label htmlFor="craving-poco">Poco</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nada" id="craving-nada" />
                      <Label htmlFor="craving-nada">Nada</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="px-8"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-6 text-lg"
            >
              <Save className="mr-2 h-5 w-5" />
              Guardar Registro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklyLogPage;