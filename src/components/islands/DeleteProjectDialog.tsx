import { withState } from "@astrojs/react/actions";
import { actions } from "astro:actions";
import { useActionState, useEffect, useRef } from "react";

export function DeleteProjectDialog({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
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
    <>
      <button
        className="button button-danger"
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        Delete project
      </button>
      <dialog
        ref={dialog}
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border bg-white p-0 shadow-2xl backdrop:bg-slate-950/40"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold">Delete {name}?</h2>
          <p className="mt-2 text-sm text-muted">
            This permanently removes the project from the local database.
          </p>
          {state.error && (
            <p className="mt-4 text-sm text-danger-strong" role="alert">
              {state.error.message}
            </p>
          )}
          <form
            action={formAction}
            className="mt-6 flex flex-wrap justify-end gap-3"
          >
            <input type="hidden" name="id" value={id} />
            <button
              className="button button-secondary"
              type="button"
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </button>
            <button
              className="button button-danger"
              disabled={pending}
              type="submit"
            >
              {pending ? "Deleting…" : "Delete"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
