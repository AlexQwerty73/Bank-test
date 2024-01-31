import React from 'react';
import { Footer, Header, Main } from './components';
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
