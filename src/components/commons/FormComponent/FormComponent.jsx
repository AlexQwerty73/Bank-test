import React from 'react';
import { useForm } from 'react-hook-form';
import { Currency, Number, Name, Surname, Email, Password, Phone, PIN, CardCategory, CardType, Address, Amount } from './labels';

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
               case 'name':
                  return <Name key={input} register={register} errors={errors} required />;
               case 'surname':
                  return <Surname key={input} register={register} errors={errors} required />;
               case 'email':
                  return <Email key={input} register={register} errors={errors} required />;
               case 'password':
                  return <Password key={input} register={register} errors={errors} required />;
               case 'phone':
                  return <Phone key={input} register={register} errors={errors} required />;
               case 'pin':
                  return <PIN key={input} register={register} errors={errors} required />;
               case 'cardcategory':
                  return <CardCategory key={input} register={register} errors={errors} required />;
               case 'cardtype':
                  return <CardType key={input} register={register} errors={errors} required />;
               case 'address':
                  return <Address key={input} register={register} errors={errors} required />;
               case 'amount':
                  return <Amount key={input} register={register} errors={errors} required />;
               default:
                  return null;
            }
         })}
         <button type="submit">Submit</button>
      </form>
   );
};
