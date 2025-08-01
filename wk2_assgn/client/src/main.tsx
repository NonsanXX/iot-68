import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import axios from "axios";
import HomePage from "./pages";
import { Notifications } from "@mantine/notifications";
import BooksPage from "./pages/books";
import BookByIdPage from "./pages/book-by-id";
import BookEditById from "./pages/book-edit-by-id";
import GenresPage from "./pages/genres";
import MenuPage from "./pages/menu";
import ManageMenuPage from "./pages/manage-menu";
import OrdersPage from "./pages/orders";
import { ModalsProvider } from "@mantine/modals";
import BookCreatePage from "./pages/book-create";
import AddGenreModal from "./components/AddGenreModal";
import EditGenreModal from "./components/EditGenreModal";

const theme = createTheme({
  primaryColor: "orange",
  fontFamily: '"Noto Sans Thai Looped", sans-serif',
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/books/create",
    element: <BookCreatePage />,
  },
  {
    path: "/books/:bookId",
    element: <BookByIdPage />,
  },
  {
    path: "/books/:bookId/edit",
    element: <BookEditById />,
  },
  {
    path: "/genres",
    element: <GenresPage />,
  },
  {
    path: "/menu",
    element: <MenuPage />,
  },
  {
    path: "/manage-menu",
    element: <ManageMenuPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  }
]);

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}
if (import.meta.env.VITE_API_SECRET) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${import.meta.env.VITE_API_SECRET}`;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          axios
            .get(url, {
              baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
            })
            .then((res) => res.data),
      }}
    >
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ModalsProvider
          modals={{
            addGenre: AddGenreModal,
            editGenre: EditGenreModal,
          }}
        >
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </SWRConfig>
  </React.StrictMode>
);
