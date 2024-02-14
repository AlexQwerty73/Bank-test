export const Surname = ({ register, errors }) => {
   const name = 'surname';

   return (
      <div>
         <label>
            <div className="title">Surname:</div>
            <input
               type="text"
               {...register(name, {
                  required: 'Surname is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};