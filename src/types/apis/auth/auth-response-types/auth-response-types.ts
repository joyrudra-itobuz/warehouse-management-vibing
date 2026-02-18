export type AuthApiMessageResponse = {
  message?: string;
};

export type AuthUserResponse = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export type LoginResponse = AuthApiMessageResponse & {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUserResponse;
};

export type SignupResponse = AuthApiMessageResponse & {
  email?: string;
  role?: string;
};

export type SendOtpResponse = AuthApiMessageResponse;

export type ForgotPasswordResponse = AuthApiMessageResponse;
