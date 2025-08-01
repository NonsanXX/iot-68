import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { orders } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const ordersRouter = new Hono();

// GET all orders
ordersRouter.get("/", async (c) => {
    const allOrders = await drizzle.query.orders.findMany({
        with: {
            orderItems: {
                with: {
                    menuItem: true,
                },
            },
        },
    });
    return c.json(allOrders);
});

// GET order by ID
ordersRouter.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await drizzle.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
            orderItems: {
                with: {
                    menuItem: true,
                },
            },
        },
    });
    if (!result) {
        return c.json({ error: "Order not found" }, 404);
    }
    return c.json(result);
});

// POST create new order
ordersRouter.post(
    "/",
    zValidator(
        "json",
        z.object({
            createdAt: z.iso
                .datetime({ offset: true })
                .optional()
                .transform((data) => (data ? dayjs(data).toDate() : new Date())),
        })
    ),
    async (c) => {
        const { createdAt } = c.req.valid("json");
        const result = await drizzle
            .insert(orders)
            .values({
                createdAt: createdAt ?? new Date(),
            })
            .returning();
        return c.json({ success: true, order: result[0] }, 201);
    }
);

// PATCH update order
ordersRouter.patch(
    "/:id",
    zValidator(
        "json",
        z.object({
            createdAt: z.iso
                .datetime({ offset: true })
                .optional()
                .transform((data) => (data ? dayjs(data).toDate() : undefined)),
        })
    ),
    async (c) => {
        const id = Number(c.req.param("id"));
        const data = c.req.valid("json");
        const updated = await drizzle.update(orders).set(data).where(eq(orders.id, id)).returning();
        if (updated.length === 0) {
            return c.json({ error: "Order not found" }, 404);
        }
        return c.json({ success: true, order: updated[0] });
    }
);

// DELETE order
ordersRouter.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const deleted = await drizzle.delete(orders).where(eq(orders.id, id)).returning();
    if (deleted.length === 0) {
        return c.json({ error: "Order not found" }, 404);
    }
    return c.json({ success: true, order: deleted[0] });
});

export default ordersRouter;
