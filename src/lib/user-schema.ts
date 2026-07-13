import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .regex(/^[가-힣]+$/, '이름은 한글만 입력 가능합니다.')
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(10, '이름은 10자 이내여야 합니다.'),
  username: z.string().min(3, '아이디는 3자 이상이어야 합니다.'),
  part: z.enum(['vocal', 'drums', 'guitar', 'bass', 'keyboard']).nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, '현재 비밀번호를 입력해주세요.'),
  newPassword: z
    .string()
    .min(6, '비밀번호는 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/[a-z]/, '비밀번호는 영문 소문자를 포함해야 합니다.')
    .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다.')
    .regex(/[^a-zA-Z0-9]/, '비밀번호는 특수문자를 포함해야 합니다.'),
  newPasswordConfirm: z.string().min(6, '비밀번호 확인을 입력해주세요.'),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['newPasswordConfirm'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
