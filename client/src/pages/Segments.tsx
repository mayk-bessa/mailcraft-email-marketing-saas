import { useAuth } from "@/_core/hooks/useAuth";
import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import SegmentModal from "@/components/SegmentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Segments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<any>(null);
  
  const { data: segments = [], isLoading, refetch } = trpc.segments.list.useQuery();
  const createMutation = trpc.segments.create.useMutation();
  const updateMutation = trpc.segments.update.useMutation();
  const deleteMutation = trpc.segments.delete.useMutation();

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingSegment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (segment: any) => {
    setEditingSegment(segment);
    setIsModalOpen(true);
  };

  const handleDelete = (segmentId: number) => {
    if (confirm("Tem certeza que deseja deletar este segmento?")) {
      deleteMutation.mutate(
        { segmentId },
        {
          onSuccess: () => {
            toast.success("Segmento deletado com sucesso!");
            refetch();
          },
          onError: (error) => {
            toast.error(error.message || "Erro ao deletar segmento");
          },
        }
      );
    }
  };

  const handleSubmit = (data: { name: string; description?: string; filters?: any }) => {
    if (editingSegment) {
      updateMutation.mutate(
        {
          segmentId: editingSegment.id,
          name: data.name,
          description: data.description,
          filters: data.filters,
        },
        {
          onSuccess: () => {
            toast.success("Segmento atualizado com sucesso!");
            setIsModalOpen(false);
            setEditingSegment(null);
            refetch();
          },
          onError: (error) => {
            toast.error(error.message || "Erro ao atualizar segmento");
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: data.name,
          description: data.description,
          filters: data.filters,
        },
        {
          onSuccess: () => {
            toast.success("Segmento criado com sucesso!");
            setIsModalOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(error.message || "Erro ao criar segmento");
          },
        }
      );
    }
  };

  return (
    <MailCraftDashboardLayout currentPage="segments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Segmentos</h1>
            <p className="text-muted-foreground mt-1">
              Organize seus assinantes em segmentos para campanhas direcionadas
            </p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            onClick={handleCreateNew}
          >
            <Plus size={18} />
            Novo Segmento
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <Input
            placeholder="Buscar segmentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Segments Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando segmentos...
          </div>
        ) : filteredSegments.length === 0 ? (
          <Card className="border border-border bg-white">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum segmento encontrado</p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                onClick={handleCreateNew}
              >
                <Plus size={18} />
                Criar Primeiro Segmento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSegments.map((segment) => (
              <Card
                key={segment.id}
                className="border border-border bg-white hover:shadow-md transition"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">
                        {segment.name}
                      </CardTitle>
                      {segment.description && (
                        <CardDescription className="mt-1">
                          {segment.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-accent" />
                    <span className="text-foreground font-semibold">
                      {segment.subscriberCount} assinantes
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEdit(segment)}
                    >
                      <Edit2 size={16} />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(segment.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Segments Table View */}
        {filteredSegments.length > 0 && (
          <Card className="border border-border bg-white mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Visão em Tabela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Nome
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Descrição
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Assinantes
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Data de Criação
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSegments.map((segment) => (
                      <tr
                        key={segment.id}
                        className="border-b border-border hover:bg-muted/50 transition"
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          {segment.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {segment.description || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-accent text-accent-foreground">
                            {segment.subscriberCount}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {segment.createdAt
                            ? new Date(segment.createdAt).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent hover:bg-accent/10"
                              onClick={() => handleEdit(segment)}
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(segment.id)}
                              disabled={deleteMutation.isPending}
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Segment Modal */}
      <SegmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSegment(null);
        }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={editingSegment}
        title={editingSegment ? "Editar Segmento" : "Novo Segmento"}
      />
    </MailCraftDashboardLayout>
  );
}
