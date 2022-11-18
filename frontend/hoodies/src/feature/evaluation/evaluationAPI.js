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
        const response = await axios1.get(API_URL + `mentor/detail/${id}`,  {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch(err) {
        console.log(err)
    }
}

export const postEvaluation = async (id, score, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'writer': writer, 'score':score, 'content': content }
    try {
        const response = await axios1.post(API_URL + `mentor/${id}/evaluation`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data

    } catch (err){
        console.log(err)
    }
    
}


export const deleteComment = async (proId, commentId) => {
    try {
        const response = await axios1.delete(API_URL + `mentor/${proId}/evaluation/${commentId}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
    
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const checkEvaluation = async (formData) => {
    try {
        const response = await axios1.post('https://k7a402.p.ssafy.io/ai/comment', formData)
        return response.data
    } catch (err) {
        console.log(err)
    }
}


