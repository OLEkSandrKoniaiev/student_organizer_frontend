import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <hr />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
