<template>
  <div class="page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">FAQ 관리</h1>
        <span class="page-sub">자주 묻는 질문을 관리해요</span>
      </div>
      <button class="btn-add" @click="startAddFaq">
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
        FAQ 추가
      </button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-expand"></th>
            <th class="col-question">질문</th>
            <th class="col-created">작성일</th>
            <th class="col-modified">최근 수정일</th>
            <th class="col-action">작업</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="faq in faqList" :key="faq.id">
            <tr
              class="data-row"
              :class="{ expanded: expandedFaqIds.has(faq.id) }"
              @click="toggleExpand(faq.id)"
            >
              <td class="col-expand">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="expand-icon"
                  :class="{ rotated: expandedFaqIds.has(faq.id) }"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </td>
              <td class="col-question">
                <span class="question-text">{{ faq.question }}</span>
              </td>
              <td class="col-created">{{ formatDate(faq.createdAt) }}</td>
              <td class="col-modified">{{ formatDate(faq.lastModifiedAt) }}</td>
              <td class="col-action">
                <div class="row-actions">
                  <button class="btn-icon-edit" @click.stop="startEditFaq(faq)">
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
                    class="btn-icon-delete"
                    @click.stop="deleteFaq(faq.id)"
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
            </tr>

            <tr v-if="expandedFaqIds.has(faq.id)" class="detail-row">
              <td colspan="5" class="detail-cell">
                <div class="detail-content">
                  <div class="question-header">Q. {{ faq.question }}</div>
                  <div class="answer-text">{{ faq.answer }}</div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="!isLoading && faqList.length === 0 && !isAddingFaq">
            <td colspan="5" class="empty-cell">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
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
              <span>등록된 FAQ가 없어요</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal ref="confirmModalRef" />
    <Snackbar ref="snackbarRef" />

    <!-- FAQ 추가/수정 모달 -->
    <div
      v-if="isAddingFaq"
      class="modal-backdrop"
      @click.self="cancelAddFaq"
      @keydown.esc="cancelAddFaq"
      tabindex="-1"
    >
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <svg
              v-if="editingFaqId"
              width="16"
              height="16"
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
            <svg
              v-else
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
            <span>{{ editingFaqId ? 'FAQ 수정' : 'FAQ 추가' }}</span>
          </div>
          <button class="modal-close" @click="cancelAddFaq">
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
          <div class="form-field">
            <label class="form-label"
              >질문 <span class="required">*</span></label
            >
            <input
              v-model="faqForm.question"
              type="text"
              class="form-input"
              placeholder="질문을 입력하세요"
            />
            <span v-if="faqErrors.question" class="field-error">{{
              faqErrors.question
            }}</span>
          </div>

          <div class="form-field">
            <label class="form-label"
              >답변 <span class="required">*</span></label
            >
            <textarea
              v-model="faqForm.answer"
              class="form-textarea"
              placeholder="답변을 입력하세요"
              rows="5"
            ></textarea>
            <span v-if="faqErrors.answer" class="field-error">{{
              faqErrors.answer
            }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-save" @click="saveFaq">
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
          <button class="btn-modal-cancel" @click="cancelAddFaq">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  deleteFaq as deleteFaqApi,
  getFaqs,
  updateFaq,
  writeFaq,
} from '@/api/faq';
import type { Faq } from '@/api/types';
import ConfirmModal from '@/components/ConfirmModal.vue';
import Snackbar from '@/components/Snackbar.vue';
import { onMounted, reactive, ref } from 'vue';

const faqList = ref<Faq[]>([]);
const isAddingFaq = ref(false);
const editingFaqId = ref<number | null>(null);
const expandedFaqIds = ref<Set<number>>(new Set());
const isLoading = ref(false);

const fetchFaqs = async () => {
  isLoading.value = true;
  try {
    const response = await getFaqs();
    faqList.value = response.data.faqs;
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFaqs();
});

const faqForm = reactive({
  question: '',
  answer: '',
});

const faqErrors = reactive({
  question: '',
  answer: '',
});

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const clearErrors = () => {
  faqErrors.question = '';
  faqErrors.answer = '';
};

const validateFaqForm = (form: {
  question: string;
  answer: string;
}): boolean => {
  clearErrors();
  let valid = true;

  if (!form.question.trim()) {
    faqErrors.question = '질문을 입력해주세요';
    valid = false;
  }
  if (!form.answer.trim()) {
    faqErrors.answer = '답변을 입력해주세요';
    valid = false;
  }

  return valid;
};

const toggleExpand = (id: number) => {
  if (expandedFaqIds.value.has(id)) {
    expandedFaqIds.value.delete(id);
  } else {
    expandedFaqIds.value.add(id);
  }
  expandedFaqIds.value = new Set(expandedFaqIds.value);
};

const startAddFaq = () => {
  isAddingFaq.value = true;
  editingFaqId.value = null;
  expandedFaqIds.value = new Set();
  faqForm.question = '';
  faqForm.answer = '';
  clearErrors();
};

const cancelAddFaq = () => {
  isAddingFaq.value = false;
  editingFaqId.value = null;
  faqForm.question = '';
  faqForm.answer = '';
  clearErrors();
};

const saveFaq = async () => {
  if (!validateFaqForm(faqForm)) return;

  const data = {
    question: faqForm.question.trim(),
    answer: faqForm.answer.trim(),
  };

  try {
    if (editingFaqId.value) {
      await updateFaq(editingFaqId.value, data);
      snackbarRef.value?.show('FAQ가 수정되었습니다.', 'success');
    } else {
      await writeFaq(data);
      snackbarRef.value?.show('FAQ가 추가되었습니다.', 'success');
    }
    cancelAddFaq();
    fetchFaqs();
  } catch {
    snackbarRef.value?.show(
      editingFaqId.value ? '수정에 실패했습니다.' : '추가에 실패했습니다.',
      'error',
    );
  }
};

const startEditFaq = (faq: Faq) => {
  editingFaqId.value = faq.id;
  isAddingFaq.value = true;
  expandedFaqIds.value = new Set();
  faqForm.question = faq.question;
  faqForm.answer = faq.answer;
  clearErrors();
};

const deleteFaq = async (id: number) => {
  const confirmed = await confirmModalRef.value?.show(
    '해당 FAQ가 삭제됩니다',
    '정말 삭제하시겠어요?',
  );

  if (!confirmed) return;

  try {
    await deleteFaqApi(id);
    snackbarRef.value?.show('FAQ가 삭제되었습니다.', 'success');
    fetchFaqs();
  } catch {
    snackbarRef.value?.show('삭제에 실패했습니다.', 'error');
  }
};
</script>

<style scoped>
.page {
  --bg-surface: #22252e;
  --bg-raised: #2a2d38;
  --bg-base: #1a1c22;
  --bg-hover: #30333f;
  --border-mid: #383c50;
  --border-low: #2e3140;
  --text-primary: #f0f2f5;
  --text-secondary: #9aa0b0;
  --text-muted: #5c6278;
  --mint: #6fcfc3;
  --mint-dim: #4ab5a8;
  --mint-glow: rgba(111, 207, 195, 0.12);
  --border: #2e3140;

  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  background: var(--bg-base);
  min-height: 100vh;
  padding: 28px 32px 48px;
  color: var(--text-primary);
  box-sizing: border-box;
}

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

/* 테이블 */
.table-wrap {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow-x: auto;
  margin-bottom: 20px;
  min-height: auto;
  display: flex;
  flex-direction: column;
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
.data-table td {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  text-align: center;
}

.data-row {
  border-bottom: 1px solid var(--border);
  transition: background-color 0.15s;
  cursor: pointer;
}

.data-row:hover {
  background: var(--bg-hover);
}

.data-row {
  cursor: pointer;
}

.data-row.expanded {
  background: var(--bg-hover);
}

/* 컬럼 너비 */
.col-expand {
  width: 30px;
  color: var(--text-muted) !important;
}
.col-question {
  width: 280px;
  text-align: left !important;
}
.col-created {
  width: 90px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-modified {
  width: 90px;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}
.col-action {
  width: 80px;
  text-align: center;
}

/* 읽기 모드 */
.question-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-icon {
  transition: transform 0.2s;
  color: var(--text-muted);
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.detail-row {
  background: var(--bg-base);
  border-bottom: 1px solid var(--border);
}

.detail-cell {
  padding: 0 !important;
}

.detail-content {
  padding: 14px 40px 14px 80px;
  animation: slideDown 0.2s ease;
  text-align: left;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-header {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.answer-text {
  margin-top: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: pre-wrap;
}

/* 작업 버튼 */
.row-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
}

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

/* 편집 모드 - 인라인 편집 제거됨 */

.empty-cell {
  text-align: center !important;
  padding: 52px 0px !important;
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

/* 반응형 */
@media (max-width: 1024px) {
  .page {
    padding: 16px;
  }

  .col-created,
  .col-modified {
    display: none;
  }

  .data-table th:nth-child(4),
  .data-table td:nth-child(4),
  .data-table th:nth-child(5),
  .data-table td:nth-child(5) {
    display: none;
  }
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
  width: 480px;
  max-width: 90vw;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.2s ease;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-mid);
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--mint);
}

.modal-title-wrap svg {
  color: var(--mint);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close:hover {
  background: var(--bg-raised);
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 10px 12px;
  background: var(--bg-base);
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

.form-textarea {
  padding: 10px 12px;
  background: var(--bg-base);
  border: 1px solid var(--border-mid);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--mint);
}

.form-textarea::placeholder {
  color: var(--text-muted);
}

.field-error {
  font-size: 11px;
  color: #ff6b6b;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px 18px;
  border-top: 1px solid var(--border-mid);
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
  background: var(--bg-raised);
  color: var(--text-primary);
}

.btn-modal-save {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  background: var(--mint);
  border: none;
  color: #0f1115;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
}

.btn-modal-save:hover {
  background: var(--mint-dim);
}
</style>
