import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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

    const[searchParams,setSearchParams]=useSearchParams();

    const search=searchParams.get("search")||"";
    const currentPage=Number(searchParams.get("page"))||1;

    const usersPerPage=5;

    const allUsers = useSelector(
        (state) => state.adminUser.users
    );

    const users=allUsers
    .filter((user)=>user.role!=="admin")
    .filter((user)=>{
      const searchMatch=
      user.name.toLowerCase().includes(search.toLowerCase())||
      user.username.toLowerCase().includes(search.toLowerCase())||
      user.email.toLowerCase().includes(search.toLowerCase());

      return searchMatch
    })

    const totalPages=Math.ceil(users.length/usersPerPage);
    const startIndex=(currentPage-1)*usersPerPage;
    const currentUsers=users.slice(startIndex,startIndex+usersPerPage);


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

                    <div className='mb-6'>
                      <input 
                      type="text"
                      placeholder='Search users...'
                      value={search}
                      onChange={(e)=>{
                        const value=e.target.value;
                        if(value){
                          searchParams.set("search",value);
                        }
                        else{
                          searchParams.delete("search");
                        }

                        searchParams.delete("page");

                        setSearchParams(searchParams);                        
                      }}
                      className='border border-gray-300 rounded-lg px-4 py-2 w-full md:w-80 outline-none'
                      />
                    </div>


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
                                    currentUsers.map((user) => (

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
                            currentUsers.length === 0 && (

                                <div className='p-8 text-center text-gray-500'>
                                    No users found
                                </div>

                            )
                        }

                    </div>

                    <div className='flex justify-center items-center gap-2 p-4'>

                      <button 
                      onClick={()=>setSearchParams({
                        search,page:currentPage-1
                      })}
                      disabled={currentPage===1}
                      className='px-4 py-2 border rounded-lg disabled:opacity-50'
                      >
                        Previous
                      </button>

                      {Array.from(
                          { length: totalPages },
                          (_, index) => (
                              <button
                                  key={index}
                                  onClick={() => setSearchParams({
                                      search,
                                      page: index + 1
                                  })}
                                  className={`px-4 py-2 rounded-lg ${
                                      currentPage === index + 1
                                          ? 'bg-black text-white'
                                          : 'border'
                                  }`}
                              >
                                  {index + 1}
                              </button>
                          )
                      )}

                      <button
                          onClick={() => setSearchParams({
                              search,
                              page: currentPage + 1
                          })}
                          disabled={
                              currentPage === totalPages ||
                              totalPages === 0
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

export default AdminUsers