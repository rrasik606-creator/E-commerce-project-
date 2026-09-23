import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminSidbar from '../../components/adminsidebar'
import AdminHeader from '../../components/adminheader'

import {
    setUsers,
    blockUser as blockUserRedux,
    unblockUser as unblockUserRedux
} from '../../redux/slices/adminuserslice'

import {
    getUsers,
    blockUser,
    unblockUser
} from '../../services/adminuserservices'


const AdminUsers = () => {

    const dispatch = useDispatch();

    const allUsers = useSelector(
        (state) => state.adminUser.users
    );

    const users=allUsers.filter((user)=>user.role!=="admin")


    const fetchUsers = async () => {

        try {

            const data = await getUsers();

            dispatch(setUsers(data));

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        fetchUsers();

    }, []);


    const handleBlock = async (id) => {

        try {

            await blockUser(id);

            dispatch(blockUserRedux(id));

        } catch (error) {

            console.log(error);

        }

    };


    const handleUnblock = async (id) => {

        try {

            await unblockUser(id);

            dispatch(unblockUserRedux(id));

        } catch (error) {

            console.log(error);

        }

    };


    return (
        <div className='flex min-h-screen bg-gray-100'>

            <AdminSidbar />

            <div className='flex-1 ml-64'>

                <AdminHeader />

                <main className='p-6'>

                    <h1 className='text-2xl font-bold mb-6'>
                        Users
                    </h1>


                    <div className='bg-white rounded-lg shadow overflow-x-auto'>

                        <table className='w-full'>

                            <thead>

                                <tr className='border-b text-left'>

                                    <th className='p-4'>
                                        Name
                                    </th>

                                    <th className='p-4'>
                                        Username
                                    </th>

                                    <th className='p-4'>
                                        Email
                                    </th>

                                    <th className='p-4'>
                                        Status
                                    </th>

                                    <th className='p-4'>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {
                                    users.map((user) => (

                                        <tr
                                            key={user.id}
                                            className='border-b'
                                        >

                                            <td className='p-4'>
                                                {user.name}
                                            </td>

                                            <td className='p-4'>
                                                {user.username}
                                            </td>

                                            <td className='p-4'>
                                                {user.email}
                                            </td>

                                            <td className='p-4'>
                                                <span className={`px-3 py-1 rounded-full text-sm ${user.blocked?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}`}>
                                                  {user.blocked?"Blocked":"Active"}
                                                </span>
                                            </td>

                                            <td className='p-4'>

                                                {
                                                    user.blocked ? (

                                                        <button
                                                            onClick={() =>
                                                                handleUnblock(user.id)
                                                            }
                                                            className='text-green-600'
                                                        >
                                                            Unblock
                                                        </button>

                                                    ) : (

                                                        <button
                                                            onClick={() =>
                                                                handleBlock(user.id)
                                                            }
                                                            className='text-red-600'
                                                        >
                                                            Block
                                                        </button>

                                                    )
                                                }

                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>


                        {
                            users.length === 0 && (

                                <div className='p-8 text-center text-gray-500'>
                                    No users found
                                </div>

                            )
                        }

                    </div>

                </main>

            </div>

        </div>
    )
}

export default AdminUsers