import React from 'react';
import styles from '.././formComponent.module.css';

export const Amount = ({ register, errors }) => {
  const name = 'amount';

  return (
    <div className={styles.input_container}>
      <label>
        <div className={styles.title}>Amount:</div>
        <input
        placeholder='1000'
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
