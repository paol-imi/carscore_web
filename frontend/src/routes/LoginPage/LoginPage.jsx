import { useUser } from "../../context/user-context";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
const inputClasses = "rounded-[10px] px-4 py-2 text-sm";
const notifyLogIn = () =>
  toast.success("You have successfully logged in", {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
function LoginPage() {
  //print the user
  const navigate = useNavigate();
  const { setUser } = useUser();
  return (
    <div className="h-full flex flex-col justify-center items-center bg-main-gradient">
      <h2 className="text-2xl text-white mb-[52px]">User Login</h2>
      <form className="flex flex-col gap-y-5 w-full max-w-[330px]" action="">
        <input
          className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
          type="text"
          name="username"
          id="username"
          placeholder="Email"
          disabled
        />
        <input
          className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          disabled
        />
        <input
          className="bg-white mt-5 font-bold px-2 py-1 w-32 mx-auto rounded-full border-2 border-main-purple disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          value="Login"
          disabled
        />
      </form>
      <button
        disabled
        className="text-white relative mt-3 text-base z-10 group  disabled:cursor-not-allowed disabled:opacity-50"
      >
        Forgot Password?
        <span className="absolute bottom-[3px] left-0 h-[2px] -z-10 bg-decorative-gradient w-full"></span>
      </button>
      <div className="mx-auto mt-10">
        <GoogleLogin
          theme="filled_black"
          logo_alignment="center"
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            notifyLogIn();
            const id_token = credentialResponse.credential;
            const decoded = jwtDecode(id_token);
            console.log(decoded);
            setUser({ ...decoded, id_token });
            navigate("/");
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
      {/* <Link
        to="/signup"
        className="mt-10 px-4 py-2 font-bold text-base border-2 border-white bg-decorative-gradient text-white rounded-full "
      >
        Create an account
      </Link> */}
    </div>
  );
}

export default LoginPage;
