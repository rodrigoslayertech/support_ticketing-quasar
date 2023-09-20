import { defineStore } from 'pinia'

import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {},

  actions: {
    async init () {
      return await api.get('/auth', {
        withCredentials: true
      }).then(response => {
        let logged = null
        let user = null

        if (!response.data) {
          return false
        }

        if (response.data.status === true) {
          user = response.data.user

          logged = true
        } else {
          user = null

          logged = false
        }

        this.user = user

        return logged
      }).catch(function (error) {
        // Error 😨
        if (error.response) {
          /*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
          console.info('Response Error - Data: ', error.response.data)
          console.info('Response Error - Status: ', error.response.status)
          console.info('Response Error - Headers: ', error.response.headers)
        } else if (error.request) {
          /*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
          console.error('Request Error - XMLHttpRequest: ', error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          console.error('Request Error (Unknown):', error)
        }

        return false
      })
    },
    async register (data: { email:string, password:string, validation:string }) {
      return await api.post('/register', {
        email: data.email,
        password: data.password,
        validation: data.validation
      }).then(response => {
        return response
      }).catch(function () {
        return false
      })
    },
    async login (form: { email: string, password: string }) {
      return await api.post('/login', {
        email: form.email,
        password: form.password
      }).then(response => {
        if (response.data?.status === true) {
          const token = response.data.token
          localStorage.setItem('bearer', token)
          return true
        } else {
          return { code: -1 } // No Response (data null)
        }
      }).catch(function (error) {
        // Error 😨
        if (error.response) {
          /*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
          console.log('Response Error - Data: ', error.response.data)
          console.log('Response Error - Status: ', error.response.status)
          console.log('Response Error - Headers: ', error.response.headers)

          if (error.response.status === 401) {
            return { code: 2 }
            // return error.response
          }

          return { code: -1 }
          // return error.response
        } else if (error.request) {
          /*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
          console.log('Request Error - XMLHttpRequest: ', error.request)

          return { code: -2 }
          // return error.request
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Request Error (Unknown)!', error)

          return { code: false }
          // return error
        }
      })
    },
    async logout () {
      return await api.post('/logout', {
        withCredentials: true
      }).then(response => {
        if (response.data) {
          if (response.data.status) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }).catch(function (error) {
        // Error 😨
        if (error.response) {
          /*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
          console.log('Response Error - Data: ', error.response.data)
          console.log('Response Error - Status: ', error.response.status)
          console.log('Response Error - Headers: ', error.response.headers)

          return false
        } else if (error.request) {
          /*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
          console.log('Request Error - XMLHttpRequest: ', error.request)

          return false
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Request Error (Unknown):', error)

          return false
        }
      })
    }
  }
})
