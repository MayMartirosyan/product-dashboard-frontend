import React, { useState, useEffect, useCallback } from 'react';
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
import InfiniteScroll from 'react-infinite-scroll-component';
import { Product } from '../../types';
import { useLocation } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [showOwn, setShowOwn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [allPage, setAllPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const [hasMoreAll, setHasMoreAll] = useState(true);
  const [hasMoreMy, setHasMoreMy] = useState(true);

  const isAuthenticated = !!localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const location = useLocation();

  const {
    data: allProductsData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    refetch: refetchAll,
  } = useGetProductsQuery(
    { page: allPage, limit: 24 },
  );
  const {
    data: myProductsData,
    isLoading: isLoadingMy,
    isFetching: isFetchingMy,
    refetch: refetchMy,
  } = useGetMyProductsQuery(
    { page: myPage, limit: 24 },
    { skip: !showOwn || !isAuthenticated || (!hasMoreMy && myPage !== 1) }
  );

  useEffect(() => {
    setAllProducts([]);
    setMyProducts([]);
    setAllPage(1);
    setMyPage(1);
    setHasMoreAll(true);
    setHasMoreMy(true);
    refetchAll();
  }, [location.key, refetchAll]);

  useEffect(() => {
    setAllProducts([]);
    setMyProducts([]);
    setAllPage(1);
    setMyPage(1);
    setHasMoreAll(true);
    setHasMoreMy(true);
    if (showOwn && isAuthenticated) {
      refetchMy();
    } else {
      refetchAll();
    }
  }, [showOwn, isAuthenticated, refetchAll, refetchMy]);

  useEffect(() => {
    if (allProductsData?.products) {
      setAllProducts((prev) =>
        allPage === 1
          ? allProductsData.products
          : [...prev, ...allProductsData.products]
      );
      setHasMoreAll(allProductsData.hasMore);
    } else if (
      allProductsData &&
      !allProductsData.products?.length &&
      !isFetchingAll
    ) {
      setHasMoreAll(false);
    }
  }, [allProductsData, allPage, isFetchingAll]);

  useEffect(() => {
    if (myProductsData?.products) {
      setMyProducts((prev) =>
        myPage === 1
          ? myProductsData.products
          : [...prev, ...myProductsData.products]
      );
      setHasMoreMy(myProductsData.hasMore);
    } else if (
      myProductsData &&
      !myProductsData.products?.length &&
      !isFetchingMy
    ) {
      setHasMoreMy(false);
    }
  }, [myProductsData, myPage, isFetchingMy]);

  const fetchMoreProducts = useCallback(() => {
    if (showOwn && hasMoreMy && !isFetchingMy) {
      setMyPage((prev) => prev + 1);
    } else if (!showOwn && hasMoreAll && !isFetchingAll) {
      setAllPage((prev) => prev + 1);
    }
  }, [
    showOwn,
    hasMoreAll,
    hasMoreMy,
    isFetchingAll,
    isFetchingMy,
    allPage,
    myPage,
  ]);

  const handleFormClose = () => {
    setShowForm(false);
  };

  const products = showOwn ? myProducts : allProducts;
  const isLoading = showOwn
    ? isLoadingMy || isFetchingMy
    : isLoadingAll || isFetchingAll;

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

      {isLoading && products.length === 0 ? (
        <Loader />
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreProducts}
          hasMore={showOwn ? hasMoreMy : hasMoreAll}
          loader={<Loader />}
          endMessage={<></>}
        >
          <div className="dashboard-products">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isOwn={isAuthenticated && product.user.id === userId}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {showForm && isAuthenticated && (
        <Modal
          title="Add Product"
          closeClick={handleFormClose}
          closeOutside={true}
          className="product-form-modal"
        >
          <ProductForm
            onClose={handleFormClose}
            onSuccess={() => {
              toast.success('Product was added successfully !');
              setAllProducts([]);
              setMyProducts([]);
              setAllPage(1);
              setMyPage(1);
              setHasMoreAll(true);
              setHasMoreMy(true);
              refetchAll();
              if (showOwn && isAuthenticated) {
                refetchMy();
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
};
