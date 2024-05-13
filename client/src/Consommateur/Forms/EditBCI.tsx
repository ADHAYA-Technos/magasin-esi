import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  selectedRow: Bon | null;
  goBack: () => void;
}

interface Bon {
  Id: number;
  dateCreation: string;
  : string;
  recieved: number;
  totalPu: string;
}

const EditBCE: React.FC<Props> = ({ selectedRow, goBack }) => {
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
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    if (selectedRow) {
      setBonData(selectedRow);
    }
  }, [selectedRow]);

  const handleChapitreClick = () => {
    fetch('/api/chapitres')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChapitres(data);
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch((error) => console.log(error));
    setBonData((prevBonData) => ({
      ...prevBonData,
      numChapitre: '',
    }));
  };

  const fetchArticles = async (chapitreId: string) => {
    try {
      const response = await axios.get(`/api/articles/${chapitreId}`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchFournisseurs = async (articleId: string) => {
    try {
      const response = await axios.get(`/api/fournisseurs/${articleId}`);
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Error fetching fournisseurs:', error);
    }
  };

  useEffect(() => {
    if (bonData.bonId !== 0) {
      fetch(`/api/commandes/${bonData.bonId}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.warn(data);
            setProducts(data);
          } else {
            console.error('Invalid data format:', data);
          }
        });
    }
  }, [bonData.bonId]);

  const handleChapitreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChapitre = event.target.value;
    setBonData({ ...bonData, numChapitre: selectedChapitre });
    fetchArticles(selectedChapitre);
  };

  const handleArticleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArticle = event.target.value;
    setBonData({ ...bonData, designation: selectedArticle });
    fetchFournisseurs(selectedArticle);
  };

  const handleFournisseurChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFournisseur = event.target.value;
    setBonData({ ...bonData, raisonSociale: selectedFournisseur });
  };

  // Handler function to update price of a product
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].pu = value;
      return updatedProducts;
    });
  };

  // Handler function to update quantity of a product
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].quantity = value;
      return updatedProducts;
    });
  };
  // Add a new product row
  const handleAddProduct = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      { productId: 0, designation: '', pu: '', quantity: '' },
    ]);
  };

  // Delete a product row
  const handleDeleteProduct = (index: number) => {
    setProducts((prevProducts) => [...prevProducts.slice(0, index), ...prevProducts.slice(index + 1)]);
  };

  // Handler function to save changes
  const handleSaveChanges = async () => {
    try {
      // Prepare updated commandes data
      const updatedCommandes = products.map((product) => ({
        commandeId: product.productId,
        pu: product.pu,
        quantity: product.quantity,
      }));

      // Prepare updated bon data
      const updatedBonData = {
        bonId: bonData.bonId,
        numChapitre: bonData.numChapitre,
        designation: bonData.designation,
        raisonSociale: bonData.raisonSociale,
        // Add any other fields that need to be updated
      };

      // Send updated bon and commandes data to backend
      await axios.put(`/api/bon/${bonData.bonId}`, {
        updatedBonData,
        updatedCommandesData: updatedCommandes, // Pass updatedCommandesData to the server
      });

      alert('Changes saved successfully!');
      goBack(); // Go back to the previous page after saving changes
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
          onChange={handleChapitreChange}
          onClick={handleChapitreClick}
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
          onChange={handleArticleChange}
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
          onChange={handleFournisseurChange}
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
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 mr-6"
        onClick={handleAddProduct}
      >
        Add Product
      </button>

      {products.map((product, index) => (
        <div key={index} className="mb-6">
       <button
            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 mr-6"
            onClick={() => handleDeleteProduct(index)}
          >
            Delete
          </button>
          <label className="block text-gray-700 text-sm font-bold mb-2">Product:</label>
          <select
            value={product.productId}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">{product.designation}</option>
          </select>
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Price:</label>
          <input
            type="number"
            value={product.pu}
            onChange={(event) => handlePriceChange(event, index)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Quantity:</label>
          <input
            type="number"
            value={product.quantity}
            onChange={(event) => handleQuantityChange(event, index)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input type="checkbox" className="mt-4" />
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

export default EditBCE;
