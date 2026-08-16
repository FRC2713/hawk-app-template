import { FolderOpenIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed py-12 text-center shadow-none">
      <CardContent className="items-center">
        <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground">
          <FolderOpenIcon aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-1 text-base font-semibold">No projects yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create the first project, or choose another status filter.
        </p>
      </CardContent>
    </Card>
  );
}
