"use client";

import { useProducts } from "@/hooks/useSupabase";

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {products.map((product) => (
        <div key={product.id} className='border p-4'>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div className='flex gap-2'>
            <span className='line-through'>{product.old_price}</span>
            <span className='font-bold'>{product.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
