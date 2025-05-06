import type {
  RouteLocationNormalizedGeneric,
  RouteRecordNameGeneric,
} from "vue-router";

const whiteListByPath: string[] = ["/login"];

const whiteListByName: RouteRecordNameGeneric[] = [];

export function isWhiteList(to: RouteLocationNormalizedGeneric) {
  return whiteListByPath.includes(to.path) || whiteListByName.includes(to.name);
}
