import React from 'react';
import { useForm } from 'react-hook-form';
import { Currency, Number } from './labels';

export const FormComponent = ({ inputs, onSubmit }) => {
   const { register, handleSubmit, formState: { errors } } = useForm();

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         {inputs.map((input) => {
            switch (input) {
               case 'currency':
                  return <Currency key={input} register={register} errors={errors} required />;
               case 'number':
                  return <Number key={input} register={register} errors={errors} required />;
               default:
                  return null;
            }
         })}
         <button type="submit">Submit</button>
      </form>
   );
};
