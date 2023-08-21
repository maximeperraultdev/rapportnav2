import ky, { Options } from 'ky'
import AuthToken from './auth/token'
import { KyInstance } from 'ky/distribution/types/ky'

const configWithAuth = (): Options => {
  const authToken = new AuthToken()
  return {
    prefixUrl: 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' },
    hooks: {
      beforeRequest: [
        options => {
          const token = authToken.get()

          if (token) {
            options.headers.set('Authorization', `Bearer ${token}`)
          }
        }
      ],
      afterResponse: []
    }
  }
}

export const httpClient: KyInstance = ky.create(configWithAuth())
