import React from 'react';

export const Amount = ({ register, errors }) => {
  const name = 'amount';

  return (
    <div>
      <label>
        <div className="title">Amount:</div>
        <input
          type="number"
          {...register(name, {
            required: 'Amount is required',
            min: {
              value: 0,
              message: 'Amount must be greater than or equal to 0'
            }
          })}
        />
      </label>
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
};
