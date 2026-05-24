import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from './Main';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
   return (
      <>
         <Header />

         <Main>
            <Outlet />
         </Main>

         <Footer />
      </>
   );
};
