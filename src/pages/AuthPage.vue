<template lang="pug">
q-page#login.bg-grey-10.row.justify-center.items-center
  q-form.shadow-3(greedy no-error-focus ref="login" @submit="login")
    q-card.bg-grey-3
      q-item-section.app-logo(avatar)
        img(src="logo/support_ticketing.128x128.png" width="100" height="100")

      q-item-section.app-name
        div
          span.app-name-primary Support Ticketing
          span.app-name-secondary  System
        q-separator(spaced)

      q-item-section.q-gutter-y-sm
        q-input.i-input(
          v-model="inputs.login.email"
          dense square outlined autofocus
          type="text" autocomplete="username" placeholder="Digite seu e-mail"
          lazy-rules :rules="rules.login.email"
          :error="errors.login.email.state" :error-message="errors.login.email.message"
          @update:model-value="validate('login.email', $event)"
        )
          template(v-slot:prepend)
            q-icon(name="email")
        q-input.i-input(
          v-model="inputs.login.password"
          dense square outlined
          :type="states.login.reveal ? 'text' : 'password'" autocomplete="current-password" placeholder="Digite sua senha"
          lazy-rules :rules="rules.login.password"
        )
          template(v-slot:prepend)
            q-icon(name="lock")
          template(v-slot:append v-if="inputs.login.password")
            q-icon.cursor-pointer(:name="states.login.reveal ? 'visibility' : 'visibility_off'" @click="states.login.reveal = !states.login.reveal")

      q-card-actions.justify-center.items-center.q-gutter-y-md
        q-btn.full-width(
          no-caps
          color="negative" label="Registrar-se" icon="how_to_reg"
          @click="registration = true"
        )
        q-btn.full-width(
          no-caps
          type="submit" color="primary" label="Login" icon="login"
          :loading="states.login.loading" :disable="states.login.loading"
        )
          template(v-slot:loading)
            q-spinner-facebook

  q-dialog(v-model="registration" persistent)
    q-card.shadow-1(style="max-width: 350px")
      q-card-section.row.items-center.bg-grey-3
        .text-h5
          | Registre sua conta
          .text-subtitle1 Crie ou redefina sua senha
        q-space
        q-btn(icon="close" flat dense v-close-popup)
      q-separator
      q-card-section.scroll(style="max-height: 60vh")
        q-form.q-gutter-md(@submit.prevent.stop="register" ref="register")
          q-input.i-input(
            dense square outlined clearable
            type="text" maxlength="100" label="Digite o email"
            v-model="inputs.register.email"
            :rules="rules.register.email"
            :error="errors.register.email.state" :error-message="errors.register.email.message"
            @update:model-value="validate('register.email', $event)"
          )
            template(v-slot:prepend)
              q-icon(name="email")
          q-input.i-input(
            dense square outlined
            :type="states.register.password.reveal ? 'text' : 'password'" autocomplete="new-password" maxlength="64" label="Digite a senha nova"
            v-model="inputs.register.password"
            :rules="rules.register.password"
            :error="errors.register.password.state" :error-message="errors.register.password.message"
            @update:model-value="validate('register.password', $event)"
          )
            template(v-slot:hint)
              div(v-if="inputs.register.password") Força da senha: {{ meta.register.password.strength.label }}
              password-meter(:strength="meta.register.password.strength.level")
            template(v-slot:append v-if="inputs.register.password")
              q-icon.cursor-pointer(:name="states.register.password.reveal ? 'visibility' : 'visibility_off'" @click="states.register.password.reveal = !states.register.password.reveal")
            template(v-slot:prepend)
              q-icon(name="lock")
          q-separator(v-show="!states.register.validation.hidden")
          q-input.i-input(v-show="!states.register.validation.hidden"
            dense square outlined clearable
            type="text" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="off" maxlength="30" label="Digite o código validador"
            :disable="states.register.validation.hidden"
            v-model="inputs.register.validation"
            :rules="rules.register.validation" :error="errors.register.validation.state" :error-message="errors.register.validation.message"
            @update:model-value="validate('register.validation', $event)"
          )
            template(v-slot:prepend)
              q-icon(name="vpn_key")
          q-separator
          q-toggle(v-model="inputs.register.accept" label="Ao clicar em Criar, você concorda com nossos Termos, Política de Dados e Política de Cookies.")
      q-card-actions.bg-grey-3(align="right")
        q-btn(
          no-caps
          @click="register" label="Criar senha" color="negative" icon="how_to_reg"
          :loading="states.register.loading" :disable="states.register.loading"
        )
          template(v-slot:loading)
            q-spinner-facebook
</template>

<script>
import * as Emails from '../lib/utils/emails.ts'
import * as Passwords from '../lib/utils/passwords.ts'
import * as Codes from '../lib/utils/codes.ts'

import PasswordMeter from '../lib/components/PasswordMeter.vue'

import { useAuthStore } from 'stores/auth'

export default {
  name: 'AuthPage',
  components: {
    PasswordMeter
  },

  data () {
    return {
      // Auth
      Auth: useAuthStore(),

      // Register
      Emails,
      Passwords,
      Codes,

      registration: false,

      inputs: {
        login: {
          email: '',
          password: '',
          persistent: true
        },
        register: {
          email: '',
          password: '',
          validation: '',
          accept: false
        }
      },
      rules: {
        login: {
          email: [
            async (value) => await Emails.validate(value) || Emails.error.alert()
          ],
          password: [
            value => (value && value.length > 0) || 'Digite sua senha.'
          ]
        },
        register: {
          email: [
            async (value) => await Emails.validate(value) || Emails.error.alert()
          ],
          password: [
            async (value) => await Passwords.validate(value) || Passwords.error.alert()
          ],
          validation: [
            async value => await Codes.validate(value) || Codes.error.alert()
          ]
        }
      },
      errors: {
        _: { state: false, message: '' },
        login: {
          email: { state: false, code: 0, message: '' }
        },
        register: {
          email: { state: false, code: 0, message: '' },
          password: { state: false, code: 0, message: '' },
          validation: { state: false, code: 0, message: '' }
        }
      },
      states: {
        login: {
          loading: false,
          reveal: false
        },
        register: {
          loading: false,
          password: {
            reveal: false
          },
          validation: {
            hidden: false
          }
        }
      },

      meta: {
        register: {
          password: {
            strength: {
              level: null,
              label: ''
            }
          }
        }
      },
      icons: {
        input2: 'email'
      },
      intervals: {
        input2: null
      }
    }
  },

  mounted () {
    if (this.$route.query.email !== undefined) {
      const email = this.$route.query.email
      Emails.validate(email).then((passed) => {
        if (passed) {
          this.inputs.login.email = email
          this.inputs.register.email = email
        }
      })
    }

    if (this.$route.query.validation_code !== undefined) {
      const validationCode = this.$route.query.validation_code
      Codes.validate(validationCode).then((passed) => {
        if (passed) {
          this.inputs.register.validation = validationCode
          this.states.register.validation.hidden = true
          this.registration = true
        }
      })
    }
  },

  methods: {
    reset () {
      if (!this.inputs.register.validation) this.errors.register.validation = this.errors._
    },
    validate (input, value) {
      switch (input) {
        case 'login.email': {
          this.errors.login.email.state = false
          this.errors.login.email.message = ''
          Emails.sanitize(value).then(email => {
            this.inputs.login.email = email
          }); break
        }
        case 'register.email': {
          this.errors.register.email.state = false
          this.errors.register.email.message = ''
          if (this.errors.register.validation.state && this.errors.register.validation.code === 1) {
            this.errors.register.validation = {
              state: false,
              message: ''
            }
          }
          Emails.sanitize(value).then(email => {
            this.inputs.register.email = email
          }); break
        }
        case 'register.password': {
          Passwords.validate(value).then(passed => {
            if (passed) {
              this.errors.register.password.state = false
              this.errors.register.password.message = ''
              this.meta.register.password.strength = Passwords.meta.strength
            } else {
              this.errors.register.password = {
                state: true,
                message: Passwords.error.alert()
              }
            }
          }); break
        }
        case 'register.validation': {
          this.errors.register.validation.state = false
          this.errors.register.validation.message = ''
          Codes.sanitize(value).then(code => {
            this.inputs.register.validation = code
            // this.$refs.register1.validate()
          }); break
        }
      }
    },
    login: async function () {
      if (!await this.$refs.login.validate()) {
        return false
      }

      this.states.login.loading = true

      setTimeout(() => {
        if (this.states.login.loading === true) {
          this.$q.notify({
            progress: true,
            type: 'warning',
            timeout: 3000,
            message: 'Tempo limite de login atingido! Tente novamente...'
          })

          setTimeout(() => {
            this.states.login.loading = false
          }, 4000)
        }
      }, 8000)

      await this.Auth.login(this.inputs.login)
        .then((response) => {
          if (response === true) {
            this.$q.notify({
              type: 'positive',
              message: 'Login realizado com sucesso!'
            })
            this.states.login.loading = false
            if (this.$route.query.redirect === undefined) {
              this.$router.push({ name: 'shop0' })
            } else {
              this.$router.go()
            }
          } else {
            switch (response.code) {
              // No has response
              case -2: // No connection or blocked request
                this.$q.notify({
                  type: 'negative',
                  timeout: 7000,
                  message: 'Não há resposta de dados de login! A solicitação foi bloqueada, o servidor está offline ou não há acesso à Internet!'
                }); break
              case -1: // No response
                this.$q.notify({
                  type: 'negative',
                  message: 'Não há dados na resposta da solicitação! Tente novamente!'
                }); break
              case 0: // No data response
                this.$q.notify({
                  type: 'negative',
                  message: 'Não há nenhum dado de resposta na sua solicitação! Algum problema interno ocorreu!'
                }); break
              // Has Response
              case 1: // Input data incorrect
                this.$q.notify({
                  type: 'negative',
                  message: 'Algum erro ocorreu ao receber os dados de login! Tente novamente mais tarde!'
                }); break
              case 2: // User inexistent or user duplicated
                this.$q.notify({
                  type: 'negative',
                  message: 'Dados de usuário insuficiente! Entre em contato com o suporte para criar sua senha!'
                }); break
              case 3: // User without data or credentials incorrect
                this.$q.notify({
                  type: 'negative',
                  message: 'Erro ao validar seu login! Confira suas credenciais!'
                }); break
              default:
                this.$q.notify({
                  type: 'negative',
                  message: 'Algum erro desconhecido ocorreu!',
                  timeout: 10000
                })
            }
            this.states.login.loading = false
          }
        })
    },
    register: async function () {
      this.$refs.register.validate().then(passed => {
        if (passed) {
          if (this.inputs.register.accept !== true) {
            this.$q.notify({
              color: 'negative',
              message: 'Você precisa concordar com os Termos, Política de Dados e Política de Cookies!',
              position: 'center'
            })
          } else {
            this.states.register.loading = true
            // Send input data
            this.Auth.register(this.inputs.register).then(response => {
              if (response.data && response.data.result) {
                this.registration = false
                this.$q.dialog({
                  icon: 'done',
                  title: '<div class="text-positive">Senha definida com sucesso!</div>',
                  message: 'Faça login com seu e-mail e senha!',
                  cancel: false
                })
                this.inputs.login.email = this.inputs.register.email
                this.inputs.register.email = ''
                this.inputs.register.password = ''
                this.inputs.register.validation = ''
              } else if (response.data.exception && response.data.exception.error) {
                switch (response.data.exception.error.code) {
                  case 1:
                    if (this.states.register.validation.hidden) {
                      this.errors.register.email = {
                        state: true,
                        code: 1,
                        message: 'E-mail incorreto ou inexistente! Utilize o mesmo e-mail da sua primeira compra!'
                      }
                    } else {
                      this.errors.register.validation = {
                        state: true,
                        code: 1,
                        message: 'Código de validação inválido ou e-mail incorreto!'
                      }
                    }
                    break
                  default:
                    this.errors.register.validation = {
                      state: true,
                      message: 'Impossível verificar código no momento!'
                    }
                }
              } else {
                this.$q.dialog({
                  title: '<div class="text-negative">Erro!</div>',
                  message: 'Algum erro desconhecido ocorreu! Tente novamente!',
                  html: true,
                  cancel: false
                })
              }
            })
            this.states.register.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="sass">
#login
  input
    background-position: 98% 56% !important
  form
    overflow: visible
    min-width: 330px
    max-width: 330px
  form .q-card
    padding: 15px 15px

  .app-logo
    margin: -65px 0 0 0
    padding: 0
    align-items: center
  .app-name
    margin: 15px 0 20px 0
    padding: 0
    text-align: center
    font-weight: bold
    .app-name-primary
      color: $primary
    .app-name-secondary
      color: $secondary

.separator-with-text
  position: relative
  .separator-text
    position: absolute
    top: -10px
    left: calc(50% - 20px)
    background-color: #eeeeee
    padding: 0 10px 0 10px
</style>
