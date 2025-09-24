import React from "react";
import FormSignInComponent from "../../components/FormSignInComponent";

const SignInPage: React.FC = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="bg-[#EDFFDF] w-[750px] flex flex-col items-center py-10 rounded-lg">
        <h1 className="text-[64px] font-bold text-[#000672] mb-4">
          Welcome Back!
        </h1>
        <p className="text-[20px] font-medium text-[#000672] mb-10">
          Please log in to your account.
        </p>
        <FormSignInComponent />
      </div>
    </div>
  );
};

export default SignInPage;
