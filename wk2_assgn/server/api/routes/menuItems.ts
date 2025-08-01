import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { menuItems } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const menuItemsRouter = new Hono();

// GET all menu items
menuItemsRouter.get("/", async (c) => {
    const allMenuItems = await drizzle.query.menuItems.findMany({
        with: {
            orderItems: true,
        },
    });
    return c.json(allMenuItems);
});

// GET menu item by ID
menuItemsRouter.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await drizzle.query.menuItems.findFirst({
        where: eq(menuItems.id, id),
        with: {
            orderItems: true,
        },
    });
    if (!result) {
        return c.json({ error: "Menu item not found" }, 404);
    }
    return c.json(result);
});

// POST create new menu item
menuItemsRouter.post(
    "/",
    zValidator(
        "json",
        z.object({
            name: z.string().min(1).max(100),
            category: z.string().min(1).max(20),
            price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
        })
    ),
    async (c) => {
        const { name, category, price } = c.req.valid("json");
        const result = await drizzle
            .insert(menuItems)
            .values({
                name,
                category,
                price,
            })
            .returning();
        return c.json({ success: true, menuItem: result[0] }, 201);
    }
);

// PATCH update menu item
menuItemsRouter.patch(
    "/:id",
    zValidator(
        "json",
        z.object({
            name: z.string().min(1).max(100).optional(),
            category: z.string().min(1).max(20).optional(),
            price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal").optional(),
        })
    ),
    async (c) => {
        const id = Number(c.req.param("id"));
        const data = c.req.valid("json");
        const updated = await drizzle.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
        if (updated.length === 0) {
            return c.json({ error: "Menu item not found" }, 404);
        }
        return c.json({ success: true, menuItem: updated[0] });
    }
);

// DELETE menu item
menuItemsRouter.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const deleted = await drizzle.delete(menuItems).where(eq(menuItems.id, id)).returning();
    if (deleted.length === 0) {
        return c.json({ error: "Menu item not found" }, 404);
    }
    return c.json({ success: true, menuItem: deleted[0] });
});

export default menuItemsRouter;
