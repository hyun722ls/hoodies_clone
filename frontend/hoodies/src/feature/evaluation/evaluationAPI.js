import axios from "axios"
import { API_URL } from "../../common/api/url"
import axios1 from "../../common/customAxios/customAxios"

export const getStaffList = async() => {
    try {
        const response = await axios1.get(API_URL + 'mentor',  {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch(err) {
        console.log(err)
    }
}

export const getStaffListByType = async(type) => {
    try {
        const response = await axios1.get(API_URL + `mentor/${type}`,  {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch(err) {
        console.log(err)
    }
}

export const getStaff = async(id) => {
    try {
        const response = await axios1.get(API_URL + `mentor/coach/${id}`,  {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch(err) {
        console.log(err)
    }
}