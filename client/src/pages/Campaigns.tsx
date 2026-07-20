import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Send, Clock, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import CampaignFilters from "@/components/CampaignFilters";

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const { data: campaigns = [], isLoading } = trpc.campaigns.list.useQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-muted text-foreground">Rascunho</Badge>;
      case "scheduled":
        return <Badge className="bg-accent text-accent-foreground">Agendada</Badge>;
      case "sent":
        return <Badge className="bg-green-600 text-white">Enviada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit2 size={16} />;
      case "scheduled":
        return <Clock size={16} />;
      case "sent":
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === null || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <MailCraftDashboardLayout currentPage="campaigns">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e acompanhe suas campanhas de email
            </p>
          </div>
          <a href="/builder">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
              <Plus size={18} />
              Nova Campanha
            </Button>
          </a>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <CampaignFilters 
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {/* Campaigns Table */}
        <Card className="border border-border bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de Campanhas</CardTitle>
            <CardDescription>
              {filteredCampaigns.length} campanha{filteredCampaigns.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando campanhas...
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhuma campanha encontrada</p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Plus size={18} />
                  Criar Primeira Campanha
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Assinantes
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Taxa de Abertura
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Taxa de Clique
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="border-b border-border hover:bg-muted/50 transition"
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          {campaign.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(campaign.status)}
                            {getStatusBadge(campaign.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {campaign.recipientCount}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {campaign.openRate}%
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {campaign.clickRate}%
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {campaign.status === "sent" && campaign.sentAt
                            ? new Date(campaign.sentAt).toLocaleDateString("pt-BR")
                            : campaign.status === "scheduled" && campaign.scheduledAt
                            ? new Date(campaign.scheduledAt).toLocaleDateString("pt-BR")
                            : campaign.createdAt
                            ? new Date(campaign.createdAt).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent hover:bg-accent/10"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
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
