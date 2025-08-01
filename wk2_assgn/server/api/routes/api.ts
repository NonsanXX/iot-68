import { Hono } from "hono";
import booksRouter from "./books.js";
import studentsRouter from "./students.js";
import genresRouter from "./genre.js";
import menuItemsRouter from "./menuItems.js";
import ordersRouter from "./orders.js";
import orderItemsRouter from "./orderItems.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";


const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Book Store API" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

apiRouter.route("/books", booksRouter);
apiRouter.route("/genres", genresRouter);
apiRouter.route("/students", studentsRouter);
apiRouter.route("/menu-items", menuItemsRouter);
apiRouter.route("/orders", ordersRouter);
apiRouter.route("/order-items", orderItemsRouter);

export default apiRouter;
