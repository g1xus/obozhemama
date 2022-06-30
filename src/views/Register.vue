<template>
  <form class="card auth-card" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model="state.email"
        >
        <label for="email">Email</label>
        <small class="helper-text invalid">Email</small>
      </div>
      <div class="input-field">
        <input
          id="name"
          type="text"
          class="validate"
          v-model="state.name"
        >
        <label for="name">Имя</label>
        <small class="helper-text invalid">Name</small>
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          class="validate"
          v-model="state.password.password"
        >
        <label for="password">Пароль</label>
        <small class="helper-text invalid">Password</small>
      </div><div class="input-field">
        <input
          id="confirm"
          type="password"
          class="validate"
          v-model="state.password.confirm"
        >
        <label for="confirm">Подтверждение пароля</label>
        <small class="helper-text invalid">Confirm</small>
      </div>

      <p>
        <label>
          <input type="checkbox" v-model="state.rules"/>
          <span>С правилами согласен</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email, sameAs, minLength, maxLength } from '@vuelidate/validators'
import { reactive, computed } from "vue";

export default {
  setup() {
    const state = reactive({
      email: '',
      name: '',
      password: {
        password: '',
        confirm: ''
      },
      rules: false
    })
    const rules = computed(()=>{
      return {
        email: { required, email },
        name: { required, minLength: minLength(5), maxLength: maxLength(16) },
        password: {
          password: { required, minLength: minLength(8), maxLength: maxLength(16) },
          confirm: { required, sameAs: sameAs(state.password.password) }
        },
        rules: { checked: v => v }
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
          const res = await fetch('http://185.173.39.122:5000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify( {
              email: this.state.email,
              password: this.state.password.password,
              name: this.state.name
            })
          })
          console.log(res)
          alert('Вы зарегестрировались в системе')
          this.$router.push('/login')
        } else {
          alert('Ашибка')
        }
      }
    }
  }
</script>
