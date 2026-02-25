"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, Ruler, Activity, Droplets, Moon, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'sonner';

interface Goals {
  startDate: string;
  endDate: string;
  initialWeight: number;
  targetWeight: number;
  initialWaist: number;
  targetWaist: number;
  height: number;
}

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

const ProgressPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goals | null>(null);
  const [logs, setLogs] = useState<WeeklyLog[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('weightLossGoals');
    if (!savedGoals) {
      toast.info('Primero configura tus metas');
      navigate('/goals');
      return;
    }
    setGoals(JSON.parse(savedGoals));

    const savedLogs = localStorage.getItem('weeklyLogs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      setLogs(parsedLogs.sort((a: WeeklyLog, b: WeeklyLog) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
    }
  }, [navigate]);

  const prepareWeightChartData = () => {
    return logs.map(log => ({
      fecha: new Date(log.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      peso: log.weight,
      objetivo: goals?.targetWeight || 0,
    }));
  };

  const prepareWaistChartData = () => {
    return logs.map(log => ({
      fecha: new Date(log.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      cintura: log.waist,
      objetivo: goals?.targetWaist || 0,
    }));
  };

  const prepareHabitsRadarData = () => {
    if (logs.length === 0) return [];
    
    const latestLog = logs[logs.length - 1];
    return [
      { habit: 'Actividad Física', value: latestLog.physicalActivity ? 100 : 0, fullMark: 100 },
      { habit: 'Sueño', value: Math.min(100, (latestLog.sleep / 8) * 100), fullMark: 100 },
      { habit: 'Meditación', value: latestLog.meditation ? 100 : 0, fullMark: 100 },
      { habit: 'Agua', value: Math.min(100, (latestLog.water / 2.5) * 100), fullMark: 100 },
      { habit: 'Control Errores', value: Math.max(0, 100 - latestLog.errors * 20), fullMark: 100 },
    ];
  };

  const getPerceptionValue = (perception: string) => {
    switch(perception) {
      case 'alta': return 100;
      case 'media': return 50;
      case 'baja': return 0;
      default: return 50;
    }
  };

  const prepareSelfAssessmentRadarData = () => {
    if (logs.length === 0) return [];
    
    const latestLog = logs[logs.length - 1];
    return [
      { aspect: 'Peso Corporal', value: getPerceptionValue(latestLog.bodyWeightPerception), fullMark: 100 },
      { aspect: 'Energía', value: getPerceptionValue(latestLog.energy), fullMark: 100 },
      { aspect: 'Control Azúcar', value: {
        'nada': 100,
        'poco': 75,
        'frecuente': 25,
        'permanente': 0
      }[latestLog.sugarCraving] || 50, fullMark: 100 },
    ];
  };

  if (!goals) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gráficos de Progreso</h1>
            <p className="text-gray-600">Visualiza tu evolución en el tiempo</p>
          </div>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6"
          >
            Volver al Dashboard
          </Button>
        </div>

        {logs.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <TrendingDown className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No hay datos aún</h3>
              <p className="text-gray-500 mb-6">Comienza registrando tu primera semana</p>
              <Button onClick={() => navigate('/log')} className="bg-gradient-to-r from-green-500 to-emerald-600">
                Registrar Primera Semana
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="weight" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weight" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Peso
              </TabsTrigger>
              <TabsTrigger value="waist" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Cintura
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Hábitos
              </TabsTrigger>
              <TabsTrigger value="selfAssessment" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Autoevaluación
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weight">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución del Peso</CardTitle>
                  <CardDescription>Gráfico de línea con tu progreso de peso</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={prepareWeightChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[goals.targetWeight - 2, goals.initialWeight + 2]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="peso" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Peso (kg)"
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="objetivo" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Objetivo"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="waist">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de la Cintura</CardTitle>
                  <CardDescription>Gráfico de barras con tus medidas de cintura</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={prepareWaistChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[goals.targetWaist - 5, goals.initialWaist + 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cintura" fill="#8b5cf6" name="Cintura (cm)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="objetivo" fill="#10b981" name="Objetivo" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="habits">
              <Card>
                <CardHeader>
                  <CardTitle>Hábitos Semanales</CardTitle>
                  <CardDescription>Radar chart de tus hábitos saludables</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareHabitsRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="habit" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Última semana" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {prepareHabitsRadarData().map((item, idx) => (
                      <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium">{item.habit}</p>
                        <p className="text-2xl font-bold text-blue-600">{Math.round(item.value)}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="selfAssessment">
              <Card>
                <CardHeader>
                  <CardTitle>Autoevaluación</CardTitle>
                  <CardDescription>Tu percepción corporal y nivel de energía</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareSelfAssessmentRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="aspect" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Última semana" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {prepareSelfAssessmentRadarData().map((item, idx) => (
                      <div key={idx} className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-900">{item.aspect}</p>
                        <p className="text-2xl font-bold text-purple-600">{Math.round(item.value)}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;