import type { RouteRecordRaw } from "vue-router";
import { routerConfig } from "@/router/config";
import { registerNavigationGuard } from "@/router/guard";
import { createRouter } from "vue-router";
import { flatMultiLevelRoutes } from "./helper";

const Layouts = () => import("@/layouts/index.vue");

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/pages/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      hidden: true,
    },
    alias: "/:pathMatch(.*)*",
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/demo",
    component: Layouts,
    redirect: "/demo/unocss",
    name: "Demo",
    meta: {
      title: "示例集合",
      elIcon: "DataBoard",
    },
    children: [
      {
        path: "unocss",
        component: () => import("@/pages/demo/unocss/index.vue"),
        name: "UnoCSS",
        meta: {
          title: "UnoCSS",
        },
      },
      {
        path: "element-plus",
        component: () => import("@/pages/demo/element-plus/index.vue"),
        name: "ElementPlus",
        meta: {
          title: "Element Plus",
          keepAlive: true,
        },
      },
      {
        path: "vxe-table",
        component: () => import("@/pages/demo/vxe-table/index.vue"),
        name: "VxeTable",
        meta: {
          title: "Vxe Table",
          keepAlive: true,
        },
      },
      {
        path: "level2",
        component: () => import("@/pages/demo/level2/index.vue"),
        redirect: "/demo/level2/level3",
        name: "Level2",
        meta: {
          title: "二级路由",
          alwaysShow: true,
        },
        children: [
          {
            path: "level3",
            component: () => import("@/pages/demo/level2/level3/index.vue"),
            name: "Level3",
            meta: {
              title: "三级路由",
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: "composable-demo",
        redirect: "/demo/composable-demo/use-fetch-select",
        name: "ComposableDemo",
        meta: {
          title: "组合式函数",
        },
        children: [
          {
            path: "use-fetch-select",
            component: () =>
              import("@/pages/demo/composable-demo/use-fetch-select.vue"),
            name: "UseFetchSelect",
            meta: {
              title: "useFetchSelect",
            },
          },
          {
            path: "use-fullscreen-loading",
            component: () =>
              import("@/pages/demo/composable-demo/use-fullscreen-loading.vue"),
            name: "UseFullscreenLoading",
            meta: {
              title: "useFullscreenLoading",
            },
          },
          {
            path: "use-watermark",
            component: () =>
              import("@/pages/demo/composable-demo/use-watermark.vue"),
            name: "UseWatermark",
            meta: {
              title: "useWatermark",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/link",
    meta: {
      title: "文档链接",
      elIcon: "Link",
    },
    children: [
      {
        path: "https://juejin.cn/post/7445151895121543209",
        component: () => {},
        name: "Link1",
        meta: {
          title: "中文文档",
        },
      },
      {
        path: "https://juejin.cn/column/7207659644487139387",
        component: () => {},
        name: "Link2",
        meta: {
          title: "新手教程",
        },
      },
    ],
  },
];

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page-level",
    name: "Permission",
    meta: {
      title: "权限演示",
      elIcon: "Lock",
      roles: ["admin", "editor"],
      alwaysShow: true,
    },
    children: [
      {
        path: "page-level",
        component: () => import("@/pages/demo/permission/page-level.vue"),
        name: "PermissionPageLevel",
        meta: {
          title: "页面级",
          roles: ["admin"],
        },
      },
      {
        path: "button-level",
        component: () => import("@/pages/demo/permission/button-level.vue"),
        name: "PermissionButtonLevel",
        meta: {
          title: "按钮级",
          roles: undefined,
        },
      },
    ],
  },
];

export const router = createRouter({
  history: routerConfig.history,
  routes: routerConfig.thirdLevelRouteCache
    ? flatMultiLevelRoutes(constantRoutes)
    : constantRoutes,
});

export function resetRouter() {
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route;
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch {
    location.reload();
  }
}

registerNavigationGuard(router);
