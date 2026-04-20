import { useAuth } from "@/_core/hooks/useAuth";
import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Mail, Trash2, Download } from "lucide-react";
import { useState } from "react";

export default function Subscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: subscribers = [], isLoading } = trpc.subscribers.list.useQuery();

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MailCraftDashboardLayout currentPage="subscribers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assinantes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua lista de assinantes e tags
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              Exportar
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
              <Plus size={18} />
              Adicionar Assinante
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Total de Assinantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {subscribers.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {subscribers.filter((s) => s.subscribed).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Inativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {subscribers.filter((s) => !s.subscribed).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <Input
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Subscribers Table */}
        <Card className="border border-border bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de Assinantes</CardTitle>
            <CardDescription>
              {filteredSubscribers.length} assinante{filteredSubscribers.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando assinantes...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhum assinante encontrado</p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Plus size={18} />
                  Adicionar Primeiro Assinante
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Tags
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Data de Inscrição
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="border-b border-border hover:bg-muted/50 transition"
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-muted-foreground" />
                            {subscriber.email}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {subscriber.name || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              subscriber.subscribed
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {subscriber.subscribed ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {subscriber.tags && Array.isArray(subscriber.tags) ? (
                              subscriber.tags.map((tag, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {subscriber.createdAt
                            ? new Date(subscriber.createdAt).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MailCraftDashboardLayout>
  );
}
