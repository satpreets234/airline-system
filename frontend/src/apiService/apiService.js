import axios from 'axios';

const baseUrl ='http://localhost:8540/api/'
const handleSuccess =(response)=>{
    return response.data;
}
const handleError =(error)=>{
    const {status,data} =error.response;
    throw new Error(`${status} : ${data.error || data}`)
}
export const fetchDataWithToken =async (slug) =>{
    const token=localStorage.getItem('token')
    return axios.get(`${baseUrl}${slug}`,{headers:{authorization:`Bearer ${token}`}})
    .then(handleSuccess)
    .catch(handleError)
}

export const fetchDataWithoutToken =async (slug) =>{
    const token=localStorage.getItem('token')
    return axios.get(`${baseUrl}${slug}`)
    .then(handleSuccess)
    .catch(handleError)
}

export const postData =async (slug,body) =>{
    const token=localStorage.getItem('token')
    return axios.post(`${baseUrl}${slug}`,body,{headers:{authorization:`Bearer ${token}`}})
    .then(handleSuccess)
    .catch(handleError)
}

export const deleteData =async (slug) =>{
    const token=localStorage.getItem('token')
    return axios.delete(`${baseUrl}${slug}`,{headers:{authorization:`Bearer ${token}`}})
    .then(handleSuccess)
    .catch(handleError)
}

export const putData =async (slug,body) =>{
    const token=localStorage.getItem('token')
    return axios.put(`${baseUrl}${slug}`,body,{headers:{authorization:`Bearer ${token}`}})
    .then(handleSuccess)
    .catch(handleError)
}