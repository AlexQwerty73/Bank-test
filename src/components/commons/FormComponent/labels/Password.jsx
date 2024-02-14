export const Password = ({ register, errors }) => {
   const name = 'password';
 
   return (
     <div>
       <label>
         <div className="title">Password:</div>
         <input
           type="password"
           {...register(name, {
             required: 'Password is required',
             minLength: {
               value: 8,
               message: 'Password must be at least 8 characters long'
             }
           })}
         />
       </label>
       {errors[name] && <p>{errors[name].message}</p>}
     </div>
   );
 };