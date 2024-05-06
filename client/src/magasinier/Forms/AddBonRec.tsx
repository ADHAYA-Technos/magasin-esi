import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  selectedRow: Bon | null;
  goBack: () => void;
}

interface Bon {
  bonId: number;
  numChapitre: string;
  designation: string;
  dateCreation: string;
  raisonSociale: string;
  recieved: number;
  totalPu: string;
}

const EditBR: React.FC<Props> = ({ selectedRow, goBack }) => {
  const [bonData, setBonData] = useState<Bon>({
    bonId: 0,
    numChapitre: '',
    designation: '',
    dateCreation: '',
    raisonSociale: '',
    recieved: 0,
    totalPu: '',
  });
  const [chapitres, setChapitres] = useState<string[]>([]);
  const [articles, setArticles] = useState<string[]>([]);
  const [fournisseurs, setFournisseurs] = useState<string[]>([]);
  const [entered , setEntered] = useState<boolean>();
  const [products, setProducts] = useState<string[]>([]);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  useEffect(() => {
    if (selectedRow) {
      setBonData(selectedRow);
    }
  }, [selectedRow]);

  

  useEffect(() => {
    if (bonData.bonId !== 0) {
      fetch(`/api/commandes/${bonData.bonId}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error('Invalid data format:', data);
          }
        });
    }
  }, [bonData.bonId]);
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setEntered(true);
    const { value } = event.target;
    const parsedValue = parseFloat(value);
  
    // Check if the parsedValue is NaN or if it's greater than leftQuantity
    if (isNaN(parsedValue) || parsedValue > products[index].leftQuantity) {
      // Update the input value to leftQuantity if parsedValue exceeds it
      event.target.value = products[index].leftQuantity.toString();
    }
  
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].deliveredQuantity = parseFloat(event.target.value); // Update with the parsed value
      return updatedProducts;
    });
  };
  


  // Handler function to save changes
  const handleSaveChanges = async () => {
    try {
      // Prepare updated commandes data
      const updatedCommandes = products.map((product) => ({
        commandeId: product.commandeId,
        quantity: product.deliveredQuantity,
        left : product.leftQuantity -product.deliveredQuantity,
        dateCreation : formattedDate 
       
      }));

      
     console.log(updatedCommandes);
      await axios.put(`/api/bonRec/${bonData.bonId}`, {
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Chapitre:</label>
        <select
          defaultValue={bonData.numChapitre}
          value={bonData.numChapitre}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">{bonData.numChapitre}</option>
          {chapitres.map((chapitre) => (
            <option key={chapitre} value={chapitre}>
              {chapitre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Article:</label>
        <select
          value={bonData.designation}
          
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">{bonData.designation}</option>
          {articles.map((article) => (
            <option key={article} value={article}>
              {article}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Fournisseur:</label>
        <select
          value={bonData.raisonSociale}
          
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">{bonData.raisonSociale}</option>
          {fournisseurs.map((fournisseur) => (
            <option key={fournisseur} value={fournisseur}>
              {fournisseur}
            </option>
          ))}
        </select>
      </div>
     

      {products.map((product, index) => (
  <div key={index} className="mb-6 flex flex-wrap items-center">
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
      <label className="block text-gray-700 text-sm font-bold mb-1">Product:</label>
      <div className="border border-gray-300 rounded-md p-2">{product.designation}</div>
    </div>

  

    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
      <label className="block text-gray-700 text-sm font-bold mt-4 mb-1">Demanded quantity:</label>
      <div className="border border-gray-300 rounded-md p-2">{product.quantity}</div>
    </div>

    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
      <label className="block text-gray-700 text-sm font-bold mt-4 mb-1">Left quantity:</label>
      <div className="border border-gray-300 rounded-md p-2">{entered?(product.leftQuantity -product.deliveredQuantity):(product.leftQuantity?product.leftQuantity:0)}</div>
    </div>

    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
      <label className="block text-gray-700 text-sm font-bold mt-4 mb-1">Delivered quantity:</label>
      <input
        type="number" min={0} max={product.leftQuantity}
        onChange={(event) => handleQuantityChange(event, index)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  </div>
))}

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
    </>
  );
};

export default EditBR;
