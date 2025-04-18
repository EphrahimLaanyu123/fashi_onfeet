import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shoeTypeId, setShoeTypeId] = useState('');
  const [sizes, setSizes] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]); // To store selected image files
  const [categories, setCategories] = useState([]); // To fetch from your categories table
  const [shoeTypes, setShoeTypes] = useState([]); // To fetch from your shoe_types table
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    };

    const fetchShoeTypes = async () => {
      const { data, error } = await supabase
        .from('shoe_types')
        .select('id, name');
      if (error) {
        console.error('Error fetching shoe types:', error);
      } else {
        setShoeTypes(data);
      }
    };

    fetchCategories();
    fetchShoeTypes();
  }, []);

  const handleImageChange = (event) => {
    setImages([...images, ...Array.from(event.target.files)]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    setUploadError(null);
    setSubmissionError(null);
    setSubmissionSuccess(false);

    if (!name || !price || !categoryId || !stock || images.length === 0) {
      alert('Please fill in all required fields and select at least one image.');
      setUploading(false);
      return;
    }

    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            name,
            description,
            price: parseFloat(price),
            category_id: parseInt(categoryId),
            shoe_type_id: shoeTypeId ? parseInt(shoeTypeId) : null,
            sizes,
            stock: parseInt(stock),
          },
        ])
        .select('id')
        .single();

      if (productError) {
        console.error('Error inserting product:', productError);
        setSubmissionError('Failed to add product.');
        setUploading(false);
        return;
      }

      if (productData?.id) {
        const productId = productData.id;
        const imagePaths = [];

        for (const image of images) {
          const imageName = `${productId}-${Date.now()}-${image.name}`;
          const { error: uploadImageError } = await supabase.storage
            .from('product-images') // Ensure your bucket name is correct
            .upload(imageName, image);

          if (uploadImageError) {
            console.error('Error uploading image:', uploadImageError);
            setUploadError('Failed to upload one or more images.');
            setUploading(false);
            // Optionally, you might want to delete the partially created product
            // await supabase.from('products').delete().eq('id', productId);
            return;
          }

          imagePaths.push(imageName); // Store just the file name as the path within the bucket
        }

        // Insert image paths into the product_images table
        const imagesToInsert = imagePaths.map((path, index) => ({
          product_id: productId,
          image_path: path,
          is_main: index === 0, // Set the first image as the main one (you can adjust this logic)
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imagesToInsert);

        if (imagesError) {
          console.error('Error inserting image paths:', imagesError);
          setSubmissionError('Failed to save image information.');
          setUploading(false);
          // Optionally, you might want to delete the created product and uploaded images
          // await supabase.from('products').delete().eq('id', productId);
          // for (const path of imagePaths) {
          //   await supabase.storage.from('product-images').remove([path]);
          // }
          return;
        }

        setSubmissionSuccess(true);
        setName('');
        setDescription('');
        setPrice('');
        setCategoryId('');
        setShoeTypeId('');
        setSizes('');
        setStock('');
        setImages([]);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setSubmissionError('An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

      {submissionSuccess && (
        <p style={{ color: 'green' }}>Product added successfully!</p>
      )}

      {submissionError && (
        <p style={{ color: 'red' }}>Error: {submissionError}</p>
      )}

      {uploadError && (
        <p style={{ color: 'orange' }}>Warning: {uploadError}</p>
      )}

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="category_id">Category:</label>
        <select
          id="category_id"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="shoe_type_id">Shoe Type (if applicable):</label>
        <select
          id="shoe_type_id"
          value={shoeTypeId}
          onChange={(e) => setShoeTypeId(e.target.value)}
        >
          <option value="">Select Shoe Type</option>
          {shoeTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sizes">Sizes (comma-separated, e.g., 6,7,8):</label>
        <input
          type="text"
          id="sizes"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="stock">Stock Quantity:</label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="images">Product Images:</label>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageChange}
          required
        />
        {images.length > 0 && (
          <div>
            <p>Selected Images:</p>
            <ul>
              {images.map((image, index) => (
                <li key={index}>{image.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
}

export default AddProductForm;