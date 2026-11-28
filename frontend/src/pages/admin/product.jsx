import React,{useEffect,useCallback} from 'react'
import Swal from 'sweetalert2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate,useSearchParams } from 'react-router-dom'
import AdminSidbar from '../../components/adminsidebar'
import { setProducts } from '../../redux/slices/adminproductslice'
import { getProduct,softDeleteProduct } from '../../services/adminproductservices'

const AdminProducts = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const products=useSelector((state)=>state.adminProduct.products);
    const brands=useSelector((state)=>state.adminProduct.brands);
    const pagination=useSelector((state)=>state.adminProduct.pagination);


    const [searchParams,setSearchParams]=useSearchParams();

    const currentPage=Number(searchParams.get("page"))||1;

    const search=searchParams.get("search")||"";
    const brand=searchParams.get("brand")||"";
    const type=searchParams.get("type")||"";

    const fetchProduct=useCallback(async()=>{
        try{
            const data=await getProduct({
                page:currentPage,
                limit:5,
                search,
                brand,
                type
            });

            dispatch(setProducts(data));

            return data;
        }
        catch(error){
            console.log(error);
        }
    },[dispatch,currentPage,search,brand,type]);

    useEffect(()=>{
        fetchProduct();
    },[fetchProduct]);

    const handleDelete=async(id)=>{

        const confirmdelete=await Swal.fire({
            title:"Are you sure?",
            text:"The product will be deleted.",
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Yes,Delete",
            cancelButtonText:"Cancel"
        })

        if(!confirmdelete.isConfirmed){
            return
        }

        try{
            await softDeleteProduct(id);

            const data = await fetchProduct();

            if(data&&data.products.length===0&&currentPage>1){
                setSearchParams({search,brand,type,page:Math.max(1,data.pagination.totalPages)});
            }
        }
        catch(error){
            console.log(error);
        }
    };

    const handleSearch=(e)=>{

        setSearchParams({
            search:e.target.value,
            brand,
            type,
            page:1
        });

    };

    const handleBrand=(e)=>{

        setSearchParams({
            search,
            brand:e.target.value,
            type,
            page:1
        });

    };

    const handleType=(e)=>{

        setSearchParams({
            search,
            brand,
            type:e.target.value,
            page:1
        });

    };

    const clearFilters=()=>{

        setSearchParams({
            page:1
        });

    };

    const handlePageChange = (page) => {
        setSearchParams({
            search,
            brand,
            type,
            page
        });
    };

  return (
    <div className='flex min-h-screen bg-gray-100'>

        <AdminSidbar/>

        <div className='flex-1 ml-64'>

            <main className='p-6'>

                <div className='flex justify-between items-center mb-6'>

                    <h1 className='text-2xl font-bold'>
                        Products
                    </h1>

                    <button
                        onClick={()=>navigate("/admin/product/add")}
                        className='bg-black text-white px-4 py-2 rounded-lg'
                    >
                        Add Product
                    </button>

                </div>


                {/* Search and Filters */}

                <div className='bg-white rounded-lg shadow p-4 mb-6'>

                    <div className='flex flex-wrap gap-4'>

                        <input
                            type='text'
                            value={search}
                            onChange={handleSearch}
                            placeholder='Search product...'
                            className='border rounded-lg px-4 py-2 flex-1 min-w-[200px]'
                        />


                        <select
                            value={brand}
                            onChange={handleBrand}
                            className='border rounded-lg px-4 py-2'
                        >

                            <option value=''>
                                All Brands
                            </option>

                            {
                                brands.map((brandName)=>(
                                    <option
                                        key={brandName}
                                        value={brandName}
                                    >
                                        {brandName}
                                    </option>
                                ))
                            }

                        </select>

                        <select
                            value={type}
                            onChange={handleType}
                            className='border rounded-lg px-4 py-2'
                        >

                            <option value=''>
                                All Types
                            </option>

                            <option value='casual'>
                                Casual
                            </option>

                            <option value='sports'>
                                Sports
                            </option>

                        </select>


                        <button
                            onClick={clearFilters}
                            className='border bg-black text-white px-4 py-2 rounded-lg'
                        >
                            Clear
                        </button>

                    </div>

                </div>


                <div className='bg-white rounded-lg shadow overflow-x-auto'>

                    <table className='w-full'>

                        <thead>

                            <tr className='border-b text-left'>

                                <th className='p-4'>Image</th>

                                <th className='p-4'>Name</th>

                                <th className='p-4'>Brand</th>

                                <th className='p-4'>Type</th>

                                <th className='p-4'>Price</th>

                                <th className='p-4'>Stock</th>

                                <th className='p-4'>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {
                                products.map((product)=>(

                                    <tr
                                        key={product._id}
                                        className='border-b'
                                    >

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
                                            {product.type}
                                        </td>


                                        <td className='p-4'>
                                            {product.price}
                                        </td>


                                        <td className='p-4'>
                                            {product.stock}
                                        </td>


                                        <td className='p-4'>

                                            <button
                                                onClick={()=>navigate(`/admin/product/edit/${product._id}`)}
                                                className='text-blue-600 mr-3'
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={()=>handleDelete(product._id)}
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


                    {
                        products.length===0 && (

                            <div className='p-8 text-center text-gray-500'>
                                No products found
                            </div>

                        )
                    }

                </div>


                {/* Pagination */}

                <div className='flex justify-center items-center gap-2 p-4'>

                    <button
                        onClick={() =>handlePageChange(currentPage-1)}
                        disabled={currentPage<=1}
                        className='px-4 py-2 border rounded-lg disabled:opacity-50'
                    >
                        Previous
                    </button>


                    {
                        Array.from(
                            {length:pagination.totalPages},
                            (_,index)=>(

                                <button
                                    key={index}
                                    onClick={() =>handlePageChange(index+1)}
                                    className={`px-4 py-2 rounded-lg ${
                                        currentPage===index+1
                                            ? 'bg-black text-white'
                                            : 'border'
                                    }`}
                                >
                                    {index+1}
                                </button>

                            )
                        )
                    }


                    <button
                        onClick={() =>handlePageChange(currentPage+1)}
                        disabled={
                            currentPage>=pagination.totalPages ||
                            pagination.totalPages===0
                        }
                        className='px-4 py-2 border rounded-lg disabled:opacity-50'
                    >
                        Next
                    </button>

                </div>

            </main>

        </div>

    </div>
  )
}

export default AdminProducts