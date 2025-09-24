import React from "react";
import FormSignUpComponent from "../../components/FormSignUpComponent";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <FormSignUpComponent />
    </div>
  );
};

export default SignUpPage;
