import type { App, Directive } from "vue";
import { useUserStore } from "@/pinia/stores/user";
import { isArray } from "@@/utils/validate";

const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding;
    const { roles } = useUserStore();
    if (isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = roles.some((role: any) =>
        permissionRoles.includes(role),
      );
      hasPermission || el.parentNode?.removeChild(el);
    } else {
      throw new Error(`Permission Denied`);
    }
  },
};

export function installPermissionDirective(app: App) {
  app.directive("permission", permission);
}
