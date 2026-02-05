<template>
  <nav
    class="TheNav d-flex flex-column p-3"
    style="width: 250px; min-height: 100vh"
  >
    <div class="mb-4">
      <h2 class="nav-title">subport</h2>
    </div>

    <ul class="nav flex-column nav-menu">
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" to="/subscriptions">
          구독 서비스 목록
        </RouterLink>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">회원 구독 정보 목록</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">회원 관리</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">통계</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.TheNav {
  background-color: #6fcfc3;
  font-family: 'Pretendard', sans-serif;
  color: #000;
  flex-shrink: 0;
}

.TheNav .nav-title {
  font-weight: 1000;
  letter-spacing: 0.5px;
  color: #000;
}

.TheNav .nav-item {
  margin-bottom: 5px;
}

.TheNav .nav-link {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  color: #000;
  transition: background-color 0.15s ease;
}

.TheNav .nav-link:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
</style>
