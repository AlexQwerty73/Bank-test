import React from 'react';

export const Img = ({folder, img, alt = ''}) => {
   return (
      <img src={`./imgs/${folder}/${img}`} alt={alt}/>
   );
};