import type { LoginDto, SignupDto } from "@/lib/apis/swagger/auth-types";
import request from "@/lib/apis/http/request/request";
import type {
  LoginResponse,
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
};

export default authRoutes;
