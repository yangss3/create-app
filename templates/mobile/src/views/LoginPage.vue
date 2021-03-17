<template>
  <div class="bg-gray-600 h-full flex flex-col pt-24vh">
    <!-- logo -->
    <div class="text-white center-box">
      <octicon:mark-github-16 class="text-5xl mr-10px"/>
      <octicon:logo-github-16 class="text-8xl"/>
    </div>
    <div class="mx-10">
      <van-field 
        v-model="form.username"
        :label="$t('username')" 
        label-width="4.5rem"
        class="bg-gray-400"
      />
      <van-field 
        v-model="form.password"
        :label="$t('password')"
        label-width="4.5rem"
        type="password" 
        class="bg-gray-400"
      />
      <van-button 
        block 
        round 
        type="primary" 
        class="mt-5"
        @click="login"
      >
        {{$t('login')}}
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { defineComponent, reactive } from 'vue'
import { http } from '@/service'
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
      const res = await http.post<{ token: string }>('login')
      store.commit('UPDATE_AUTH', {
        username: form.username,
        token: res.token
      })
      router.replace('/')
    }

    return {
      form,
      login
    }
  }

})
</script>