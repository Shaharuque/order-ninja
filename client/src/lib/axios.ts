import axios from "axios";
import { baseURL } from "./domain";

const CustomInstance = axios.create({
    baseURL: baseURL,
    // headers: { Authorization: "Bearer " + localStorage.tid },
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});
// CustomInstance.interceptors.response.use((res)=>{
//     return res;
// },(error)=>{
//     if(error.response.status === 401 ){
//         // history.pushState(null,'','/login');
//     }
// });


export default CustomInstance;