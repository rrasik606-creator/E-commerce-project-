import axios from "axios";


const api = axios.create({
    baseURL:"http://localhost:5000",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
});

api.interceptors.response.use(
    (response)=>{
        return response;
    },
    async(error)=>{
        const originalRequest=error.config;

        if(
            error.response?.status===401&&
            originalRequest&&
            !originalRequest._retry&&
            !originalRequest.url?.includes("/auth/refresh")&&
            !originalRequest.url?.includes("/auth/login")&&
            !originalRequest.url?.includes("/auth/register")
        ){
            originalRequest._retry=true;

            try{
                await api.post("/auth/refresh");
                return api(originalRequest);
            }
            catch(refreshError){
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api