import axios from "axios"
import { API_URL } from "../../common/api/url"
import axios1 from "../../common/customAxios/customAxios"

export const checkNickname = async (nickname) => {
    try {
        const response = await axios.get(API_URL + `user/check/${nickname}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const sendMM = async (email) => {
    try {
        const response = await axios.get(API_URL + `user/auth/${email}`)
        
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const authMM = async (email, authcode) => {
    const formData = {'email':email, 'authcode': authcode}
    try {
        const response = await axios.post(API_URL + 'user/auth', formData)
       
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const signup = async (email, password, nickname) => {
    const formData = {'email':email, 'password': password, 'nickname': nickname}
    try {
        const response = await axios.post(API_URL + 'user', formData)
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const login = async (email, password) => {
    const formData = {'email':email, 'password': password}
    try {
        const response = await axios.post(API_URL + 'user/login', formData)
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const passwordSendMM = async (email) => {
    try {
        const response = await axios.get(API_URL + `user/resetPassword/${email}`)
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const passworAuthMM = async (email, authcode ) => {
    const formData = {'email':email, 'authcode': authcode}
    try {
        const response = await axios.post(API_URL + 'user/resetPassword', formData )
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const logOut = async () => {
    try {
        const response = await axios1.get(API_URL + 'user/logout', {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const postInquiry = async (content) => {
    const data = {'content': content}
    try {
        const response = await axios1.post(API_URL + 'board/feedback', data, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const getInquiry = async () => {
    try {
        const response = await axios1.get(API_URL + 'admin/feedback', {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}