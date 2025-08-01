export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  synopsis?: string;
  publishedAt: string;
  genreId?: number;
  genre?: number;
}

export interface Genre {
  id: number;
  title: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
}

export interface Order {
  id: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  note?: string;
  order?: Order;
  menuItem?: MenuItem;
}
