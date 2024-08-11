import type { LoginForm, SignupForm } from '@/types'
import axios from 'axios'

const BASE_URL = 'https://todolist-api.hexschool.io/users'

export const signup = async (params: SignupForm) => {
  return axios.post(`${BASE_URL}/sign_up`, params)
}

export const login = async (params: LoginForm) => {
  return axios.post(`${BASE_URL}/sign_in`, params)
}

export const checkAuth = async () => {
  return axios.get(`${BASE_URL}/checkout`)
}

export const logout = async () => {
  return axios.post(`${BASE_URL}/sign_out`, {})
}
