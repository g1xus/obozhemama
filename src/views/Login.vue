<template>
  <form @submit.prevent="onSubmit">
    <div>
      <span>Домашняя бухгалтерия</span>
      <div>
        <input
          id="email"
          type="text"
          class="validate"
          v-model="state.email"
        >
        <label for="email">Email</label>
        <small>Email</small>
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          class="validate"
          v-model="state.password"
        >
        <label for="password">Пароль</label>
        <small>Password</small>
      </div>
    </div>
    <div>
      <div>
        <button
          type="submit"
        >
          Войти
          <i>send</i>
        </button>
      </div>

      <p>
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email} from '@vuelidate/validators'
import { reactive, computed } from "vue";

export default {
  setup() {
    const state = reactive({
      email: '',
      password: '',

    })
    const rules = computed(()=>{
      return {
        email: { required, email },
        password: { required }
      }
    })
    const v$ = useVuelidate(rules, state)
    return{
      state,v$
    }
  },

  methods: {
    async onSubmit() {
      this.v$.$validate()
      if(!this.v$.$error) {
        const res = await fetch('http://109.107.187.195:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify( {
            email: this.state.email,
            password: this.state.password
          })
        })
        const {refreshToken, jwtRefreshLife} = await res.json()
        document.cookie = `token=${refreshToken};max-age=${jwtRefreshLife};path=/;`
        this.$router.push('/')
      } else {
        alert('Ашибка')
      }
    },

  }
}
</script>

