import React from 'react'
import Productcrd from './productcrd'

const Productgrid = ({products}) => {
  return (
    <div>
      <section className='px-6 md:px-10 lg:px-16 py-10'>

        {/* heading */}
        <div className='mb-8'>
            <p className='text-sm tracking-[0.3em] text-gray-500'>
                VELLORA COLLECTION
            </p>
            <h2 className='text-3xl md:text-4xl font-semibold mt-2'>
                Explore Our Watches
            </h2>
        </div>

        {/* product grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {
                products.map((product)=>(<Productcrd key={product.id} product={product}/>))
            }
        </div>

      </section>
    </div>
  )
}

export default Productgrid
