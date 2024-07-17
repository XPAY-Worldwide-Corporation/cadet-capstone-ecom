"use client";
import ProductCard from "@/components/cards/ProductCard";
import StoreCard from "@/components/cards/StoreCard";
import CategoryBar from "@/components/CategoryBar";
import { fetch_products } from "@/redux/reducers/products_slice";
import { fetch_stores } from "@/redux/reducers/store_slice";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading_products } = useSelector(
    (state: RootState) => state.product
  );
  const { stores, loading_stores } = useSelector(
    (state: RootState) => state.store
  );

  useEffect(() => {
    const fetchDatas = () => {
      dispatch(fetch_products());
      dispatch(fetch_stores());
    };
    fetchDatas();
  }, []);

  const SampleProducts = () => {
    return (
      <>
        {loading_products ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <li>
              <ProductCard product={null} />
            </li>
            <li>
              <ProductCard product={null} />
            </li>
            <li>
              <ProductCard product={null} />
            </li>
            <li>
              <ProductCard product={null} />
            </li>
            <li>
              <ProductCard product={null} />
            </li>
            <li>
              <ProductCard product={null} />
            </li>
          </ul>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {products.slice(0, 6).map((product) => {
              return (
                <li key={String(product.id)}>
                  <ProductCard product={product} />
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  };

  const SampleStores = () => {
    return (
      <>
        {loading_stores ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <li>
              <StoreCard store={null} />
            </li>
          </ul>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {stores.slice(0, 6).map((store) => {
              return (
                <li key={String(store.id)}>
                  <StoreCard store={store} />
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  };

  return (
    <section className="w-full">
      <div className="w-full h-[250px] md:h-[500px] relative">
        <Image src={"/images/home.jpg"} alt="" fill />
      </div>
      <div className="w-full overflow-hidden py-[2rem]">
        <CategoryBar />
      </div>
      <div className="w-full py-[1rem]">
        <h1>Products</h1>
        <SampleProducts />
        <div className="w-full flex justify-center items-center py-[1rem]">
          <button className="underline">browse all products</button>
        </div>
      </div>
      <div className="w-full py-[1rem]">
        <h1>Stores</h1>
        <SampleStores />
        <div className="w-full flex justify-center items-center py-[1rem]">
          <button className="underline">browse all stores</button>
        </div>
      </div>
    </section>
  );
}
