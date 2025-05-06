export interface LoginRequestData {
  username: "admin" | "editor";
  password: string;
  code: string;
}

export type CaptchaResponseData = ApiResponseData<string>;

export type LoginResponseData = ApiResponseData<{ token: string }>;
