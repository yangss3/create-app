<template>
  <div class="bg-teal-600 h-full flex flex-col pt-24vh">
    <!-- logo -->
    <div class="text-white center-box">
      <octicon:mark-github-16 class="text-5xl mr-10px" />
      <octicon:logo-github-16 class="text-8xl" />
    </div>
    <div class="mx-10">
      <van-field
        v-model="form.username"
        :label="t('username')"
        label-width="4.5rem"
      />
      <van-field
        v-model="form.password"
        :label="t('password')"
        label-width="4.5rem"
        type="password"
      />
      <van-button
        block
        round
        class="mt-5"
        @click="login"
      >
        {{ t('login') }}
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { http } from '@/service'
import { useI18n } from '@yangss/vue3-i18n'

const form = reactive({
  username: '',
  password: ''
})

const store = useStore()
const router = useRouter()

async function login () {
  const res = await http.post<{ token: string }>('login')
  store.commit('UPDATE_AUTH', {
    username: form.username,
    token: res.token
  })
  router.replace('/')
}

const { t } = useI18n()
</script>
