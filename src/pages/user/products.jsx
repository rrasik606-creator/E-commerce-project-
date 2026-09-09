import React from 'react';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import Productgrid from '../../components/productgrid';

const API_URL="http://localhost:3001/products";

const Products = () => {

    const getProduct=async()=>{
        const response=await axios.get(API_URL);
        return response.data
    };

    const {data:products=[],isLoading,isError}=useQuery({
        queryKey:["products"],
        queryFn:getProduct
    });

    if(isLoading){
        return(
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500 text-lg'>
                    Loading products...
                </p>
            </div>
        )
    }

    if(isError){
        return(
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-red-500 text-lg'>
                    Failed to load products
                </p>
            </div>
        )
    }
  return (
    <div className='min-h-screen bg-white'>
      
      {/* page header */}
      <div className='px-6 md:px-10 lg:px-16 pt-10'>
        <h1 className='text-4xl md:text-5xl font-semibold text-gray-900'>
            Watches
        </h1>
        <p className='text-gray-500 mt-3 max-w-xl'>
            Discover timeless watches designed for every style and occasion.
        </p>
      </div>

      {/* send product to productgrid */}
      <Productgrid products={products}/>
    </div>
  )
}

export default Products
