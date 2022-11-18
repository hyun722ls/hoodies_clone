import axios1 from "../../common/customAxios/customAxios";
import { API_URL } from "../../common/api/url"

export const fetchPreview = async () => {
    try {
        const response = await axios1.get(API_URL + 'preview/free', {headers: {
                'accessToken': localStorage.getItem('token')
            }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchPopularview = async () => {
    try {
        const response = await axios1.get(API_URL + 'preview/popular', {headers: {
                'accessToken': localStorage.getItem('token')
            }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchStaffview = async () => {
    try {
        const response = await axios1.get(API_URL + 'preview/mentor', {headers: {
                'accessToken': localStorage.getItem('token')
            }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}