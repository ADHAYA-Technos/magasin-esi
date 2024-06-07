import React, { useEffect, useState } from "react";
import axios from "axios";

import Button from "@mui/material/Button"; // Import Button from Material-UI
import { idID } from "@mui/material/locale";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

interface Props {
  goBack: () => void;
}
type Product = {
  productId: number;
  designation: string;
  quantityPhysique: number;
  seuilMin: number;
};

interface OrderRecipient {
  type: string;
  products: string[];
  quantities: number[];
}
const AddBCI: React.FC<Props> = ({ goBack }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [unselectedProducts, setUnselectedProducts] = useState<Product[][]>([]);
  const [orderRecipient, setOrderRecipient] = useState<OrderRecipient>({
    type: "",
    products: [],
    quantities: [],
  });
  const [lastRowQuantity, setLastRowQuantity] = useState("");
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const [type, setType] = React.useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch(`/api/products`)
      .then((response) => response.json())
      .then((data) => {
        // Map through the data array and add id as productId to each product

        setProducts(data);
        setUnselectedProducts((prevUnselectedProducts) => {
          // Create a copy of the previous state
          const newState = [...prevUnselectedProducts];

          newState[0] = data;

          // Return the updated state
          return newState;
        });
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:3000/check-authentication',
          withCredentials: true,
        });
        console.warn(response.data.user);
        setUser(response.data.user);
      } catch (err) {
     
      }
    };
    checkAuthentication();
  }, []);
  const handleAddRow = () => {
    // allow adding the first row without conditions
    if (orderRecipient.products.length === 0) {
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        products: [{ productId: "", quantity: "" }],
      }));
      return;
    }

    // Check if the last row has filled price and quantity
    const lastRowIndex = orderRecipient.products.length - 1;

    const lastRow = orderRecipient.products[lastRowIndex];
    if (lastRow && lastRow.quantity !== undefined && lastRow.quantity !== "") {
      // Check if there are no unselected products available
      if (unselectedProducts.length === 0) {
        alert(
          "You have already added all available products for this article."
        );
        return; // All products have been selected, exit early
      }

      // Check if the number of rows exceeds the number of available products
      if (orderRecipient.products.length >= unselectedProducts.length) {
        alert(
          "You have already added all available products for this article."
        );
        return;
      }

      // Add a new row only if the last row has filled price and quantity
      setOrderRecipient((prevOrderRecipient) => ({
        ...prevOrderRecipient,
        products: [
          ...prevOrderRecipient.products,
          { productId: "", quantity: "" },
        ],
      }));
    } else {
      // Check if the user has selected a product
      const lastProductIndex = orderRecipient.products.length - 1;
      const lastProduct = orderRecipient.products[lastProductIndex];

      if (lastProduct && lastProduct.productId) {
        const confirmed = window.confirm(
          "Quantity field in the current row are not filled. Do you want to proceed anyway?"
        );
        if (confirmed) {
          // Add a new row if the user confirms
          setOrderRecipient((prevOrderRecipient) => ({
            ...prevOrderRecipient,
            products: [
              ...prevOrderRecipient.products,
              { productId: "", quantity: "" },
            ],
          }));
        }
      } else {
        // Prompt the user to select a product before proceeding
        alert("Please select a product before adding a new row.");
      }
    }
  };

  const [selectedProductIds, setSelectedProductIds] = useState<Number[]>([]);

  //handle Prodcut Change
  const handleProductChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProductId = event.target.value;
    setSelectedProductIds((prevSelectedProducts) => {
      // Create a copy of the previous state
      const newState = [...prevSelectedProducts];

      // Set each row from index 0 to data.length - 1 with the new data

      newState[index] = parseInt(selectedProductId);

      // Return the updated state
      return newState;
    });
    // Check if the selected product is already selected in another row
    if (
      orderRecipient.products.some(
        (product, i) => i !== index && product.productId === selectedProductId
      )
    ) {
      //  nooot update the state if the product is already selected in another row
      return;
    }

    const newProducts = [...orderRecipient.products];

    // ensure that the product exists at the specified index
    if (!newProducts[index]) {
      newProducts[index] = { productId: "", quantity: "" };
    }

    newProducts[index].productId = selectedProductId;

    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      products: newProducts,
    }));

    const newProdArray = unselectedProducts[index].filter(
      (product) => product.productId !== parseInt(selectedProductId)
    );

    setUnselectedProducts((prevUnselectedProducts) => {
      // Create a copy of the previous state
      const newState = [...prevUnselectedProducts];

      // Set each row from index 0 to data.length - 1 with the new data

      newState[index + 1] = newProdArray;

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
        const newState = [...prevUnselectedProducts];
    
        if (index === 0) {
          // If deleting the first row, add the product back to the first array in unselectedProducts
          newState[0] = newState[0].concat(
            products.find((product) => product.productId === deletedProduct.productId)
          );
        } else {
          // For other rows, add the product back to the previous row's unselectedProducts
          newState[index - 1] = newState[index - 1].concat(
            products.find((product) => product.productId === deletedProduct.productId)
          );
        }
    
        return newState;
      });
    }
    
    // Create a new products array without the deleted row
    const newProducts = [...orderRecipient.products];
    newProducts.splice(index, 1);
  
    // Create a new quantities array without the deleted row
    const newQuantities = [...orderRecipient.quantities];
    newQuantities.splice(index, 1);
  
    setOrderRecipient((prevOrderRecipient) => ({
      ...prevOrderRecipient,
      products: newProducts,
      quantities: newQuantities,
    }));
    
    // Adjust unselectedProducts for the remaining rows
    if (index > 0) {
      setUnselectedProducts((prevUnselectedProducts) => {
        const newState = [...prevUnselectedProducts];
    
        for (let i = index; i < newState.length; i++) {
          newState[i - 1] = newState[i];
        }
        newState.pop();
    
        return newState;
      });
    }
  };
  
  //handle quantity change
  const handleQuantityChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    const hasUnavailableProduct = orderRecipient.products.some((product) => {
      const prodDetails = products.find((prod) => prod.productId === parseInt(product.productId));
      return prodDetails && prodDetails.seuilMin >= prodDetails.quantityPhysique;
    });
  
    if (hasUnavailableProduct) {
      alert("Your order contains an unavailable product");
      return;
    }
    try {
      // Ensure that orderRecipient contains the necessary data
      if (orderRecipient.products.length === 0) {
        window.alert("Please select products ");
        return;
      }

      const bonResponse = await axios.post("/api/createBCI", {
        userId:user.userId,
        type: type === "S" ? "Sortie" : "Décharge",
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
      await axios.post("/api/createBciRows", commandesData);

      const confirmMessage = `Bon and Commande rows created successfully for Bon ID: ${bciId}.`;
      const confirmed = window.confirm(confirmMessage);
      if (confirmed) {
        // Show message and go back if user confirms
        alert("Bon created successfully!");
        goBack();
        window.location.reload();
      } else {
        // Show message only if user cancels
        alert("Bon creation canceled.");
      }
    } catch (error) {
      console.error("Error creating Bon and Commande rows:", error);
      alert("An error occurred while creating Bon and Commande rows.");
    }
  };

   
  return (
    <div>
      <FormControl required sx={{ m: 1, minWidth: 180 }}>
        <InputLabel>Type du BCI</InputLabel>
        <Select
          value={type}
          label="Type *"
          onChange={(event) => setType(event.target.value as string)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"S"}>Sortie</MenuItem>
          <MenuItem value={"D"}>Décharge</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>

      {type && (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-6">
              {orderRecipient.products.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 bg-white rounded-lg px-6 pt-6 pb-2"
                >
                 
                  <div className="flex gap-4">
                      
                  <Autocomplete
                  className="basis-3/6"
                    options={unselectedProducts[index]}
                    getOptionLabel={(option) => option.designation}
                    renderInput={(params) => (
                      <TextField {...params} label="Product" variant="outlined" />
                    )}
                    value={unselectedProducts[index].find(
                      (prod) => prod.productId === product.productId
                    )}
                    onChange={(event, newValue) =>
                      handleProductChange(index, { target: { value: newValue?.productId } })
                    }
                    disableClearable
                    isOptionEqualToValue={(option, value) => option.productId === value.productId}
                  />
                    <TextField
                      className="basis-2/6"
                      type="number"
                      label="Quantity"
                      variant="outlined"
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max:
                            products.find(
                              (product) =>
                                product.productId ===
                                parseInt(
                                  orderRecipient.products[index].productId
                                )
                            )?.quantityPhysique -
                            products.find(
                              (product) =>
                                product.productId ===
                                parseInt(
                                  orderRecipient.products[index].productId
                                )
                            )?.seuilMin,
                        },
                      }}
                      disabled={
                        products.find(
                          (prod) =>
                            prod.productId ===
                            parseInt(orderRecipient.products[index].productId)
                        )?.seuilMin >=
                        products.find(
                          (prod) =>
                            prod.productId ===
                            parseInt(orderRecipient.products[index].productId)
                        )?.quantityPhysique
                      }
                      helperText={
                        products.find(
                          (prod) =>
                            prod.productId ===
                            parseInt(orderRecipient.products[index].productId)
                        )?.seuilMin >=
                        products.find(
                          (prod) =>
                            prod.productId ===
                            parseInt(orderRecipient.products[index].productId)
                        )?.quantityPhysique
                          ? "Product unavailable"
                          : "Enter Quantity"
                      }
                      value={orderRecipient.quantities[index]}
                      onChange={(event) => handleQuantityChange(index, event)}
                    />
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="basis-1/6 bg-red-500 mb-6 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                onClick={handleAddRow}
                variant="contained"
                color="primary"
                size="small"
                className="mt-10"
              >
                Add Ligne
              </Button>
              <Button
                className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              <Button
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
                onClick={goBack}
              >
                Go Back
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddBCI;
