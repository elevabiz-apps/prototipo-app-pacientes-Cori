"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Plus, Send, Trash2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: string;
  availability: string;
  status: 'new' | 'qualified' | 'unqualified' | 'contacted';
  createdAt: Date;
  lastMessage: string;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const AgentChat = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular carga de leads (en producción, conectar a API o Supabase)
    const mockLeads = [
      {
        id: '1',
        name: 'María González',
        email: 'maria@example.com',
        phone: '+56912345678',
        goal: 'Perder 10kg',
        availability: 'Lunes y Miércoles 18:00',
        status: 'new',
        createdAt: new Date(),
        lastMessage: 'Hola, quiero saber más sobre el programa de pérdida de peso',
        messages: [
          { id: '1', text: 'Hola, quiero saber más sobre el programa de pérdida de peso', sender: 'user', timestamp: new Date() },
        ],
      },
      {
        id: '2',
        name: 'Ana Pérez',
        email: 'ana@example.com',
        phone: '+56987654321',
        goal: 'Mejorar mi alimentación',
        availability: 'Martes 10:00',
        status: 'qualified',
        createdAt: new Date(),
        lastMessage: '¿El programa incluye planes de comidas personalizados?',
        messages: [
          { id: '1', text: '¿El programa incluye planes de comidas personalizados?', sender: 'user', timestamp: new Date() },
          { id: '2', text: 'Sí, incluye planes de comidas personalizados según tus necesidades y objetivos. ¿Te gustaría agendar una llamada para discutir más detalles?', sender: 'agent', timestamp: new Date() },
        ],
      },
    ];
    setLeads(mockLeads);
  }, []);

  const handleSendMessage = async () => {
    if (!selectedLead || !newMessage.trim()) return;

    setLoading(true);
    try {
      // Simular envío de mensaje (en producción, enviar a API)
      const newMessageObj = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'agent',
        timestamp: new Date(),
      };

      const updatedLead = {
        ...selectedLead,
        messages: [...selectedLead.messages, newMessageObj],
        lastMessage: newMessage,
      };

      setLeads(leads.map(lead => lead.id === selectedLead.id ? updatedLead : lead));
      setSelectedLead(updatedLead);
      setNewMessage('');

      // Simular respuesta automática del agente
      setTimeout(() => {
        const agentResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Gracias por tu mensaje. Te contactaré pronto para agendar una llamada. Mientras tanto, puedes ver más información aquí: [Calendly Link]',
          sender: 'agent',
          timestamp: new Date(),
        };

        const finalLead = {
          ...updatedLead,
          messages: [...updatedLead.messages, agentResponse],
          lastMessage: agentResponse.text,
          status: 'contacted',
        };

        setLeads(leads.map(lead => lead.id === selectedLead.id ? finalLead : lead));
        setSelectedLead(finalLead);
      }, 2000);
    } catch (error) {
      toast.error('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleQualifyLead = (leadId: string) => {
    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: 'qualified' } : lead));
  };

  const handleUnqualifyLead = (leadId: string) => {
    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: 'unqualified' } : lead));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Agente de IA - Gestión de Leads</h1>
            <p className="text-gray-600">Conversaciones de Instagram y calificación de leads</p>
          </div>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="px-6"
          >
            Volver al Panel
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Lista de leads */}
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Leads Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {leads.length === 0 ? (
                  <p className="text-center text-gray-500">No hay leads aún</p>
                ) : (
                  leads.map((lead) => (
                    <Card
                      key={lead.id}
                      className={`cursor-pointer border-l-4 ${
                        lead.status === 'qualified' ? 'border-green-500' :
                        lead.status === 'unqualified' ? 'border-red-500' :
                        'border-blue-500'
                      } hover:shadow-md transition-shadow`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-gray-500">{lead.lastMessage}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {lead.status}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLead(lead.id);
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de conversación */}
          <div className="col-span-2">
            {selectedLead ? (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>{selectedLead.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({selectedLead.status})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-96">
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {selectedLead.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            message.sender === 'user'
                              ? 'bg-white text-gray-900'
                              : 'bg-blue-600 text-white'
                          } rounded-lg px-4 py-2`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        disabled={loading}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="text-center py-16">
                  <p className="text-gray-500">Selecciona un lead para ver la conversación</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Panel de control */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Panel de Control</CardTitle>
            <CardDescription>Gestión de leads y estadísticas</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Leads Totales</p>
              <p className="text-2xl font-bold text-blue-900">{leads.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Leads Calificados</p>
              <p className="text-2xl font-bold text-green-900">
                {leads.filter(l => l.status === 'qualified').length}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Leads No Calificados</p>
              <p className="text-2xl font-bold text-red-900">
                {leads.filter(l => l.status === 'unqualified').length}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Leads Contactados</p>
              <p className="text-2xl font-bold text-purple-900">
                {leads.filter(l => l.status === 'contacted').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentChat;