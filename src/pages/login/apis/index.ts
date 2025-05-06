import type * as Auth from "./type";
import { request } from "@/http/axios";

export function getCaptchaApi() {
  return request<Auth.CaptchaResponseData>({
    url: "auth/captcha",
    method: "get",
  });
}

export function loginApi(data: Auth.LoginRequestData) {
  return request<Auth.LoginResponseData>({
    url: "auth/login",
    method: "post",
    data,
  });
}
