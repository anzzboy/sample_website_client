import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./componenets/Home";
import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
  ],
  { basename: "/sample_website_client/" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
