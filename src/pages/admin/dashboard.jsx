 import React,{useEffect} from 'react'
 import { useSelector,useDispatch } from 'react-redux'

 import AdminSidbar from '../../components/adminsidebar'
 import AdminHeader from '../../components/adminheader'

 import { getProduct } from '../../services/adminproductservices'
 import { getUsers } from '../../services/adminuserservices'
import { getOrders } from '../../services/adminorderservices'

import { setProducts } from '../../redux/slices/adminproductslice'
import { setUsers } from '../../redux/slices/adminuserslice'
import { setOrders } from '../../redux/slices/adminordersslice'

 
 const Dashboard = () => {
    const dispatch=useDispatch();

    useEffect(() => {

    const fetchDashboardData = async () => {

        const productsData = await getProduct();
        const usersData = await getUsers();
        const ordersData = await getOrders();

        dispatch(setProducts(productsData));
        dispatch(setUsers(usersData));
        dispatch(setOrders(ordersData));
    };

    fetchDashboardData();

    }, [dispatch]);

    const products=useSelector((state)=>state.adminProduct.products)
    const users=useSelector((state)=>state.adminUser.users)
    const orders=useSelector((state)=>state.adminOrder.orders)

   return (
     <div className='flex min-h-screen bg-gray-100'>

        <AdminSidbar/>
        
        <div className='flex-1 ml-64'>

            <AdminHeader/>

            <main className='p-6'>

                <h1 className='text-2xl font-bold mb-6'>
                    Dashboard
                </h1>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Product</p>
                        <h2 className='text-3xl font-bold mt-2'>
                            {products.filter((product)=>!product.deleted).length}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Users</p>
                        <h2 className='text-3xl font-bold mt-2'>
                            {users.filter((user) => user.role !== "admin").length}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Orders</p>
                        <h2 className='text-3xl font-bold mt-2'>
                            {orders.length}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Revenue</p>
                        <h2 className='text-3xl font-bold mt-2'>0</h2>
                    </div>

                </div>

            </main>

        </div>
       
     </div>
   )
 }
 
 export default Dashboard
 