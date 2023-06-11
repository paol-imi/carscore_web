import BenefitsGrid from "../../components/BenefitsGrid/";
function Subscription() {
  return (
    <div className=" text-white bg-main-gradient min-h-screen py-36 relative z-10">
      <div className="px-4 max-w-[700px] mx-auto">
        <div className="mx-auto  ">
          <h3 className="text-2xl font-medium">Subscription</h3>
          <div className="mt-6 font-bold">
            <p>Select a subscription</p>
          </div>
        </div>
        <div className="">
          <BenefitsGrid freeAuxText="Selected" premiumAuxText="Coming soon!" />
        </div>
      </div>
    </div>
  );
}
export default Subscription;
