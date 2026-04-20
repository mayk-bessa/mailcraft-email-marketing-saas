import { useAuth } from "@/_core/hooks/useAuth";
import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import DraggableEmailBlock from "@/components/DraggableEmailBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Type, Image, Link2, Save, Eye } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EmailBlock {
  id: string;
  type: "text" | "image" | "button";
  content: string;
  order: number;
}

export default function EmailBuilder() {
  const { user } = useAuth();
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [preview, setPreview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const saveDraftMutation = trpc.campaigns.saveDraft.useMutation();

  const addBlock = (type: "text" | "image" | "button") => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === "text" ? "Seu texto aqui" : type === "image" ? "https://via.placeholder.com/600x300" : "Clique aqui",
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < blocks.length - 1)
    ) {
      const newBlocks = [...blocks];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];
      setBlocks(newBlocks.map((block, idx) => ({ ...block, order: idx })));
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);
    
    setBlocks(newBlocks.map((block, idx) => ({ ...block, order: idx })));
    setDraggedIndex(null);
  };

  return (
    <MailCraftDashboardLayout currentPage="campaigns">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Construtor de Email</h1>
            <p className="text-muted-foreground mt-1">
              Crie seu email com blocos drag-and-drop
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setPreview(!preview)}
            >
              <Eye size={18} />
              {preview ? "Editar" : "Visualizar"}
            </Button>
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              onClick={() => {
                if (!campaignName.trim()) {
                  toast.error("Digite um nome para a campanha");
                  return;
                }
                saveDraftMutation.mutate({
                  name: campaignName,
                  subject: subject,
                  emailContent: blocks,
                }, {
                  onSuccess: () => {
                    toast.success("Rascunho salvo com sucesso!");
                  },
                  onError: () => {
                    toast.error("Erro ao salvar rascunho");
                  },
                });
              }}
              disabled={saveDraftMutation.isPending}
            >
              <Save size={18} />
              {saveDraftMutation.isPending ? "Salvando..." : "Salvar Rascunho"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-4">
            <Card className="border border-border bg-white">
              <CardHeader>
                <CardTitle className="text-foreground">Configuração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Nome da Campanha
                  </label>
                  <Input
                    placeholder="Ex: Newsletter Semanal"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Assunto do Email
                  </label>
                  <Input
                    placeholder="Ex: Confira as novidades desta semana"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Blocks Palette */}
            <Card className="border border-border bg-white">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Adicionar Blocos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => addBlock("text")}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Type size={16} />
                  Texto
                </Button>
                <Button
                  onClick={() => addBlock("image")}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Image size={16} />
                  Imagem
                </Button>
                <Button
                  onClick={() => addBlock("button")}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Link2 size={16} />
                  Botão
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border bg-white">
              <CardHeader>
                <CardTitle className="text-foreground text-xs">Dica</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>Arraste os blocos para reordená-los</p>
                <p>Use os botões ↑/↓ para mover rapidamente</p>
                <p>Clique em um bloco para editar seu conteúdo</p>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Editor */}
          <div className="lg:col-span-2">
            {preview ? (
              <Card className="border border-border bg-white">
                <CardHeader>
                  <CardTitle className="text-foreground">Pré-visualização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div className="bg-white p-6 rounded-lg space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Assunto:</p>
                        <p className="font-semibold text-foreground">{subject || "Sem assunto"}</p>
                      </div>
                      <div className="border-t border-border pt-4 space-y-4">
                        {blocks.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            Nenhum bloco adicionado
                          </p>
                        ) : (
                          blocks.map((block) => (
                            <div key={block.id} className="space-y-2">
                              {block.type === "text" && (
                                <p className="text-foreground whitespace-pre-wrap">
                                  {block.content}
                                </p>
                              )}
                              {block.type === "image" && (
                                <img
                                  src={block.content}
                                  alt="Email content"
                                  className="w-full rounded-lg"
                                />
                              )}
                              {block.type === "button" && (
                                <div className="inline-block">
                                  <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition">
                                    {block.content}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border bg-white">
                <CardHeader>
                  <CardTitle className="text-foreground">Blocos do Email</CardTitle>
                  <CardDescription>
                    {blocks.length} bloco{blocks.length !== 1 ? "s" : ""} adicionado{blocks.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {blocks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Nenhum bloco adicionado ainda</p>
                      <p className="text-sm mt-2">Clique em "Adicionar Blocos" para começar</p>
                    </div>
                  ) : (
                    blocks.map((block, idx) => (
                      <DraggableEmailBlock
                        key={block.id}
                        block={block}
                        index={idx}
                        totalBlocks={blocks.length}
                        onUpdate={updateBlock}
                        onRemove={removeBlock}
                        onMove={moveBlock}
                        isDragging={draggedIndex === idx}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MailCraftDashboardLayout>
  );
}
