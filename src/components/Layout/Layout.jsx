import React from 'react';
import { Footer, Header } from './components';

export const Layout = ({children}) => {
   return (
      <>
         <Header />

         <main className="main">
            {children}
         </main>

         <Footer />
      </>
   );
};