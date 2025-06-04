import api from './axios';
import { ENDPOINTS } from '../config/constants';

export const login = (email: string, password: string) =>
  api.post(ENDPOINTS.LOGIN, { username: email, password });

export const verifyOtp = (id: string, email: string, code: string) =>
  api.post(ENDPOINTS.VERIFY_OTP, {
    id,
    verifyOtpDTO: {
      email,
      code,
      actionType: 'For Login',
    },
  });
