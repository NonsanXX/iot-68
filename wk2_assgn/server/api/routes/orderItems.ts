import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { orderItems } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const orderItemsRouter = new Hono();

// GET all order items
orderItemsRouter.get("/", async (c) => {
    const allOrderItems = await drizzle.query.orderItems.findMany({
        with: {
            order: true,
            menuItem: true,
        },
    });
    return c.json(allOrderItems);
});

// GET order items by order ID
orderItemsRouter.get("/order/:orderId", async (c) => {
    const orderId = Number(c.req.param("orderId"));
    const result = await drizzle.query.orderItems.findMany({
        where: eq(orderItems.orderId, orderId),
        with: {
            order: true,
            menuItem: true,
        },
    });
    return c.json(result);
});

// GET order item by ID
orderItemsRouter.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await drizzle.query.orderItems.findFirst({
        where: eq(orderItems.id, id),
        with: {
            order: true,
            menuItem: true,
        },
    });
    if (!result) {
        return c.json({ error: "Order item not found" }, 404);
    }
    return c.json(result);
});

// POST create new order item
orderItemsRouter.post(
    "/",
    zValidator(
        "json",
        z.object({
            orderId: z.number().int().positive(),
            menuItemId: z.number().int().positive(),
            quantity: z.number().int().positive().default(1),
            note: z.string().max(255).optional().nullable(),
        })
    ),
    async (c) => {
        const { orderId, menuItemId, quantity, note } = c.req.valid("json");
        
        console.log("Received order item data:", { orderId, menuItemId, quantity, note }); // Debug log
        
        try {
            const result = await drizzle
                .insert(orderItems)
                .values({
                    orderId,
                    menuItemId,
                    quantity: quantity || 1,
                    note: note || null,
                })
                .returning();
            
            console.log("Order item created successfully:", result[0]); // Debug log
            return c.json({ success: true, orderItem: result[0] }, 201);
        } catch (error) {
            console.error("Database error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return c.json({ error: "Failed to create order item", details: errorMessage }, 500);
        }
    }
);

// PATCH update order item
orderItemsRouter.patch(
    "/:id",
    zValidator(
        "json",
        z.object({
            orderId: z.number().int().positive().optional(),
            menuItemId: z.number().int().positive().optional(),
            quantity: z.number().int().positive().optional(),
            note: z.string().max(255).optional().nullable(),
        })
    ),
    async (c) => {
        const id = Number(c.req.param("id"));
        const data = c.req.valid("json");
        const updated = await drizzle.update(orderItems).set(data).where(eq(orderItems.id, id)).returning();
        if (updated.length === 0) {
            return c.json({ error: "Order item not found" }, 404);
        }
        return c.json({ success: true, orderItem: updated[0] });
    }
);

// DELETE order item
orderItemsRouter.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const deleted = await drizzle.delete(orderItems).where(eq(orderItems.id, id)).returning();
    if (deleted.length === 0) {
        return c.json({ error: "Order item not found" }, 404);
    }
    return c.json({ success: true, orderItem: deleted[0] });
});

export default orderItemsRouter;
