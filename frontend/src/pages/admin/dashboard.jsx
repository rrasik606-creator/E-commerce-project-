import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'

import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from 'recharts'

import AdminSidbar from '../../components/adminsidebar'
import AdminHeader from '../../components/adminheader'

import { getDashboardStats } from '../../services/admindashboardservices'


const Dashboard = () => {
    const navigate=useNavigate();

    const[period,setPeriod]=useState("monthly");
    const [dashboardData, setDashboardData] = useState({
        statistics: {
            totalProducts: 0,
            totalUsers: 0,
            activeUsers: 0,
            blockedUsers: 0,
            totalOrders: 0,
            revenue: 0
        },
        chartData: [],
        recentOrders: []
    });

    const [loading,setloading] = useState(true);

    useEffect(() => {

      const fetchDashboardData = async () => {
        try{
            setloading(true);
            const data= await getDashboardStats(period);
            setDashboardData(data);
        }
        catch(error){
            console.log(error);
        }
        finally{
            setloading(false);
        }
    };

    fetchDashboardData();

    }, [period]);

    const {
        totalProducts,
        totalUsers,
        activeUsers,
        blockedUsers,
        totalOrders,
        revenue
    } = dashboardData.statistics

    const recentOrders = dashboardData.recentOrders;
    const chartData = dashboardData.chartData;


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
                            {totalProducts}
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
                            {totalOrders}
                        </h2>
                    </div>

                    <div className='bg-white p-5 rounded-lg shadow'>
                        <p className='text-gray-500'>Revenue</p>
                        <h2 className='text-3xl font-bold mt-2'>
                            ₹ {revenue.toLocaleString("en-IN")}
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

                                {!loading && recentOrders.length>0? (recentOrders.map((order) => (

                                    <tr
                                        key={order._id}
                                        className='border-b'
                                    >

                                        <td className='py-3'>
                                            {order._id}
                                        </td>

                                        <td className='py-3'>
                                            {order.userId?.name||order.address?.name||"Guest"}
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

                                ))
                                ):(
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-gray-500">
                                            {loading ? "Loading orders..." : "No recent orders found"}
                                        </td>  
                                    </tr>
                                )
                                }

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