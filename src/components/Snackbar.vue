<template>
  <Teleport to="body">
    <Transition name="snackbar">
      <div v-if="visible" class="snackbar" :class="type">
        <svg
          v-if="type === 'success'"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else-if="type === 'error'"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg
          v-else
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span class="snackbar-message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref<'success' | 'error' | 'info'>('info');

let timer: ReturnType<typeof setTimeout> | null = null;

function show(
  msg: string,
  msgType: 'success' | 'error' | 'info' = 'info',
  duration = 3000,
) {
  if (timer) clearTimeout(timer);

  message.value = msg;
  type.value = msgType;
  visible.value = true;

  timer = setTimeout(() => {
    visible.value = false;
  }, duration);
}

function hide() {
  if (timer) clearTimeout(timer);
  visible.value = false;
}

defineExpose({ show, hide });
</script>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #22252e;
  border: 1px solid #383c50;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}
.snackbar.success {
  border-color: #69db7c;
}
.snackbar.success svg {
  color: #69db7c;
}
.snackbar.error {
  border-color: #ff6b6b;
}
.snackbar.error svg {
  color: #ff6b6b;
}
.snackbar.info svg {
  color: #74c0fc;
}
.snackbar-message {
  font-size: 13px;
  font-weight: 500;
  color: #f0f2f5;
}

.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.25s ease;
}
.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}
</style>
