import React from 'react';

export const Number = ({ register, errors }) => {
  const name = 'number';

  return (
    <div>
      <label>
         <div className="title">Card Number:</div> 
        <input
          type="text"
          {...register(name, {
            required: 'Card number is required',
            pattern: {
              value: /^[0-9]{16}$/,
              message: 'Please enter a valid 16-digit card number'
            }
          })}
        />
      </label>
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
};
