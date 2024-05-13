import React, { useEffect, useState } from "react";
import axios from "axios";

import Button from "@mui/material/Button"; // Import Button from Material-UI
import { idID } from "@mui/material/locale";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  goBack: () => void;
}
type Product = {
  productId: number;
  designation: string;
};

interface OrderRecipient {
  type: string;
  products: string[];
  quantities: number[];
}
const AddBCI: React.FC<Props> = ({  goBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [unselectedProducts, setUnselectedProducts] = useState<Product[][]>([]);
  const [orderRecipient, setOrderRecipient] = useState<OrderRecipient>({
    type: '',
    products: [],
    quantities: [],
  });
  const[searched ,setSearched] = useState<Boolean[]>([]);
  const [lastRowQuantity, setLastRowQuantity] = useState('');
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState<string[]>([]);
  const [type, setType] = React.useState('');
  useEffect(() => {
   
      fetch(`/api/products`)
        .then((response) => response.json())
        .then((data) => {
          // Map through the data array and add id as productId to each product
          
          setProducts(data);
          setUnselectedProducts(prevUnselectedProducts => {
            // Create a copy of the previous state
            const newState = [...prevUnselectedProducts];
        
           
                newState[0] = data;
                newState[1] = data;
            // Return the updated state
            return newState;
        });      
        })
        .catch((error) => console.error("Error fetching products:", error));


        setSearched(prevSearched => {
          const newState = [...prevSearched];
            
          for (let i = 0; i < products.length; i++) {
            newState.push(false);
          }
          
          
          // Return the updated state
          return newState;
          
         })
    }
  , []);

  const handleAddRow = () => {
    // allow adding the first row without conditions
    if (orderRecipient.products.length === 0) {
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        products: [{ productId: '', quantity: '' }],
      }));
      return;
    }
   

    // Check if the last row has filled price and quantity
    const lastRowIndex = orderRecipient.products.length - 1;

    setSearchTerm(prevSearchTerm => {
      // Create a copy of the previous state
      const newState = [...prevSearchTerm];
  
      // Set each row from index 0 to data.length - 1 with the new data
      
          newState[lastRowIndex] = '';
      
      // Return the updated state
      return newState;
  });
    const lastRow = orderRecipient.products[lastRowIndex];
    if (
      lastRow &&
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
        products: [...prevOrderRecipient.products, { productId: '', quantity: '' }],
      }));
    } else {
      // Check if the user has selected a product
      const lastProductIndex = orderRecipient.products.length - 1;
      const lastProduct = orderRecipient.products[lastProductIndex];
      
      if (lastProduct && lastProduct.productId) {
        const confirmed = window.confirm(
          'Quantity field in the current row are not filled. Do you want to proceed anyway?'
        );
        if (confirmed) {
          // Add a new row if the user confirms
          setOrderRecipient((prevOrderRecipient) => ({
            ...prevOrderRecipient,
            products: [...prevOrderRecipient.products, { productId: '', quantity: '' }],
          }));
        }
      } else {
        // Prompt the user to select a product before proceeding
        alert('Please select a product before adding a new row.');
      }
    }
  };

  const [selectedProductIds , setSelectedProductIds] = useState<Number[]>([]);
   
  //handle Prodcut Change
  const handleProductChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = event.target.value;
    setSelectedProductIds(prevSelectedProducts => {
      // Create a copy of the previous state
      const newState = [...prevSelectedProducts];
  
      // Set each row from index 0 to data.length - 1 with the new data
      
          newState[index] = parseInt(selectedProductId);
      
      // Return the updated state
      return newState;
  });
    // Check if the selected product is already selected in another row
    if (orderRecipient.products.some((product, i) => i !== index && product.productId === selectedProductId)) {
      //  nooot update the state if the product is already selected in another row
      return;
    }

    const newProducts = [...orderRecipient.products];

    // ensure that the product exists at the specified index
    if (!newProducts[index]) {
      newProducts[index] = { productId: '', quantity: '' };
    }

    newProducts[index].productId = selectedProductId;

    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      products: newProducts,
    }));
    console.warn(index +1)
    const newProdArray = unselectedProducts[index+1].filter(product => product.productId !== parseInt(selectedProductId));

  setUnselectedProducts(prevUnselectedProducts => {
    // Create a copy of the previous state
    const newState = [...prevUnselectedProducts];

    // Set each row from index 0 to data.length - 1 with the new data
    
        newState[index+1] = newProdArray;
    
    // Return the updated state
    return newState;
});
  };
// handle delete ROW
const handleDeleteRow = (index: number) => {
  // Retrieve the product being deleted
  const deletedProduct = orderRecipient.products[index];
  // Add the deleted product back to the list of unselected products, only if productId exists
  if (deletedProduct.productId) {
    setUnselectedProducts((prevUnselectedProducts) => {
    const newState =  [...prevUnselectedProducts] ;
    newState[index-1] = newState[index-1].concat(products.filter(product => product.productId === deletedProduct.productId));
    return newState;
    
  });
  }



  const newProducts = [...orderRecipient.products];
  newProducts.splice(index, 1);

  setOrderRecipient((prevOrderRecipient) => ({
    ...prevOrderRecipient,
    products: newProducts,
  }));
};

//handle quantity change
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
//handle CONFIRM 
const handleConfirm = async () => {


  try {
    // Ensure that orderRecipient contains the necessary data
    if (orderRecipient.products.length === 0) {
      window.alert('Please select products ');
      return;
    }

    const bonResponse = await axios.post('/api/createBCI', {
     
      type: type ==='S'? 'Sortie' : 'Décharge',
      dateCreation: formattedDate,
    });
    const bciId = bonResponse.data.bciId;

    // Prepare data for creating Commande rows
    const commandesData = orderRecipient.products.map((product) => ({
      bonId: bciId,
      productId: product.productId,
      quantity: product.quantity || 0, // Setting default value if quantity is empty
    }));

    // Send request to create Commande rows
    await axios.post('/api/createBciRows', commandesData);

    const confirmMessage = `Bon and Commande rows created successfully for Bon ID: ${bciId}.`;
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



const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const newSearchTerm = event.target.value; // Update the searchTerm for the specific row

  if(!searched[index]){
    setUnselectedProducts(prevUnselectedProducts => {
      // Create a copy of the previous state
      const newState = [...prevUnselectedProducts];
      
      // Update the specific row with the new data
      newState[index+1] = unselectedProducts[index];
      
      // Return the updated state
      return newState;
  })
   setSearched(prevSearched => {
    const newState = [...prevSearched];
      
    // Update the specific row with the new data
    newState[index] = true;
    
    // Return the updated state
    return newState;
    
   })
} 
  if(!newSearchTerm){
    const newProdArray = unselectedProducts[index-1].filter(product => product.productId !== selectedProductIds[index-1]);
    setUnselectedProducts(prevUnselectedProducts => {
      // Create a copy of the previous state
      const newState = [...prevUnselectedProducts];
      
      // Update the specific row with the new data
      newState[index] = newProdArray;
      
      // Return the updated state
      return newState;
  });
  setSearchTerm(prevSearchTerm => {
    // Create a copy of the previous state
    const newState = [...prevSearchTerm];

    // Set each row from index 0 to data.length - 1 with the new data
    
        newState[index] = newSearchTerm;
    
    // Return the updated state
    return newState;
});
  return ;
  }
  setSearchTerm(prevSearchTerm => {
    // Create a copy of the previous state
    const newState = [...prevSearchTerm];

    // Set each row from index 0 to data.length - 1 with the new data
    
        newState[index] = newSearchTerm;
    
    // Return the updated state
    return newState;
});
  const filteredProducts = unselectedProducts[index].filter((product) =>
    product.designation.toLowerCase().includes(event.target.value.toLowerCase())
  );
  
  setUnselectedProducts(prevUnselectedProducts => {
    // Create a copy of the previous state
    const newState = [...prevUnselectedProducts];
    
    // Update the specific row with the new data
    newState[index] = filteredProducts;
    
    // Return the updated state
    return newState;
});
};

  return (
    <div>

<FormControl required sx={{ m: 1, minWidth: 180 }}>
        <InputLabel >Type du BCI</InputLabel>
        <Select
         
          value={type}
          label="type *"
          onChange={(event) => setType(event.target.value as string)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'S'}>Sortie</MenuItem>
          <MenuItem value={'D'}>Décharge</MenuItem>
          
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
      {type &&(
        <>
    <div className="flex gap-4">
      
     
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
            {unselectedProducts[index].map((unselectedProduct) => (
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
      
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Quantity:</label>
          <input
            type="number"
            min={0}
            value={orderRecipient.quantities[index]}
            onChange={(event) => handleQuantityChange(index, event)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input
          type="text"
          placeholder="Search product"
          value={searchTerm[index]}
          onChange={(e) => handleSearchTermChange(e, index)}
          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        
        </div>
      ))}
      
      <Button onClick ={handleAddRow} variant="contained" color="primary" size="small">Add Ligne</Button>
    </div>
    
    <button
        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 mr-4"
        onClick={handleConfirm}
      >
        Confirm
      </button>
      </> )}
      <button
        className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
        onClick={goBack}
      >
        Go Back
      </button>
    
    </div>
  );
}

export default AddBCI;
