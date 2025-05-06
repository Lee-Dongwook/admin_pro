<script lang="ts" setup>
import { useGreyAndColorWeakness } from "@@/composables/useGreyAndColorWeakness";
import { usePany } from "@@/composables/usePany";
import { useTheme } from "@@/composables/useTheme";
import koKR from "element-plus/es/locale/lang/ko-kr";

const { initTheme } = useTheme();
const { initGreyAndColorWeakness } = useGreyAndColorWeakness();
const { initStarNotification, initStoreNotification } = usePany();

initTheme();
initGreyAndColorWeakness();
initStarNotification();
initStoreNotification();
</script>

<template>
  <el-config-provider :locale="koKR">
    <router-view />
  </el-config-provider>
</template>
