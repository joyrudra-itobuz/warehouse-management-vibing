import type {
  ForgotPasswordDto,
  LoginDto,
  SendOtpDto,
  SignupDto,
} from "@/lib/apis/swagger/auth-types";
import request from "@/lib/apis/http/request/request";
import type {
  ForgotPasswordResponse,
  LoginResponse,
  SendOtpResponse,
  SignupResponse,
} from "@/types/apis/auth/auth-response-types/auth-response-types";

const authRoutes = {
  signup: async (payload: SignupDto) => {
    return request<SignupResponse, SignupDto>({
      path: "/user/auth/signup",
      method: "POST",
      payload,
    });
  },
  login: async (payload: LoginDto) => {
    return request<LoginResponse, LoginDto>({
      path: "/user/auth/login",
      method: "POST",
      payload,
    });
  },
  sendOtp: async (payload: SendOtpDto) => {
    return request<SendOtpResponse, SendOtpDto>({
      path: "/user/auth/send-otp",
      method: "POST",
      payload,
    });
  },
  forgotPassword: async (payload: ForgotPasswordDto) => {
    return request<ForgotPasswordResponse, ForgotPasswordDto>({
      path: "/user/auth/forgot-password",
      method: "POST",
      payload,
    });
  },
};

export default authRoutes;
