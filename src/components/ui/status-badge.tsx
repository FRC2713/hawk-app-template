import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/server/projects";

const labels: Record<ProjectStatus, string> = {
  planned: "Planned",
  active: "Active",
  done: "Done",
};

const colors: Record<ProjectStatus, string> = {
  planned: "bg-status-planned text-status-planned-foreground",
  active: "bg-status-active text-status-active-foreground",
  done: "bg-status-done text-status-done-foreground",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge className={cn("border-transparent", colors[status])}>
      {labels[status]}
    </Badge>
  );
}
