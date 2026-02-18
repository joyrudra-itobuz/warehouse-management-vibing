export type AuthApiResponseEnvelope<TData = undefined> = {
  message: string;
  success: boolean;
  data: TData;
};

export type AuthUserResponse = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export type LoginResponseData = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthUserResponse;
};

export type SignupResponseData = {
  email?: string;
  role?: string;
};

export type LoginResponse = AuthApiResponseEnvelope<LoginResponseData>;

export type SignupResponse = AuthApiResponseEnvelope<SignupResponseData>;

export type SendOtpResponse = AuthApiResponseEnvelope<null>;

export type ForgotPasswordResponse = AuthApiResponseEnvelope<null>;
