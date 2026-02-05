<template>
  <div class="d-flex" style="min-height: 100vh">
    <TheNav />

    <div class="content-area flex-grow-1 p-4">
      <TheView />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheNav from './layouts/TheNav.vue';
import TheView from './layouts/TheView.vue';
</script>

<style>
.content-area {
  background-color: #242429;
}
</style>
