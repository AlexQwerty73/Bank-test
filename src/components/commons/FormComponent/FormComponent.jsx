import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './formComponent.module.css';
import {
   Currency, Number, Name, Surname, Email,
   Password, Phone, PIN, CardCategory, CardType,
   Address, Amount, UserCards,
} from './labels';

// Маппінг ключ → компонент замість switch/case
const INPUT_COMPONENTS = {
   currency:    Currency,
   number:      Number,
   name:        Name,
   surname:     Surname,
   email:       Email,
   password:    Password,
   phone:       Phone,
   pin:         PIN,
   cardcategory: CardCategory,
   cardtype:    CardType,
   address:     Address,
   amount:      Amount,
   usercards:   UserCards,
};

export const FormComponent = ({ inputs, onSubmit }) => {
   const { register, handleSubmit, formState: { errors } } = useForm();

   return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
         {inputs.map((input) => {
            const Component = INPUT_COMPONENTS[input];
            if (!Component) return null;
            return <Component key={input} register={register} errors={errors} />;
         })}
         <button className={styles.button} type="submit">Submit</button>
      </form>
   );
};
