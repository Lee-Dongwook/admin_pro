import { useUserStore } from "@/pinia/stores/user";
import { isArray } from "@@/utils/validate";

export function checkPermission(permissionRoles: string[]): boolean {
  if (isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStore();
    return roles.some((role: any) => permissionRoles.includes(role));
  } else {
    console.error("Permission Error");
    return false;
  }
}
