import axios from "axios"
import { API_URL } from "../../common/api/url"

export const checkNickname = async (nickname) => {
  try {
      const response = await axios.get(API_URL + `user/check/${nickname}`)
      return response.data
  } catch (err) {
      console.log(err)
  }
}

export const updateNickname = async (nickname) => {
  try {
    const response = await axios.put(API_URL + 'user/nickname', {
      nickname
    }, 
    {
      headers: {
        token : localStorage.getItem('token')
      }
    })
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export const updatePassword = async (password) => {
  try {
    const response = await axios.put(API_URL + 'user/password', {password})
    return response.data
  } catch (err) {
    console.log(err)
  }
}