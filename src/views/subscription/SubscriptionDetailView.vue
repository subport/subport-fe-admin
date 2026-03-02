<template>
  <div class="page">
    <!-- 구독 서비스 정보 카드 -->
    <div class="detail-card">
      <!-- 읽기 모드 -->
      <div v-if="!isEditingSubscription" class="view-mode">
        <div class="service-info">
          <!-- 로고 -->
          <img
            :src="subscription.logoImageUrl"
            alt="logo"
            class="service-logo"
          />

          <!-- 이름 + 메타 -->
          <div class="service-meta">
            <h2 class="service-name">{{ subscription.name }}</h2>
            <div class="service-tags">
              <span class="type-badge">{{ subscription.type }}</span>
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
                플랜 페이지
              </a>
            </div>
            <div class="service-dates">
              <span class="date-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                등록 {{ subscription.createdAt }}
              </span>
              <span class="date-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                수정 {{ subscription.lastModifiedAt }}
              </span>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="action-btns">
            <button class="btn-list" @click="goSubscriptionList">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              목록
            </button>
            <button
              class="btn-edit"
              @click="startUpdateSubscription(subscription)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
              수정
            </button>
            <button class="btn-delete" @click="handleDeleteSubscription">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- 수정 모드 -->
      <form v-else @submit.prevent="handleUpdateSubscription" class="edit-mode">
        <div class="edit-header">
          <div class="edit-title">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
            구독 서비스 수정
          </div>
          <div class="edit-actions">
            <button type="submit" class="btn-save">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              저장
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="cancelUpdateSubscription"
            >
              취소
            </button>
          </div>
        </div>

        <div class="edit-body">
          <!-- 로고 업로드 -->
          <div class="logo-edit-wrap">
            <label class="form-label">로고 이미지</label>
            <div class="logo-edit-box" @click="logoInput?.click()">
              <img
                :src="logoPreviewUrl || subscription.logoImageUrl"
                alt="logo preview"
                class="logo-edit-img"
              />
              <div class="logo-edit-overlay">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              class="btn-upload"
              @click="logoInput?.click()"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              파일 선택
            </button>
            <input
              ref="logoInput"
              type="file"
              class="hidden-input"
              accept="image/*"
              @change="changeLogo"
            />
          </div>

          <!-- 폼 필드 -->
          <div class="edit-fields">
            <div class="form-row">
              <div class="form-field">
                <label class="form-label"
                  >서비스명 <span class="required">*</span></label
                >
                <input
                  v-model="subscriptionEditForm.name"
                  type="text"
                  class="form-input"
                  :class="{ error: subNameError }"
                  @input="clearSubNameError"
                />
                <span v-if="subNameError" class="field-error">{{
                  subNameError
                }}</span>
              </div>
              <div class="form-field">
                <label class="form-label"
                  >타입 <span class="required">*</span></label
                >
                <div class="select-wrap">
                  <select
                    v-model="subscriptionEditForm.type"
                    class="custom-select"
                    :class="{ error: subTypeError }"
                    @change="clearSubTypeError"
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
                <span v-if="subTypeError" class="field-error">{{
                  subTypeError
                }}</span>
              </div>
            </div>
            <div class="form-field">
              <label class="form-label">플랜 페이지 URL</label>
              <input
                v-model="subscriptionEditForm.planUrl"
                type="url"
                class="form-input"
                placeholder="https://example.com/pricing"
              />
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- 플랜 목록 카드 -->
    <div class="plan-card">
      <div class="plan-card-header">
        <h3 class="plan-card-title">플랜 목록</h3>
        <button class="btn-add-plan" @click="startSavePlan">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          플랜 추가
        </button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-name">플랜명</th>
              <th class="col-amount">가격</th>
              <th class="col-unit">금액 단위</th>
              <th class="col-duration">기간</th>
              <th class="col-date">등록일</th>
              <th class="col-date">최근 수정일</th>
              <th class="col-action">작업</th>
            </tr>
          </thead>
          <tbody>
            <!-- 플랜 없음 -->
            <tr v-if="!isLoading && plans.length === 0 && !isAddingPlan">
              <td colspan="8" class="empty-cell">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>등록된 플랜이 없어요</span>
              </td>
            </tr>

            <!-- 새 플랜 추가 행 -->
            <tr v-if="isAddingPlan" class="editing-row">
              <td class="col-id muted">-</td>
              <td class="col-name">
                <input
                  v-model="planRegisterForm.name"
                  type="text"
                  class="inline-input"
                  @input="clearPlanErrors"
                />
              </td>
              <td class="col-amount">
                <input
                  v-model="planRegisterForm.amount"
                  type="text"
                  inputmode="numeric"
                  class="inline-input"
                  @input="clearPlanErrors"
                />
              </td>
              <td class="col-unit">
                <select
                  v-model="planRegisterForm.amountUnit"
                  class="inline-select"
                  @change="clearPlanErrors"
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
              <td class="col-duration">
                <div class="duration-wrap">
                  <input
                    v-model.number="planRegisterForm.durationMonths"
                    type="text"
                    inputmode="numeric"
                    class="inline-input text-center"
                    @input="clearPlanErrors"
                  />
                  <span class="unit-label">개월</span>
                </div>
              </td>
              <td class="col-date muted">-</td>
              <td class="col-date muted">-</td>
              <td class="col-action col-action-editing">
                <!-- 버튼이 행 위로 뜸 -->
                <div class="floating-actions">
                  <button type="button" class="btn-row-save" @click="savePlan">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    저장
                  </button>
                  <button
                    type="button"
                    class="btn-row-cancel"
                    @click="cancelSavePlan"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    취소
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="isAddingPlan && hasPlanErrors" class="error-row">
              <td class="col-id"></td>
              <td class="col-name">
                <span v-if="planNameError" class="cell-error">{{
                  planNameError
                }}</span>
              </td>
              <td class="col-amount">
                <span v-if="planAmountError" class="cell-error">{{
                  planAmountError
                }}</span>
              </td>
              <td class="col-unit">
                <span v-if="planUnitError" class="cell-error">{{
                  planUnitError
                }}</span>
              </td>
              <td class="col-duration">
                <span v-if="planDurationError" class="cell-error">{{
                  planDurationError
                }}</span>
              </td>
              <td class="col-date"></td>
              <td class="col-date"></td>
              <td class="col-action"></td>
            </tr>

            <!-- 기존 플랜 목록 -->
            <tr
              v-for="plan in plans"
              :key="plan.id"
              class="data-row"
              :class="{ 'editing-row': editingPlanId === plan.id }"
            >
              <!-- 읽기 모드 -->
              <template v-if="editingPlanId !== plan.id">
                <td class="col-id muted">{{ plan.id }}</td>
                <td class="col-name">{{ plan.name }}</td>
                <td class="col-amount">{{ formatAmount(plan.amount) }}</td>
                <td class="col-unit">
                  <span class="unit-badge">{{ plan.amountUnit }}</span>
                </td>
                <td class="col-duration">{{ plan.durationMonths }}개월</td>
                <td class="col-date">{{ plan.createdAt }}</td>
                <td class="col-date">{{ plan.lastModifiedAt }}</td>
                <td class="col-action">
                  <div class="row-actions">
                    <button
                      type="button"
                      class="btn-icon-edit"
                      @click="startUpdatePlan(plan)"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="btn-icon-delete"
                      @click="handleDeletePlan(plan.id)"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </template>

              <!-- 수정 모드 -->
              <template v-else>
                <td class="col-id muted">{{ plan.id }}</td>
                <td class="col-name">
                  <input
                    v-model="planEditForm.name"
                    type="text"
                    class="inline-input"
                    :class="{ error: planNameError }"
                    @input="clearPlanErrors"
                  />
                  <span v-if="planNameError" class="inline-error">{{
                    planNameError
                  }}</span>
                </td>
                <td class="col-amount">
                  <input
                    v-model="planEditForm.amount"
                    type="text"
                    inputmode="numeric"
                    class="inline-input"
                    :class="{ error: planAmountError }"
                    @input="clearPlanErrors"
                  />
                  <span v-if="planAmountError" class="inline-error">{{
                    planAmountError
                  }}</span>
                </td>
                <td class="col-unit">
                  <select
                    v-model="planEditForm.amountUnit"
                    class="inline-select"
                    :class="{ error: planUnitError }"
                    @change="clearPlanErrors"
                  >
                    <option
                      v-for="unit in AMOUNT_UNITS"
                      :key="unit"
                      :value="unit"
                    >
                      {{ unit }}
                    </option>
                  </select>
                  <span v-if="planUnitError" class="inline-error">{{
                    planUnitError
                  }}</span>
                </td>
                <td class="col-duration">
                  <div class="duration-wrap">
                    <input
                      v-model.number="planEditForm.durationMonths"
                      type="text"
                      inputmode="numeric"
                      class="inline-input"
                      :class="{ error: planDurationError }"
                      @input="clearPlanErrors"
                    />
                    <span class="unit-label">개월</span>
                  </div>
                  <span v-if="planDurationError" class="inline-error">{{
                    planDurationError
                  }}</span>
                </td>
                <td class="col-date">{{ plan.createdAt }}</td>
                <td class="col-date">{{ plan.lastModifiedAt }}</td>
                <td class="col-action col-action-editing">
                  <!-- 버튼이 행 위로 뜸 -->
                  <div class="floating-actions">
                    <button
                      type="button"
                      class="btn-row-save"
                      @click="handleUpdatePlan"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      저장
                    </button>
                    <button
                      type="button"
                      class="btn-row-cancel"
                      @click="cancelUpdatePlan"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      취소
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

  <Snackbar ref="snackbarRef" />
  <ConfirmModal ref="confirmModalRef" />
</template>

<script setup lang="ts">
import { isApiError } from '@/api/index';
import { deletePlan, getPlans, registerPlan, updatePlan } from '@/api/plans';
import {
  deleteSubscription,
  getSubscription,
  updateSubscription,
} from '@/api/subscriptions';
import {
  AMOUNT_UNITS,
  SUBSCRIPTION_TYPES,
  type Plan,
  type PlanForm,
  type RegisterPlanRequest,
  type Subscription,
  type UpdatePlanRequest,
  type UpdateSubscriptionRequest,
} from '@/api/types';
import ConfirmModal from '@/components/ConfirmModal.vue';
import Snackbar from '@/components/Snackbar.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// ── 구독 상태 ─────────────────────────────────────
const subscriptionId = Number(route.params.id);
const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null);
const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
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
const subNameError = ref('');
const subTypeError = ref('');
const selectedLogoFile = ref<File | null>(null);
const logoPreviewUrl = ref<string | null>(null);
const logoInput = ref<HTMLInputElement | null>(null);

// ── 플랜 상태 ─────────────────────────────────────
const plans = ref<Plan[]>([]);
const isLoading = ref(true);
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
const planNameError = ref('');
const planAmountError = ref('');
const planUnitError = ref('');
const planDurationError = ref('');

const hasPlanErrors = computed(() => {
  return !!(
    planNameError.value ||
    planAmountError.value ||
    planUnitError.value ||
    planDurationError.value
  );
});

// ── 구독 조회 ─────────────────────────────────────
const fetchSubscription = async () => {
  try {
    const response = await getSubscription(subscriptionId);
    subscription.value = response.data;
  } catch (error) {
    console.error('구독 조회 실패:', error);
    snackbarRef.value?.show('조회에 실패했습니다.', 'error');
  }
};

// ── 구독 수정 ─────────────────────────────────────
const startUpdateSubscription = (sub: Subscription) => {
  isEditingSubscription.value = true;
  subscriptionEditForm.value = {
    name: sub.name,
    type: sub.type,
    planUrl: sub.planUrl || '',
    logoImageUrl: sub.logoImageUrl,
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
const clearSubNameError = () => {
  subNameError.value = '';
};
const clearSubTypeError = () => {
  subTypeError.value = '';
};

const validateSubscriptionEditForm = (): boolean => {
  const name = subscriptionEditForm.value.name.trim();
  const type = subscriptionEditForm.value.type;
  let valid = true;

  if (!name) {
    subNameError.value = '서비스명을 입력해주세요';
    valid = false;
  } else if (name.length > 10) {
    subNameError.value = '서비스명은 최대 10자까지 가능해요';
    valid = false;
  }

  if (!type) {
    subTypeError.value = '타입을 선택해주세요';
    valid = false;
  }

  return valid;
};

const handleUpdateSubscription = async () => {
  if (!validateSubscriptionEditForm()) return;

  try {
    const formData: UpdateSubscriptionRequest = {
      name: subscriptionEditForm.value.name.trim(),
      type: subscriptionEditForm.value.type,
      planUrl: subscriptionEditForm.value.planUrl || undefined,
      image: selectedLogoFile.value || undefined,
    };
    await updateSubscription(subscriptionId, formData);
    snackbarRef.value?.show('구독 서비스가 수정되었습니다.', 'success');
    isEditingSubscription.value = false;
    await fetchSubscription();
  } catch (error) {
    console.error('구독 수정 실패:', error);
    snackbarRef.value?.show('수정에 실패했습니다.', 'error');
  }
};
const cancelUpdateSubscription = () => {
  isEditingSubscription.value = false;
  selectedLogoFile.value = null;
  logoPreviewUrl.value = null;
  subNameError.value = '';
  subTypeError.value = '';
};

// ── 구독 삭제 ─────────────────────────────────────
const handleDeleteSubscription = async () => {
  const confirmed = await confirmModalRef.value?.show(
    '관련된 모든 플랜도 함께 삭제됩니다',
    '정말 해당 구독 서비스를 삭제하시겠어요?',
  );
  if (!confirmed) return;

  try {
    await deleteSubscription(subscriptionId);
    snackbarRef.value?.show('구독 서비스가 삭제되었습니다.', 'success');
    setTimeout(() => {
      router.push('/subscriptions');
    }, 1000);
  } catch (error) {
    console.error('구독 서비스 삭제 실패:', error);
    if (
      isApiError(error) &&
      error.response.data.code === 'SUBSCRIPTION_IN_USE'
    ) {
      snackbarRef.value?.show(
        '회원이 사용 중인 구독은 삭제할 수 없습니다.',
        'error',
      );
      return;
    }
    snackbarRef.value?.show('구독 서비스 삭제에 실패했습니다.', 'error');
  }
};

// ── 플랜 조회 ─────────────────────────────────────
const fetchPlans = async () => {
  try {
    const response = await getPlans(subscriptionId);
    plans.value = response.data.plans;
  } catch (error) {
    console.error('플랜 목록 조회 실패:', error);
    snackbarRef.value?.show('플랜 목록 조회에 실패했습니다.', 'error');
  }
};

// ── 플랜 추가 ─────────────────────────────────────
const startSavePlan = () => {
  isAddingPlan.value = true;
  editingPlanId.value = null;
  clearPlanErrors();
  planRegisterForm.value = {
    name: '',
    amount: 0,
    amountUnit: '',
    durationMonths: 1,
  };
};
const clearPlanErrors = () => {
  planNameError.value = '';
  planAmountError.value = '';
  planUnitError.value = '';
  planDurationError.value = '';
};

const validatePlanFormLocal = (form: PlanForm): boolean => {
  const name = form.name.trim();
  let valid = true;
  clearPlanErrors();

  if (!name) {
    planNameError.value = '플랜명을 입력해주세요';
    valid = false;
  } else if (name.length > 20) {
    planNameError.value = '플랜명은 최대 20자까지 가능해요';
    valid = false;
  }

  if (form.amount == null) {
    planAmountError.value = '가격을 입력해주세요';
    valid = false;
  } else if (Number(form.amount) < 0) {
    planAmountError.value = '가격은 0 이상으로 입력해주세요';
    valid = false;
  }

  if (!form.amountUnit) {
    planUnitError.value = '금액 단위를 선택해주세요';
    valid = false;
  }

  if (form.durationMonths == null) {
    planDurationError.value = '기간을 입력해주세요';
    valid = false;
  } else if (Number(form.durationMonths) < 1) {
    planDurationError.value = '기간은 1개월 이상으로 입력해주세요';
    valid = false;
  }

  return valid;
};

const savePlan = async () => {
  if (!validatePlanFormLocal(planRegisterForm.value)) return;

  try {
    const data: RegisterPlanRequest = {
      name: planRegisterForm.value.name.trim(),
      amount: Number(planRegisterForm.value.amount),
      amountUnit: planRegisterForm.value.amountUnit,
      durationMonths: Number(planRegisterForm.value.durationMonths),
    };
    await registerPlan(subscriptionId, data);
    snackbarRef.value?.show('플랜이 추가되었습니다.', 'success');
    isAddingPlan.value = false;
    await fetchPlans();
  } catch (error) {
    console.error('플랜 추가 실패:', error);
    if (isApiError(error)) {
      snackbarRef.value?.show(
        error.response.data.message || '플랜 추가에 실패했습니다.',
        'error',
      );
      return;
    }
    snackbarRef.value?.show('플랜 추가에 실패했습니다.', 'error');
  }
};
const cancelSavePlan = () => {
  isAddingPlan.value = false;
  clearPlanErrors();
  planRegisterForm.value = {
    name: '',
    amount: 0,
    amountUnit: '',
    durationMonths: 1,
  };
};

// ── 플랜 수정 ─────────────────────────────────────
const startUpdatePlan = (plan: Plan) => {
  isAddingPlan.value = false;
  editingPlanId.value = plan.id;
  clearPlanErrors();
  planEditForm.value = {
    name: plan.name,
    amount: plan.amount,
    amountUnit: plan.amountUnit,
    durationMonths: plan.durationMonths,
  };
};
const handleUpdatePlan = async () => {
  if (!editingPlanId.value) return;
  if (!validatePlanFormLocal(planEditForm.value)) return;

  try {
    const data: UpdatePlanRequest = {
      name: planEditForm.value.name.trim(),
      amount: Number(planEditForm.value.amount),
      amountUnit: planEditForm.value.amountUnit,
      durationMonths: Number(planEditForm.value.durationMonths),
    };
    await updatePlan(editingPlanId.value, data);
    snackbarRef.value?.show('플랜이 수정되었습니다.', 'success');
    editingPlanId.value = null;
    await fetchPlans();
  } catch (error) {
    console.error('플랜 수정 실패:', error);
    if (isApiError(error)) {
      snackbarRef.value?.show(
        error.response.data.message || '플랜 수정에 실패했습니다.',
        'error',
      );
      return;
    }
    snackbarRef.value?.show('플랜 수정에 실패했습니다.', 'error');
  }
};
const cancelUpdatePlan = () => {
  editingPlanId.value = null;
  clearPlanErrors();
  planEditForm.value = {
    name: '',
    amount: 0,
    amountUnit: '',
    durationMonths: 1,
  };
};

// ── 플랜 삭제 ─────────────────────────────────────
const handleDeletePlan = async (planId: number) => {
  const confirmed = await confirmModalRef.value?.show(
    '해당 플랜이 삭제됩니다',
    '정말 삭제하시겠어요?',
  );
  if (!confirmed) return;

  try {
    await deletePlan(planId);
    snackbarRef.value?.show('플랜이 삭제되었습니다.', 'success');
    await fetchPlans();
  } catch (error) {
    console.error('플랜 삭제 실패:', error);
    if (isApiError(error) && error.response.data.code === 'PLAN_IN_USE') {
      snackbarRef.value?.show(
        '회원이 사용 중인 플랜은 삭제할 수 없습니다.',
        'error',
      );
      return;
    }
    snackbarRef.value?.show('플랜 삭제에 실패했습니다.', 'error');
  }
};

// ── 유틸 ──────────────────────────────────────────
const formatAmount = (amount: number) => amount.toLocaleString();
const goSubscriptionList = () => router.push('/subscriptions');

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([fetchSubscription(), fetchPlans()]);
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.page {
  /* ── CSS 변수 ── */
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── 공통 카드 ───────────────────────────────────── */
.detail-card,
.plan-card {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
}

/* ── 구독 서비스 정보 (읽기 모드) ─────────────────── */
.view-mode {
  padding: 24px;
}
.service-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}
.service-logo {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border-mid);
}
.service-meta {
  flex: 1;
}
.service-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px;
  letter-spacing: -0.3px;
}
.service-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.type-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--mint);
  background: var(--mint-glow);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(111, 207, 195, 0.2);
  white-space: nowrap;
}
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
.service-dates {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.date-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-muted);
}

/* 액션 버튼 */
.action-btns {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-shrink: 0;
}
.btn-list,
.btn-edit,
.btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
  border: 1px solid;
}
.btn-list {
  background: var(--bg-raised);
  border-color: var(--border-mid);
  color: var(--text-secondary);
}
.btn-list:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.btn-edit {
  background: var(--mint);
  border-color: var(--mint);
  color: #0f1115;
  font-weight: 700;
}
.btn-edit:hover {
  background: var(--mint-dim);
  border-color: var(--mint-dim);
}
.btn-delete {
  background: transparent;
  border-color: rgba(250, 82, 82, 0.4);
  color: #ff6b6b;
}
.btn-delete:hover {
  background: rgba(250, 82, 82, 0.1);
  border-color: #fa5252;
}

/* ── 수정 모드 ───────────────────────────────────── */
.edit-mode {
  padding: 0;
}
.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
}
.edit-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--mint);
}
.edit-actions {
  display: flex;
  gap: 8px;
}
.btn-cancel {
  padding: 7px 16px;
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
.btn-cancel:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.btn-save {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
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
.btn-save:hover {
  background: var(--mint-dim);
}

.edit-body {
  display: flex;
  gap: 28px;
  padding: 24px;
  flex-wrap: wrap;
}

/* 로고 수정 */
.logo-edit-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100px;
}
.logo-edit-box {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid var(--border-mid);
}
.logo-edit-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.logo-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
}
.logo-edit-box:hover .logo-edit-overlay {
  opacity: 1;
}
.btn-upload {
  /* 이미지 너비(100px)에 맞춰 꽉 채움 */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 0;
  border-radius: 7px;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  box-sizing: border-box;
}
.btn-upload:hover {
  border-color: var(--mint);
  color: var(--mint);
  background: var(--mint-glow);
}
.hidden-input {
  display: none;
}

/* 폼 필드 */
.edit-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 280px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
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
  padding: 8px 12px;
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
.form-input.error {
  border-color: #ff6b6b;
}
.custom-select.error {
  border-color: #ff6b6b;
}
.field-error {
  font-size: 11px;
  color: #ff6b6b;
}
.select-wrap {
  position: relative;
}
.custom-select {
  appearance: none;
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s;
}
.custom-select:focus {
  outline: none;
  border-color: var(--mint);
}
.custom-select option {
  background: var(--bg-raised);
}

/* ── 플랜 카드 ───────────────────────────────────── */
.plan-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
}
.plan-card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.btn-add-plan {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
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
.btn-add-plan:hover {
  background: var(--mint-dim);
}

/* ── 테이블 ──────────────────────────────────────── */
.table-wrap {
  overflow-x: auto;
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
  padding: 10px 14px;
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
.editing-row {
  background: var(--bg-raised) !important;
}
.data-table td {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  vertical-align: middle;
}
.muted {
  color: var(--text-muted) !important;
  font-size: 12px !important;
}

/* 컬럼 너비 */
.col-id {
  width: 50px;
}
.col-name {
  width: 130px;
}
.col-amount {
  width: 90px;
}
.col-unit {
  width: 80px;
}
.col-duration {
  width: 80px;
}
.col-date {
  width: 100px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-action {
  width: 80px;
}

/* 수정 모드일 때 작업 컬럼: 저장/취소 버튼 2개가 들어갈 너비로 확장 */
.col-action-editing {
  width: 130px;
  min-width: 130px;
}

/* 저장/취소 버튼 세트 (인라인, 같은 행 안에 배치) */
.floating-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
}

/* 배지 */
.unit-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-raised);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--border-mid);
}

/* 인라인 수정 인풋 — 숫자 스피너(화살표) 제거, 기본 가운데 정렬 */
.inline-input {
  width: 100%;
  padding: 5px 8px;
  background: var(--bg-base);
  border: 1px solid var(--border-mid);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 12px;
  font-family: inherit;
  box-sizing: border-box;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}
.inline-input::-webkit-outer-spin-button,
.inline-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.inline-input:focus {
  outline: none;
  border-color: var(--mint);
}
.inline-input.error {
  border-color: #ff6b6b;
}
.inline-error {
  display: block;
  font-size: 10px;
  color: #ff6b6b;
  margin-top: 2px;
}
.inline-select {
  width: 100%;
  padding: 5px 8px;
  appearance: none;
  background: var(--bg-base);
  border: 1px solid var(--border-mid);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  text-align: center;
}
.inline-select:focus {
  outline: none;
  border-color: var(--mint);
}
.inline-select.error {
  border-color: #ff6b6b;
}
.inline-select option {
  background: var(--bg-raised);
}

.duration-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.unit-label {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* 저장/취소 버튼 (액션 바 안) */
.btn-row-save,
.btn-row-cancel {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-row-save {
  background: var(--mint);
  border: none;
  color: #0f1115;
}
.btn-row-save:hover {
  background: var(--mint-dim);
}
.btn-row-cancel {
  background: var(--bg-hover);
  border: 1px solid var(--border-mid);
  color: var(--text-secondary);
}
.btn-row-cancel:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* 아이콘 버튼 (수정/삭제) */
.btn-icon-edit,
.btn-icon-delete {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid;
}
.btn-icon-edit {
  background: var(--bg-raised);
  border-color: var(--border-mid);
  color: var(--text-secondary);
}
.btn-icon-edit:hover {
  border-color: var(--mint);
  color: var(--mint);
  background: var(--mint-glow);
}
.btn-icon-delete {
  background: transparent;
  border-color: rgba(250, 82, 82, 0.3);
  color: rgba(250, 82, 82, 0.6);
}
.btn-icon-delete:hover {
  border-color: #fa5252;
  color: #ff6b6b;
  background: rgba(250, 82, 82, 0.1);
}
.row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* 빈 상태 */
.empty-cell {
  text-align: center !important;
  padding: 48px 0 !important;
  color: var(--text-muted);
}
.empty-cell svg {
  opacity: 0.3;
  margin-bottom: 10px;
  display: block;
  margin-inline: auto;
}
.empty-cell span {
  font-size: 14px;
  display: block;
}

.error-row td {
  padding: 4px 14px !important;
}
.cell-error {
  font-size: 10px;
  color: #ff6b6b;
  display: block;
  text-align: center;
}

/* ── 반응형 ──────────────────────────────────────── */
@media (max-width: 768px) {
  .page {
    padding: 16px;
  }
  .service-info {
    flex-direction: column;
  }
  .action-btns {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .col-date {
    display: none;
  }
}
</style>
