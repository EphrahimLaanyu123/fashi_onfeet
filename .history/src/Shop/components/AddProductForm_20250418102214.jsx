import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './AddForm.css';

const AddForm = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [shoeType, setShoeType] = useState('');
  const [sizes, setSizes] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get or insert category
    let { data: catData, error: catErr } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .single();

    if (!catData && !catErr) {
      const { data: newCat, error: newCatErr } = await supabase
        .from('categories')
        .insert({ name: category })
        .select()
        .single();
      catData = newCat;
    }

    // Get or insert shoe type
    let { data: typeData, error: typeErr } = await supabase
      .from('shoe_types')
      .select('id')
      .eq('name', shoeType)
      .single();

    if (!typeData && !typeErr) {
      const { data: newType, error: newTypeErr } = await supabase
        .from('shoe_types')
        .insert({ name: shoeType })
        .select()
        .single();
      typeData = newType;
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description: desc,
          price,
          category_id: catData?.id,
          shoe_type_id: typeData?.id,
          sizes,
          stock,
        },
      ])
      .select()
      .single();

    if (error) return alert('Error adding product: ' + error.message);

    // Upload image
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${product.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
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

      <input type="text" placeholder="Category (e.g. Men, Women)" onChange={(e) => setCategory(e.target.value)} required />
      <input type="text" placeholder="Shoe Type (e.g. Sneakers, Boots)" onChange={(e) => setShoeType(e.target.value)} required />

      <input type="text" placeholder="Sizes (e.g. 6,7,8)" onChange={(e) => setSizes(e.target.value)} />
      <input type="number" placeholder="Stock" onChange={(e) => setStock(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddForm;
