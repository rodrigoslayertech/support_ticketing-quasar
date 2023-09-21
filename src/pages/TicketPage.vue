<template lang="pug">
q-page(style="max-width: 1200px; margin: auto;")
  q-scroll-area.ticket-scrollarea(
    :class="ticket.status !== 'closed' ? 'ticket-closed' : 'ticket-non-closed'"
    ref="ticketScrollArea"
  )
    .row.q-mb-md
      .col-md-11.col-sm-10.col-xs-10
        div.text-caption Usuário: {{ ticket.user_id }}
        div.text-h5 {{ ticket.title }}
      .col-md-1.col-sm-2.col-xs-2.text-right
        q-badge(v-if="ticket.status === 'opened'" color="red") aberto
        q-badge(v-else-if="ticket.status === 'in_progress'") em progresso
        q-badge(v-else-if="ticket.status === 'closed'" color="green") fechado

    .row.q-mb-md
      div {{ ticket.description }}
    .row.q-mb-md(v-if="ticket.file")
      .text-caption (Arquivo anexado):
        a.q-ml-xs(
          target="_blank"
          :href="api.defaults.baseURL + '/' + ticket.file"
        ) {{ api.defaults.baseURL + '/' + ticket.file }}

    .row.justify-end
      //-.col.text-left
        .text-caption Ticket criado em:
        .text-caption {{ ticket.created_at }}
      .col.text-right(v-if="ticket.updated_at")
        //-.text-caption Última atualização:
        .text-caption {{ ticket.updated_at }}

    q-separator(spaced="20px")

    div(v-for="reply in ticketReplies" :key="reply.id")
      .row.q-mb-md
        div {{ reply.reply }}
      .row.justify-end
        .col.text-right(v-if="reply.updated_at")
          //-.text-caption Última atualização:
          .text-caption {{ reply.updated_at }}
      q-separator(spaced="20px")

  q-form.q-gutter-md.q-pa-md(
    v-if="ticket.status && ticket.status !== 'closed'"
    @submit.prevent.stop="replyTicket"
    ref="ticketReplyForm"
  )
    q-input(
      dense square outlined clearable
      type="textarea" label="Digite uma resposta"
      v-model="ticketReplyInput.reply"
      :rules="ticketReplyRules.reply"
    )
      template(v-slot:prepend)
        q-icon(name="quickreply")
    //-q-input(
      dense square outlined clearable
      type="textarea" label="Digite uma descrição"
      v-model="ticketInput.description"
      :rules="ticketRules.description"
      )
      template(v-slot:prepend)
        q-icon(name="description")
    .row.justify-end
      q-btn.q-mr-md(
        no-caps
        @click="closeTicket"
        label="Fechar ticket" color="negative" icon="close"
        :loading="ticketCloseStatus.close.loading"
        :disable="ticketCloseStatus.close.loading"
      )
        template(v-slot:loading)
          q-spinner-facebook
      q-btn(
        no-caps
        @click="replyTicket"
        label="Responder ticket" color="primary" icon="quickreply"
        :loading="ticketReplyStatus.reply.loading"
        :disable="ticketReplyStatus.reply.loading"
      )
        template(v-slot:loading)
          q-spinner-facebook
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

import { useTicketStore } from 'src/stores/ticket'

export default defineComponent({
  name: 'TicketPage',

  setup () {
    const Route = useRoute()
    const Router = useRouter()

    const $q = useQuasar()

    const Ticket = useTicketStore()

    const ticket = ref({})
    const ticketScrollArea = ref(null)
    const ticketReplyForm = ref(null)
    const ticketReplyInput = ref({
      reply: ''
    })
    const ticketReplyRules = ref({
      reply: [
        value => (value && value.length > 0) || 'Digite uma resposta.'
      ]
    })
    const ticketReplyStatus = ref({
      reply: {
        loading: false
      }
    })
    const ticketCloseStatus = ref({
      close: {
        loading: false
      }
    })
    const ticketReplies = ref([])

    const ticketId = Route.params.id
    Ticket.get(ticketId).then(data => {
      const createdDate = new Date(data.created_at)
      let updatedDate = null
      if (data.created_at !== data.updated_at) {
        updatedDate = new Date(data.updated_at)
      } else {
        data.updated_at = null
      }

      const dateCreated = createdDate.toLocaleDateString()
      const timeCreated = createdDate.toLocaleTimeString()
      data.created_at = `${dateCreated} às ${timeCreated}`

      if (updatedDate) {
        const dateUpdated = updatedDate.toLocaleDateString()
        const timeUpdated = updatedDate.toLocaleTimeString()
        data.updated_at = `${dateUpdated} às ${timeUpdated}`
      }

      ticket.value = data
    })

    function getTicketReplies () {
      Ticket.getReplies(ticketId).then(replies => {
        replies.forEach(reply => {
          const createdDate = new Date(reply.created_at)
          const updatedDate = new Date(reply.updated_at)

          const dateCreated = createdDate.toLocaleDateString()
          const timeCreated = createdDate.toLocaleTimeString()
          reply.created_at = `${dateCreated} às ${timeCreated}`

          const dateUpdated = updatedDate.toLocaleDateString()
          const timeUpdated = updatedDate.toLocaleTimeString()
          reply.updated_at = `${dateUpdated} às ${timeUpdated}`
        })

        ticketReplies.value = replies
      })
    }
    function replyTicket () {
      ticketReplyStatus.value.reply.loading = true
      ticketReplyForm.value.validate().then(passed => {
        if (passed === false) {
          ticketReplyStatus.value.reply.loading = false
          return false
        }

        const Reply = {
          ticket: ticketId,
          ...ticketReplyInput.value
        }
        Ticket.sendReply(Reply).then(Reply => {
          // listTicketReplies()

          if (Reply.status === true) {
            ticketReplyStatus.value.reply.loading = false
            Router.go()
          }
        })
      })

      return true
    }
    function closeTicket () {
      $q.dialog({
        title: 'Confirmar',
        message: 'Você gostaria mesmo de fechar o ticket?',
        cancel: {
          label: 'Não',
          color: 'positive'
        },
        ok: {
          label: 'Sim',
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        Ticket.close(ticket.value.id).then(response => {
          console.log(response)

          if (response.status === true) {
            ticketCloseStatus.value.close.loading = false
            Router.go()
          }
        })
      })

      return true
    }

    getTicketReplies()

    setTimeout(() => {
      ticketScrollArea.value.setScrollPercentage('vertical', 1.0, 200)
    }, 3000)

    return {
      api,
      ticket,
      ticketReplies,

      ticketScrollArea,
      ticketReplyForm,
      ticketReplyInput,
      ticketReplyRules,
      ticketCloseStatus,
      ticketReplyStatus,

      replyTicket,
      closeTicket
    }
  }
})
</script>

<style lang="sass">
.ticket-scrollarea
  width: 100%
  padding: 15px
.ticket-closed
  height: calc(100vh - 285px)
.ticket-non-closed
  height: calc(100vh - 50px)
</style>
