import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; filters?: any }) => void;
  isLoading?: boolean;
  initialData?: {
    name: string;
    description?: string;
    filters?: any;
  };
  title?: string;
}

export default function SegmentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
  title = "Novo Segmento",
}: SegmentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Sync initialData with form state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else if (isOpen && !initialData) {
      // Reset form for new segment
      setName("");
      setDescription("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Nome do segmento é obrigatório");
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      filters: initialData?.filters,
    });

    // Reset form
    setName("");
    setDescription("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription>
            Crie ou edite um segmento para organizar seus assinantes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Nome do Segmento
            </label>
            <Input
              placeholder="Ex: Clientes VIP"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descrição (Opcional)
            </label>
            <Textarea
              placeholder="Ex: Clientes que gastaram mais de R$ 1000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Segmento"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
