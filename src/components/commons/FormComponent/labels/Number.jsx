import React from 'react';

export const Number = ({ register, errors}) => {
  const name = 'number';

  return (
    <label>
      Number
      <input type="text" {...register(name, { required: 'invalid num' })} />
      {errors[name] ? errors[name].message : false}
    </label>
  );
};