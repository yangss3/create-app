<template>
  <div class="h-full flex">
    <div class="w-2/5 bg-gradient-to-br from-green-400 to-green-100"></div>
    <div class="w-3/5 flex justify-center items-center bg-gray-100">
      <div class="w-4/5 xl:w-1/2 p-10 shadow-lg rounded-md bg-white">
        <h1 class="text-center font-mono text-4xl mb-10">
          {{ $t('welcome') }}
        </h1>
        <a-form class="mx-6">
          <a-form-item>
            <a-input
              v-model:value="form.username"
              size="large"
              :placeholder="$t('username')"
            >
              <template #prefix><uil:user /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password
              v-model:value="form.password"
              size="large"
              :placeholder="$t('password')"
            >
              <template #prefix><ri:lock-password-line /></template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button block type="primary" size="large" @click="login">
              {{ $t('login') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { http } from '@/service'
import { useStore } from '@/store'
import { Auth } from '@/utils/types'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const form = reactive({
      username: '',
      password: ''
    })

    const store = useStore()
    const router = useRouter()
    async function login() {
      const res = await http.post<Auth>('login', form)
      store.commit('UPDATE_AUTH', { token: res.token, username: form.username })
      router.replace('/')
    }

    return {
      form,
      login
    }
  }
})
</script>
