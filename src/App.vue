<template>
  <div v-if="isAuthPage" class="auth-layout">
    <TheView />
  </div>

  <div v-else class="app-layout">
    <TheHeader />
    <!-- 헤더를 최상단으로 -->
    <div class="body-area">
      <TheNav />
      <div class="content-area">
        <TheView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from './layouts/TheHeader.vue';
import TheNav from './layouts/TheNav.vue';
import TheView from './layouts/TheView.vue';

const route = useRoute();

// route meta에 { layout: 'auth' } 가 있으면 네브/헤더 숨김
const isAuthPage = computed(() => route.meta?.layout === 'auth');
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.auth-layout {
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column; /* 헤더 위, 바디 아래 */
  min-height: 100vh;
}

.body-area {
  flex: 1;
  display: flex; /* 네브 왼쪽, 콘텐츠 오른쪽 */
  min-height: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: #1a1c22;
}
</style>
