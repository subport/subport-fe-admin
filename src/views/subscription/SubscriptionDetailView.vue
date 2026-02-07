<template>
  <div class="page-title mb-4">
    <h3>구독 서비스 상세</h3>
  </div>

  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- 읽기 모드 -->
        <div v-if="!isEditingSubscription">
          <!-- 구독 서비스 정보 -->
          <div class="d-flex align-items-start">
            <img
              :src="subscription.logoImageUrl"
              alt="logo"
              class="rounded-3 me-3 flex-shrink-0"
              width="80"
              height="80"
              style="object-fit: cover"
            />

            <div class="flex-grow-1">
              <div class="row align-items-start">
                <div class="col-12 col-lg">
                  <h4 class="mb-4">{{ subscription.name }}</h4>
                  <div class="d-flex align-items-center gap-3 flex-wrap">
                    <span class="badge badge-color">{{
                      subscription.type
                    }}</span>
                    <a
                      v-if="subscription.planUrl"
                      :href="subscription.planUrl"
                      target="_blank"
                      class="text-decoration-none d-inline-flex align-items-center small link-color"
                    >
                      <i class="bi bi-link-45deg me-1"></i>
                      플랜 페이지
                    </a>
                  </div>
                </div>

                <!-- 날짜 정보 -->
                <div class="col-auto text-end">
                  <div class="small mb-1">
                    <i class="bi bi-calendar-plus"></i>
                    {{ subscription.createdAt }}
                  </div>
                  <div class="small">
                    <i class="bi bi-calendar-check"></i>
                    {{ subscription.lastModifiedAt }}
                  </div>
                </div>

                <!-- 버튼 목록 -->
                <div class="col-12 col-lg-auto mt-3 mt-lg-0">
                  <div class="d-flex gap-2 justify-content-end">
                    <button
                      class="btn btn-outline-secondary btn-sm btn-list"
                      @click="goSubscriptionList"
                    >
                      <i class="bi bi-list-ul"></i> 목록
                    </button>
                    <button
                      class="btn btn-primary btn-sm btn-update"
                      @click="startUpdateSubscription(subscription)"
                    >
                      <i class="bi bi-pencil"></i> 수정
                    </button>
                    <button
                      class="btn btn-outline-danger btn-sm btn-delete"
                      @click="handleDeleteSubscription"
                    >
                      <i class="bi bi-trash"></i> 삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 수정 모드 -->
        <form v-else @submit.prevent="handleUpdateSubscription">
          <!-- 헤더 -->
          <div
            class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom"
          >
            <h5 class="mb-0">
              <i class="bi bi-pencil-square"></i> 구독 서비스 수정
            </h5>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary btn-sm btn-save">
                <i class="bi bi-check-lg"></i> 저장
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm btn-cancel"
                @click="cancelUpdateSubscription()"
              >
                <i class="bi bi-x-lg"></i> 취소
              </button>
            </div>
          </div>

          <div class="row g-3">
            <!-- 이미지 업로드 -->
            <div class="col-12 col-md-auto">
              <label class="form-label"> 로고 이미지 </label>
              <div class="d-flex flex-column align-items-stretch">
                <!-- 이미지 미리보기 -->
                <div
                  class="position-relative d-inline-block"
                  style="cursor: pointer"
                  @click="logoInput?.click()"
                >
                  <img
                    :src="logoPreviewUrl || subscription.logoImageUrl"
                    alt="logo preview"
                    class="rounded-3"
                    width="120"
                    height="120"
                    style="object-fit: cover"
                  />
                  <div class="hover-overlay">
                    <i class="bi bi-camera text-white fs-3"></i>
                  </div>
                </div>

                <!-- 파일 선택 -->
                <input
                  ref="logoInput"
                  type="file"
                  class="d-none"
                  accept="image/*"
                  @change="changeLogo"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary btn-upload btn-sm w-100 mt-2"
                  @click="logoInput?.click()"
                >
                  <i class="bi bi-upload"></i> 파일 선택
                </button>
              </div>
            </div>

            <!-- 폼 필드 -->
            <div class="col-12 col-md">
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <label for="name" class="form-label">
                    서비스명 <span class="text-danger">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="subscriptionEditForm.name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <label for="type" class="form-label">
                    타입 <span class="text-danger">*</span>
                  </label>
                  <select
                    id="type"
                    v-model="subscriptionEditForm.type"
                    class="form-select"
                    required
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

                <div class="col-12">
                  <label for="planUrl" class="form-label"
                    >플랜 페이지 URL</label
                  >
                  <input
                    id="planUrl"
                    v-model="subscriptionEditForm.planUrl"
                    type="url"
                    class="form-control"
                    placeholder="https://example.com/pricing"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-4"></div>

    <!-- 플랜 목록 영역 -->
    <div class="card text-white shadow-sm">
      <div
        class="card-header border-bottom border-secondary d-flex justify-content-between align-items-center py-3"
      >
        <h4 class="mb-0">플랜 목록</h4>
        <button class="btn btn-primary btn-sm btn-add" @click="startSavePlan">
          <i class="bi bi-plus-circle"></i> 플랜 추가
        </button>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="text-center">ID</th>
                <th class="text-center">플랜명</th>
                <th class="text-center">가격</th>
                <th class="text-center">금액 단위</th>
                <th class="text-center">기간</th>
                <th class="text-center">등록일</th>
                <th class="text-center">최근 수정일</th>
                <th class="text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              <!-- 플랜 없음 -->
              <tr v-if="plans.length === 0 && !isAddingPlan">
                <td colspan="8" class="text-center py-5">
                  <i class="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                  등록된 플랜이 없습니다.
                </td>
              </tr>

              <!-- 새 플랜 추가 행 -->
              <tr v-if="isAddingPlan" class="table-active">
                <td class="text-center">-</td>
                <td>
                  <input
                    v-model="planRegisterForm.name"
                    type="text"
                    class="form-control form-control-sm"
                    required
                  />
                </td>
                <td>
                  <input
                    v-model="planRegisterForm.amount"
                    type="number"
                    class="form-control form-control-sm text-end"
                    min="0"
                    required
                  />
                </td>
                <td>
                  <select
                    v-model="planRegisterForm.amountUnit"
                    class="form-select form-select-sm"
                    required
                  >
                    <option value="">선택</option>
                    <option
                      v-for="unit in AMOUNT_UNITS"
                      :key="unit"
                      :value="unit"
                    >
                      {{ unit }}
                    </option>
                  </select>
                </td>
                <td>
                  <div class="input-group input-group-sm">
                    <input
                      v-model.number="planRegisterForm.durationMonths"
                      type="number"
                      class="form-control text-center"
                      min="1"
                      placeholder="1"
                      required
                    />
                    <span class="input-group-text">개월</span>
                  </div>
                </td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      class="btn btn-primary btn-save"
                      @click="savePlan"
                    >
                      <i class="bi bi-check-lg"></i> 저장
                    </button>
                    <button
                      type="button"
                      class="btn btn-light btn-cancel"
                      @click="cancelSavePlan"
                    >
                      <i class="bi bi-x-lg"></i> 취소
                    </button>
                  </div>
                </td>
              </tr>

              <!-- 기존 플랜 목록 -->
              <tr
                v-for="plan in plans"
                :key="plan.id"
                :class="{ 'table-active': editingPlanId === plan.id }"
              >
                <!-- 읽기 모드 -->
                <template v-if="editingPlanId !== plan.id">
                  <td class="text-center">{{ plan.id }}</td>
                  <td class="text-center">{{ plan.name }}</td>
                  <td class="text-center">{{ formatAmount(plan.amount) }}</td>
                  <td class="text-center">
                    <span class="badge bg-secondary">{{
                      plan.amountUnit
                    }}</span>
                  </td>
                  <td class="text-center">{{ plan.durationMonths }}개월</td>
                  <td class="text-center small">
                    {{ plan.createdAt }}
                  </td>
                  <td class="text-center small">
                    {{ plan.lastModifiedAt }}
                  </td>
                  <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-update"
                        @click="startUpdatePlan(plan)"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-delete"
                        @click="handleDeletePlan(plan.id)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </template>

                <!-- 수정 모드 -->
                <template v-else>
                  <td class="text-center">{{ plan.id }}</td>
                  <td>
                    <input
                      v-model="planEditForm.name"
                      type="text"
                      class="form-control form-control-sm"
                      required
                    />
                  </td>
                  <td>
                    <input
                      v-model="planEditForm.amount"
                      type="text"
                      class="form-control form-control-sm text-end"
                      required
                    />
                  </td>
                  <td>
                    <select
                      v-model="planEditForm.amountUnit"
                      class="form-select form-select-sm"
                      required
                    >
                      <option
                        v-for="unit in AMOUNT_UNITS"
                        :key="unit"
                        :value="unit"
                      >
                        {{ unit }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        v-model.number="planEditForm.durationMonths"
                        type="number"
                        class="form-control text-center"
                        min="1"
                        required
                      />
                      <span class="input-group-text">개월</span>
                    </div>
                  </td>
                  <td class="text-center small">
                    {{ plan.createdAt }}
                  </td>
                  <td class="text-center small">
                    {{ plan.lastModifiedAt }}
                  </td>
                  <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        class="btn btn-primary btn-save"
                        @click="handleUpdatePlan"
                      >
                        <i class="bi bi-check-lg"></i> 저장
                      </button>
                      <button
                        type="button"
                        class="btn btn-light btn-sm btn-cancel"
                        @click="cancelUpdatePlan"
                      >
                        <i class="bi bi-x-lg"></i> 취소
                      </button>
                    </div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  deleteSubscription,
  getSubscription,
  updateSubscription,
} from '@/api/subscriptions';
import { deletePlan, getPlans, registerPlan, updatePlan } from '@/api/plans';
import {
  type Subscription,
  type Plan,
  type RegisterPlanRequest,
  type UpdatePlanRequest,
  type UpdateSubscriptionRequest,
  type PlanForm,
  AMOUNT_UNITS,
  SUBSCRIPTION_TYPES,
} from '@/api/types';

const route = useRoute();
const router = useRouter();

// Reactive 상태 (구독)
const subscriptionId = Number(route.params.id);
const subscription = ref<Subscription>({
  id: 0,
  name: '',
  type: '',
  logoImageUrl: '',
  planUrl: '',
  createdAt: '',
  lastModifiedAt: '',
});
const subscriptionEditForm = ref({
  name: '',
  type: '',
  planUrl: '',
  logoImageUrl: '',
});
const isEditingSubscription = ref(false);
const selectedLogoFile = ref<File | null>(null);
const logoPreviewUrl = ref<string | null>(null);
const logoInput = ref<HTMLInputElement | null>(null);

// Reactive 상태 (플랜)
const plans = ref<Plan[]>([]);
const planRegisterForm = ref<PlanForm>({
  name: '',
  amount: 0,
  amountUnit: '',
  durationMonths: 1,
});
const planEditForm = ref<PlanForm>({
  name: '',
  amount: 0,
  amountUnit: '',
  durationMonths: 1,
});
const isAddingPlan = ref(false);
const editingPlanId = ref<number | null>(null);

/**
 * 구독 관련 함수
 * 1. 구독 조회
 * 2. 구독 수정
 * 3. 구독 삭제
 */

// 1.
const fetchSubscription = async () => {
  try {
    const response = await getSubscription(subscriptionId);
    subscription.value = response.data;
  } catch (error) {
    console.error('구독 조회 실패:', error);
    alert('조회에 실패했습니다.');
  }
};

// 2.
const startUpdateSubscription = (subscription: Subscription) => {
  isEditingSubscription.value = true;
  subscriptionEditForm.value = {
    name: subscription.name,
    type: subscription.type,
    planUrl: subscription.planUrl || '',
    logoImageUrl: subscription.logoImageUrl,
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
const handleUpdateSubscription = async () => {
  if (subscriptionEditForm.value.name.length > 10) {
    alert('이름은 최대 10자까지 가능합니다');
    return;
  }

  try {
    const formData: UpdateSubscriptionRequest = {
      name: subscriptionEditForm.value.name,
      type: subscriptionEditForm.value.type,
      planUrl: subscriptionEditForm.value.planUrl || undefined,
      image: selectedLogoFile.value || undefined,
    };
    await updateSubscription(subscriptionId, formData);
    alert('구독 정보가 수정되었습니다.');
    isEditingSubscription.value = false;
    await fetchSubscription();
  } catch (error) {
    console.error('구독 수정 실패:', error);
    alert('수정에 실패했습니다.');
  }
};
const cancelUpdateSubscription = () => {
  isEditingSubscription.value = false;
  selectedLogoFile.value = null;
  logoPreviewUrl.value = null;
};

// 3.
const handleDeleteSubscription = async () => {
  if (
    !confirm(
      '정말 이 구독 서비스를 삭제하시겠습니까?\n관련된 모든 플랜도 함께 삭제됩니다.',
    )
  ) {
    return;
  }

  try {
    await deleteSubscription(subscriptionId);
    alert('삭제되었습니다.');
    router.push('/subscriptions');
  } catch (error) {
    console.error('구독 삭제 실패:', error);
    alert('삭제에 실패했습니다.');
  }
};

/**
 * 플랜 관련 함수
 * 1. 플랜 목록 조회
 * 2. 플랜 생성
 * 3. 플랜 수정
 * 4. 플랜 삭제
 */

// 1.
const fetchPlans = async () => {
  try {
    const response = await getPlans(subscriptionId);
    plans.value = response.data.plans;
  } catch (error) {
    console.error('플랜 목록 조회 실패:', error);
    alert('플랜 목록 조회에 실패했습니다.');
  }
};

// 2.
const startSavePlan = () => {
  isAddingPlan.value = true;
  editingPlanId.value = null;
  planRegisterForm.value = {
    name: '',
    amount: 0,
    amountUnit: '',
    durationMonths: 1,
  };
};
const savePlan = async () => {
  const errorMessage = validatePlanForm(planRegisterForm.value);
  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  try {
    const data: RegisterPlanRequest = {
      name: planRegisterForm.value.name,
      amount: planRegisterForm.value.amount,
      amountUnit: planRegisterForm.value.amountUnit,
      durationMonths: planRegisterForm.value.durationMonths,
    };
    await registerPlan(subscriptionId, data);
    alert('플랜이 추가되었습니다.');
    isAddingPlan.value = false;
    await fetchPlans();
  } catch (error) {
    console.error('플랜 추가 실패:', error);
    alert('플랜 추가에 실패했습니다.');
  }
};
const cancelSavePlan = () => {
  isAddingPlan.value = false;
  planRegisterForm.value = {
    name: '',
    amount: 0,
    amountUnit: '',
    durationMonths: 1,
  };
};

// 3.
const startUpdatePlan = (plan: Plan) => {
  isAddingPlan.value = false;
  editingPlanId.value = plan.id;
  planEditForm.value = {
    name: plan.name,
    amount: plan.amount,
    amountUnit: plan.amountUnit,
    durationMonths: plan.durationMonths,
  };
};
const handleUpdatePlan = async () => {
  if (!editingPlanId.value) return;

  const errorMessage = validatePlanForm(planEditForm.value);
  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  try {
    const data: UpdatePlanRequest = {
      name: planEditForm.value.name,
      amount: planEditForm.value.amount,
      amountUnit: planEditForm.value.amountUnit,
      durationMonths: planEditForm.value.durationMonths,
    };
    await updatePlan(editingPlanId.value, data);
    alert('플랜이 수정되었습니다.');
    editingPlanId.value = null;
    await fetchPlans();
  } catch (error) {
    console.error('플랜 수정 실패:', error);
    alert('플랜 수정에 실패했습니다.');
  }
};
const cancelUpdatePlan = () => {
  editingPlanId.value = null;
  planEditForm.value = {
    name: '',
    amount: 0,
    amountUnit: '',
    durationMonths: 1,
  };
};

// 4.
const handleDeletePlan = async (planId: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) {
    return;
  }

  try {
    await deletePlan(planId);
    alert('플랜이 삭제되었습니다.');
    await fetchPlans();
  } catch (error) {
    console.error('플랜 삭제 실패:', error);
    alert('플랜 삭제에 실패했습니다.');
  }
};

/**
 * 기타
 */

const validatePlanForm = (form: PlanForm) => {
  const name = form.name;
  const amount = form.amount;
  const amountUnit = form.amountUnit;
  const durationMonths = form.durationMonths;

  if (!name || !amount == null || !amountUnit || !durationMonths == null) {
    return '모든 값을 입력해주세요';
  }
  if (name.length > 10) {
    return '이름은 최대 10자까지 가능합니다';
  }
  if (amount < 0) {
    return '가격은 0원 이상이어야 합니다';
  }
  if (durationMonths < 1) {
    return '기간은 1개월 이상이어야 합니다';
  }
  return null;
};

const formatAmount = (amount: number) => {
  return amount.toLocaleString();
};

const goSubscriptionList = () => {
  router.push('/subscriptions');
};

onMounted(() => {
  fetchSubscription();
  fetchPlans();
});
</script>

<style scoped>
.page-title h3 {
  color: #fff;
}

.card {
  background-color: #313137;
  color: #ffffff;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem; /* 이미지 둥글기와 맞춤 */
  opacity: 0; /* 기본 숨김 */
  transition: opacity 0.2s;
}

.position-relative:hover .hover-overlay {
  opacity: 1; /* 마우스 올리면 보이게 */
}

.table {
  --bs-table-bg: #313137;
  --bs-table-color: #ffffff;
  table-layout: fixed;
  width: 100%;
}

.btn {
  white-space: nowrap;
}

.btn-update,
.btn-add,
.btn-save {
  background-color: #6fcfc3;
  border-color: #6fcfc3;
  color: #000;
}

.btn-update:hover,
.btn-add:hover,
.btn-save:hover {
  background-color: #5bb8ad;
  border-color: #5bb8ad;
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

.btn-delete {
  background-color: transparent;
  border: 1px solid #6fcfc3;
  color: #6fcfc3;
}

.btn-delete:hover {
  background-color: rgba(111, 207, 195, 0.15);
}

.btn-list {
  background-color: transparent;
  border: 1px solid #adb5bd;
  color: #adb5bd;
}

.btn-list:hover {
  background-color: #adb5bd;
  color: #212529;
}

.badge-color {
  background-color: rgba(111, 207, 195, 0.2);
  color: #6fcfc3;
  border: 1px solid rgba(111, 207, 195, 0.4);
  font-weight: 500;
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

.btn-upload {
  background-color: #6fcfc3;
  border: 1px solid #6fcfc3;
  color: #000;
  font-weight: 500;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.btn-upload:hover {
  background-color: #5bb8ad;
  border-color: #5bb8ad;
  color: #000;
}

.form-select:focus,
.form-control:focus {
  border-color: #5bb8ad;
  box-shadow: 0 0 0 3px rgba(111, 207, 195, 0.15);
}
</style>
