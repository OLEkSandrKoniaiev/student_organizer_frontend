import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.service";

interface IFormProps {
  email: string;
  password: string;
}

const FormSignInComponent: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormProps>();
  const navigate = useNavigate();

  const customHandler = async (formDataProps: IFormProps) => {
    try {
      const { accessToken } = await login(
        formDataProps.email,
        formDataProps.password,
      );

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        navigate("/");
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(customHandler)}
      className="flex flex-col gap-4 max-w-sm mx-auto"
    >
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          className="border p-2 rounded w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="border p-2 rounded w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
      >
        Create account
      </button>
    </form>
  );
};

export default FormSignInComponent;
