<template>
  <div class="page-title mb-4">
    <h3>구독 서비스 목록</h3>
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
</template>

<script setup lang="ts">
import { getSubscriptions } from '@/api/subscriptions';
import { onMounted, ref } from 'vue';
import type { Subscription } from '@/api/types';
import { useRouter } from 'vue-router';

const subscriptions = ref<Subscription[]>([]);

const router = useRouter();
const goSubscriptionDetail = (id: number) => {
  router.push(`/subscriptions/${id}`);
};

const fetchSubscriptions = async () => {
  const response = await getSubscriptions();
  subscriptions.value = response.data.subscriptions;
};

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

.btn-detail {
  background-color: #6fcfc3;
  border-color: #6fcfc3;
  color: #000;
}

.btn-detail:hover {
  background-color: #5bb8ad;
  border-color: #5bb8ad;
}

.btn-delete {
  background-color: #444;
  border-color: #444;
  color: #fff;
}

.btn-delete:hover {
  background-color: #666;
}
</style>
