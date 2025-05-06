<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import type { LoginRequestData } from "./apis/type";
import { useSettingsStore } from "@/pinia/stores/settings";
import { useUserStore } from "@/pinia/stores/user";
import ThemeSwitch from "@@/components/ThemeSwitch/index.vue";
import { Key, Loading, Lock, Picture, User } from "@element-plus/icons-vue";
import { getCaptchaApi, loginApi } from "./apis";
import Owl from "./components/Owl.vue";
import { useFocus } from "./composables/useFocus";

const router = useRouter();

const userStore = useUserStore();

const settingsStore = useSettingsStore();

const { isFocus, handleBlur, handleFocus } = useFocus();
</script>
