import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import {
  createProject,
  deleteProject,
  PROJECT_STATUSES,
  updateProject,
} from "../server/projects.js";

const projectFields = {
  name: z.string().trim().min(1, "Enter a project name.").max(100),
  description: z.string().trim().max(2000).default(""),
  status: z.enum(PROJECT_STATUSES),
};

export const server = {
  createProject: defineAction({
    accept: "form",
    input: z.object(projectFields),
    handler: async (input) => ({ id: createProject(input).id }),
  }),

  updateProject: defineAction({
    accept: "form",
    input: z.object({
      id: z.coerce.number().int().positive(),
      ...projectFields,
    }),
    handler: async ({ id, ...input }) => {
      const project = updateProject(id, input);
      if (!project) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "That project no longer exists.",
        });
      }
      return { id: project.id };
    },
  }),

  deleteProject: defineAction({
    accept: "form",
    input: z.object({ id: z.coerce.number().int().positive() }),
    handler: async ({ id }) => {
      if (!deleteProject(id)) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "That project no longer exists.",
        });
      }
      return { ok: true };
    },
  }),
};
