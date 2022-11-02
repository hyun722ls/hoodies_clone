import axios from "axios"
import { API_URL } from "../../common/api/url"
import axios1 from "../../common/customAxios/customAxios"


export const createArticle = async (title, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'title': title, 'writer': writer, 'content': content }
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
        const response = await axios1.put(API_URL + `board/${articleId}`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }})
        return response.data

    } catch (err){
        console.log(err)
    }
    
}

export const fetchArticles = async (page) => {
    try {
        const response = await axios1.get(API_URL + `board?page=${page}&size=20`, {headers: {
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
        const response = await axios1.get(API_URL + `board/${articleId}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }}) 
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const deleteArticle = async (articleId) => {
    try {
        const response = await axios1.delete(API_URL + `board/${articleId}`, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
        console.log(response.data)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const createComment = async (articleId, content) => {
    const writer = localStorage.getItem('nickname')
    const formData = {'content': content, 'writer': writer}
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
        const response = await axios1.put(API_URL + `board/${articleId}/comment/${commentId}`, formData, {headers: {
            'accessToken': localStorage.getItem('token')
        }} )
        console.log(response.data)
        return response
    } catch (err) {
        console.log(err)
    }
}

