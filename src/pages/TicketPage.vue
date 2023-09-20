<template lang="pug">
q-page(padding style="max-width: 1200px;")
  <!--<img alt="Quasar logo" src="~assets/support_ticketing.logo.png" style="width: 200px; height: 200px">-->

  .row.q-mb-md
    .col-11
      div.text-caption Usuário: {{ ticket.user_id }}
      div.text-h5 {{ ticket.title }}
    .col-1.text-right
      q-badge(v-if="ticket.status === 'opened'" color="red") aberto
      q-badge(v-else-if="ticket.status === 'in_progress'") em progresso
      q-badge(v-else-if="ticket.status === 'closed'" color="green") fechado

  .row.q-mb-md
    div {{ ticket.description }}

  .row.justify-end
    .col.text-left
      .text-caption Criado em:
      .text-caption {{ ticket.created_at }}
    .col.text-right(v-if="ticket.updated_at")
      .text-caption Ultima atualização:
      .text-caption {{ ticket.updated_at }}

  q-separator(spaced="20px")

  div {{ replies }}
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useTicketStore } from 'src/stores/ticket'

export default defineComponent({
  name: 'TicketPage',

  setup () {
    const Route = useRoute()
    const Ticket = useTicketStore()

    const ticket = ref({})
    const replies = ref([])

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
    Ticket.getReplies(ticketId).then(data => {
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

      replies.value = data
    })

    return {
      ticket,
      replies
    }
  }
})
</script>
