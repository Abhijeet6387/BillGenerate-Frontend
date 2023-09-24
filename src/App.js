import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import MenuList from "./components/MenuList";
import OrdersList from "./components/OrdersList";
import Bill from "./components/Bill";
import CreateOrder from "./components/CreateOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "menu",
    element: <MenuList />,
  },
  {
    path: "orders/new",
    element: <CreateOrder />,
  },
  {
    path: "orders",
    element: <OrdersList />,
  },
  {
    path: "bill",
    element: <Bill />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
