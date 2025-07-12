import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Card } from '../ui/Card/Card';
import './ProductCard.scss';
import ImagePlaceholder from '../../assets/imagePlaceholder.jpg';
import { STORAGE_URL } from '../../utils';

interface ProductCardProps {
  product: Product;
  isOwn: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isOwn }) => {
  const productImg = product.picture
    ? `${STORAGE_URL}${product.picture}`
    : ImagePlaceholder;

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <Card isOwn={isOwn}>
        <div className="product-card-image">
          <img
            src={productImg}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = ImagePlaceholder;
            }}
          />
        </div>

        <div className="product-card-content">
          <h3 className="product-card-title">{product.name}</h3>
          <div className="product-card-pricing">
            <span className="product-card-price">
              $
              {product.discountedPrice
                ? product.discountedPrice.toFixed(2)
                : product.price.toFixed(2)}
            </span>
            {product.discountedPrice && (
              <span className="product-card-discounted">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <p className="product-card-owner">
            by {product.user.firstName} {product.user.lastName}
          </p>
        </div>
      </Card>
    </Link>
  );
};
