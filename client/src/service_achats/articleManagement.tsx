import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type Chapitre = {
  chapitreId: number;
  numChapitre: string;
  libelle: string;
};

type Article = {
  articleId: number;
  designation: string;
};

type Props = {};

const ArticleManagement: React.FC<Props> = () => {
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [selectedChapitre, setSelectedChapitre] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Fetch chapitres from the server
    fetch('/api/chapitres')
      .then(response => response.json())
      .then(data => setChapitres(data))
      .catch(error => console.error('Error fetching chapitres:', error));
  }, []);

  useEffect(() => {
    // Fetch articles for the selected chapitre
    if (selectedChapitre !== null) {
      fetch(`/api/articles/${selectedChapitre}`)
        .then(response => response.json())
        .then(data => setArticles(data.map((article: Article, index: number) => ({ ...article, id: article.articleId }))))
        .catch(error => console.error('Error fetching articles:', error));
    }
  }, [selectedChapitre]);

  const columns: GridColDef[] = [
    { field: 'articleId', headerName: 'ID', width: 70 },
    { field: 'designation', headerName: 'Designation', width: 200 }
  ];

  const handleChapitreSelection = (chapitreId: number) => {
    setSelectedChapitre(chapitreId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Article Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapitres.map(chapitre => (
          <div key={chapitre.chapitreId} className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{chapitre.numChapitre}</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleChapitreSelection(chapitre.chapitreId)}
            >
              View Articles
            </button>
          </div>
        ))}
      </div>
      {selectedChapitre !== null && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Articles</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={articles} columns={columns}  getRowId={(row) => row.articleId}  checkboxSelection />
            </div>
          </div>
        </div>
      )}
      <Box sx={{ '& > :not(style)': { m: 1 } }} className="mt-8">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          <AddIcon className="mr-2" />
          Add Article
        </button>
      </Box>
    </div>
  );
};

export default ArticleManagement;
