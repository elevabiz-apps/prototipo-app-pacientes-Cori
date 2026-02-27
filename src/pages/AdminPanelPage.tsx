import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPanelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Gestión completa del sistema</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          >
            Volver al Dashboard
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Leads Totales</span>
              </CardTitle>
              <CardDescription>Número total de leads registrados</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-500">leads</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Leads Calificados</span>
              </CardTitle>
              <CardDescription>Leads que han sido calificados</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-gray-500">leads</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Leads No Calificados</span>
              </CardTitle>
              <CardDescription>Leads que no cumplen los criterios</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-3xl font-bold text-red-600">0</p>
              <p className="text-gray-500">leads</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Leads Recientes</CardTitle>
            <CardDescription>Lista de los últimos leads registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Teléfono</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-left p-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">No hay datos</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanelPage;