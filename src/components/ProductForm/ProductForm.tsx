import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from '../../store/api/apiSlice';
import { Button } from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import { Loader } from '../ui/Loader/Loader';
import './ProductForm.scss';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    discountedPrice: product?.discountedPrice?.toString() || '',
    description: product?.description || '',
  });
  const [picture, setPicture] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price.toString(),
        discountedPrice: product.discountedPrice?.toString() || '',
        description: product.description || '',
      });
      setPicture(null);
    }
  }, [product]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicture(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      if (form.discountedPrice)
        formData.append('discountedPrice', form.discountedPrice);
      if (form.description) formData.append('description', form.description);
      if (picture) formData.append('picture', picture);

      if (product) {
        const res = await updateProduct({ id: product.id, formData }).unwrap();
        if (res.id) {
          onSuccess?.();
          onClose?.();
        }
      } else {
        const res = await addProduct(formData).unwrap();
        if (res.id) {
          onSuccess?.();
          onClose?.();
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <Input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        error={errors.price}
      />
      <Input
        name="discountedPrice"
        type="number"
        placeholder="Discounted Price (optional)"
        value={form.discountedPrice}
        onChange={handleChange}
      />
      <Input
        name="picture"
        type="file"
        placeholder="Picture"
        onChange={handleFileChange}
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        className="product-form-textarea"
      />
      <div className="product-form-actions">
        <Button type="submit" disabled={isAdding || isUpdating}>
          {isAdding || isUpdating ? (
            <Loader />
          ) : product ? (
            'Update Product'
          ) : (
            'Add Product'
          )}
        </Button>
        {onClose && (
          <Button
            variant="error"
            onClick={onClose}
            disabled={isAdding || isUpdating}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
