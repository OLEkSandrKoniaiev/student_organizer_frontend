import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api.service";

interface IFormProps {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const FormSignUpComponent: React.FC = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormProps>();
  const navigate = useNavigate();

  const passwordValue = watch("password");

  const customHandler = async (formDataProps: IFormProps) => {
    if (formDataProps.password !== formDataProps.repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { accessToken } = await registerUser(
        formDataProps.username,
        formDataProps.email,
        formDataProps.password,
      );

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        navigate("/");
      }
    } catch (error: unknown) {
      console.error(
        "Registration failed:",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error.response?.data || error.message,
      );
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(customHandler)}
      className="flex flex-col gap-4 max-w-sm mx-auto"
    >
      <div>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
          className="border p-2 rounded w-full"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

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

      <div>
        <input
          type="password"
          placeholder="Repeat Password"
          {...register("repeatPassword", {
            required: "Please repeat your password",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          })}
          className="border p-2 rounded w-full"
        />
        {errors.repeatPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.repeatPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Signing up..." : "Sign up"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/signin")}
        className="bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
      >
        Back to Login
      </button>
    </form>
  );
};

export default FormSignUpComponent;
