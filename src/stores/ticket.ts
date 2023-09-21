import { ref } from 'vue'
import { defineStore } from 'pinia'

import { api } from 'boot/axios'

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref([])

  async function list () {
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
  }
  async function get (id:number) {
    return await api.get('/ticket/' + id, {
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
  }
  async function open (data: { title:string, description:string }) {
    return await api.post('/ticket/', {
      title: data.title,
      description: data.description
    }, {
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
  }
  async function getReplies (id:number) {
    return await api.get('/ticket/reply', {
      withCredentials: true,
      params: {
        ticket: id
      }
    }).then(response => {
      if (!response.data) {
        return false
      }

      const replies = response.data

      return replies
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
  async function sendReply (reply: {ticket:number, reply:string, file:string}) {
    return await api.post('/ticket/reply', {
      ticket_id: reply.ticket,
      reply: reply.reply,
      file: reply.file
    }, {
      withCredentials: true
    }).then(response => {
      if (!response.data) {
        return false
      }

      const result = response.data

      return result
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
  async function close (ticket:number) {
    return await api.put('/ticket/' + ticket + '/close', {
      withCredentials: true
    }).then(response => {
      if (!response.data) {
        return false
      }

      const result = response.data

      return result
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

  return {
    tickets,
    list,
    get,
    open,
    getReplies,
    sendReply,
    close
  }
})
