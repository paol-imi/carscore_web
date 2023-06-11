import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ScrollToHashElement } from "../../utils/scroll-functions";
function RootLayout() {
  return (
    <>
      <header className="relative z-20">
        <Navbar />
      </header>
      <main className="h-full">
        <Outlet />
      </main>
      <ScrollToHashElement />
    </>
  );
}

export default RootLayout;
