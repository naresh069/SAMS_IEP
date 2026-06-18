import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sams_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sams_token')
      localStorage.removeItem('sams_user')
    }
    return Promise.reject(err)
  },
)

export default api
