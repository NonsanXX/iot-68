import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";



export const students = t.pgTable("students", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  fname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  lname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  studentId: t
    .varchar({
      length: 255,
    })
    .notNull()
    .unique(),
    dob: t.date().notNull(),
  sex: t
    .varchar({
      length: 10,
    })
    .notNull(),
});

export const genres = t.pgTable("genres", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
});

export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
  author: t
    .varchar({
      length: 255,
    })
    .notNull(),
  description: t.text(),
  synopsis: t.text(),
  publishedAt: t.timestamp().notNull(),

  genreId: t.bigint({ mode: "number" }).references(() => genres.id, {
    onDelete: "set null",
  }),
});

export const menuItems = t.pgTable("menu_items", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t
    .varchar({
      length: 100,
    })
    .notNull(),
  category: t
    .varchar({
      length: 20,
    })
    .notNull(),
  price: t.decimal({ precision: 8, scale: 2 }).notNull(),
});

export const orders = t.pgTable("orders", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  createdAt: t.timestamp().notNull().defaultNow()
});

export const orderItems = t.pgTable("order_items", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  orderId: t.bigint({ mode: "number" }).notNull().references(() => orders.id, {
    onDelete: "cascade",
  }),
  menuItemId: t.bigint({ mode: "number" }).notNull().references(() => menuItems.id, {
    onDelete: "cascade",
  }),
  quantity: t.integer().notNull().default(1),
  note: t.varchar({ length: 255 }),
});

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, {
    fields: [books.genreId],
    references: [genres.id],
  }),
}));

export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const menuItemRelations = relations(menuItems, ({ many }) => ({
  orderItems: many(orderItems),
}));
