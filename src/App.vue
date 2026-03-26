<template>
  <div v-if="isAuthPage" class="auth-layout">
    <TheView />
  </div>

  <div v-else class="app-layout">
    <TheHeader @toggle-nav="toggleMobileNav" />
    <div class="body-area">
      <TheNav
        :class="{ 'mobile-open': mobileNavOpen }"
        @click="closeMobileNav"
      />
      <!-- 모바일 오버레이 -->
      <div
        v-if="mobileNavOpen"
        class="mobile-nav-overlay"
        @click="closeMobileNav"
      />
      <div class="content-area">
        <TheView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from './layouts/TheHeader.vue';
import TheNav from './layouts/TheNav.vue';
import TheView from './layouts/TheView.vue';

const route = useRoute();

const isAuthPage = computed(() => route.meta?.layout === 'auth');

const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}

function closeMobileNav() {
  mobileNavOpen.value = false;
}
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

/* ── 모바일 네비게이션 ─────────────────────────────── */
.mobile-nav-overlay {
  display: none;
}

@media (max-width: 768px) {
  .the-nav {
    position: fixed;
    left: -260px;
    top: 75px;
    bottom: 0;
    width: 260px;
    z-index: 99;
    transition: left 0.25s ease;
  }

  .the-nav.mobile-open {
    left: 0;
  }

  .mobile-nav-overlay {
    display: block;
    position: fixed;
    inset: 0;
    top: 75px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 98;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
