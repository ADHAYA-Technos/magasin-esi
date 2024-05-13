import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

type Product = {
    productId: number;
    designation: string;
    quantity_l: number;
    quantity_p: number;
    isConsommable: boolean;
    quantityPhysique: number; // Added quantityPhysique property
};

const ProductTable = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`/api/products`)
            .then((response) => response.json())
            .then((data) => {
                // Map through the data array and add id as productId to each product
                const productsWithIds = data.map((product: { productId: any }) => ({
                    ...product,
                    id: product.productId, // Assuming productId starts from 1
                    quantityPhysique: 0, // Initialize quantityPhysique property
                }));
                setProducts(productsWithIds);
            })
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
        const { value } = event.target;
        const parsedValue = parseInt(value, 10) || 0; // Convert value to integer or 0 if not a valid number
        // Update the product's physique quantity in the state
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[rowIndex].quantityPhysique = parsedValue;
            return updatedProducts;
        });
    };

    const columns = [
        { field: 'productId', headerName: 'Product ID', flex: 1 },
        { field: 'designation', headerName: 'Designation', flex: 1 },
        { field: 'quantityPhysique', headerName: 'Physique Quantity', flex: 1, 
          renderCell: () => (
            <input
                type="number"
                value={''}
                disabled={true}
                
                style={{ width: '100%' }}
            />
          )
        },
        { field: 'quantityLogique', headerName: 'Logical Quantity', flex: 1 },
        { field: 'isConsommable', headerName: 'Consommable / nonConsommable ', flex: 1 },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={products}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection={false}
                disableSelectionOnClick
            />
        </div>
    );
};

export default ProductTable;
