import React, { useEffect,useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AdminSidbar from '../../components/adminsidebar'

import {setUsers} from '../../redux/slices/adminuserslice'

import {
    getUsers,
    blockUser,
    unblockUser
} from '../../services/adminuserservices'


const AdminUsers = () => {

    const dispatch = useDispatch();

    const[searchParams,setSearchParams]=useSearchParams();

    const search=searchParams.get("search")||"";
    const status=searchParams.get("status")||"";
    const currentPage=Number(searchParams.get("page"))||1;

    const usersPerPage=5;

    const users = useSelector((state) => state.adminUser.users);
    const pagination = useSelector((state)=>state.adminUser.pagination);

    const totalPages=pagination.totalPages


    const fetchUsers = useCallback(async () => {

            const data = await getUsers({
                search,
                status,
                page:currentPage,
                limit:usersPerPage
            });
            dispatch(setUsers(data));

    },[search,status,currentPage,dispatch]);


    useEffect(() => {
        const loadUsers = async()=>{
            try{
                await fetchUsers();
            }
            catch(error){
                console.log("GET USERS ERROR:",error);
            }
        };

        loadUsers();
    }, [fetchUsers]);

    const handleBlock = async (id) => {

        try {
            await blockUser(id);

            await fetchUsers();
        } 
        catch (error) {
            console.log("BLOCK USERS ERROR:",error);
        }

    };


    const handleUnblock = async (id) => {

        try {
            await unblockUser(id);

            await fetchUsers();
        } 
        catch (error) {
            console.log("UNBLOCK USER ERROR:",error);
        }

    };


    return (
        <div className='flex min-h-screen bg-gray-100'>

            <AdminSidbar />

            <div className='flex-1 ml-64'>

                <main className='p-6'>

                    <h1 className='text-2xl font-bold mb-6'>
                        Users
                    </h1>

                    <div className='bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3'>
                      <input 
                      type="text"
                      placeholder='Search users...'
                      value={search}
                      onChange={(e)=>{
                        const value=e.target.value;
                        const params=new URLSearchParams(searchParams);
                        if(value){
                          params.set("search",value);
                        }
                        else{
                          params.delete("search");
                        }

                        params.delete("page");

                        setSearchParams(params);                        
                      }}
                      className='border border-gray-300 rounded-lg px-4 py-2 w-full md:w-80 outline-none'
                      />

                      <select
                      value={status}
                      onChange={(e)=>{
                        const value=e.target.value
                        const params=new URLSearchParams(searchParams)

                        if(value){
                            params.set("status",value);
                        }
                        else{
                            params.delete("status");
                        }

                        params.delete("page")

                        setSearchParams(params);
                      }}
                      className='border border-gray-300 rounded-lg px-4 py-2 outline-none ml-3'
                      >
                        <option value="">All Users</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>

                      <button 
                      onClick={()=>{
                        setSearchParams({});
                      }}
                      className='px-4 py-2 border border-gray-300 rounded-lg bg-black text-white'
                      >
                        Clear
                      </button>
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
                                    users.map((user) => (

                                        <tr
                                            key={user._id}
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
                                                                handleUnblock(user._id)
                                                            }
                                                            className='text-green-600'
                                                        >
                                                            Unblock
                                                        </button>

                                                    ) : (

                                                        <button
                                                            onClick={() =>
                                                                handleBlock(user._id)
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

                    <div className='flex justify-center items-center gap-2 p-4'>

                      <button 
                      onClick={()=>setSearchParams({
                        search,
                        status,
                        page:currentPage-1
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
                                      status,
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
                              status,
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