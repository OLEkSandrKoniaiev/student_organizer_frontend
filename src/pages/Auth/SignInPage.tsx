import React from "react";
import FormSignInComponent from "../../components/FormSignInComponent";

const SignInPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">Welcome Back!</h1>
      <strong className="mb-6">Please log in to your account</strong>
      <FormSignInComponent />
    </div>
  );
};

export default SignInPage;
