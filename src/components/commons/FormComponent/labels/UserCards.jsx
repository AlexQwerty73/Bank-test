import { useParams } from "react-router-dom";
import { useGetCardsByUserIdQuery } from '../../../../redux'
import { convertToNumberCartFormat } from "../../../../utils";

export const UserCards = ({ register, errors }) => {
   const { userId } = useParams();
   const { data: cards = [], isLoading } = useGetCardsByUserIdQuery(userId);
   const name = 'usercards';
   console.log(cards);

   return (
      <div>
         <label>
            <div className="title">From Number:</div>
            {
               !isLoading
                  ? <select {...register(name, { required: 'Please select a card number' })}>
                     <option value="">Select category</option>
                     {
                        cards.map(card =><option value={card.number}>{convertToNumberCartFormat(card.number)}</option>)
                     }
                  </select>
                  : <option value="">Loading ...</option>
            }

         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};