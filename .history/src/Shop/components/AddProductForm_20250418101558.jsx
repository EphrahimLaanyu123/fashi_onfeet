import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './AddForm.css';

const AddForm = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shoeTypeId, setShoeTypeId] = useState('');
  const [sizes, setSizes] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [shoeTypes, setShoeTypes] = useState([]);

  useEffect(() => {
    const fetchMeta = async () => {
      const { data: catData } = await supabase.from('categories').select();
      const { data: typeData } = await supabase.from('shoe_types').select();
      setCategories(catData || []);
      setShoeTypes(typeData || []);
    };
    fetchMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description: desc,
          price,
          category_id: categoryId,
          shoe_type_id: shoeTypeId,
          sizes,
          stock,
        },
      ])
      .select()
      .single();

    if (error) return alert('Error adding product: ' + error.message);

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${product.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products-image')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) return alert('Upload error: ' + uploadError.message);

      const { error: imgInsertError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_path: filePath,
          is_main: true,
        });

      if (imgInsertError) return alert('Image DB error: ' + imgInsertError.message);
    }

    alert('Product added successfully!');
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h2>Add New Product</h2>

      <input type="text" placeholder="Product Name" onChange={(e) => setName(e.target.value)} required />
      <textarea placeholder="Description" onChange={(e) => setDesc(e.target.value)} />
      <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required />

      <select onChange={(e) => setCategoryId(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select onChange={(e) => setShoeTypeId(e.target.value)} required>
        <option value="">Select Shoe Type</option>
        {shoeTypes.map((type) => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>

      <input type="text" placeholder="Sizes (e.g. 6,7,8)" onChange={(e) => setSizes(e.target.value)} />
      <input type="number" placeholder="Stock" onChange={(e) => setStock(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddForm;
