import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles, Theme } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    blueButton: {
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#135ba1',
        },
    },
}));

type Product = {
    productId: number;
    designation: string;
    quantity_l: number;
    quantity_p: number;
    isConsommable: boolean;
};

const CreateRapportCell = (params) => {
    const classes = useStyles(); // Using useStyles here

    const handleCreateRapport = () => {
        // Logic for creating rapport d'inventaire goes here
        console.log("Creating rapport d'inventaire for product:", params.row.productId);
    };

    return (
        <button className={classes.blueButton} onClick={handleCreateRapport}>
            Create Rapport
        </button>
    );
};

const columns = [
    { field: 'productId', headerName: 'Product ID', flex: 1 },
    { field: 'designation', headerName: 'Designation', flex: 1 },
    { field: 'quantityLogique', headerName: 'Quantity Physique', flex: 1 },
    { field: 'quantityPhysique', headerName: 'Quantity Logique', flex: 1 },
    { field: 'isConsommable', headerName: 'Consommable / nonConsommable ', flex: 1 },
    { field: 'createRapport', headerName: 'Create Rapport', flex: 1, renderCell: CreateRapportCell },
];

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
                }));
                setProducts(productsWithIds);
            })
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

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
