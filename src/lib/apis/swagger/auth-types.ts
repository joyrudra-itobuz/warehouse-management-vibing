export type AuthRole = "ADMIN" | "MANAGER" | "STAFF";

export type LoginDto = {
  email: string;
  password: string;
};

export type SignupDto = {
  role: AuthRole;
  email: string;
};

export type SendOtpDto = {
  email: string;
};

export type ForgotPasswordDto = {
  email: string;
  otp: string;
  password: string;
};

export type ApiErrorShape = {
  message?: string | string[];
};
