import axios from "axios";
import { API_URL } from "../../common/api/url"

export const fetchPreview = async () => {
    try {
        const response = await axios.get(API_URL + 'preview/free')
        return response.data
    } catch (err){
        console.log(err)
    }
}

export const fetchPopularview = async () => {
    try {
        const response = await axios.get(API_URL + 'preview/popular')
        return response.data
    } catch (err){
        console.log(err)
    }
}

export const fetchStaffview = async () => {
    try {
        const response = await axios.get(API_URL + 'preview/mentor')
        return response.data
    } catch (err){
        console.log(err)
    }
}