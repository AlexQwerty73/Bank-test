import React from 'react';

export const Currency = ({ register, errors, required = false }) => {
  return (
    <label>
      Currency
      <input type="text" {...register('currency', { required })} />


      {errors.currency && <p>{errors.currency.message}</p>}
    </label>
  );
};