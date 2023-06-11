import PhoneUrl from "./phone.png";
import ShieldUrl from "./shield.png";
function About() {
  return (
    <div id="about" className="pb-36 pt-36">
      <h2 className="text-center text-main-purple text-2xl font-bold mb-10">
        About Cars
      </h2>
      <div className="flex flex-col px-10 md:px-0 md:flex-row gap-14 text-white text-base  md:max-w-[800px] mx-auto">
        <div className="border-l-[#CB31E4] border-l pl-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>

          <p>
            Our goal is to reduce the number of crypto fraud, by providing a
            possibility to verify the authenticity of the crypto wallet address.{" "}
          </p>
        </div>
        <div className="border-l-[#CB31E4] border-l pl-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
            />
          </svg>

          <p>
            We use state of the art AI to classify a wallet based on many
            attributes such as transaction pattern, lifespan and much more.
          </p>
        </div>
        <div className="border-l-[#CB31E4] border-l pl-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>

          <p>
            CARS is a self-funded and independent project, without any influence
            from the market actors.
          </p>
        </div>
      </div>
      <div className="relative  px-10 gap-y-10 md:gap-y-0 grid grid-cols-3 md:grid-cols-6 text-white mt-20">
        <p className="col-start-1 col-span-full md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-3">
          We want to keep our service{" "}
          <span className="font-bold underline underline-offset-2">free</span>{" "}
          for all users. For curious souls we offer the possibility of getting
          more detailed report about every wallet.
        </p>
        <img
          className="col-start-2 col-end-3 md:col-start-5 md:col-end-6"
          src={PhoneUrl}
          alt=""
        />
        <img
          src={ShieldUrl}
          className="-z-10 absolute top-24 right-6 w-[250px] md:right-8 md:-top-10 lg:right-0 lg:-top-20 lg:w-[400px]"
          alt=""
        />
      </div>
    </div>
  );
}

export default About;
