import axios from "axios"
import { API_URL } from "../../common/api/url"
import axios1 from "../../common/customAxios/customAxios"


export const createArticle = async (title, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'title': title, 'writer': writer, 'content': content, 'type': 1 }
    try {
        const response = await axios1.post(API_URL + 'board', formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data

    } catch (err){
        console.log(err)
    }
    
}

export const modifyArticle = async (title, content, articleId) => {
    // const writer = localStorage.getItem('nickname')
    const formData = {'title': title, 'content': content, 'articleId': articleId }
    try {
        const response = await axios1.put(API_URL + `board/detail/${articleId}`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data

    } catch (err){
        console.log(err)
    }
    
}

export const fetchArticles = async (page) => {
    try {
        const response = await axios1.get(API_URL + `board/1?page=${page}&size=20`, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchPopularArticles = async () => {
    try {
        const response = await axios1.get(API_URL + 'preview/popular', {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchArticle = async (articleId) => {
    try {
        const response = await axios1.get(API_URL + `board/detail/${articleId}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }}) 
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const deleteArticle = async (articleId) => {
    try {
        const response = await axios1.delete(API_URL + `board/detail/${articleId}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
        
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const createComment = async (articleId, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'content': content, 'writer': writer, type: 1}
    try {
        const response = await axios1.post(API_URL + `board/${articleId}/comment`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const deleteComment = async (articleId, commentId) => {
    try {
        const response = await axios1.delete(API_URL + `board/${articleId}/comment/${commentId}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
    
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const modifyComment = async (articleId, commentId, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'content': content, 'writer': writer,  type: 1}
    try {
        const response = await axios1.put(API_URL + `board/${articleId}/comment/${commentId}`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
    
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchLike = async (articleId) => {
    const writer = localStorage.getItem('nickname')
    const tmpData = []
    try {
        const response = await axios1.patch(API_URL + `board/detail/${articleId}/like`, tmpData, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
 
        return response.data
    } catch (err) {
        console.log(err)
    }

}

export const reportArticle = async (articleId) => {
    const writer = localStorage.getItem('nickname')
    const tmpData = {}
    try {
        const response = await axios1.put(API_URL + `board/detail/${articleId}/report`, tmpData, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}



export const reportComment = async (articleId, commentId) => {
    const writer = localStorage.getItem('nickname')
    const tmpData = {}
    try {
        const response = await axios1.put(API_URL + `board/${articleId}/comment/${commentId}/report`, tmpData, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchSearch = async (option, keyword, page) => {
    try {
        const response = await axios.get(API_URL + `board/1/search?option=${option}&keyword=${keyword}&page=${page}&size=20`, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const previewImg = async (formData) => {
    try {
        const response = await axios.post('https://k7a402.p.ssafy.io/cm/image/filter', formData, {headers: {
            'Content-Type': 'multipart/form-data'
        }})
        return response.data.result
    } catch (err) {
        console.log(err)
    }
}

export const uploadImg = async (id,formData) => {
    try {
        const response = await axios.post(API_URL + `file/${id}`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
            
        }})
        return response.data
    } catch (err) {
        console.log(err)
    }
}