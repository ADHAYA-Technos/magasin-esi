import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Product = {
    productId: number;
    designation: string;
    quantityLogique: number;
    isConsommable: boolean;
    quantityPhysique: number;
    observation?: string;
};

const ProductTable = () => {
    const [chapitres, setChapitres] = useState([]);
    const [articles, setArticles] = useState([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedChapitre, setSelectedChapitre] = useState('');
    const [selectedArticle, setSelectedArticle] = useState('');
    const [editing, setEditing] = useState(false);

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
    }, []);

    const handleChapitreChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const chapitreId = event.target.value as string;
        setSelectedChapitre(chapitreId);
        setSelectedArticle('');
        setProducts([]);
        fetch(`/api/articles/${chapitreId}`)
            .then((response) => response.json())
            .then((data) => {
                setArticles(data);
            })
            .catch((error) => console.log(error));
    };

    const handleArticleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const articleId = event.target.value as string;
        setSelectedArticle(articleId);
        fetch(`/api/products/${articleId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const productsWithIds = data.map((product: any) => ({
                        ...product,
                        id: product.productId,
                        quantityPhysique: '',
                    }));
                    setProducts(productsWithIds);
                } else {
                    console.error('Invalid data format:', data);
                }
            })
            .catch((error) => console.error('Error fetching products:', error));
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex :number) => {
      const id = products.findIndex(p => p.productId === rowIndex);
        const { value } = event.target;
        const parsedValue = parseInt(value, 10);
        
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            if (updatedProducts[id]) {
                updatedProducts[id].quantityPhysique = parsedValue > 0 ? parsedValue : 0; // Ensure positive integer
            }
            return updatedProducts;
        });
    };

    const handleObservationChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
        const id = products.findIndex(p => p.productId === rowIndex);

        const { value } = event.target;
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            if (updatedProducts[id]) {
                updatedProducts[id].observation = value;
            }
            return updatedProducts;
        });
    };

    const handlePrint = () => {
        const selectedChapitreObj = chapitres.find(c => c.chapitreId === selectedChapitre);
        const selectedArticleObj = articles.find(a => a.articleId === selectedArticle);
        
        const chapitreLibelle = selectedChapitreObj ? selectedChapitreObj.libelle : 'N/A';
        const articleDesignation = selectedArticleObj ? selectedArticleObj.designation : 'N/A';

        const doc = new jsPDF();
        doc.setFont('times', 'bold');
        doc.text('Ministère de l\'Enseignement Supérieur et de la Recherche Scientifique', 20, 20);
        doc.text('Ecole Supérieure en Informatique 8 Mai 1945, Sidi Bel-Abbés', 20, 30);
        doc.text('1ère Année Second Cycle', 20, 40);
        doc.setFont('times', 'normal');
        doc.text(`Chapitre: ${chapitreLibelle}`, 20, 50);
        doc.text(`Article: ${articleDesignation}`, 20, 60);
        doc.autoTable({
            startY: 70,
            head: [['Product', 'Logical Quantity', 'Physical Quantity']],
            body: products.map(product => [
                product.designation,
                product.quantityLogique,
                ''
            ])
        });
        
        doc.save('inventory_check.pdf');
    };

    const handleCreate = () => {
        setEditing(true);
    };

    const handleSubmit = () => {
        // Validate that all products have quantityPhysique
        const invalidProducts = products.filter(product => product.quantityPhysique == null || product.quantityPhysique === '');
    
        if (invalidProducts.length > 0) {
            alert('Please ensure all products have a physical quantity.');
            return; // Stop the function execution
        }
    
        const selectedChapitreObj = chapitres.find(c => c.chapitreId === selectedChapitre);
        const selectedArticleObj = articles.find(a => a.articleId === selectedArticle);
    
        const chapitreLibelle = selectedChapitreObj ? selectedChapitreObj.libelle : 'N/A';
        const articleDesignation = selectedArticleObj ? selectedArticleObj.designation : 'N/A';
    
        const doc = new jsPDF();
        doc.setFont('times', 'bold');
        doc.text('Ministère de l\'Enseignement Supérieur et de la Recherche Scientifique', 20, 20);
        doc.text('Ecole Supérieure en Informatique 8 Mai 1945, Sidi Bel-Abbés', 20, 30);
        doc.text('1ère Année Second Cycle', 20, 40);
        doc.setFont('times', 'normal');
        doc.text(`Chapitre: ${chapitreLibelle}`, 20, 50);
        doc.text(`Article: ${articleDesignation}`, 20, 60);
        doc.autoTable({
            startY: 70,
            head: [['Product', 'Logical Quantity', 'Physical Quantity', 'Observation']],
            body: products.map(product => [
                product.designation,
                product.quantityLogique,
                product.quantityPhysique,
                product.quantityPhysique !== product.quantityLogique ? product.observation || '' : ''
            ])
        });
        doc.text('Signature de Magasinier', 20, 270);
        doc.text('Signature de Directeur', 140, 270);
        doc.save('rapport_inventaire.pdf');
    
        fetch('/api/updateInventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(products),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Inventory updated:', data);
            setEditing(false);
        })
        .catch(error => {
            console.error('Error updating inventory:', error);
        });
    };
    
    const columns = [
        { field: 'productId', headerName: 'Product ID', flex: 1 },
        { field: 'designation', headerName: 'Designation', flex: 1 },
        {
            field: 'quantityPhysique',
            headerName: 'Physical Quantity',
            flex: 1,
            renderCell: (params) => {
                return (
                    <input
                        type="number"
                        value={params.row.quantityPhysique}
                        onChange={(event) => handleQuantityChange(event, params.id)}
                        style={{ width: '100%' }}
                        disabled={!editing}
                    />
                );
            },
        },
        { field: 'quantityLogique', headerName: 'Logical Quantity', flex: 1 },
        {
            field: 'observation',
            headerName: 'Observation',
            flex: 1,
            renderCell: (params) => {
                return (
                    <input
                        type="text"
                        value={params.row.observation || ''}
                        onChange={(event) => handleObservationChange(event, params.id)}
                        style={{ width: '100%' }}
                        disabled={!editing}
                    />
                );
            },
        },
    ];
    
  
    
    
    return (
        <Container>
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Chapitre</InputLabel>
                    <Select
                        value={selectedChapitre}
                        onChange={handleChapitreChange}
                    >
                        {chapitres.map((chapitre) => (
                            <MenuItem key={chapitre.chapitreId} value={chapitre.chapitreId}>
                                {chapitre.libelle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Article</InputLabel>
                    <Select
                        value={selectedArticle}
                        onChange={handleArticleChange}
                        disabled={!selectedChapitre}
                    >
                        {articles.map((article) => (
                            <MenuItem key={article.articleId} value={article.articleId}>
                                {article.designation}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {!selectedArticle && <p>Please select an article to view products</p>}
            {!selectedArticle && ! selectedChapitre && <p>Please select a chapitre and an article to view products</p>}
            {selectedArticle && selectedChapitre && <>
            
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
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mr: 2 }}>
                    Print
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCreate} disabled={editing}>
                    Create
                </Button>
                {editing && (
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
                        OK
                    </Button>
                )}
            </Box>
            </>}
          
        </Container>
    );
};

export default ProductTable;
