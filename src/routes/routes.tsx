import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import TaskListPage from "../pages/Tasks/TaskListPage";
import TaskDetailsPage from "../pages/Tasks/TaskDetailsPage";
// import EditTaskPage from "../pages/Tasks/EditTaskPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import EditProfilePage from "../pages/Profile/EditProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// ===== Protected wrapper =====
/**
 * ProtectedRoute перевіряє чи користувач авторизований.
 * Якщо так — рендерить children.
 * Якщо ні — редірект на /signin.
 */

export const routes = createBrowserRouter([
  {
    path: "",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TaskListPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/edit", element: <EditProfilePage /> },
      { path: "task/:id", element: <TaskDetailsPage /> },
      // { path: "task/:id/edit", element: <EditTaskPage /> },
    ],
  },
  { path: "signin", element: <PublicRoute><SignInPage /></PublicRoute> },
  { path: "signup", element: <PublicRoute><SignUpPage /></PublicRoute> },
]);