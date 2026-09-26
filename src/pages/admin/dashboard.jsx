 import React,{useEffect,useState} from 'react'
 import { useNavigate } from 'react-router-dom'
 import { useSelector,useDispatch } from 'react-redux'

 import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from 'recharts'

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
    const navigate=useNavigate();

    const[period,setPeriod]=useState("monthly")

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

    const products=useSelector((state)=>state.adminProduct.products);

    const users=useSelector((state)=>state.adminUser.users);
    const totalUsers =users.filter((user)=>user.role!=="admin").length;
    const activeUsers =users.filter((user)=>user.role!=="admin"&&!user.blocked).length;
    const blockedUsers =users.filter((user)=>user.role!=="admin"&&user.blocked).length;
    const orders=useSelector((state)=>state.adminOrder.orders);
    const revenue=orders.reduce((total,order)=>total+Number(order.total),0);

    const recentOrders =[...orders].sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate)).slice(0,5);

    let chartData = [];

    if (period === "monthly") {

        chartData = Array.from({ length: 12 }, (_, index) => {

            const revenue = orders
                .filter((order) => {
                    const date = new Date(order.orderDate);

                    return date.getMonth() === index;
                })
                .reduce(
                    (total, order) => total + Number(order.total),
                    0
                );

            return {
                label: new Date(2026, index).toLocaleString("en-US", {
                    month: "short"
                }),
                revenue: revenue
            };
        });

    }

    if (period === "yearly") {

        const years = [
            ...new Set(
                orders.map((order) => {
                    return new Date(order.orderDate).getFullYear();
                })
            )
        ];

        chartData = years.map((year) => {

            const revenue = orders
                .filter((order) => {
                    const date = new Date(order.orderDate);

                    return date.getFullYear() === year;
                })
                .reduce(
                    (total, order) => total + Number(order.total),
                    0
                );

            return {
                label: year.toString(),
                revenue: revenue
            };
        });

    }

    if (period === "weekly") {

        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const firstWeekDay = firstDay.getDay();

        const totalWeeks = Math.ceil(
            (firstWeekDay + lastDay.getDate()) / 7
        );

        chartData = Array.from(
            { length: totalWeeks },
            (_, index) => {

                const weekNumber = index + 1;

                const revenue = orders
                    .filter((order) => {

                        const date = new Date(order.orderDate);

                        if (
                            date.getFullYear() !== year ||
                            date.getMonth() !== month
                        ) {
                            return false;
                        }

                        const week = Math.ceil(
                            (firstWeekDay + date.getDate()) / 7
                        );

                        return week === weekNumber;
                    })
                    .reduce(
                        (total, order) =>
                            total + Number(order.total),
                        0
                    );

                return {
                    label: `Week ${weekNumber}`,
                    revenue: revenue
                };
            }
        );

    }

    if (period === "daily") {

        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        chartData = Array.from(
            { length: daysInMonth },
            (_, index) => {

                const day = index + 1;

                const revenue = orders
                    .filter((order) => {
                        const date = new Date(order.orderDate);

                        return (
                            date.getFullYear() === year &&
                            date.getMonth() === month &&
                            date.getDate() === day
                        );
                    })
                    .reduce(
                        (total, order) =>
                            total + Number(order.total),
                        0
                    );

                return {
                    label: day.toString(),
                    revenue: revenue
                };
            }
        );

    }

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
                        <p className='text-gray-500'>Total Users</p>

                        <h2 className='text-3xl font-bold mt-2'>
                            {totalUsers}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Active Users</p>

                        <h2 className='text-3xl font-bold mt-2'>
                            {activeUsers}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Blocked Users</p>

                        <h2 className='text-3xl font-bold mt-2'>
                            {blockedUsers}
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
                        <h2 className='text-3xl font-bold mt-2'>
                            ₹ {revenue.toLocaleString()}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow mt-6 col-span-1 md:col-span-2 lg:col-span-4'>

                        <div className='flex justify-between items-center mb-5'>

                            <h2 className='text-xl font-semibold'>
                                Revenue
                            </h2>

                            <select
                                value={period}
                                onChange={(e)=>setPeriod(e.target.value)}
                                className='border border-gray-300 rounded-md px-3 py-2'
                            >
                                <option value="yearly">Yearly</option>
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>

                        </div>

                        <div className='w-full h-[350px]'>

                            <ResponsiveContainer width="100%" height="100%">

                                <AreaChart data={chartData}>

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="label" />

                                    <YAxis />

                                    <Tooltip />

                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#000"
                                        fill="#000"
                                        fillOpacity={0.1}
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>

                <div className='bg-white p-5 rounded-lg shadow mt-6'>
                    
                    <div className='flex justify-between items-center mb-5'>
                        <h2 className='text-xl font-semibold'>
                        Recent Orders
                        </h2>

                        <button
                        onClick={() => navigate("/admin/orders")}
                        className="bg-black text-white px-4 py-2 rounded-md"
                        >
                        View Orders
                        </button>
                    </div>

                    <div className='overflow-x-auto'>

                        <table className='w-full'>

                            <thead>
                                <tr className='border-b'>
                                    <th className='text-left py-3'>Order ID</th>
                                    <th className='text-left py-3'>Customer</th>
                                    <th className='text-left py-3'>Total</th>
                                    <th className='text-left py-3'>Status</th>
                                    <th className='text-left py-3'>Date</th>
                                </tr>
                            </thead>

                            <tbody>

                                {recentOrders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className='border-b'
                                    >

                                        <td className='py-3'>
                                            {order.id}
                                        </td>

                                        <td className='py-3'>
                                            {order.address.name}
                                        </td>

                                        <td className='py-3'>
                                            ₹ {Number(order.total).toLocaleString()}
                                        </td>

                                        <td className='py-3'>
                                            {order.status}
                                        </td>

                                        <td className='py-3'>
                                            {new Date(
                                                order.orderDate
                                            ).toLocaleDateString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

        </div>
       
     </div>
   )
 }
 
 export default Dashboard
 