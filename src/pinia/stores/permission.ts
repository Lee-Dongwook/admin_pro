import type { RouteRecordRaw } from "vue-router";
import { pinia } from "@/pinia";
import { constantRoutes, dynamicRoutes } from "@/router";
import { routerConfig } from "@/router/config";
import { flatMultiLevelRoutes } from "@/router/helper";
import { ref } from "vue";

function hasPermission(roles: string[], route: RouteRecordRaw) {
  const routerRoles = route.meta?.roles;
  return routerRoles
    ? roles.some((role: any) => routerRoles.includes(role))
    : true;
}

function filterDynamicRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tempRoute = { ...route };
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles);
      }
      res.push(tempRoute);
    }
  });
  return res;
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const addRoutes = ref<RouteRecordRaw[]>([]);

  const set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes);
    addRoutes.value = routerConfig.thirdLevelRouteCache
      ? flatMultiLevelRoutes(accessedRoutes)
      : accessedRoutes;
  };

  const setRoutes = (roles: string[]) => {
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes, roles);
    set(accessedRoutes);
  };

  const setAllRoutes = () => {
    set(dynamicRoutes);
  };

  return { routes, addRoutes, setRoutes, setAllRoutes };
});

export function usePermissionStoreOutside() {
  return usePermissionStore(pinia);
}
