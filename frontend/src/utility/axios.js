import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://mernstackllmoptimzer-3.onrender.com/api', 
    withCredentials: true, 
});
export default axiosInstance
