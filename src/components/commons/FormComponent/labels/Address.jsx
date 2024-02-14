export const Address = ({ register, errors }) => {
   const name = 'address';

   return (
      <div>
         <label>
            <div className="title">Address:</div>
            <input
               type="text"
               {...register(name, {
                  required: 'Address is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};