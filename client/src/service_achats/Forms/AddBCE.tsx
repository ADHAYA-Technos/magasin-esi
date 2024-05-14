import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  selectedRowIds: number[];
  goBack: () => void;
}

interface OrderRecipient {
  chapitre: string;
  article: string;
  fournisseur: string;
  products: string[];
  prices: number[];
  quantities: number[];
}

const AddBCE: React.FC<Props> = ({ selectedRowIds, goBack }) => {
  const [orderRecipient, setOrderRecipient] = useState<OrderRecipient>({
    chapitre: '',
    article: '',
    fournisseur: '',
    products: [],
    prices: [],
    quantities: [],
  });
  const [fournisseurs, setFournisseurs] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [chapitres, setChapitres] = useState<string[]>([]);
  const [articles, setArticles] = useState<string[]>([]);
  const [unselectedProducts, setUnselectedProducts] = useState<string[]>([]);
  const [lastRowPrice, setLastRowPrice] = useState('');
  const [lastRowQuantity, setLastRowQuantity] = useState('');
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
    fetch(`/api/fournisseurs`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFournisseurs(data);
         
        } else {
          console.error('Invalid data format:', data);
        }
      });
  }, []);

  const handleChapitreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chapitreId = event.target.value;
    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      chapitre: chapitreId,
    }));
    fetch(`/api/articles/${chapitreId}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => console.log(error));
  };

  const handleArticleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const articleId = event.target.value;
    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      article: articleId,
      products: [],
      prices: [],
      quantities: [],
    }));

    fetch(`/api/products/${articleId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnselectedProducts(data);
          setProducts(data);
        } else {
          console.error('Invalid data format:', data);
        }
      });
  };

  const handleFournisseurChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fournisseurId = event.target.value;
    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      fournisseur: fournisseurId,
    }));
  };

  const handlePriceChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrices = [...orderRecipient.prices];
    newPrices[index] = parseFloat(event.target.value);
    setLastRowPrice(parseFloat(event.target.value).toString());

    const newProducts = [...orderRecipient.products];
    newProducts[index].price = event.target.value;

    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      prices: newPrices,
      products: newProducts,
    }));
  };

  const handleQuantityChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantities = [...orderRecipient.quantities];
    newQuantities[index] = parseInt(event.target.value);
    setLastRowQuantity(parseInt(event.target.value).toString());

    const newProducts = [...orderRecipient.products];
    newProducts[index].quantity = event.target.value;

    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      quantities: newQuantities,
      products: newProducts,
    }));
  };

  const handleProductChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = event.target.value;

    // Check if the selected product is already selected in another row
    if (orderRecipient.products.some((product, i) => i !== index && product.productId === selectedProductId)) {
      //  nooot update the state if the product is already selected in another row
      return;
    }

    const newProducts = [...orderRecipient.products];

    // ensure that the product exists at the specified index
    if (!newProducts[index]) {
      newProducts[index] = { productId: '', price: '', quantity: '' };
    }

    newProducts[index].productId = selectedProductId;

    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      products: newProducts,
    }));
  };

  const handleAddRow = () => {
    // allow adding the first row without conditions
    if (orderRecipient.products.length === 0) {
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        products: [{ productId: '', price: '', quantity: '' }],
      }));
      return;
    }

    // Check if the last row has filled price and quantity
    const lastRowIndex = orderRecipient.products.length - 1;
    const lastRow = orderRecipient.products[lastRowIndex];
    if (
      lastRow &&
      lastRow.price !== undefined &&
      lastRow.price !== '' &&
      lastRow.quantity !== undefined &&
      lastRow.quantity !== ''
    ) {
      // Check if there are no unselected products available
      if (unselectedProducts.length === 0) {
        alert('You have already added all available products for this article.');
        return; // All products have been selected, exit early
      }

      // Check if the number of rows exceeds the number of available products
      if (orderRecipient.products.length >= unselectedProducts.length) {
        alert('You have already added all available products for this article.');
        return;
      }

      // Add a new row only if the last row has filled price and quantity
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        products: [...prevOrderRecipient.products, { productId: '', price: '', quantity: '' }],
      }));
    } else {
      // Check if the user has selected a product
      const lastProductIndex = orderRecipient.products.length - 1;
      const lastProduct = orderRecipient.products[lastProductIndex];
      if (lastProduct && lastProduct.productId) {
        const confirmed = window.confirm(
          'Price and quantity fields in the current row are not filled. Do you want to proceed anyway?'
        );
        if (confirmed) {
          // Add a new row if the user confirms
          setOrderRecipient((prevOrderRecipient) => ({
            ...prevOrderRecipient,
            products: [...prevOrderRecipient.products, { productId: '', price: '', quantity: '' }],
          }));
        }
      } else {
        // Prompt the user to select a product before proceeding
        alert('Please select a product before adding a new row.');
      }
    }
  };

  const handleDeleteRow = (index: number) => {
    // Retrieve the product being deleted
    const deletedProduct = orderRecipient.products[index];
    // Add the deleted product back to the list of unselected products, only if productId exists
    if (deletedProduct.productId) {
      setUnselectedProducts((prevUnselectedProducts) => [...prevUnselectedProducts, deletedProduct]);
    }

    const newProducts = [...orderRecipient.products];
    newProducts.splice(index, 1);

    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      products: newProducts,
    }));
  };

  const handleConfirm = async () => {
   console.log(filteredFournisseurs);
    if(filteredFournisseurs.length > 0 && !orderRecipient.fournisseur){
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        fournisseur: filteredFournisseurs[0].fournisseurId,
      }));
    }
    if(filteredFournisseurs.length ===0 || orderRecipient.products.length === 0){
      window.alert(filteredFournisseurs.length===0?'Please select a fournissor ':'Please Add Products');
      return;
    }
    try {
      // Ensure that orderRecipient contains the necessary data
      if (!orderRecipient.chapitre || !orderRecipient.article || !orderRecipient.fournisseur || filteredFournisseurs.length===0 ||orderRecipient.products.length === 0) {
        window.alert(orderRecipient.fournisseur?'Please select a fournissor':'Please fill in all fields before confirming.');
        console.error('Error creating Bon and Commande rows: Incomplete data');
        return;
      }

      const bonResponse = await axios.post('/api/createBon', {
        chapitreId: orderRecipient.chapitre,
        articleId: orderRecipient.article,
        fournisseurId: orderRecipient.fournisseur,
        type: 'BCE',
        dateCreation: formattedDate,
      });
      const bonId = bonResponse.data.bonId;

      // Prepare data for creating Commande rows
      const commandesData = orderRecipient.products.map((product) => ({
        bonId: bonId,
        productId: product.productId,
        quantity: product.quantity || 0, // Setting default value if quantity is empty
        pu: product.price || 0, // Setting default value if price is empty
        leftQuantity: product.quantity || 0,
        deliveredQuantity: 0, // Setting default value if quantity is empty
      }));

      // Send request to create Commande rows
      await axios.post('/api/createCommandeRows', commandesData);

      const confirmMessage = `Bon and Commande rows created successfully for Bon ID: ${bonId}.`;
      const confirmed = window.confirm(confirmMessage);
      if (confirmed) {
        // Show message and go back if user confirms
        alert('Bon created successfully!');
        goBack();
        window.location.reload();
      } else {
        // Show message only if user cancels
        alert('Bon creation canceled.');
      }
    } catch (error) {
      console.error('Error creating Bon and Commande rows:', error);
      alert('An error occurred while creating Bon and Commande rows.');
    }
  };

  const filteredFournisseurs = fournisseurs.filter((fournisseur) =>
  fournisseur.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase())
);
  // Function to handle change in search term
  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  
    const filteredFournisseurs = fournisseurs.filter((fournisseur) =>
      fournisseur.raisonSociale.toLowerCase().includes(event.target.value.toLowerCase())
    );
  
    // Check if the current fournisseur in orderRecipient still exists in the filtered list
    const existingFournisseur = filteredFournisseurs.find(
      (fournisseur) => fournisseur.fournisseurId === orderRecipient.fournisseur
    );
  
    if (existingFournisseur) {
      // If the current fournisseur still exists in the filtered list, keep it
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        fournisseur: existingFournisseur.fournisseurId,
      }));
    } else {
      // If the current fournisseur is not in the filtered list, select the first fournisseur from the filtered list
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        fournisseur: filteredFournisseurs.length > 0 ? filteredFournisseurs[0].fournisseurId : '',
      }));
    }
  };
  
  console.debug(orderRecipient.fournisseur);
  return (
    <>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Chapitre:</label>
        <select
          value={orderRecipient.chapitre}
          onChange={handleChapitreChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          {chapitres.map((chapitre) => (
            <option key={chapitre.numChapitre} value={chapitre.chapitreId}>
              {chapitre.libelle}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Article:</label>
        <select
          value={orderRecipient.article}
          onChange={handleArticleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          {articles.map((article) => (
            <option key={article.articleId} value={article.articleId}>
              {article.designation}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Fournisseur:</label>
        <select
          value={orderRecipient.fournisseur}
          onChange={handleFournisseurChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          {filteredFournisseurs.map((fournisseur) => (
            <option key={fournisseur.fournisseurId} value={fournisseur.fournisseurId}>
              {fournisseur.raisonSociale}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search fournisseur"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      <button
        className="bg-gray-800 text-white py-2 px-6 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 mr-4"
        onClick={handleAddRow}
      >
        Add Row
      </button>
      {orderRecipient.products.map((product, index) => (
        <div key={index} className="mb-6">
          <button
            onClick={() => handleDeleteRow(index)}
            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 mr-6"
          >
            Delete
          </button>
          <label className="block text-gray-700 text-sm font-bold mb-2">Product:</label>
          <select
            value={product.productId}
            onChange={(event) => handleProductChange(index, event)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Select a product</option>
            {unselectedProducts.map((unselectedProduct) => (
              <option
                key={unselectedProduct.productId}
                value={unselectedProduct.productId}
                disabled={orderRecipient.products.some(
                  (selectedProduct) => selectedProduct.productId === unselectedProduct.productId
                )}
              >
                {unselectedProduct.designation}
              </option>
            ))}
          </select>
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Price:</label>
          <input
            type="number"
            value={orderRecipient.prices[index]}
            onChange={(event) => handlePriceChange(index, event)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Quantity:</label>
          <input
            type="number"
            value={orderRecipient.quantities[index]}
            onChange={(event) => handleQuantityChange(index, event)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input type="checkbox" className="mt-4" />
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 mr-4"
        onClick={handleConfirm}
      >
        Confirm
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

export default AddBCE;
