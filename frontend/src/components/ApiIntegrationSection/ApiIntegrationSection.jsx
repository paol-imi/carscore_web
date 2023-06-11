import GearsUrl from "./gears.png";
import BusinessUrl from "./business.png";
function ApiIntegrationSection() {
  return (
    <div
      id="business"
      className="relative text-white grid grid-cols-12 items-center py-24 md:pb-[225px]"
    >
      <div className="absolute bg-[#151515] -inset-x-20 inset-y-0 rotate-[10deg] -z-10"></div>
      <img
        src={GearsUrl}
        className="md:col-start-1 md:col-end-5 hidden md:inline"
        alt="A Picture of 3 gears"
      />
      <div className="col-start-1 col-end-13 md:col-start-6 md:col-end-13 ">
        <h3 className="text-2xl text-center md:text-left text-main-purple font-bold mb-8">
          Business subscription & API integration
        </h3>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="md:w-[292px]">
            <p className="px-10 md:px-0">
              Do you share our mission to make the internet safer? Or do you
              just want to protect your costumers against scams?
            </p>
            <p className="px-10 md:px-0 mt-4 md:mt-8">
              Integrate our API to your trading platform and watch as your user
              satisfaction grows.
            </p>
            <p className="px-10 md:px-0 mt-4 md:mt-8">
              For more information, explore our docs or contact us on
              business@cars.it
            </p>
            <button className="hidden mx-auto md:block mt-10 rounded-full font-bold border-2 border-main-purple px-4 py-2">
              <span>Get Ready!</span>
            </button>
          </div>
          <div
            id="list-of-benefits"
            className="flex flex-col gap-y-16 self-center md:self-start pr-2 md:pr-10 "
          >
            <ul className="flex flex-col gap-y-2">
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block text-main-purple mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span>Improved user experience</span>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block text-main-purple mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span>Increased trustworthiness</span>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block text-main-purple mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span>Retain customers</span>
              </li>
            </ul>
            <button className=" mx-auto block md:hidden rounded-full font-bold border-2 border-main-purple px-4 py-2">
              <span>Get Ready!</span>
            </button>
            <img
              src={BusinessUrl}
              className="hidden md:inline max-w-[226px]"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiIntegrationSection;
