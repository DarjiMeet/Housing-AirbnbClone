import {Nunito} from "next/font/google"
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import ClientOnly from "./components/ClientOnly";

import ToastProvider from "./Providers/ToastPovider";

import RegisterModal from "./components/Modals/RegisterModal";
import LoginModal from "./components/Modals/LoginModal";
import RentModal from "./components/Modals/RentModal";

import getCurrentUser from "./actions/getCurrentUser";
import SearchModal from "./components/Modals/SearchModal";


export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb Clone",
};

const font = Nunito({
  subsets : ["latin"],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToastProvider/>
          <SearchModal/>
          <RentModal/>
          <LoginModal/>
          <RegisterModal/>
          <Navbar currentUser = {currentUser}/>
        </ClientOnly>
        
        <div className="pb-20 pt-28">
          {children}
        </div>
        
      </body>
    </html>                   
  );
}
