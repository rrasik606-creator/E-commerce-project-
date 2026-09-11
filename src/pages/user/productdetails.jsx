import React, { useState } from 'react'
import { Heart,Minus,Plus,ShoppingCart,Truck } from 'lucide-react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const API_URL="http://localhost:3001/products";

const Productdetails = () => {

  const {id} =useParams();
  const[quantity,setQuantity]=useState(1);
  const[selectimage,setSelecetedImage]=useState(0)
  const[like,setLike]=useState(false);
  
  const getProduct=async()=>{
    const response=axios.get(`${API_URL}/${id}`);
    return (await response).data
  };

  const {data:product,isLoading,isError}=useQuery({
    queryKey:["product",id],
    queryFn:getProduct
  });

  if(isLoading){
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>
          Loading product...
        </p>
      </div>
    )
  }

  if(isError){
    return(
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-red-500 text-lg'>
           Failed to load product
        </p>
      </div>
    )
  }

  const images=product.image||[product.image];

  return (
    <div className='min-h-screen bg-gray-50 p-5'>
      
      <div className='max-w-6xl mx-auto bg-white p-6 rounded-2xl'>

        <div className='grid md:grid-cols-2 gap-10'>

          {/* leftside */}
          <div className='flex gap-4'>

            {/* side images */}
            <div className='flex flex-col gap-3'>
              <span className='text-sm tracking-widest font-bold'>Colour :</span>
              {
                images.map((img,index)=>(
                  <img src={img} key={index} alt={product.name} onClick={()=>setSelecetedImage(index)} className='w-20 h-20 object-contain bg-gray-100 rounded-lg cursor-pointer border' />
                ))
              }
            </div>

            {/* main image */}
            <div className='relative flex-1'>
              <img src={images[selectimage]} alt={product.name} className='w-full h-[550px] object-contain bg-gray-100 rounded-xl' />
              <button className='absolute top-4 right-4 bg-white p-3 rounded-full shadow-sm hover:bg-gray-100 transition' onClick={(e)=>{e.stopPropagation();e.preventDefault();setLike(!like)}}>
                <Heart size={22}  className={like?'fill-red-500 text-red-500':'text-grey-400'}/>
              </button>
            </div>

          </div>

          {/* rightside */}
          <div>
            <p className='text-sm tracking-widest font-bold'>
              {product.brand}
            </p>
            <h1 className='text-3xl font-bold mt-3'>
              {product.name}
            </h1>

            {/* rating */}
            {/* <div className='mt-4 text-yellow-500'>
              ★★★★★
              
              <span className='text-gray-500 ml-3'>
                {product.rating}({product.reviews} reviews)
              </span>
            </div> */}

            {/* price */}
            <div className='flex gap-4 items-center mt-5'>
              <p className='text-3xl font-bold'>
                ₹{product.price}
              </p>

              <p className='line-through text-gray-400'>
                ₹{product.originalPrice}
              </p>

              <p className='text-green-600'>
                {product.discount} %
              </p>
            </div>

            {/* stock */}
            <div className='flex gap-5 mt-5 pb-5 border-b'>
              <p className='text-green-600'>
                ●{product.stock>0?"In stock":"out of stock"}
              </p>

              <p className='flex gap-2 text-gray-600'>
                <Truck size={20}/>
                Free delivery
              </p>
            </div>

            {/* featurs */}
            <div className='mt-5'>
              <h2 className='font-bold text-lg'>
                Key Features
              </h2>

              <ul className='mt-3 space-y-2 text-gray-600'>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>

            {/* quantity */}
            <div className='mt-6'>
              <h3 className='font-bold mb-2'>
                Quantity
              </h3>

              <div className='flex items-center border rounded-full w-36'>
                <button onClick={()=>setQuantity(Math.max(1,quantity-1))} className='p-3'>
                  <Minus size={18}/>
                </button>

                <span className='flex-1 text-center'>
                  {quantity}
                </span>

                <button onClick={()=>setQuantity(quantity+1)} className='p-3'>
                  <Plus size={18}/>
                </button>
              </div>

            </div>

            {/* addtocart */}
            <button className='w-full mt-6 py-4 bg-gray-900 text-white rounded-lg flex justify-center gap-2'>
              <ShoppingCart size={20}/>
              Add to Cart
            </button>

            {/* buy */}
            <button className='w-full mt-3 py-4 border-2 border-gray-900 rounded-lg'>
              Buy Now
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Productdetails
