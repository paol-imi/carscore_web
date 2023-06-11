import { Link, useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex flex-col justify-center h-full bg-main-gradient">
      <div className="flex-1  text-white">
        <div className="flex px-12 md:px-0 w-full flex-col gap-4 h-full justify-center items-center">
          <h1 className="text-6xl font-semibold mb-4">Oh no!</h1>
          <img
            src="https://i.imgur.com/yW2W9SC.png"
            alt="A cute and confused robot"
            className="w-40 h-40 mb-6"
          />
          <p className="text-xl font-medium mb-4">
            This is wierd, and an unexpected error has occurred.
          </p>
          <p className="text-center text-gray-300 mb-6">
            <i>{error?.statusText || error?.message}</i>
          </p>
          <div className="flex gap-4">
            <Link
              to="/"
              onClick={null}
              className=" mx-auto mt-10 bg-black rounded-full font-bold border-2 border-main-purple px-4 py-2"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
