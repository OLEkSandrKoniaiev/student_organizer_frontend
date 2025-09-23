import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="flex justify-end gap-4 p-4 bg-gray-100 shadow">
      <button
        onClick={handleLogout}
        className="text-red-600 font-semibold hover:underline"
      >
        Logout
      </button>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-gray-700 hover:underline"
        }
      >
        Profile
      </NavLink>
    </nav>
  );
};

export default NavigationBar;
