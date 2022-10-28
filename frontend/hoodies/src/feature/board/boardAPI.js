import axios from "axios"
import { API_URL } from "../../common/api/url"


export const createArticle = async (title, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'title': title, 'writer': writer, 'content': content }
    try {
        const response = await axios.post(API_URL + 'board', formData)
        return response.data

    } catch (err){
        console.log(err)
    }
    
}

export const modifyArticle = async (title, content, articleId) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'title': title, 'writer': writer, 'content': content }
    try {
        const response = await axios.put(API_URL + `board/${articleId}`, formData)
        return response.data

    } catch (err){
        console.log(err)
    }
    
}

export const fetchArticles = async (page) => {
    try {
        const response = await axios.get(API_URL + `board?pageNumber=${page}&pageSize=20`)
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchPopularArticles = async () => {
    try {
        const response = await axios.get(API_URL + 'preview/popular')
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const fetchArticle = async (articleId) => {
    try {
        const response = await axios.get(API_URL + `board/${articleId}`)
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const createComment = async (articleId, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'content': content, 'writer': writer}
    try {
        const response = await axios.post(API_URL + `board/${articleId}/comment`, formData )
        return response.data
    } catch (err) {
        console.log(err)
    }
}


export const deleteComment = async (articleId, commentId) => {
    try {
        const response = await axios.delete(API_URL + `board/${articleId}/comment/${commentId}` )
        console.log(response.data)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const modifyComment = async (articleId, commentId, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'content': content, 'writer': writer}
    try {
        const response = await axios.put(API_URL + `board/${articleId}/comment/${commentId}`, formData )
        console.log(response.data)
        return response
    } catch (err) {
        console.log(err)
    }
}