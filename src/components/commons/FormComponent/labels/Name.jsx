export const Name = ({ register, errors }) => {
   const name = 'name';

   return (
      <div>
         <label>
            <div className="title">Name:</div>
            <input
               type="text"
               {...register(name, {
                  required: 'Name is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};