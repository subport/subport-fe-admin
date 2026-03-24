<template>
  <nav class="the-nav">
    <!-- 메뉴 그룹 -->
    <div class="nav-section">
      <span class="nav-section-label">메뉴</span>
      <ul class="nav-list">
        <li>
          <RouterLink class="nav-item" active-class="active" to="/dashboard">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            대시보드
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="nav-item"
            active-class="active"
            to="/subscriptions"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>

            구독 서비스 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav-item" active-class="active" to="/members">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            회원 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="nav-item"
            active-class="active"
            to="/email-notifications"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            이메일 발송 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/faqs" class="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.5 1-1.5 1.7v.3" />
              <circle
                cx="12"
                cy="17"
                r="1.2"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            FAQ 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/feedbacks" class="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
              />
            </svg>
            피드백 관리
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.the-nav {
  width: 220px;
  min-height: 100vh;
  background: #6fcfc3;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 20px 12px;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

/* ── 로고 ─────────────────────────────────────────── */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-bottom: 28px;
  text-decoration: none;
  border-radius: 10px;
  transition: background-color 0.15s;
}
.nav-logo:hover {
  background: rgba(0, 0, 0, 0.08);
}
.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f1f1e;
  flex-shrink: 0;
}
.logo-text {
  font-size: 17px;
  font-weight: 800;
  color: #0f1f1e;
  letter-spacing: -0.3px;
}

/* ── 섹션 ─────────────────────────────────────────── */
.nav-section {
  flex: 1;
}
.nav-section-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.35);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 0 10px;
  margin-bottom: 6px;
}
.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── 메뉴 아이템 ──────────────────────────────────── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  transition:
    background-color 0.15s,
    color 0.15s;
  cursor: pointer;
}
.nav-item svg {
  stroke: rgba(0, 0, 0, 0.55);
  transition: stroke 0.15s;
}
.nav-item:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #000;
}
.nav-item:hover svg {
  stroke: #000;
}
.nav-item.active {
  background: rgba(0, 0, 0, 0.12);
  color: #000;
  font-weight: 700;
}
.nav-item.active svg {
  stroke: #000;
}
.nav-item.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.nav-item.disabled:hover {
  background: none;
  color: rgba(0, 0, 0, 0.65);
}
.nav-item.disabled:hover svg {
  stroke: rgba(0, 0, 0, 0.55);
}
</style>
