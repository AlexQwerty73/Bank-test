export const Phone = ({ register, errors }) => {
   const name = 'phone';

   return (
      <div>
         <label>
            <div className="title">Phone:</div>
            <input
               type="tel"
               {...register(name, {
                  required: 'Phone number is required',
                  pattern: {
                     value: /^\d{10}$/,
                     message: 'Please enter a valid phone number'
                  }
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};