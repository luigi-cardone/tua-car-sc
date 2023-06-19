import axios from "axios";
const BASE_URL = 'https://leads.tua-car.it/'
//http://localhost:8000
//http://tua-car-test.online
//https://https://leads.tua-car.it/
export default axios.create({
    baseURL: BASE_URL
})


export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers : { 'Content-Type' : 'application/json'},
    withCredentials : true
})