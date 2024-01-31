import React from 'react';

export const Main = ({ children }) => {
   return (
      <main className='main'>
         <div className="container">
            {
               children
            }
         </div>
      </main>
   );
};