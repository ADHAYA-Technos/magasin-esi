import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react'

interface BonRec {
    
    bonId : number;
    bonRecId : number;
    dateCreation : string;
    id:number

  }
const EditBonRec = ({ selectedBRRow, goBack }) => {
    const [bonData, setBonData] = useState<BonRec>({
        bonId: 0,
        bonRecId:0,
        dateCreation: '',
        id: 0,
      });
      const [products, setProducts] = useState<string[]>([]);
      const [entered , setEntered] = useState<boolean[]>([]);
      const [leftQuantity, setLeftQuantity] = useState<number[]>();
      const [deliveredQuantity, setDeliveredQuantity] = useState<number[]>();
      
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
     
    useEffect(() => {
       
        
        if (selectedBRRow) {

            
          setBonData(selectedBRRow);
        }
      }, [selectedBRRow]);
    
      
    
      useEffect(() => {
        if (bonData.id !== 0) {
          
          fetch(`/api/receptions/${bonData.id}`)
            .then((response) => response.json())
            .then((data) => {
              if (Array.isArray(data)) {
                
                setProducts(data);
                
                 setLeftQuantity(data.map((product) => product.leftQuantity));
                 setDeliveredQuantity(data.map((product) => product.quantity));
                 console.warn(products);
                 console.warn(leftQuantity);
                 console.warn(deliveredQuantity);
              } else {
                console.error('Invalid data format:', data);
              }
            });
        }
      }, [bonData.id]);

      const setEnteredAtIndex = (index: number) => {
        const updatedEntered = [...entered];
        updatedEntered[index] = true;
        setEntered(updatedEntered);
      };

      const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        
        
        setEnteredAtIndex(index);
        const { value } = event.target;
        const parsedValue = parseFloat(value);
        console.warn(leftQuantity[index] );
        // Check if the parsedValue is NaN or if it's greater than leftQuantity
        if (isNaN(parsedValue) || parsedValue > (leftQuantity[index] + deliveredQuantity[index])) {
          // Update the input value to leftQuantity if parsedValue exceeds it
          event.target.value =(leftQuantity[index] + deliveredQuantity[index]).toString();
          
          return ;
        }
    
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];
          updatedProducts[index].deliveredQuantity = parseFloat(event.target.value); // Update with the parsed value
          return updatedProducts;
        });
      };
      const handleSaveChanges = async () => {
        try {
          // Prepare updated commandes data
          const updatedCommandes = products.map((product) => ({
            commandeId: product.commandeId,
            quantity: product.deliveredQuantity,
            
            dateCreation : formattedDate 
           
          }));
    
          console.warn(updatedCommandes);
          await axios.put(`/api/UpdateBonRec/${bonData.id}`, {
            updatedCommandes
          });
    
          alert('Changes saved successfully!');
          goBack(); // Go back to the previous page after saving changes
          window.location.reload();
        } catch (error) {
          console.error('Error updating bon:', error);
          alert('Failed to save changes. Please try again.');
        }
      };
  return (
    
<>
  <div className="mb-6">
    <div className="flex flex-col md:flex-row md:space-x-4">
      <div className="md:w-1/3">
        <p className="text-gray-700 text-sm font-bold mb-1">ID du BCE:</p>
        <div className="border border-gray-300 rounded-md p-2">{bonData.bonId}</div>
      </div>
      <div className="md:w-1/3">
        <p className="text-gray-700 text-sm font-bold mb-1">ID du BR:</p>
        <div className="border border-gray-300 rounded-md p-2">{bonData.bonRecId}</div>
      </div>
      <div className="md:w-1/3">
        <p className="text-gray-700 text-sm font-bold mb-1">Date de création du BR:</p>
        <div className="border border-gray-300 rounded-md p-2">{bonData.dateCreation}</div>
      </div>
    </div>
  </div>

  <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {products.map((product, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="border border-gray-300 rounded-md p-4 mb-4 w-full">
          <p className="text-gray-700 text-sm font-bold mb-1">Product:</p>
          <div className="mb-2">{product.designation}</div>
          <p className="text-gray-700 text-sm font-bold mb-1">Demanded quantity:</p>
          <div className="mb-2">{product.demandedQuantity}</div>
          <p className="text-gray-700 text-sm font-bold mb-1">Left quantity:</p>
          <div className="mb-2">{entered[index] ? (leftQuantity[index] - (product.deliveredQuantity -deliveredQuantity[index])) : (product.leftQuantity ? product.leftQuantity : 0)}</div>
          <p className="text-gray-700 text-sm font-bold mb-1">Delivered quantity:</p>
          <input
            type="number"
            min={0}
            
            max={(leftQuantity[index] + deliveredQuantity[index])}
            value={entered[index] ? product.deliveredQuantity : product.quantity}
            onChange={(event) => handleQuantityChange(event, index)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
      </div>
    ))}
  </div>

  <div className="flex justify-end">
    <button
      className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 mr-4"
      onClick={handleSaveChanges}
    >
      Save Changes
    </button>
    <button
      className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
      onClick={goBack}
    >
      Go Back
    </button>
  </div>
</>


  )
}

export default EditBonRec