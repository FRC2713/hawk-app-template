import { withState } from "@astrojs/react/actions";
import { actions } from "astro:actions";
import { useActionState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Project, ProjectStatus } from "../../server/projects.js";

type Props =
  { mode: "create"; project?: never } | { mode: "update"; project: Project };

function initialActionState<T>(): T {
  // Astro's SafeResult models only completed actions. React also needs an idle
  // state before the first submission, so keep that one bridge localized here.
  return { data: undefined, error: undefined } as T;
}

function errorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("message" in error))
    return undefined;
  return String(error.message);
}

function fieldError(error: unknown, field: string): string | undefined {
  if (!error || typeof error !== "object" || !("fields" in error))
    return undefined;
  const fields = error.fields;
  if (!fields || typeof fields !== "object") return undefined;
  const messages = (fields as Record<string, unknown>)[field];
  return Array.isArray(messages) ? messages.map(String).join(" ") : undefined;
}

export function ProjectForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm />
  ) : (
    <UpdateForm project={props.project} />
  );
}

function CreateForm() {
  const [state, formAction, pending] = useActionState(
    withState(actions.createProject),
    initialActionState<Awaited<ReturnType<typeof actions.createProject>>>(),
  );
  useEffect(() => {
    if (state.data?.id)
      window.location.assign(`/projects/${state.data.id}?created=1`);
  }, [state.data]);
  return (
    <Fields
      mode="create"
      formAction={formAction}
      pending={pending}
      error={state.error}
    />
  );
}

function UpdateForm({ project }: { project: Project }) {
  const [state, formAction, pending] = useActionState(
    withState(actions.updateProject),
    initialActionState<Awaited<ReturnType<typeof actions.updateProject>>>(),
  );
  useEffect(() => {
    if (state.data?.id)
      window.location.assign(`/projects/${state.data.id}?updated=1`);
  }, [state.data]);
  return (
    <Fields
      mode="update"
      project={project}
      formAction={formAction}
      pending={pending}
      error={state.error}
    />
  );
}

function Fields({
  mode,
  project,
  formAction,
  pending,
  error,
}: {
  mode: "create" | "update";
  project?: Project;
  formAction: (payload: FormData) => void;
  pending: boolean;
  error: unknown;
}) {
  const nameError = fieldError(error, "name");
  const descriptionError = fieldError(error, "description");
  const statuses: Array<{ value: ProjectStatus; label: string }> = [
    { value: "planned", label: "Planned" },
    { value: "active", label: "Active" },
    { value: "done", label: "Done" },
  ];

  return (
    <form action={formAction} className="grid gap-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      {errorMessage(error) && (
        <Alert variant="destructive">
          <AlertTitle>Could not save the project</AlertTitle>
          <AlertDescription>{errorMessage(error)}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name}
          maxLength={100}
          required
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "name-error" : undefined}
        />
        {nameError && (
          <span className="text-sm text-destructive" id="name-error">
            {nameError}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          className="min-h-32 resize-y"
          id="description"
          name="description"
          defaultValue={project?.description}
          maxLength={2000}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={
            descriptionError ? "description-error" : "description-hint"
          }
        />
        <span className="text-sm text-muted-foreground" id="description-hint">
          Optional, up to 2,000 characters.
        </span>
        {descriptionError && (
          <span className="text-sm text-destructive" id="description-error">
            {descriptionError}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <NativeSelect
          className="w-full"
          id="status"
          name="status"
          defaultValue={project?.status ?? "planned"}
        >
          {statuses.map((status) => (
            <NativeSelectOption value={status.value} key={status.value}>
              {status.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-wrap gap-3 border-t pt-6">
        <Button disabled={pending} type="submit">
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create project"
              : "Save changes"}
        </Button>
        <a
          className={buttonVariants({ variant: "outline" })}
          href={project ? `/projects/${project.id}` : "/"}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
