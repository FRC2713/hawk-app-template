import { expect, test } from "@playwright/test";

test("a user can create, edit, filter, and delete a project", async ({
  page,
}) => {
  const name = `Browser project ${Date.now()}`;

  await page.goto("/");
  await page.getByRole("link", { name: "New project" }).click();
  await page.getByLabel("Project name").fill(name);
  await page
    .getByLabel("Description")
    .fill("Created by the golden browser journey.");
  await page.getByLabel("Status").selectOption("active");
  await page.getByRole("button", { name: "Create project" }).click();

  await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("created");

  await page.getByRole("link", { name: "Edit project" }).click();
  await page.getByLabel("Status").selectOption("done");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("updated");
  await expect(page.getByText("Done", { exact: true })).toBeVisible();

  await page.goto("/?status=done");
  await expect(
    page.getByRole("link", { name: new RegExp(name) }),
  ).toBeVisible();

  await page.getByRole("link", { name: new RegExp(name) }).click();
  await page.getByRole("button", { name: "Delete project" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByRole("status")).toContainText("deleted");
  await expect(page.getByText(name)).toHaveCount(0);
});

test("validation explains how to repair a blank project", async ({ page }) => {
  await page.goto("/projects/new");
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByLabel("Project name")).toBeFocused();
  await expect(page.getByLabel("Project name")).toHaveAttribute("required", "");
});
