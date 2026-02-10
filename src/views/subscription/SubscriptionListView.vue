<template>
  <div class="page-title mb-3">
    <h3 class="mb-0">구독 서비스 목록</h3>
  </div>

  <!-- 필터 + 정렬 + 검색 + 구독 추가-->
  <div class="d-flex align-items-center mb-4">
    <div class="d-flex align-items-center gap-2">
      <select
        v-model="selectedType"
        class="form-select form-select-sm select-type"
      >
        <option value="">전체</option>
        <option v-for="type in SUBSCRIPTION_TYPES" :key="type" :value="type">
          {{ type }}
        </option>
      </select>

      <select v-model="sort" class="form-select form-select-sm select-sort">
        <option value="">기본순</option>
        <option value="createdAt,desc">최근 등록순</option>
        <option value="lastModifiedAt,desc">최근 수정순</option>
        <option value="name,asc">이름순</option>
      </select>

      <div class="input-group input-group-sm box-search">
        <input
          type="text"
          class="form-control"
          placeholder="이름으로 검색"
          v-model="searchedName"
          @keyup.enter="handleSearch"
        />
        <button class="btn btn-search" @click="handleSearch">검색</button>
      </div>
    </div>

    <button class="btn btn-sm btn-add ms-auto" @click="startSaveSubscription">
      <i class="bi bi-plus-circle"></i> 구독 서비스 추가
    </button>
  </div>

  <table class="table table-dark table-hover align-middle">
    <thead>
      <tr>
        <th class="id-col" scope="col">ID</th>
        <th class="type-col" scope="col">타입</th>
        <th class="logo-col" scope="col">로고</th>
        <th class="name-col" scope="col">이름</th>
        <th class="plan-url-col" scope="col">플랜 페이지</th>
        <th class="created-at-col" scope="col">등록일</th>
        <th class="updated-at-col" scope="col">최근 수정일</th>
        <th class="action-col" scope="col">상세보기</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="subscription in subscriptions" :key="subscription.id">
        <th class="id-col" scope="row">{{ subscription.id }}</th>
        <td class="type-col">
          <span class="badge bg-secondary"> {{ subscription.type }}</span>
        </td>
        <td class="logo-col">
          <img
            :src="subscription.logoImageUrl"
            alt="logo"
            width="40"
            height="40"
            class="rounded"
          />
        </td>
        <td class="name-col">{{ subscription.name }}</td>
        <td class="plan-url-col">
          <a
            v-if="subscription.planUrl"
            :href="subscription.planUrl"
            target="_blank"
            class="link link-color"
          >
            링크
          </a>
          <span v-else>-</span>
        </td>
        <td class="created-at-col">{{ subscription.createdAt }}</td>
        <td class="updated-at-col">{{ subscription.lastModifiedAt }}</td>
        <td class="action-col">
          <button
            class="btn btn-sm btn-detail me-2"
            type="button"
            @click="goSubscriptionDetail(subscription.id)"
          >
            <i class="bi bi-search"></i> 상세보기
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- 구독 추가 모달 -->
  <div
    v-if="isAddingSubscription"
    class="modal d-block"
    @click.self="isAddingSubscription = false"
    @keydown.esc="close"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered" style="max-width: 400px">
      <div class="modal-content text-white">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-plus-circle-fill"></i> 구독 서비스 추가
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <!-- 이미지 업로드 -->
            <div class="col-12 d-flex justify-content-center">
              <div class="d-flex flex-column align-items-stretch">
                <!-- 이미지 업로드 박스 -->
                <div
                  class="position-relative d-inline-flex justify-content-center align-items-center"
                  style="
                    width: 120px;
                    height: 120px;
                    border: 2px dashed #6fcfc3;
                    border-radius: 8px;
                    cursor: pointer;
                  "
                  @click="logoInput?.click()"
                >
                  <i
                    v-if="!logoPreviewUrl"
                    class="bi bi-plus-lg text-white fs-2"
                  ></i>

                  <!-- 미리보기 이미지 -->
                  <img
                    v-else
                    :src="logoPreviewUrl"
                    alt="logo preview"
                    class="rounded-3"
                    style="width: 120px; height: 120px; object-fit: cover"
                  />
                </div>

                <!-- 숨겨진 파일 입력 -->
                <input
                  ref="logoInput"
                  type="file"
                  class="d-none"
                  accept="image/*"
                  @change="changeLogo"
                />
              </div>
            </div>

            <div class="col-12 col-sm-12">
              <label for="name" class="form-label">
                서비스명 <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                required
                v-model="subscriptionRegisterForm.name"
              />
            </div>
            <div class="col-12 col-sm-12">
              <label for="type" class="form-label">
                타입 <span class="text-danger">*</span>
              </label>
              <select
                id="type"
                class="form-select"
                required
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
            <div class="col-12 col-sm-12">
              <label for="planUrl" class="form-label"> 플랜 페이지 URL </label>
              <input
                type="url"
                class="form-control"
                placeholder="https://example.com/pricing"
                v-model="subscriptionRegisterForm.planUrl"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-save" @click="saveSubscription">
              <i class="bi bi-check-lg"></i> 저장
            </button>
            <button
              class="btn btn-secondary btn-sm btn-cancel"
              @click="cancelSaveSubscription"
            >
              <i class="bi bi-x-lg"></i> 취소
            </button>
          </div>
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
} from '@/api/types';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Reactive 상태
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
const selectedType = ref('');
const sort = ref('');
const searchedName = ref('');
const appliedName = ref('');

// 함수
const fetchSubscriptions = async () => {
  const params: GetSubscriptionsParams = {};

  if (selectedType.value) {
    params.type = selectedType.value;
  }
  if (sort.value) {
    params.sort = sort.value;
  }
  if (appliedName.value) {
    params.name = appliedName.value;
  }

  const response = await getSubscriptions(params);
  subscriptions.value = response.data.subscriptions;
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
    logoPreviewUrl.value = null; // 취소 시 기존 이미지로 복구
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

const handleSearch = () => {
  appliedName.value = searchedName.value;

  router.replace({
    query: {
      type: selectedType.value || undefined,
      sort: sort.value || undefined,
      name: appliedName.value || undefined,
    },
  });
};

watch([selectedType, sort], () => {
  router.replace({
    query: {
      type: selectedType.value || undefined,
      sort: sort.value || undefined,
      name: appliedName.value || undefined,
    },
  });
});
watch(
  () => route.query,
  query => {
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
</script>

<style scoped>
.page-title h3 {
  color: #fff;
}

.page-title hr {
  border-color: #fff;
}

.table {
  --bs-table-bg: #313137;
  --bs-table-color: #ffffff;
  table-layout: fixed;
  width: 100%;
}

.id-col,
.logo-col,
.name-col,
.type-col,
.plan-url-col,
.created-at-col,
.updated-at-col,
.action-col {
  text-align: center;
}

.link-color {
  color: #6fcfc3;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.link-color:hover {
  color: #5bb8ad;
  text-decoration: underline;
}

.btn-detail,
.btn-save,
.btn-search {
  background-color: #6fcfc3;
  border-color: #6fcfc3;
  color: #000;
}

.btn-detail:hover,
.btn-save:hover,
.btn-search:hover {
  background-color: #5bb8ad;
  border-color: #5bb8ad;
}

.btn-add {
  background-color: #b2b4b6;
  border-color: #b2b4b6;
  color: #000;
}

.btn-add:hover {
  background-color: #9da0a3;
  border-color: #9da0a3;
}

.btn-cancel {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.btn-cancel:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #313137;
  border: 1px solid #444;
}

.modal-content input {
  background-color: #fff;
  color: #111;
  border: 1px solid #555;
}

.modal-footer {
  margin-top: 1rem;
}

.form-select:focus,
.form-control:focus {
  border-color: #5bb8ad;
  box-shadow: 0 0 0 3px rgba(111, 207, 195, 0.15);
}

.select-type {
  width: 150px;
}

.select-sort {
  width: 120px;
}

.box-search {
  width: 200px;
}
</style>
