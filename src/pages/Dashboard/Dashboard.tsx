import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetProductsQuery,
  useGetMyProductsQuery,
} from '../../store/api/apiSlice';
import './Dashboard.scss';
import { ProductForm } from '../../components/ProductForm/ProductForm';
import { Button } from '../../components/ui/Button/Button';
import { Loader } from '../../components/ui/Loader/Loader';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import Modal from '../../components/ui/Modal/Modal';

export const Dashboard: React.FC = () => {
  const [showOwn, setShowOwn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data: allProducts, isLoading: isLoadingAll } = useGetProductsQuery();
  const { data: myProducts, isLoading: isLoadingMy } = useGetMyProductsQuery(
    undefined,
    { skip: !localStorage.getItem('token') }
  );
  const isAuthenticated = !!localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const products = showOwn ? myProducts : allProducts;

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div className="dashboard container">
      <div className="dashboard-head">
        <h1>Dashboard</h1>
        {isAuthenticated && (
          <div className="dashboard-controls">
            <Button onClick={() => setShowOwn(!showOwn)}>
              {showOwn ? 'Show All Products' : 'Show My Products'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Product'}
            </Button>
          </div>
        )}
      </div>

      {isLoadingAll || (showOwn && isLoadingMy) ? (
        <Loader />
      ) : (
        <div className="dashboard-products">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isOwn={isAuthenticated && product.user.id === userId}
            />
          ))}
        </div>
      )}

      {showForm && isAuthenticated && (
        <Modal
          title="Add Product"
          closeClick={handleFormClose}
          closeOutside={true}
          className="product-form-modal"
        >
          <ProductForm onClose={handleFormClose} onSuccess={()=> toast.success('Product was added successfully !')} />
        </Modal>
      )}
    </div>
  );
};
