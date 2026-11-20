import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser,logout,setAuthLoading } from "../redux/slices/authslice";
import { getCurrentUser } from "../services/authService";

const AuthInitializer =({children})=>{
    const dispatch=useDispatch();

    useEffect(()=>{
        const checkAuth=async()=>{
            try{
                const res = await getCurrentUser();

                dispatch(setUser(res.user));
            }
            catch(error){
                dispatch(logout());
            }
            finally{
                dispatch(setAuthLoading(false))
            }
        };

        checkAuth();
    },[dispatch])

    return children
}

export default AuthInitializer