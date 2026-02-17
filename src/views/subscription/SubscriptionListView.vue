<template>
  <div class="page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">구독 서비스 관리</h1>
        <span class="page-sub">제공 중인 구독 서비스를 관리해요</span>
      </div>
      <button class="btn-add" @click="startSaveSubscription">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        구독 서비스 추가
      </button>
    </div>

    <!-- 필터 바 -->
    <div class="filter-bar">
      <!-- 타입 필터 -->
      <div class="filter-group">
        <label class="filter-label">타입</label>
        <div class="select-wrap">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="select-icon"
          >
            <path
              d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
            />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <select v-model="selectedType" class="custom-select">
            <option value="">전체 타입</option>
            <option
              v-for="type in SUBSCRIPTION_TYPES"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- 정렬 -->
      <div class="filter-group">
        <label class="filter-label">정렬</label>
        <div class="status-tabs">
          <button
            v-for="tab in sortTabs"
            :key="tab.value"
            class="status-tab"
            :class="{ active: sort === tab.value }"
            @click="onSortChange(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 검색 -->
      <div class="filter-group search-group">
        <label class="filter-label">이름 검색</label>
        <div class="search-wrap">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchedName"
            type="text"
            class="search-input"
            placeholder="이름으로 검색"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">검색</button>
        </div>
      </div>

      <!-- 초기화 -->
      <button class="reset-btn" @click="resetFilters">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-4.63" />
        </svg>
        초기화
      </button>
    </div>

    <!-- 결과 요약 -->
    <div class="result-summary">
      <span class="result-count"
        >총 <strong>{{ totalElements }}</strong
        >건</span
      >
    </div>

    <!-- 테이블 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-type">타입</th>
            <th class="col-logo">로고</th>
            <th class="col-name">이름</th>
            <th class="col-url">플랜 페이지</th>
            <th class="col-date">등록일</th>
            <th class="col-date">최근 수정일</th>
            <th class="col-action">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="subscriptions.length === 0">
            <td colspan="8" class="empty-cell">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>조회된 구독 서비스가 없어요</span>
            </td>
          </tr>
          <tr
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="data-row"
          >
            <td class="col-id">{{ subscription.id }}</td>
            <td class="col-type">
              <span class="type-badge">{{ subscription.type }}</span>
            </td>
            <td class="col-logo">
              <img
                :src="subscription.logoImageUrl"
                alt="logo"
                class="logo-img"
              />
            </td>
            <td class="col-name" :title="subscription.name">
              {{ subscription.name }}
            </td>
            <td class="col-url">
              <a
                v-if="subscription.planUrl"
                :href="subscription.planUrl"
                target="_blank"
                class="plan-link"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                링크
              </a>
              <span v-else class="no-data">-</span>
            </td>
            <td class="col-date">{{ subscription.createdAt }}</td>
            <td class="col-date">{{ subscription.lastModifiedAt }}</td>
            <td class="col-action">
              <button
                class="btn-detail"
                @click="goSubscriptionDetail(subscription.id)"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <template v-for="p in pageNumbers" :key="p">
        <button v-if="p === '...'" class="page-btn ellipsis">···</button>
        <button
          v-else
          class="page-btn"
          :class="{ active: currentPage === p }"
          @click="goToPage(p as number)"
        >
          {{ p }}
        </button>
      </template>
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <!-- 구독 추가 모달 -->
    <div
      v-if="isAddingSubscription"
      class="modal-backdrop"
      @click.self="isAddingSubscription = false"
      @keydown.esc="close"
      tabindex="-1"
    >
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>구독 서비스 추가</span>
          </div>
          <button class="modal-close" @click="close">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- 로고 업로드 -->
          <div class="logo-upload-wrap">
            <div class="logo-upload-box" @click="logoInput?.click()">
              <template v-if="!logoPreviewUrl">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <span class="logo-upload-hint">로고 업로드</span>
              </template>
              <img
                v-else
                :src="logoPreviewUrl"
                alt="logo preview"
                class="logo-preview-img"
              />
            </div>
            <input
              ref="logoInput"
              type="file"
              class="hidden-input"
              accept="image/*"
              @change="changeLogo"
            />
          </div>

          <!-- 폼 필드 -->
          <div class="form-field">
            <label class="form-label"
              >서비스명 <span class="required">*</span></label
            >
            <input
              type="text"
              class="form-input"
              placeholder="서비스명을 입력하세요"
              v-model="subscriptionRegisterForm.name"
            />
          </div>

          <div class="form-field">
            <label class="form-label"
              >타입 <span class="required">*</span></label
            >
            <div class="select-wrap full">
              <select
                class="custom-select full"
                v-model="subscriptionRegisterForm.type"
              >
                <option value="">선택</option>
                <option
                  v-for="type in SUBSCRIPTION_TYPES"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label class="form-label">플랜 페이지 URL</label>
            <input
              type="url"
              class="form-input"
              placeholder="https://example.com/pricing"
              v-model="subscriptionRegisterForm.planUrl"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-save" @click="saveSubscription">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            저장
          </button>
          <button class="btn-modal-cancel" @click="cancelSaveSubscription">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSubscriptions, registerSubscription } from '@/api/subscriptions';
import {
  SUBSCRIPTION_TYPES,
  type GetSubscriptionsParams,
  type RegisterSubscriptionRequest,
  type Subscription,
  type SubscriptionsResponse,
} from '@/api/types';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const subscriptionRegisterForm = ref({
  name: '',
  type: '',
  planUrl: '',
  logoImageUrl: '',
});
const subscriptions = ref<Subscription[]>([]);
const selectedLogoFile = ref<File | null>(null);
const logoPreviewUrl = ref<string | null>(null);
const logoInput = ref<HTMLInputElement | null>(null);
const isAddingSubscription = ref(false);

const SORT_MAP: Record<string, string> = {
  '': 'id,asc',
  recent: 'createdAt,desc',
  updated: 'lastModifiedAt,desc',
  name: 'name,asc',
};

const sortTabs = [
  { label: '기본', value: '' },
  { label: '최근 등록순', value: 'recent' },
  { label: '최근 수정순', value: 'updated' },
  { label: '이름순', value: 'name' },
] as const;

const selectedType = ref('');
const sort = ref('');
const searchedName = ref('');
const appliedName = ref('');
const currentPage = ref(1);
const totalElements = ref(0);
const totalPages = ref(0);

const fetchSubscriptions = async () => {
  const params: GetSubscriptionsParams = {
    page: currentPage.value - 1,
    size: 10,
  };
  if (selectedType.value) params.type = selectedType.value;
  if (sort.value) params.sort = SORT_MAP[sort.value];
  if (appliedName.value) params.name = appliedName.value;

  const response = await getSubscriptions(params);
  const data = response.data as SubscriptionsResponse;

  subscriptions.value = data.subscriptions;
  currentPage.value = data.currentPage;
  totalElements.value = data.totalElements;
  totalPages.value = data.totalPages;
};

const startSaveSubscription = () => {
  isAddingSubscription.value = true;
  subscriptionRegisterForm.value = {
    name: '',
    type: '',
    logoImageUrl: '',
    planUrl: '',
  };
};

const changeLogo = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null;
  selectedLogoFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      logoPreviewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    logoPreviewUrl.value = null;
  }
};

const saveSubscription = async () => {
  if (subscriptionRegisterForm.value.name.length > 10) {
    alert('이름은 최대 10자까지 가능합니다.');
    return;
  }
  try {
    const formData: RegisterSubscriptionRequest = {
      name: subscriptionRegisterForm.value.name,
      type: subscriptionRegisterForm.value.type,
      planUrl: subscriptionRegisterForm.value.planUrl || undefined,
      image: selectedLogoFile.value || undefined,
    };
    await registerSubscription(formData);
    alert('구독 서비스가 등록되었습니다.');
    isAddingSubscription.value = false;
    await fetchSubscriptions();
  } catch (error) {
    console.error('구독 서비스 등록 실패:', error);
    alert('등록에 실패했습니다.');
  }
};

const cancelSaveSubscription = () => {
  isAddingSubscription.value = false;
  subscriptionRegisterForm.value = {
    name: '',
    type: '',
    logoImageUrl: '',
    planUrl: '',
  };
};

const close = () => {
  isAddingSubscription.value = false;
};

const goSubscriptionDetail = (id: number) => {
  router.push(`/subscriptions/${id}`);
};

const onSortChange = (value: string) => {
  sort.value = value;
  currentPage.value = 1;
  router.replace({
    query: {
      ...(currentPage.value > 1 ? { page: String(currentPage.value) } : {}),
      type: selectedType.value || undefined,
      sort: sort.value || undefined,
      name: appliedName.value || undefined,
    },
  });
};

const resetFilters = () => {
  selectedType.value = '';
  sort.value = '';
  searchedName.value = '';
  appliedName.value = '';
  currentPage.value = 1;
  router.replace({
    query: {},
  });
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const handleSearch = () => {
  appliedName.value = searchedName.value;
  router.replace({
    query: {
      ...(currentPage.value > 1 ? { page: String(currentPage.value) } : {}),
      type: selectedType.value || undefined,
      sort: sort.value || undefined,
      name: appliedName.value || undefined,
    },
  });
};

watch([currentPage, selectedType, sort], () => {
  router.replace({
    query: {
      ...(currentPage.value > 1 ? { page: String(currentPage.value) } : {}),
      type: selectedType.value || undefined,
      sort: sort.value || undefined,
      name: appliedName.value || undefined,
    },
  });
});

watch(
  () => route.query,
  query => {
    currentPage.value = query.page ? Number(query.page) : 1;
    selectedType.value = (query.type as string) || '';
    sort.value = (query.sort as string) || '';
    appliedName.value = (query.name as string) || '';
    searchedName.value = appliedName.value;
    fetchSubscriptions();
  },
  { immediate: true },
);

onMounted(() => {
  fetchSubscriptions();
});

// ── 페이지 번호 계산 ──────────────────────────────
const pageNumbers = computed<(number | string)[]>(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (cur > 3) pages.push('...');
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++)
    pages.push(p);
  if (cur < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});
</script>

<style scoped>
/* ── 기본 ────────────────────────────────────────── */
.page {
  --bg-base: #1a1c22;
  --bg-surface: #22252e;
  --bg-raised: #2a2d38;
  --bg-hover: #30333f;
  --mint: #6fcfc3;
  --mint-dim: #4ab5a8;
  --mint-glow: rgba(111, 207, 195, 0.12);
  --text-primary: #f0f2f5;
  --text-secondary: #9aa0b0;
  --text-muted: #5c6278;
  --border: #2e3140;
  --border-mid: #383c50;

  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  background: var(--bg-base);
  min-height: 100vh;
  padding: 28px 32px 48px;
  color: var(--text-primary);
  box-sizing: border-box;
}

/* ── 헤더 ────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
}
.page-sub {
  font-size: 13px;
  color: var(--text-muted);
}
.btn-add {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 9px;
  background: var(--mint);
  border: none;
  color: #0f1115;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition:
    background-color 0.15s,
    transform 0.1s;
}
.btn-add:hover {
  background: var(--mint-dim);
  transform: translateY(-1px);
}

/* ── 필터 바 ─────────────────────────────────────── */
.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 18px 20px;
  margin-bottom: 25px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.3px;
}
.search-group {
  flex: 1;
  min-width: 200px;
}

/* 셀렉트 */
.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.select-icon {
  position: absolute;
  left: 10px;
  color: var(--text-muted);
  pointer-events: none;
}
.custom-select {
  appearance: none;
  padding: 7px 32px 7px 30px;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: 7px;
  color: var(--text-primary);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  height: 32px;
  box-sizing: border-box;
}
.custom-select:hover {
  background: var(--bg-hover);
}
.custom-select:focus {
  outline: none;
  border-color: var(--mint);
}
.custom-select option {
  background: var(--bg-raised);
}

/* 정렬 탭 */
.status-tabs {
  display: flex;
  gap: 4px;
}
.status-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 7px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
  height: 32px;
  box-sizing: border-box;
}
.status-tab:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.status-tab.active {
  background: var(--mint);
  color: #0f1115;
  border-color: var(--mint);
  font-weight: 700;
}

/* 검색 */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0 90px 0 32px;
  border-radius: 8px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  box-sizing: border-box;
  height: 32px;
}
.search-input::placeholder {
  color: var(--text-muted);
}
.search-input:focus {
  outline: none;
  border-color: var(--mint);
}
.search-btn {
  position: absolute;
  right: 4px;
  padding: 5px 12px;
  border-radius: 6px;
  background: var(--mint);
  border: none;
  color: #0f1115;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-btn:hover {
  background: var(--mint-dim);
}

/* 초기화 버튼 */
.reset-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 7px;
  border: 1px solid var(--border-mid);
  background: var(--bg-raised);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  align-self: flex-end;
  height: 32px;
  box-sizing: border-box;
}
.reset-btn:hover {
  background: rgba(250, 82, 82, 0.1);
  color: #ff6b6b;
  border-color: rgba(250, 82, 82, 0.3);
}

/* ── 결과 요약 ───────────────────────────────────── */
.result-summary {
  margin-bottom: 13px;
}
.result-count {
  font-size: 13px;
  color: var(--text-secondary);
}
.result-count strong {
  color: var(--text-primary);
  font-weight: 700;
}

/* 모달 안 셀렉트: 아이콘 없으므로 좌측 패딩을 일반 인풋과 동일하게 */
.select-wrap.full {
  display: block;
  width: 100%;
}
.select-wrap.full .custom-select {
  padding-left: 12px;
  width: 100%;
  box-sizing: border-box;
}
.full {
  width: 100%;
  box-sizing: border-box;
}

/* ── 테이블 ──────────────────────────────────────── */
.table-wrap {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 20px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table thead tr {
  background: var(--bg-raised);
  border-bottom: 1px solid var(--border-mid);
}
.data-table th {
  padding: 11px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.4px;
  text-align: center;
}

.data-row {
  border-bottom: 1px solid var(--border);
  transition: background-color 0.15s;
}
.data-row:last-child {
  border-bottom: none;
}
.data-row:hover {
  background: var(--bg-hover);
}
.data-table td {
  padding: 13px 14px;
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  vertical-align: middle;
}

.empty-cell {
  text-align: center !important;
  padding: 52px 0 !important;
  color: var(--text-muted);
}
.empty-cell svg {
  opacity: 0.25;
  margin-bottom: 10px;
  display: block;
  margin-inline: auto;
}
.empty-cell span {
  font-size: 14px;
  display: block;
}

/* 컬럼 너비 */
.col-id {
  width: 60px;
  color: var(--text-muted) !important;
  font-size: 12px !important;
}
.col-type {
  width: 130px;
}
.col-logo {
  width: 90px;
}
.col-name {
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.col-url {
  width: 90px;
}
.col-date {
  width: 110px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-action {
  width: 120px;
  padding-left: 8px !important;
  padding-right: 16px !important;
}

/* 타입 배지 */
.type-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--mint);
  background: var(--mint-glow);
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid rgba(111, 207, 195, 0.2);
  white-space: nowrap;
  display: inline-block;
}

/* 로고 이미지 */
.logo-img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
}

/* 플랜 링크 */
.plan-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--mint);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}
.plan-link:hover {
  color: var(--mint-dim);
  text-decoration: underline;
}
.no-data {
  color: var(--text-muted);
}

/* 상세보기 버튼 */
.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 7px;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-detail:hover {
  background: var(--mint-glow);
  border-color: var(--mint);
  color: var(--mint);
}

/* ── 페이지네이션 ─────────────────────────────────── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid var(--border-mid);
  background: var(--bg-surface);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled):not(.ellipsis) {
  background: var(--bg-raised);
  color: var(--text-primary);
}
.page-btn.active {
  background: var(--mint);
  color: #0f1115;
  border-color: var(--mint);
  font-weight: 700;
}
.page-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.page-btn.ellipsis {
  border: none;
  background: none;
  cursor: default;
  color: var(--text-muted);
}

/* ── 모달 ────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.modal-box {
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid var(--border-mid);
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.2s ease;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 16px;
  border-bottom: 1px solid var(--border);
}
.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--mint);
}
.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
}
.modal-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 로고 업로드 */
.logo-upload-wrap {
  display: flex;
  justify-content: center;
}
.logo-upload-box {
  width: 110px;
  height: 110px;
  border-radius: 12px;
  border: 2px dashed var(--border-mid);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-muted);
  transition:
    border-color 0.15s,
    background-color 0.15s;
  overflow: hidden;
}
.logo-upload-box:hover {
  border-color: var(--mint);
  background: var(--mint-glow);
  color: var(--mint);
}
.logo-upload-hint {
  font-size: 11px;
  font-weight: 500;
}
.logo-preview-img {
  width: 110px;
  height: 110px;
  object-fit: cover;
}
.hidden-input {
  display: none;
}

/* 폼 */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}
.required {
  color: #ff6b6b;
}
.form-input {
  padding: 9px 12px;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  transition: border-color 0.15s;
}
.form-input:focus {
  outline: none;
  border-color: var(--mint);
}
.form-input::placeholder {
  color: var(--text-muted);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 22px 20px;
  border-top: 1px solid var(--border);
}
.btn-modal-cancel {
  padding: 8px 18px;
  border-radius: 8px;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-modal-cancel:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.btn-modal-save {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 8px;
  background: var(--mint);
  border: none;
  color: #0f1115;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
}
.btn-modal-save:hover {
  background: var(--mint-dim);
}

/* ── 반응형 ──────────────────────────────────────── */
@media (max-width: 1024px) {
  .col-date {
    display: none;
  }
}
@media (max-width: 768px) {
  .page {
    padding: 16px;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    width: 100%;
  }
}
</style>
