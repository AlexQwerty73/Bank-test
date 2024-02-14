export const Email = ({ register, errors }) => {
   const name = 'email';
 
   return (
     <div>
       <label>
         <div className="title">Email:</div>
         <input
           type="email"
           {...register(name, {
             required: 'Email is required',
             pattern: {
               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
               message: 'Please enter a valid email address'
             }
           })}
         />
       </label>
       {errors[name] && <p>{errors[name].message}</p>}
     </div>
   );
 };
 