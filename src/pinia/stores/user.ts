import { getCurrentUserApi } from "@/common/apis/users";
import {
  setToken as _setToken,
  getToken,
  removeToken,
} from "@/common/utils/cache/cookies";

import { pinia } from "@/pinia";
import { resetRouter } from "@/router";
import { routerConfig } from "@/router/config";
import { useSettingsStore } from "./settings";
import { useTagsViewStore } from "./tags-view";

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "");
  const roles = ref<string[]>([]);
  const username = ref<string>("");

  const tagsViewStore = useTagsViewStore();
  const settingsStore = useSettingsStore();

  const setToken = (value: string) => {
    _setToken(value);
    token.value = value;
  };

  const getInfo = async () => {
    const { data } = await getCurrentUserApi();
    username.value = data.username;
    // eslint-disable-next-line style/operator-linebreak
    roles.value =
      data.roles?.length > 0 ? data.roles : routerConfig.defaultRoles;
  };

  const changeRoles = (role: string) => {
    const newToken = `token-${role}`;
    token.value = newToken;
    _setToken(newToken);
    location.reload();
  };

  const logout = () => {
    removeToken();
    token.value = "";
    roles.value = [];
    resetRouter();
    resetTagsView();
  };

  const resetToken = () => {
    removeToken();
    token.value = "";
    roles.value = [];
  };

  const resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews();
      tagsViewStore.delAllCachedViews();
    }
  };
  return {
    token,
    roles,
    username,
    setToken,
    getInfo,
    changeRoles,
    logout,
    resetToken,
  };
});

export function useUserStoreOutSide() {
  return useUserStore(pinia);
}
