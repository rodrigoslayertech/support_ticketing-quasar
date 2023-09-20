import { defineStore } from 'pinia'

import { api } from 'boot/axios'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    list: []
  }),

  getters: {},

  actions: {
    async list () {
      return await api.get('/ticket', {
        withCredentials: true
      }).then(response => {
        if (!response.data) {
          return false
        }

        const ticket = response.data

        return ticket
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
    async get (id:number) {
      return await api.get('/ticket/' + id, {
        withCredentials: true
      }).then(response => {
        if (!response.data) {
          return false
        }

        this.list = response.data

        return this.list
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
    async getReplies (id:number) {
      return await api.get('/ticket/reply', {
        withCredentials: true,
        params: {
          ticket: id
        }
      }).then(response => {
        if (!response.data) {
          return false
        }

        this.list = response.data

        return this.list
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
    }
  }
})
