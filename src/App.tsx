import { Route } from "wouter";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";

export default function App() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/wishlist" component={Wishlist} />
    </>
  );
}
