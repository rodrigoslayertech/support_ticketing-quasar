<template lang="pug">
q-page(padding style="max-width: 1200px; margin: auto;")
  .row.justify-end
    q-btn.q-mb-md(
      v-if="Auth.user.role !== 'Collaborator'"
      color="secondary"
      @click="ticketDialog = true"
    ) Abrir ticket

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
        q-item-label.q-mb-sm(caption) {{ ticket.item.updated_at }}\
        .row
          q-badge.q-mr-xs(color="yellow-6" text-color="black") {{ ticket.item.replies_count }}
            q-tooltip Respostas a este ticket
            q-icon.q-ml-xs(name="forum" size="14px")

          q-badge(v-if="ticket.item.status === 'opened'" color="red") aberto
          q-badge(v-else-if="ticket.item.status === 'in_progress'") em progresso
          q-badge(v-else-if="ticket.item.status === 'closed'" color="green") fechado

  q-dialog(v-model="ticketDialog" persistent)
    q-layout.bg-white.text-dark(
      view="Lhh lpR fff"
      container
      style="max-height: 500px"
    )
      q-header.bg-primary
        q-toolbar
          q-toolbar-title Abra um ticket
          q-btn(flat v-close-popup round dense icon="close")

      q-page-container
        q-page(padding)
          q-form.q-gutter-md(
            @submit.prevent.stop="openTicket"
            ref="ticketForm"
          )
            q-input(
              dense square outlined clearable
              type="text" label="Digite um título"
              v-model="ticketInput.title"
              :rules="ticketRules.title"
            )
              template(v-slot:prepend)
                q-icon(name="title")
            q-input(
              dense square outlined clearable
              type="textarea" label="Digite uma descrição"
              v-model="ticketInput.description"
              :rules="ticketRules.description"
            )
              template(v-slot:prepend)
                q-icon(name="description")
            q-file(
              filled bottom-slots
              v-model="ticketInput.file"
              label="Arquivo (opcional)"
              counter
            )
              template(v-slot:prepend)
                q-icon(name="cloud_upload" @click.stop.prevent)
              template(v-slot:append)
                q-icon.cursor-pointer(name="close" @click.stop.prevent="model = null")
              template(v-slot:hint)

            .row.justify-end
              q-btn(
                no-caps
                @click="openTicket"
                label="Criar ticket" color="negative" icon="how_to_reg"
                :loading="ticketStatus.open.loading" :disable="ticketStatus.open.loading"
              )
                template(v-slot:loading)
                  q-spinner-facebook
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from 'src/stores/auth'
import { useTicketStore } from 'src/stores/ticket'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const Router = useRouter()

    const Auth = useAuthStore()
    const Ticket = useTicketStore()

    const tickets = ref([])
    const ticketForm = ref(null)
    const ticketDialog = ref(false)
    const ticketInput = ref({
      title: '',
      description: '',
      file: ''
    })
    const ticketRules = ref({
      title: [
        value => (value && value.length > 0) || 'Digite um título.'
      ],
      description: [
        value => (value && value.length > 0) || 'Digite uma descrição.'
      ]
    })
    const ticketStatus = ref({
      open: {
        loading: false
      }
    })

    function listTicket () {
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
    }
    function openTicket () {
      const User = Auth.user

      if (User.role === 'Collaborator') {
        Notify.create({
          type: 'negative',
          position: 'center',
          message: 'Colaboradores não podem abrir tickets!'
        })

        return false
      }

      ticketStatus.value.open.loading = true
      ticketForm.value.validate().then(passed => {
        if (passed === false) {
          ticketStatus.value.open.loading = false
          return false
        }

        const formData = new FormData()
        formData.append('title', ticketInput.value.title)
        formData.append('description', ticketInput.value.description)
        if (ticketInput.value.file) {
          formData.append('file', ticketInput.value.file)
        }
        Ticket.open(formData).then(Ticket => {
          // listTicket()

          if (Ticket?.id) {
            ticketStatus.value.open.loading = false
            Router.push('/ticket/' + Ticket.id)
          }
        })
      })

      return true
    }

    listTicket()

    return {
      Auth,
      tickets,

      ticketForm,
      ticketDialog,
      ticketInput,
      ticketRules,
      ticketStatus,

      openTicket
    }
  }
})
</script>
