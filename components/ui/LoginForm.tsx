import React from "react";

const LoginForm = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl my-3">Log in to book a visit</h1>
      <p className="text-base text-primary-1">
        Add your phone number. We'll send you a verification code.
      </p>

      <form className="mt-10">
        {/* Don't add any styles to input and label, check css in global.css */}
        <div className="inputGroup">
          <input type="text" required autoComplete="off" />
          <label htmlFor="mobileNumber">Mobile Number</label>
        </div>
        <button className="w-full bg-secondary-1 text-white rounded-full py-3 text-sm my-2">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
