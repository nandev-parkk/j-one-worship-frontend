import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, '아이디는 4자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.')
    .regex(
      /^[a-z0-9\-_.]+$/,
      '아이디는 영문 소문자, 숫자, 특수 기호(-, _, .)만 사용 가능합니다.',
    ),
  password: z
    .string()
    .min(6, '비밀번호는 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
