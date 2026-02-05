<template>
  <div class="page-title">
    <h3>구독 서비스 목록</h3>
    <hr class="my-4" />
  </div>
  <table class="table table-dark table-hover align-middle">
    <thead>
      <tr>
        <th class="id-col" scope="col">ID</th>
        <th class="logo-col" scope="col">로고</th>
        <th class="name-col" scope="col">이름</th>
        <th class="type-col" scope="col">타입</th>
        <th class="plan-url-col" scope="col">플랜 페이지</th>
        <th class="created-at-col" scope="col">등록일</th>
        <th class="updated-at-col" scope="col">최근 수정일</th>
        <th class="action-col" scope="col">작업</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="subscription in subscriptions" :key="subscription.id">
        <th class="id-col" scope="row">{{ subscription.id }}</th>
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
        <td class="type-col">{{ subscription.type }}</td>
        <td class="type-col">
          <a
            v-if="subscription.planUrl"
            :href="subscription.planUrl"
            target="_blank"
            class="link"
          >
            링크
          </a>
          <span v-else>-</span>
        </td>
        <td class="type-col">{{ subscription.createdAt }}</td>
        <td class="type-col">{{ subscription.lastModifiedAt }}</td>
        <td class="action-col">
          <button
            class="btn btn-sm btn-update me-2"
            type="button"
            @click="goUpdateSubscription(subscription.id)"
          >
            관리
          </button>
          <button class="btn btn-sm btn-delete">삭제</button>
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
const goUpdateSubscription = (id: number) => {
  router.push(`/subscriptions/${id}/update`);
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
  width: 98%;
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

.link {
  color: #6fcfc3;
  text-decoration: underline;
  cursor: pointer;
}

.link:hover {
  color: #57b9ad;
}

.btn-update {
  background-color: #6fcfc3;
  border-color: #6fcfc3;
  color: #000;
}

.btn-update:hover {
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
