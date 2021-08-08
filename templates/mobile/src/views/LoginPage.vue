<template>
  <div class="bg-blue-500 h-full flex flex-col pt-24vh">
    <!-- logo -->
    <h1 class="text-white text-32px mb-24px mx-auto">
      {{ $t('welcome') }}
    </h1>
    <div class="mx-40px space-y-24px">
      <van-cell-group>
        <van-field
          v-model="form.username"
          :label="$t('username')"
        />
        <van-field
          v-model="form.password"
          :label="$t('password')"
          type="password"
        />
      </van-cell-group>
      <van-button
        block
        round
        @click="login"
      >
        {{ $t('login') }}
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const form = reactive({
  username: '',
  password: ''
})

const router = useRouter()

async function login () {
  router.replace('/')
}
</script>
