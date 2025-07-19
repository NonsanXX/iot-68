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
    const result = await drizzle
      .insert(students)
      .values({
        fname,
        lname,
        studentId,
        dob: dob instanceof Date ? dob.toISOString() : dob,
        sex
      })
      .returning();
    return c.json({ success: true, student: result[0] }, 201);
  }
);

export default studentsRouter;
