import React from 'react';

export const Currency = ({ register, errors }) => {
  const name = 'currency';

  return (
    <div>
      <label>
        <div className="title">Currency:</div>
        <select {...register(name, { required: 'Please select a currency.' })}>
          <option value="">Select currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">UAH</option>
        </select>
      </label>
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
};
