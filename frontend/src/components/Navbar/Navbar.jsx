import React, { useState, forwardRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoUrl from "../../assets/Logo.svg";
import { Disclosure } from "@headlessui/react";
import AccountDropdown from "../AccountDropdown/";
import { useUser } from "../../context/user-context";
import { googleLogout } from "@react-oauth/google";

//TODO: Make that links can have a Link or a button to scroll to a section

const baseNavbarItemClasses =
  "  px-3 py-2 rounded-md text-base font-medium underline-offset-1 hover:underline";
const baseNavbarMobileItemClasses =
  "text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-violet-500 hover:text-white transition ";
const NavbarMobileAccountClasses =
  " text-white block bg-dark-purple px-3 py-2 rounded-md text-base font-medium hover:bg-violet-500 hover:text-white transition ";
const navigationSections = [
  { name: "About", id: "about" },
  { name: "Premium", id: "premium" },
  { name: "Business", id: "business" },
  { name: "FAQ", id: "faq" },
  { name: "Team", id: "team" },
];
const notifyLogOut = () =>
  toast.info("You have successfully logged out", {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
// const navigationPages = [{ name: "Api", href: "/api" }];
const navigationPages = [];
function Navbar() {
  const { user, setUser } = useUser();
  const isUserLoggedIn = user !== null;
  const navigate = useNavigate();

  return (
    <Disclosure
      as="nav"
      className=" text-white bg-transparent absolute top-0 left-0 right-0 "
    >
      {({ open }) => (
        <>
          <ToastContainer />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <img className="h-12 w-auto" src={logoUrl} alt="CARS" />
                </Link>
              </div>
              <div className="hidden md:flex w-full items-baseline">
                <nav
                  id="landscape-navbar"
                  className="ml-4 flex items-center space-x-1"
                >
                  {navigationSections.map((section) => (
                    <NavLink
                      key={section.name}
                      to={`/#${section.id}`}
                      className={baseNavbarItemClasses}
                    >
                      {section.name}
                    </NavLink>
                  ))}

                  {navigationPages?.map((page) => (
                    <NavLink
                      key={page.name}
                      to={page.href}
                      className={({ isActive: active }) => {
                        return (
                          (active ? "underline" : "hover:underline") +
                          baseNavbarItemClasses
                        );
                      }}
                    >
                      {page.name}
                    </NavLink>
                  ))}
                </nav>
                {isUserLoggedIn ? (
                  <AccountDropdown />
                ) : (
                  <Link
                    to="/login"
                    className="ml-auto text-black text-xs leading-normal bg-gray-200 py-2 px-6 rounded-full hover:bg-gray-300 transition "
                  >
                    Login
                  </Link>
                )}
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="bg-black bg-opacity-60 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden p-2 py-1">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white bg-opacity-90 backdrop-blur-lg rounded drop-shadow-lg">
              {navigationSections.map((section) => (
                <Disclosure.Button
                  as={NavLink}
                  key={section.name}
                  to={`/#${section.id}`}
                  className={baseNavbarMobileItemClasses}
                >
                  {section.name}
                </Disclosure.Button>
              ))}
              {navigationPages?.map((page) => (
                <Disclosure.Button
                  as={NavLink}
                  to={page.href}
                  key={page.name}
                  className={baseNavbarMobileItemClasses}
                >
                  {page.name}
                </Disclosure.Button>
              ))}
              <div className="border border-black !my-4" />
              {isUserLoggedIn ? (
                <>
                  <Disclosure.Button
                    as={NavLink}
                    to="/account"
                    className={NavbarMobileAccountClasses}
                  >
                    Account
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={NavLink}
                    to="/subscription"
                    className={NavbarMobileAccountClasses}
                  >
                    Subscription
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={NavLink}
                    onClick={() => {
                      notifyLogOut();
                      googleLogout();
                      navigate("/");
                      setUser(null);
                    }}
                    className={NavbarMobileAccountClasses}
                  >
                    Log out
                  </Disclosure.Button>
                </>
              ) : (
                <Disclosure.Button
                  as={Link}
                  to="/login"
                  className={NavbarMobileAccountClasses}
                >
                  Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 inline-block ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
