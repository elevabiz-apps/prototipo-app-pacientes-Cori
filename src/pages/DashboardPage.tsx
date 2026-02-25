"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Scale, Ruler, TrendingDown, Target, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

const DashboardPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goals | null>(null);
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [currentWeekProgress, setCurrentWeekProgress] = useState(0);

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
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  }, [navigate]);

  useEffect(() => {
    if (logs.length > 0 && goals) {
      const latestLog = logs[0];
      const weightProgress = ((goals.initialWeight - latestLog.weight) / (goals.initialWeight - goals.targetWeight)) * 100;
      const waistProgress = ((goals.initialWaist - latestLog.waist) / (goals.initialWaist - goals.targetWaist)) * 100;
      setCurrentWeekProgress(Math.min(100, Math.max(0, (weightProgress + waistProgress) / 2)));
    }
  }, [logs, goals]);

  const calculateStats = () => {
    if (!logs.length || !goals) return null;

    const latestLog = logs[0];
    const weightLost = goals.initialWeight - latestLog.weight;
    const waistLost = goals.initialWaist - latestLog.waist;
    const weeksActive = logs.length;
    const avgWeightLossPerWeek = weightLost / weeksActive;
    const avgWaistLossPerWeek = waistLost / weeksActive;

    return {
      weightLost,
      waistLost,
      weeksActive,
      avgWeightLossPerWeek,
      avgWaistLossPerWeek,
      currentWeight: latestLog.weight,
      currentWaist: latestLog.waist,
    };
  };

  const stats = calculateStats();

  if (!goals) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Progreso</h1>
            <p className="text-gray-600">Seguimiento de tu journey de pérdida de peso</p>
          </div>
          <Button 
            onClick={() => navigate('/log')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 text-lg shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Registrar Semana
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Peso Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Scale className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats?.currentWeight.toFixed(1) || '--'} kg</div>
                  <p className="text-sm text-gray-500">
                    Inicial: {goals.initialWeight} kg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Cintura Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Ruler className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats?.currentWaist.toFixed(1) || '--'} cm</div>
                  <p className="text-sm text-gray-500">
                    Inicial: {goals.initialWaist} cm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Pérdida Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats ? `-${stats.weightLost.toFixed(1)} kg` : '--'}
                  </div>
                  <p className="text-sm text-gray-500">
                    Meta: -{(goals.initialWeight - goals.targetWeight).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Progreso General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-orange-600 mr-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {currentWeekProgress.toFixed(0)}%
                  </div>
                </div>
                <Progress value={currentWeekProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Resumen del Progreso</CardTitle>
              <CardDescription>Estadísticas de las últimas semanas</CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Semanas Activas</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.weeksActive}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Promedio/Semana</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.avgWeightLossPerWeek.toFixed(2)} kg</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Cintura Perdida</p>
                      <p className="text-2xl font-bold text-green-900">{stats.waistLost.toFixed(1)} cm</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Restante</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {(goals.initialWeight - stats.currentWeight).toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay registros aún</p>
                  <Button onClick={() => navigate('/log')} className="mt-4">
                    Registrar Primera Semana
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Metas</CardTitle>
              <CardDescription>Tus objetivos a alcanzar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Peso Inicial</span>
                  <span className="font-bold">{goals.initialWeight} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Peso Objetivo</span>
                  <span className="font-bold text-green-600">{goals.targetWeight} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Cintura Inicial</span>
                  <span className="font-bold">{goals.initialWaist} cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Cintura Objetivo</span>
                  <span className="font-bold text-green-600">{goals.targetWaist} cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Altura</span>
                  <span className="font-bold">{goals.height} cm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Historial de Registros</CardTitle>
            <CardDescription>Todas tus mediciones semanales</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Fecha</th>
                      <th className="text-left p-3">Peso (kg)</th>
                      <th className="text-left p-3">Cintura (cm)</th>
                      <th className="text-left p-3">Errores</th>
                      <th className="text-left p-3">Actividad</th>
                      <th className="text-left p-3">Sueño (h)</th>
                      <th className="text-left p-3">Agua (L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{new Date(log.date).toLocaleDateString()}</td>
                        <td className="p-3 font-medium">{log.weight}</td>
                        <td className="p-3">{log.waist}</td>
                        <td className="p-3">{log.errors}</td>
                        <td className="p-3">{log.physicalActivity ? '✅' : '❌'}</td>
                        <td className="p-3">{log.sleep}h</td>
                        <td className="p-3">{log.water}L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay registros aún</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;