import React from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../Img';

export const Logo = () => {
   return (
      <div className="logo">
         <Link to='/'>
            <Img folder='logo' img='main.png' />
         </Link>
      </div>
   );
};