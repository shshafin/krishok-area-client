import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Signup";
import "@/assets/styles/Auth.css";

export default function Auth() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // decide which form to render
  const isLogin = path.endsWith("/login");

  return (
    <div className="auth-page">
      <h1>কৃষক এরিয়া</h1>
      {isLogin ? <Login /> : <Register />}
    </div>
  );
}