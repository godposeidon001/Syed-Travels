import { createBrowserRouter } from "react-router-dom";
import AddSpot from "../components/AddSpot/AddSpot";
import CountryCards from "../components/CountryCards/CountryCards";
import CountryDetails from "../components/CountryDetails/CountryDetails";
import EditSpot from "../components/EditSpot/EditSpot";
import Home from "../components/Home/Home";
import Login from "../components/Login/Login";
import MyBooking from "../components/MyBooking/MyBooking";
import MyList from "../components/MyList/MyList";
import Register from "../components/Register/Register";
import Root from "../components/Root/Root";
import SpotDetails from "../components/SpotDetails/SpotDetails";
import TouristSpotForm from "../components/TouristSpotForm";
import PrivateRoute from "./PrivateRoute";

const apiBase = import.meta.env.VITE_API_URL;
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
        loader: () => fetch(`${apiBase}/spots`),
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/addspot",
        element: <PrivateRoute><AddSpot></AddSpot></PrivateRoute>,
      },
      {
        path: "/spots/:id",
        element: <PrivateRoute><SpotDetails></SpotDetails></PrivateRoute>,
        loader: ({ params }) =>
          fetch(`${apiBase}/spots/${params.id}`),
      },
      {
        path: "/mylist",
        element: <PrivateRoute><MyList></MyList></PrivateRoute>,
      },
      {
        path: "/mybooking",
        element: <PrivateRoute><MyBooking></MyBooking></PrivateRoute>,
      },
      {
        path: "/edit-spot/:id", // 
        element: <PrivateRoute><EditSpot></EditSpot></PrivateRoute>,
      },
      {
        path: "/countries/:id", // 
        element: <CountryCards></CountryCards>,
        loader: ({params}) => fetch(`${apiBase}/countries/${params.id}`),
      },
      {
        path: "/countries/:country/:id", // 
        element: <CountryDetails></CountryDetails>,
        loader: ({params}) => fetch(`${apiBase}/countries/${params.country}/${params.id}`),
      },
    ],
  },
]);

export default routes;
