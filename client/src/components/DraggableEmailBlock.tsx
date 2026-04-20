import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, GripVertical } from "lucide-react";

interface EmailBlock {
  id: string;
  type: "text" | "image" | "button";
  content: string;
  order: number;
}

interface DraggableEmailBlockProps {
  block: EmailBlock;
  index: number;
  totalBlocks: number;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

export default function DraggableEmailBlock({
  block,
  index,
  totalBlocks,
  onUpdate,
  onRemove,
  onMove,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
}: DraggableEmailBlockProps) {
  const [isEditing, setIsEditing] = useState(true);

  const getBlockLabel = (type: string) => {
    switch (type) {
      case "text":
        return "Texto";
      case "image":
        return "Imagem";
      case "button":
        return "Botão";
      default:
        return type;
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={(e) => onDrop?.(e, index)}
      className={`border-2 rounded-lg p-4 space-y-3 transition ${
        isDragging
          ? "border-accent bg-accent/10 opacity-50"
          : "border-border bg-muted/30 hover:border-accent/50"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical size={18} className="text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing" />
          <Badge className="bg-accent text-accent-foreground flex-shrink-0">
            {getBlockLabel(block.type)}
          </Badge>
          <span className="text-xs text-muted-foreground">#{index + 1}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 flex-shrink-0"
          onClick={() => onRemove(block.id)}
        >
          <X size={16} />
        </Button>
      </div>

      {isEditing && (
        <div className="space-y-2">
          {block.type === "text" && (
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              className="w-full p-2 border border-border rounded bg-background text-foreground text-sm"
              rows={3}
              placeholder="Digite seu texto aqui"
            />
          )}
          {block.type === "image" && (
            <Input
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              placeholder="URL da imagem"
              className="text-sm"
            />
          )}
          {block.type === "button" && (
            <div className="space-y-2">
              <Input
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                placeholder="Texto do botão"
                className="text-sm"
              />
              <Input
                placeholder="URL do link"
                className="text-sm"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMove(block.id, "up")}
          disabled={index === 0}
          className="text-xs"
        >
          ↑ Acima
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMove(block.id, "down")}
          disabled={index === totalBlocks - 1}
          className="text-xs"
        >
          Abaixo ↓
        </Button>
      </div>
    </div>
  );
}
