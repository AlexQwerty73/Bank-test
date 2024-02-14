export const CardCategory = ({ register, errors }) => {
   const name = 'cardCategory';
 
   return (
     <div>
       <label>
         <div className="title">Card Category:</div>
         <select {...register(name, { required: 'Please select a card category' })}>
           <option value="">Select category</option>
           <option value="debit">Debit</option>
           <option value="credit">Credit</option>
         </select>
       </label>
       {errors[name] && <p>{errors[name].message}</p>}
     </div>
   );
 };