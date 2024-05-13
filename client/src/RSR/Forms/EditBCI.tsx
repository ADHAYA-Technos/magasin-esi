import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react'

interface BCI {
  bciId : number  
  type: string;
  dateCreation: string,
  products: string[];
  quantities: number[];

  }

  type Product = {
    productId: number;
    designation: string;
    demandedQuantity: number;
    quantityPhysique: number;
    seuilMin : number ;
  };
const EditBCI= ({ selectedBCIRow, goBack }) => {
    const [bonData, setBonData] = useState<BCI>({
        bciId: 0,
        type:'',
        dateCreation: '',
        products : [],
        quantities : [],
      });
      const [products, setProducts] = useState<Product[]>([]);
      const [entered , setEntered] = useState<boolean[]>([]);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
     
    useEffect(() => {
       
        
        if (selectedBCIRow) {

            
          setBonData(selectedBCIRow);
         
        }
      }, [selectedBCIRow]);
    
      
    
      useEffect(() => {
        if (bonData.bciId !== 0) {
          
          fetch(`/api/lignebci/${bonData.bciId}`)
            .then((response) => response.json())
            .then((data) => {
              if (Array.isArray(data)) {
                
                setProducts(data);
                
              
              } else {
                console.error('Invalid data format:', data);
              }
            });
        }
      }, [bonData.bciId]);

  

      const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        
    
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];
          updatedProducts[index].demandedQuantity = parseInt(event.target.value); // Update with the parsed value
          return updatedProducts;
        });
    
      };
      const handleSaveChanges = async () => {
        try {
         
          const updatedCommandes = products.map((product) => ({
            productId: product.productId,
            demandedQuantity: product.demandedQuantity,
            dateCreation : formattedDate ,
            RSR : 'RSR' 
          }));
      
          
          await axios.put(`/api/UpdateBCI/${bonData.bciId}`, {
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
        <p className="text-gray-700 text-sm font-bold mb-1">ID du BCI:</p>
        <div className="border border-gray-300 rounded-md p-2">{bonData.bciId}</div>
      </div>
     
      <div className="md:w-1/3">
        <p className="text-gray-700 text-sm font-bold mb-1">Date de création du BCI:</p>
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
          <input
            type="number"
            min={0}
            max={product.quantityPhysique - product.seuilMin}
            value={product.demandedQuantity}
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
      Validate BCI
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

export default EditBCI ;