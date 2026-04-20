import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CampaignFiltersProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export default function CampaignFilters({
  selectedStatus,
  onStatusChange,
}: CampaignFiltersProps) {
  const statuses = [
    { id: "draft", label: "Rascunho", color: "bg-muted text-foreground" },
    { id: "scheduled", label: "Agendada", color: "bg-accent text-accent-foreground" },
    { id: "sent", label: "Enviada", color: "bg-green-600 text-white" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={selectedStatus === null ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange(null)}
        className={selectedStatus === null ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
      >
        Todas
      </Button>
      {statuses.map((status) => (
        <Button
          key={status.id}
          variant={selectedStatus === status.id ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(status.id)}
          className={selectedStatus === status.id ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}
