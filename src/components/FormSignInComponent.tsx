import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.service";
import { HiEye, HiEyeOff } from "react-icons/hi";

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
  const [showPassword, setShowPassword] = useState(false);

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
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(customHandler)}
      className="flex flex-col items-center gap-6"
    >
      {/* Email */}
      <div className="flex flex-col">
        <label className="text-[16px] font-medium text-[#8B8B8B] mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="myemail123@gmail.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          className="w-[500px] h-[80px] text-[16px] font-medium px-4 border-2 border-[#96E5D2] rounded-[8px] bg-[#FCFCFC] focus:outline-none focus:ring-2 focus:ring-[#DDD602] text-[#000672]"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col relative">
        <label className="text-[16px] font-medium text-[#8B8B8B] mb-2">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-[500px] h-[80px] text-[16px] font-medium px-4 border-2 border-[#96E5D2] rounded-[8px] bg-[#FCFCFC] focus:outline-none focus:ring-2 focus:ring-[#DDD602] text-[#000672]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[50px] text-[#8B8B8B]"
        >
          {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-6 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[210px] h-[70px] text-[20px] font-medium rounded-[8px] bg-[#96E5D2] text-[#000672] shadow-[0_0_16px_0_rgba(0,0,0,0.2)] hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="w-[210px] h-[70px] text-[20px] font-medium rounded-[8px] border-2 border-[#96E5D2] text-[#000672] bg-[#FCFCFC] hover:bg-[#96E5D2]/20 transition"
        >
          Create account
        </button>
      </div>
    </form>
  );
};

export default FormSignInComponent;
