import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Target, Plus, TrendingUp, BarChart3, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Mis Metas",
      description: "Configura tu peso inicial, objetivo y fechas del programa",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      action: () => navigate("/goals"),
    },
    {
      title: "Registrar Semana",
      description: "Ingresa tu peso, cintura y hábitos de la semana",
      icon: Plus,
      color: "from-green-500 to-emerald-600",
      action: () => navigate("/log"),
    },
    {
      title: "Mi Progreso",
      description: "Visualiza tu evolución y estadísticas",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      action: () => navigate("/dashboard"),
    },
    {
      title: "Gráficos",
      description: "Análisis detallado con gráficos interactivos",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      action: () => navigate("/progress"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Weight Loss Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu compañero personal para alcanzar tus metas de peso. 
            Registra tu progreso, visualiza tus logros y mantente motivado.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:shadow-xl transition-all cursor-pointer group"
              onClick={feature.action}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90`}>
                  Ir a {feature.title}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Comienza tu journey hoy</CardTitle>
            <CardDescription>
              Esta aplicación te permite:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Configura tus metas</h4>
                  <p className="text-sm text-gray-600">Define tu peso inicial, objetivo y período del programa</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Registra tu progreso semanal</h4>
                  <p className="text-sm text-gray-600">Anota peso, cintura y tus hábitos cada semana</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Visualiza tu evolución</h4>
                  <p className="text-sm text-gray-600">Gráficos interactivos de peso, cintura y hábitos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Autoevalúa tu estado</h4>
                  <p className="text-sm text-gray-600">Respuestas sobre tu energía y antojos</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/goals")} className="bg-gradient-to-r from-blue-500 to-indigo-600">
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
              Ver Demo
            </Button>
          </CardFooter>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;