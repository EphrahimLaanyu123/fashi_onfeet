import React, { useState, useEffect } from 'react';

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

  // Replace with your actual Supabase client setup
  // import { supabase } from './supabaseClient';

  useEffect(() => {
    // Fetch categories from Supabase
    const fetchCategories = async () => {
      // if (supabase) {
      //   const { data, error } = await supabase
      //     .from('categories')
      //     .select('id, name');
      //   if (data) {
      //     setCategories(data);
      //   }
      //   if (error) {
      //     console.error('Error fetching categories:', error);
      //   }
      // }
      // Mock data for demonstration
      setCategories([
        { id: 1, name: 'Men' },
        { id: 2, name: 'Women' },
        { id: 3, name: 'Children' },
      ]);
    };

    // Fetch shoe types from Supabase
    const fetchShoeTypes = async () => {
      // if (supabase) {
      //   const { data, error } = await supabase
      //     .from('shoe_types')
      //     .select('id, name');
      //   if (data) {
      //     setShoeTypes(data);
      //   }
      //   if (error) {
      //     console.error('Error fetching shoe types:', error);
      //   }
      // }
      // Mock data for demonstration
      setShoeTypes([
        { id: 1, name: 'Sneakers' },
        { id: 2, name: 'Boots' },
        { id: 3, name: 'Sandals' },
      ]);
    };

    fetchCategories();
    fetchShoeTypes();
  }, []);

  const handleImageChange = (event) => {
    setImages([...images, ...Array.from(event.target.files)]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!name || !price || !categoryId || !stock || images.length === 0) {
      alert('Please fill in all required fields and select at least one image.');
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(categoryId),
      shoe_type_id: shoeTypeId ? parseInt(shoeTypeId) : null,
      sizes,
      stock: parseInt(stock),
    };

    console.log('Product Data:', productData);
    console.log('Selected Images:', images);

    // --- Here you would typically: ---
    // 1. Use your Supabase client to insert the product data into the 'products' table.
    // 2. Loop through the 'images' array:
    //    a. Upload each image to your Supabase Storage bucket.
    //    b. Get the path of the uploaded image.
    //    c. Insert a new record into the 'product_images' table with the 'product_id' and the 'image_path'.
    // 3. Handle success and error states, and potentially reset the form.

    // For now, we'll just log the data.
    alert('Product data and images submitted (check console).');
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setShoeTypeId('');
    setSizes('');
    setStock('');
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

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

      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProductForm;