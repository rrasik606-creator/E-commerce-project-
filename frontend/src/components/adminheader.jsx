import React from 'react'

const AdminHeader = () => {
  return (
    <div>

        <header  className='h-16 border-b bg-white flex items-center justify-between px-6'>

            <h2 className='text-xl font-semibold'>
                Admin Dashboard
            </h2>

            <div>
                <span className='text-gray-600'>
                    Admin
                </span>
            </div>

        </header>
      
    </div>
  )
}

export default AdminHeader
