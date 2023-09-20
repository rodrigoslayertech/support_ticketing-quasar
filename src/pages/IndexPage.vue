<template lang="pug">
q-page(padding style="max-width: 1200px; margin: auto;")
  .row.justify-end
    q-btn.q-mb-md(color="secondary") Abrir ticket

  q-virtual-scroll(
    :items="tickets"
    separator
    v-slot="ticket"
    style="height: calc(100vh - 150px); max-width: 1200px;"
  )
    q-item(
      clickable v-ripple
      :to="'ticket/' + ticket.item.id"
      :key="ticket.index"
    )
      q-item-section
        q-item-label {{ ticket.item.title }}
        q-item-label(caption lines="1") {{ ticket.item.description }}
      q-item-section(side top)
        q-item-label.q-mb-sm(caption) {{ ticket.item.updated_at }}
        q-badge(v-if="ticket.item.status === 'opened'" color="red") aberto
        q-badge(v-else-if="ticket.item.status === 'in_progress'") em progresso
        q-badge(v-else-if="ticket.item.status === 'closed'" color="green") fechado
</template>

<script>
import { defineComponent, ref } from 'vue'

import { useTicketStore } from 'src/stores/ticket'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const Ticket = useTicketStore()

    const tickets = ref([])

    Ticket.list().then(list => {
      list.forEach(item => {
        if (item.updated_at) {
          const updatedDate = new Date(item.updated_at)

          const date = updatedDate.toLocaleDateString()
          const time = updatedDate.toLocaleTimeString()

          item.updated_at = `${date} às ${time}`
        }
      })

      tickets.value = list
    })

    return {
      tickets
    }
  }
})
</script>
