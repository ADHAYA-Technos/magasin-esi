

import React, { useState } from 'react';
import logo from 'client/src/pages/dashboard/logo.png'; // Import the logo

function  BonDeReceptionPage () {
  // State variables to store data
  const [items, setItems] = useState([
    { id: 1, number: 1, designation: '', quantity: '' }
  ]);
  const [editable, setEditable] = useState(false);
  const [fournisseur, setFournisseur] = useState('Supplier Name');
  const [numBon, setNumBon] = useState('123456');
  const [dateBon, setDateBon] = useState('2024-04-05');

  // Function to add a new row to the table
  const addItem = () => {
    const newNumber = items.length > 0 ? items[items.length - 1].number + 1 : 1;

    const newItem = { id: items.length + 1, number: newNumber, designation: '', quantity: '' };

    setItems([...items, newItem]);
  };

  // Function to remove a row from the table
  const removeItem = id => {
    const indexToRemove = items.findIndex(item => item.id === id);

    const newItems = items.filter(item => item.id !== id);



    // Adjust numbers

    if (indexToRemove !== -1) {

      const diff = items.length > 1 ? items[indexToRemove].number - items[indexToRemove - 1].number : 1;

      for (let i = indexToRemove; i < newItems.length; i++) {

        newItems[i].number -= diff;

      }

    }



    setItems(newItems);
  };

  // Function to update an item's data
  const updateItem = (id, key, value) => {
    setItems(items.map(item => (item.id === id ? { ...item, [key]: value } : item)));
  };
  const handleQuantityChange = (id, value) => {
    const integerValue = parseInt(value, 10);
    if (!isNaN(integerValue) && integerValue >= 0) {
      updateItem(id, 'quantity', integerValue);
    }
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={logo} alt="Logo" style={{ width: '100%', height: '150px' }} />
      <h1 style={{ fontSize: '36px' }}>Bon de Reception</h1>
      <div style={{ textAlign: 'left', marginLeft: '50px', marginRight: '50px' }}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '10px' }}>
          Date: {editable ? <input type="text" value={dateBon} onChange={e => setDateBon(e.target.value)} /> : dateBon}
        </p>
        <p style={{ marginBottom: '10px' }}>
          Fournisseur: {editable ? <input type="text" value={fournisseur} onChange={e => setFournisseur(e.target.value)} /> : fournisseur}
        </p>
        <p style={{ marginBottom: '10px' }}>
          Numéro de Bon de Réception: {editable ? <input type="text" value={numBon} onChange={e => setNumBon(e.target.value)} /> : numBon}
        </p>
        <button onClick={() => setEditable(!editable)}>{editable ? 'Save' : 'Edit'}</button>
      </div>
      </div>
      <div style={{ margin: '50px auto', width: '80%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black' }}>Number</th>
              <th style={{ border: '1px solid black' }}>Designation</th>
              <th style={{ border: '1px solid black' }}>Quantity</th>
              <th style={{ border: '1px solid black' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                
                <td style={{ border: '1px solid black' }}>{item.number}</td>
                <td style={{ border: '1px solid black' }}>
                  <input
                    type="text"
                    value={item.designation}
                    onChange={e => updateItem(item.id, 'designation', e.target.value)}
                  />
                </td>
                <td style={{ border: '1px solid black' }}>
                <input
                    type="number"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.id, e.target.value)}
                  />
                </td>
                <td style={{ border: '1px solid black' }}>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addItem}>Add Row</button>
    </div>
  );
}



  
 
export default BonDeReceptionPage ;