import { Hono } from "hono";
import drizzle from "../db/drizzle";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allStudents = await drizzle.select().from(students);
  return c.json(allStudents);
});

studentsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.id, id),
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});
studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      fname: z.string().min(1),
      lname: z.string().min(1),
      studentId: z.string().min(1),
      dob: z.string().datetime().transform((data: string) => new Date(data)),
      sex: z.string().min(1)
    })
  ),
  async (c) => {
    const { fname, lname, studentId, dob, sex } = c.req.valid("json");
    const dobString = dob instanceof Date ? dob.toISOString() : (typeof dob === "string" ? new Date(dob).toISOString() : "");
    const result = await drizzle
      .insert(students)
      .values({
        fname,
        lname,
        studentId,
        dob: dobString,
        sex
      })
      .returning();
    return c.json({ success: true, student: result[0] }, 201);
  }
);

studentsRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      fname: z.string().min(1).optional(),
      lname: z.string().min(1).optional(),
      studentId: z.string().min(1).optional(),
      dob: z.string().datetime().optional(),
      sex: z.string().min(1).optional()
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const { fname, lname, studentId, dob, sex } = c.req.valid("json");
    const result = await drizzle
      .update(students)
      .set({
        fname,
        lname,
        studentId,
        dob: typeof dob === "string" ? new Date(dob).toISOString() : dob,
        sex
      })
      .where(eq(students.id, id))
      .returning();
    if (!result) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, student: result[0] }, 200);
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle
    .delete(students)
    .where(eq(students.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, message: "Student deleted successfully" }, 200);
});


export default studentsRouter;
