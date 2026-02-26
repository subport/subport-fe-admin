<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">페이지를 찾을 수 없어요</h1>
      <p class="error-sub">요청하신 페이지가 존재하지 않거나 이동되었어요</p>
      <RouterLink to="/" class="btn-home">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        홈으로 돌아가기
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  min-height: 100vh;
  background: #1a1c22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.error-code {
  font-size: 96px;
  font-weight: 800;
  color: #6fcfc3;
  letter-spacing: -4px;
  line-height: 1;
  opacity: 0.35;
}

.error-title {
  font-size: 22px;
  font-weight: 700;
  color: #f0f2f5;
  letter-spacing: -0.3px;
  margin: 0;
}

.error-sub {
  font-size: 14px;
  color: #5c6278;
  margin: 0 0 8px;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background-color: #6fcfc3;
  border-radius: 10px;
  color: #0f1115;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 0.15s,
    transform 0.1s;
}
.btn-home:hover {
  background-color: #4ab5a8;
  transform: translateY(-1px);
}
</style>
