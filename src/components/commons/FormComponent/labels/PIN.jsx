export const PIN = ({ register, errors }) => {
   const name = 'pin';
 
   return (
     <div>
       <label>
         <div className="title">PIN:</div>
         <input
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