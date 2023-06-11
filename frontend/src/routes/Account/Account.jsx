import { useUser } from "../../context/user-context";
function Account() {
  const { user } = useUser();
  let email = user?.email || "Not logged in";
  return (
    <div className=" text-white bg-main-gradient min-h-screen py-36">
      <div className="px-8">
        <div className="mx-auto max-w-[570px] ">
          <h3 className="text-2xl font-medium">My Account</h3>
          <div className="mt-6">
            <p className="">Email: {email}</p>
          </div>
          <button
            className="bg-white mt-5 px-6 py-2 font-bold text-black mx-auto rounded-full border-2 border-main-purple cursor-pointer"
            type="submit"
          >
            Change Password
          </button>
        </div>
      </div>
      <div className="px-8">
        <div className="mt-8  bg-opacity-10 backdrop-blur-3xl drop-shadow-lg flex flex-col md:flex-row gap-6 md:gap-[120px] justify-between items-center max-w-[570px] bg-white mx-auto px-4 py-2 rounded-[10px]">
          <div className="">
            <h4 className="text-base font-semibold">
              Premium - Clear search history
            </h4>
            <p className="text-xs mt-4">
              This action would delete your search history from our servers. At
              any given time we only store your last 10 searched wallet
              addresses.
            </p>
          </div>
          <button className="bg-[#FBEB5A] min-w-fit text-[#151515] rounded-full px-8 py-2 font-semibold">
            Clear history
          </button>
        </div>
      </div>
      <div className="px-8">
        <div className="mt-8  bg-opacity-10 backdrop-blur-3xl drop-shadow-lg flex flex-col md:flex-row gap-6 md:gap-[120px] justify-between items-center max-w-[570px] bg-white mx-auto px-4 py-2 rounded-[10px]">
          <div className="">
            <h4 className="text-base font-semibold">Delete your account</h4>
            <p className="text-xs mt-4">
              By deleting your account, all the data associated with your
              account will be deleted. Premium subscriptions will not be
              refunded the remaining subscription period
            </p>
          </div>
          <button className="bg-[#AB0000] min-w-fit text-white rounded-full px-8 py-2 font-semibold">
            Delete account{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
