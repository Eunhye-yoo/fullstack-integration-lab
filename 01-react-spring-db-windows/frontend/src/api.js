import axios from 'axios'

// 개발: Vite 프록시 사용 → baseURL 생략(빈 문자열)
// 운영: .env 파일에 VITE_API_BASE=https://api.example.com 처럼 지정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || ''
})

export default api
