export const CardType = ({ register, errors }) => {
   const name = 'cardType';

   return (
      <div>
         <label>
            <div className="title">Card Type:</div>
            <select {...register(name, { required: 'Please select a card type' })}>
               <option value="">Select type</option>
               <option value="VISA">VISA</option>
               <option value="MASTERCARD">MASTERCARD</option>
            </select>
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};
