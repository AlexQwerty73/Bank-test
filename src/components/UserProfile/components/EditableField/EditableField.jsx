import { EditBtn } from '../../../commons';
import styles from '../../userProfile.module.css';

export const EditableField = ({ isEdit, value, onChange, onSave }) => {
   return (
      <div className={styles.itemData}>
         <div className={styles.leftPart}>
            {isEdit ? <input className={styles.input} value={value} onChange={e => onChange(e.target.value)} /> : value}
         </div>
         <div className={styles.rightPart}>
            <EditBtn isEdit={isEdit} onClick={onSave} />
         </div>
      </div>)
};