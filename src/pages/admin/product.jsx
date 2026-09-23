import React,{useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate,useSearchParams } from 'react-router-dom'
import AdminSidbar from '../../components/adminsidebar'
import AdminHeader from '../../components/adminheader'
import { setProducts,softDeleteProduct as softDeleteProductRedux } from '../../redux/slices/adminproductslice'
import { getProduct,softDeleteProduct } from '../../services/adminproductservices'

const AdminProducts = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const products=useSelector((state)=>state.adminProduct.products);

    const [searchParams,setSearchParams]=useSearchParams();

    const currentPage=Number(searchParams.get("page"))||1;

    const search=searchParams.get("search")||"";
    const brand=searchParams.get("brand")||"";
    const category=searchParams.get("category")||"";
    const type=searchParams.get("type")||"";

    const productsPerPage=5;

    const activeProducts=products.filter(
        (product)=>!product.deleted
    );

    const filteredProducts=activeProducts.filter((product)=>{

        const searchMatch=product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const brandMatch=brand
            ? product.brand===brand
            : true;

        // const categoryMatch=category
        //     ? product.category===category
        //     : true;

        const typeMatch=type
            ? product.type===type
            : true;

        return (
            searchMatch &&
            brandMatch &&
            // categoryMatch &&
            typeMatch
        );
    });

    const totalPages=Math.ceil(
        filteredProducts.length/productsPerPage
    );

    const startIndex=(currentPage-1)*productsPerPage;

    const currentProducts=filteredProducts.slice(
        startIndex,
        startIndex+productsPerPage
    );

    const brands=[
        ...new Set(
            activeProducts
                .map((product)=>product.brand)
                .filter(Boolean)
        )
    ];

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

        const confirmdelete=window.confirm(
            "Are you sure you want to delete?"
        );

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

    const handleSearch=(e)=>{

        setSearchParams({
            search:e.target.value,
            brand:brand,
            category:category,
            type:type,
            page:1
        });

    };

    const handleBrand=(e)=>{

        setSearchParams({
            search:search,
            brand:e.target.value,
            category:category,
            type:type,
            page:1
        });

    };

    const handleCategory=(e)=>{

        setSearchParams({
            search:search,
            brand:brand,
            category:e.target.value,
            type:type,
            page:1
        });

    };

    const handleType=(e)=>{

        setSearchParams({
            search:search,
            brand:brand,
            category:category,
            type:e.target.value,
            page:1
        });

    };

    const clearFilters=()=>{

        setSearchParams({
            page:1
        });

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


                        {/* <select
                            value={category}
                            onChange={handleCategory}
                            className='border rounded-lg px-4 py-2'
                        >

                            <option value=''>
                                All Categories
                            </option>

                            <option value='men'>
                                Men
                            </option>

                            <option value='women'>
                                Women
                            </option>

                        </select> */}


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
                            className='border px-4 py-2 rounded-lg'
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
                                currentProducts.map((product)=>(

                                    <tr
                                        key={product.id}
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
                                                onClick={()=>navigate(`/admin/product/edit/${product.id}`)}
                                                className='text-blue-600 mr-3'
                                            >
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


                    {
                        currentProducts.length===0 && (

                            <div className='p-8 text-center text-gray-500'>
                                No products found
                            </div>

                        )
                    }

                </div>


                {/* Pagination */}

                <div className='flex justify-center items-center gap-2 p-4'>

                    <button
                        onClick={() =>
                            setSearchParams({
                                search:search,
                                brand:brand,
                                category:category,
                                type:type,
                                page:currentPage-1
                            })
                        }
                        disabled={currentPage===1}
                        className='px-4 py-2 border rounded-lg disabled:opacity-50'
                    >
                        Previous
                    </button>


                    {
                        Array.from(
                            {length:totalPages},
                            (_,index)=>(

                                <button
                                    key={index}
                                    onClick={() =>
                                        setSearchParams({
                                            search:search,
                                            brand:brand,
                                            category:category,
                                            type:type,
                                            page:index+1
                                        })
                                    }
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
                        onClick={() =>
                            setSearchParams({
                                search:search,
                                brand:brand,
                                category:category,
                                type:type,
                                page:currentPage+1
                            })
                        }
                        disabled={
                            currentPage===totalPages ||
                            totalPages===0
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