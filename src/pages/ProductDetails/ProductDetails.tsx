import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProductByIdQuery } from '../../store/api/apiSlice';
import './ProductDetails.scss';
import { Loader } from '../../components/ui/Loader/Loader';
import { Button } from '../../components/ui/Button/Button';
import Modal from '../../components/ui/Modal/Modal';
import { ProductForm } from '../../components/ProductForm/ProductForm';
import { STORAGE_URL } from '../../utils';
import ImagePlaceholder from '../../assets/imagePlaceholder.jpg';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductByIdQuery(id!);
  const userId = localStorage.getItem('userId');
  const isAuthenticated = !!localStorage.getItem('token');
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <Loader />;
  if (!product)
    return <div className="product-details container">Product not found</div>;

  const isOwn = isAuthenticated && product.user.id === userId;
  const productImg = product.picture
    ? `${STORAGE_URL}${product.picture}`
    : ImagePlaceholder;

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div className="product-details container">
      <div className="product-details-head">
        {isOwn && (
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Edit Product
          </Button>
        )}
      </div>

      <div className="product-details-body">
        <div className="product-details-image">
          <img
            src={productImg}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = productImg;
            }}
          />
        </div>
        <div className="product-details-info">
          <h1 className="product-details-title">{product.name}</h1>
          <div className="product-details-pricing">
            <span className="product-details-price">
              ${' '}
              {product.discountedPrice
                ? product.discountedPrice.toFixed(2)
                : product.price.toFixed(2)}
            </span>
            {product.discountedPrice && (
              <span className="product-details-discounted">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <p className="product-details-description">
            {product.description || 'No description available.'}
          </p>
          <p className="product-details-owner">
            Sold by: {product.user.firstName} {product.user.lastName}
          </p>
        </div>
      </div>

      {showForm && isOwn && (
        <Modal
          title="Edit Product"
          closeClick={handleFormClose}
          closeOutside={true}
          className="product-form-modal"
        >
          <ProductForm
            product={product}
            onClose={handleFormClose}
            onSuccess={() =>
              toast.success('Product was updated successfully !')
            }
          />
        </Modal>
      )}
    </div>
  );
};
