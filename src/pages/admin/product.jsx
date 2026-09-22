import React,{useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AdminSidbar from '../../components/adminsidebar'
import AdminHeader from '../../components/adminheader'
import { setProducts,softDeleteProduct as softDeleteProductRedux,restoreProduct as restoreProductRedux,permanentDeleteProduct as permanentDeleteProductRedux } from '../../redux/slices/adminproductslice'
import { getProduct,softDeleteProduct,restoreProduct,permanentDeleteProduct } from '../../services/adminproductservices'

const AdminProducts = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const products=useSelector((state)=>state.adminProduct.products);

    const fetchProduct=async()=>{
        try{
            const data=await getProduct();
            dispatch(setProducts(data))
        }
        catch(error){
            console.log(error);
        }
    };

    useEffect(()=>{
        fetchProduct();
    },[]);

    const handleDelete=async(id)=>{

        const confirmdelete=window.confirm("Are you sure you want to delete?");

        if(!confirmdelete){
            return
        }

        try{
            await softDeleteProduct(id);
            dispatch(softDeleteProductRedux(id));
        }
        catch(error){
            console.log(error);
        }
    };

    const handleRestore=async(id)=>{
        try{
            await restoreProduct(id);
            dispatch(restoreProductRedux(id));
        }
        catch(error){
            console.log(error);
        }
    };

    const handlePermanentDelete=async(id)=>{

        const confirmpermanentdelete=window.confirm("Are you sure you want to permanently delete this product?")

        if(!confirmpermanentdelete){
            return
        }

        try{
            await permanentDeleteProduct(id);
            dispatch(permanentDeleteProductRedux(id));
        }
        catch(error){
            console.log(error);
        }
    };
    

  return (
    <div className='flex min-h-screen bg-gray-100'>

        <AdminSidbar/>

        <div className='flex-1 ml-64'>

            <AdminHeader/>

            <main className='p-6'>

                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>
                        Products
                    </h1>

                    <button onClick={()=>navigate("/admin/product/add")} className='bg-black text-white px-4 py-2 rounded-lg'>
                        Add Product
                    </button>
                </div>

                <div className='bg-white rounded-lg shadow overflow-x-auto'>

                    <table className='w-full'>

                        <thead>
                            <tr className='border-b text-left'>
                                <th className='p-4'>Image</th>
                                <th className='p-4'>Name</th>
                                <th className='p-4'>Brand</th>
                                <th className='p-4'>Category</th>
                                <th className='p-4'>Price</th>
                                <th className='p-4'>Stock</th>
                                <th className='p-4'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                products.filter((product)=>!product.deleted).map((product)=>(
                                    <tr key={product.id} className='border-b'>

                                        <td className='p-4'>
                                            <img
                                                src={product.image[0]}
                                                alt={product.name}
                                                className='w-16 h-16 object-contain'
                                            />
                                        </td>

                                        <td className='p-4'>
                                            {product.name}
                                        </td>

                                        <td className='p-4'>
                                            {product.brand}
                                        </td>

                                        <td className='p-4'>
                                            {product.category}
                                        </td>

                                        <td className='p-4'>
                                            {product.price}
                                        </td>

                                        <td className='p-4'>
                                            {product.stock}
                                        </td>

                                        <td className='p-4'>
                                            <button onClick={()=>navigate(`/admin/product/edit/${product.id}`)} className='text-blue-600 mr-3'>
                                                Edit
                                            </button>

                                            <button
                                                onClick={()=>handleDelete(product.id)}
                                                title='Delete'
                                                className='text-red-600'
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>

                <div className='bg-white rounded-lg shadow overflow-x-auto mt-8'>

                    <h2 className='text-xl font-bold p-4 border-b'>
                        Deleted Products
                    </h2>

                    <table className='w-full'>

                        <thead>
                            <tr className='border-b text-left'>
                                <th className='p-4'>Image</th>
                                <th className='p-4'>Name</th>
                                <th className='p-4'>Brand</th>
                                <th className='p-4'>Category</th>
                                <th className='p-4'>Price</th>
                                <th className='p-4'>Stock</th>
                                <th className='p-4'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                products.filter((product)=>product.deleted).map((product)=>(
                                    <tr key={product.id} className='border-b'>

                                        <td className='p-4'>
                                            <img
                                                src={product.image[0]}
                                                alt={product.name}
                                                className='w-16 h-16 object-contain'
                                            />
                                        </td>

                                        <td className='p-4'>
                                            {product.name}
                                        </td>

                                        <td className='p-4'>
                                            {product.brand}
                                        </td>

                                        <td className='p-4'>
                                            {product.category}
                                        </td>

                                        <td className='p-4'>
                                            {product.price}
                                        </td>

                                        <td className='p-4'>
                                            {product.stock}
                                        </td>

                                        <td className='p-4'>
                                            <button
                                                onClick={()=>handleRestore(product.id)}
                                                className='text-green-600 mr-3'
                                            >
                                                Restore
                                            </button>

                                            <button
                                                onClick={()=>handlePermanentDelete(product.id)}
                                                title='delete permenantly'
                                                className='text-red-600'
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>

                </div>

            </main>

        </div>    
      
    </div>
  )
}

export default AdminProducts