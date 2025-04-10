"use client";
import React, { useState } from "react";
import { useNavBar } from "@/components/navbar/navBarContext";
import useAuth from "@/hooks/useAuth";
import UserDropdown from "./header/UserDropdown";
import Btn from "@/elements/btn";
import Icon from "@/elements/Icon";
import Link from "next/link";

const Header = () => {
   const { isMobileOpen, toggleNavBar, toggleMobileNavBar } = useNavBar();
   const handleToggle = () => {
      if (window.innerWidth >= 1024) {
         toggleNavBar();
      } else {
         toggleMobileNavBar();
      }
   };

   const { gestor } = useAuth();

   return (
      <header className="sticky top-0 flex w-full z-40 bg-bee-dark-100 border-b border-bee-dark-300 dark:border-bee-dark-400 dark:bg-bee-dark-800 lg:border-b">
         <div className="flex items-center justify-between grow flex-row px-6">
            <div className="flex items-center gap-2  border-bee-dark-100 dark:border-bee-dark-400 justify-between border-b-0 px-0 py-4">
               <Btn variant="secondary" type="button" onClick={handleToggle} className={`${!gestor ? "cursor-not-allowed" : ""}`}>
                  {isMobileOpen ? (
                     <Icon name="xMark" className="h-7" />
                  ) : (
                     <Icon name="closeLeft" className="h-7" strokeWidth={1.5} />
                  )}
               </Btn>
            </div>

            <div className="flex items-center justify-between gap- py-4justify-end px-0">
               {gestor ? (
                  <>
                     <div className="flex items-center gap-2 2xsm:gap-3">
                     </div>
                     <UserDropdown />
                  </>
               ) : (
                  <Link href="/login">
                     <Btn variant="primary" texto="Login" />
                  </Link>
               )}
            </div>
         </div>
      </header>
   );
};

export default Header;
