import { API_URL } from "../../common/api/url"
import axios1 from "../../common/customAxios/customAxios"

export const checkNickname = async (nickname) => {
    try {
        const response = await axios1.get(API_URL + `user/check/${nickname}`,  {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const updateNickname = async (nickname) => {
    try {
        const response = await axios1.put(API_URL + 'user/nickname', {
                nickname
            },
            {
                headers: {
                    'accesstoken' : localStorage.getItem('token')
                }
            })
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const updatePassword = async (data) => {
    try {
        const response = await axios1.put(API_URL + 'user/password', data,  {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchArticles = async () => {
    try {
        const response = await axios1.get(API_URL + `user/article/${localStorage.getItem('nickname')}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}