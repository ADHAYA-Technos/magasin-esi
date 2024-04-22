import React, { useState } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", chapter: "21-13", article: "21-13.8" },
    { id: 2, name: "Product 2", chapter: "21-14", article: "21-14.2" },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    chapter: "",
    article: "",
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const handleSaveEdit = () => {
    setProducts(
      products.map((product) =>
        product.id === editingProduct.id
          ? { ...product, ...editingProduct }
          : product
      )
    );
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.chapter) {
      setProducts([...products, { id: Date.now(), ...newProduct }]);
      setNewProduct({ name: "", chapter: "", article: "" });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-6 text-red-500">Product Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Chapter</th>
            <th className="border px-4 py-2">Articles</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">
                {editingProduct && editingProduct.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingProduct && editingProduct.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.chapter}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        chapter: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1"
                  />
                ) : (
                  product.chapter
                )}
              </td>
              <td className="border px-4 py-2">
                {editingProduct && editingProduct.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.article}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        article: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1"
                  />
                ) : (
                  product.article
                )}
              </td>
              <td className="border px-4 py-2">
                {editingProduct && editingProduct.id === product.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl mt-8 mb-4">Add Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        className="w-full px-2 py-1 mb-2"
      />
      <select
        value={newProduct.chapter}
        onChange={(e) =>
          setNewProduct({ ...newProduct, chapter: e.target.value })
        }
        className="w-full px-2 py-1 mb-2"
      >
        <option value="">Select Chapter</option>
        <option value="21-13">21-13</option>
        <option value="21-14">21-14</option>
        <option value="21-16">21-16</option>
      </select>

      <select
        value={newProduct.article}
        onChange={(e) =>
          setNewProduct({ ...newProduct, article: e.target.value })
        }
        className="w-full px-2 py-1 mb-2"
      >
        <option value="">Select Article</option>
        <option value="21-13.8">21-13.8</option>
        <option value="21-14.2">21-14.2</option>
        <option value="21-16.1">21-16.1</option>
      </select>
      <button
        onClick={handleAddProduct}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add
      </button>
    </div>
  );
};

export default ProductManagement