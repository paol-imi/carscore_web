import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import QuestionMarksUrl from "./question-marks.svg";
function FAQ({ faqItems = [] }) {
  return (
    <div
      id="faq"
      className="lg:grid lg:grid-cols-12 w-full px-4 pt-60 pb-[140px] bg-transparent "
    >
      <div className="relative lg:col-start-3 lg:col-end-9 flex flex-col items-start gap-y-7 mx-auto w-full max-w-[600px] bg-darkest-purple rounded-2xl px-4 md:p-[60px]  md:pt-6 py-12">
        <img
          className="hidden lg:inline absolute -right-72 "
          src={QuestionMarksUrl}
          alt=""
          srcSet=""
        />
        <h2 className="text-center mx-auto md:-ml-28 md:text-left text-2xl font-bold text-white bg-dark-purple border-main-purple border px-4 py-1 rounded-[10px]">
          Frequently Asked Questions
        </h2>
        {faqItems.map((faq, index) => (
          <Disclosure key={faq.id}>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-base flex w-full justify-between px-4 py-2 text-left font-medium text-white  hover:bg-purple-900 transition-colors ease-out focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 border-b-main-purple border-b-2 ">
                  <span>{faq.question}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="-mt-7 px-4 pt-4 pb-2 text-white rounded-b-2xl text-base bg-main-purple">
                  {faq.answer}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
