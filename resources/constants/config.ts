export const APP_URL = 'http://localhost:8000'
export const API_PREFIX = '/api'

export const API_URL: string = APP_URL + API_PREFIX

export const USER_ROLE = {
  admin: 'administrador',
  coach: 'entrenador',
  tutor: 'tutor',
  delegate: 'delegado'
} as const
