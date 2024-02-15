import { useParams } from "react-router-dom";
import { useGetCardsByUserIdQuery } from '../../../../redux'
import { convertToNumberCartFormat } from "../../../../utils";
import styles from '.././formComponent.module.css';

export const UserCards = ({ register, errors }) => {
   const { userId } = useParams();
   const { data: cards = [], isLoading } = useGetCardsByUserIdQuery(userId);
   const name = 'usercards';

   return (
      <div className={styles.input_container}>
         <label >
            <div className={styles.title}>From Number:</div>
            {
               !isLoading
                  ? <select {...register(name, { required: 'Please select a card number' })}>
                     <option value="">Select category</option>
                     {
                        cards.map(card => <option key={card.id} value={card.number}>{convertToNumberCartFormat(card.number)} ({card.currency})</option>)
                     }
                  </select>
                  : <option value="">Loading ...</option>
            }

         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};