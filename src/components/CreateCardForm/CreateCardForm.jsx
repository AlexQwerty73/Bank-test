import React, { useState } from 'react';

export const CreateCardForm = () => {
   const [cardData, setCardData] = useState({
      userId: "23rf",
      number: "",
      expiryDate: "",
      cvv: "",
      pin: "",
      balance: 1000,
      type: "VISA",
      currency: "USD",
      history: []
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCardData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Отримайте дані форми і відправте їх на сервер або базу даних
      console.log("Нова карта:", cardData);
      // Додайте логіку для збереження в базі даних
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Номер картки:
          <input
            type="text"
            name="number"
            value={cardData.number}
            onChange={handleChange}
          />
        </label>
        <br />
  
        <label>
          Термін дії (MM/YYYY):
          <input
            type="text"
            name="expiryDate"
            value={cardData.expiryDate}
            onChange={handleChange}
          />
        </label>
        <br />
  
        <label>
          CVV:
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleChange}
          />
        </label>
        <br />
  
        <label>
          PIN:
          <input
            type="text"
            name="pin"
            value={cardData.pin}
            onChange={handleChange}
          />
        </label>
        <br />
  
        <button type="submit">Створити карту</button>
      </form>
   );
};
