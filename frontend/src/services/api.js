// import axios from "axios";


// const api = axios.create({
//     baseURL:"http://localhost:5000",
//     withCredentials:true,
//     headers:{
//         "Content-Type":"application/json"
//     }
// });

// api.interceptors.response.use(
//     (response)=>{
//         return response;
//     },
//     async(error)=>{
//         const originalRequest=error.config;

//         if(
//             error.response?.status===401&&
//             originalRequest&&
//             !originalRequest._retry&&
//             !originalRequest.url?.includes("/auth/refresh")&&
//             !originalRequest.url?.includes("/auth/login")&&
//             !originalRequest.url?.includes("/auth/register")
//         ){
//             originalRequest._retry=true;

//             try{
//                 await api.post("/auth/refresh");
//                 return api(originalRequest);
//             }
//             catch(refreshError){
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api




import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthUrl = ["/auth/refresh", "/auth/login", "/auth/register"].some(
      (u) => original?.url?.includes(u)
    );

    if (error.response?.status === 401 && original && !original._retry && !isAuthUrl) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh").finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;    
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;