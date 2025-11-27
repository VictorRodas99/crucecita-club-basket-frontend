import { API_URL } from '@/resources/constants/config'
import ky from 'ky'

const http = ky.create({
  prefixUrl: API_URL,
  headers: {
    Accept: 'application/json'
  }
})

export default http
