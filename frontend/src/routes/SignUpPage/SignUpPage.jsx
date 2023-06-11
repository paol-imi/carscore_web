import React from "react";
const inputClasses = "rounded-[10px] px-4 py-2 text-sm";
function SignUpPage() {
  return (
    <div className="h-full flex flex-col  justify-center items-center bg-main-gradient">
      <h2 className="text-2xl text-white mb-[52px]">User Registration</h2>
      <form
        className="grid grid-cols-1 px-4 md:px-0 md:grid-cols-[max-content,1fr]  items-baseline gap-y-3 md:gap-y-5 md:gap-x-4 w-full max-w-[530px]"
        action=""
      >
        <label className="text-left md:text-right" htmlFor="username">
          <span className="text-white">Email</span>
        </label>
        <input
          className={inputClasses}
          type="text"
          name="username"
          id="username"
          placeholder="jon.doe@mail.com"
        />
        <label className="text-left md:text-right" htmlFor="password">
          <span className="text-white">Password</span>
        </label>
        <input
          className={inputClasses}
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        />
        <label className="text-left md:text-right" htmlFor="confirm-password">
          <span className="text-white">Confirm Password</span>
        </label>
        <input
          className={inputClasses}
          type="password"
          name="confirm-password"
          id="confirm-password"
          placeholder="Confirm Password"
        />
        <input
          className="bg-white mt-16 md:col-span-2 font-bold px-2 py-1 w-32 mx-auto rounded-full border-2 border-main-purple cursor-pointer md:min-w-[172px]"
          type="submit"
          value="Sign Up"
        />
      </form>
    </div>
  );
}

export default SignUpPage;
