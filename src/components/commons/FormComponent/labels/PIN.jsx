
import styles from '.././formComponent.module.css';

export const PIN = ({ register, errors }) => {
   const name = 'pin';
 
   return (
     <div className={styles.input_container}>
       <label>
         <div className={styles.title}>PIN:</div>
         <input
         placeholder='****'
           type="text"
           {...register(name, {
             required: 'PIN is required',
             pattern: {
               value: /^\d{4}$/,
               message: 'PIN must be a 4-digit number'
             }
           })}
         />
       </label>
       {errors[name] && <p>{errors[name].message}</p>}
     </div>
   );
 };