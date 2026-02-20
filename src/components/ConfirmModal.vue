<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="confirm-backdrop" @click.self="handleCancel">
        <div class="confirm-modal">
          <div class="confirm-header">
            <span>{{ title }}</span>
          </div>
          <div class="confirm-body">
            <p>{{ message }}</p>
          </div>
          <div class="confirm-footer">
            <button class="btn-confirm" @click="handleConfirm">삭제</button>
            <button class="btn-cancel" @click="handleCancel">취소</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const title = ref('');
const message = ref('');
let resolvePromise: ((value: boolean) => void) | null = null;

function show(msg: string, msgTitle = '확인 요청'): Promise<boolean> {
  message.value = msg;
  title.value = msgTitle;
  visible.value = true;

  return new Promise(resolve => {
    resolvePromise = resolve;
  });
}

function handleConfirm() {
  visible.value = false;
  resolvePromise?.(true);
  resolvePromise = null;
}

function handleCancel() {
  visible.value = false;
  resolvePromise?.(false);
  resolvePromise = null;
}

defineExpose({ show });
</script>

<style scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.confirm-modal {
  background: #22252e;
  border-radius: 14px;
  border: 1px solid #383c50;
  width: 360px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.2s ease;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.confirm-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px 14px;
  font-size: 15px;
  font-weight: 700;
  color: #ff6b6b;
}
.confirm-body {
  padding: 20px;
}
.confirm-body p {
  margin: 0;
  font-size: 13px;
  color: #f0f2f5;
  line-height: 1.5;
  white-space: pre-wrap;
}
.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px 18px;
}
.btn-cancel {
  padding: 8px 18px;
  border-radius: 8px;
  background: #2a2d38;
  border: 1px solid #383c50;
  color: #9aa0b0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-cancel:hover {
  background: #30333f;
  color: #f0f2f5;
}
.btn-confirm {
  padding: 8px 20px;
  border-radius: 8px;
  background: #ff6b6b;
  border: none;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
}
.btn-confirm:hover {
  background: #fa5252;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .confirm-modal,
.modal-leave-to .confirm-modal {
  transform: scale(0.95);
}
</style>
