import { withState } from "@astrojs/react/actions";
import { actions } from "astro:actions";
import { useActionState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function DeleteProjectDialog({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const [state, formAction, pending] = useActionState(
    withState(actions.deleteProject),
    { data: undefined, error: undefined } as unknown as Awaited<
      ReturnType<typeof actions.deleteProject>
    >,
  );

  useEffect(() => {
    if (state.data?.ok) window.location.assign("/?deleted=1");
  }, [state.data]);

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the project from the local database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state.error && (
          <Alert variant="destructive">
            <AlertTitle>Could not delete the project</AlertTitle>
            <AlertDescription>{state.error.message}</AlertDescription>
          </Alert>
        )}
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={pending} type="submit">
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
