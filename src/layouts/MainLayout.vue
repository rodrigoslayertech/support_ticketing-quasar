<template lang="pug">
q-layout(view="hHh Lpr lFf")
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer")
      q-toolbar-title
        | Support Ticketing System
      div v1.0

  q-drawer(v-model="leftDrawerOpen" show-if-above bordered)
    q-list.rounded-borders.text-primary(bordered padding)
      q-item-label(header) Menu
      q-item(
        clickable
        v-ripple
        :active="true"
        active-class="my-menu-link"
        to="/"
      )
        q-item-section(avatar)
          q-icon(name="data_info_alert")
        q-item-section
          | {{ Auth.user.role === 'Client' ? 'Meus Tickets' : 'Tickets' }}

      q-item(
        clickable
        v-ripple
        @click="logout"
        style="position: absolute; bottom: 0; width: 100%"
      )
        q-item-section(avatar)
          q-icon(name="logout")
        q-item-section
          | Sair

  q-page-container
    router-view
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useQuasar } from 'quasar'

import { useAuthStore } from 'src/stores/auth'

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup () {
    const Router = useRouter()
    const $q = useQuasar()
    const Auth = useAuthStore()
    const leftDrawerOpen = ref(false)

    function logout () {
      Auth.logout().then(status => {
        if (status) {
          $q.notify({
            progress: true,
            type: 'positive',
            message: 'Você saiu com sucesso!'
          })

          Router.go()
        }
      })
    }
    return {
      Auth,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout
    }
  }
})
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: $primary
</style>
