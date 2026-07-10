import { z } from 'zod';

export const createPerformanceSchema = z.object({
  name: z.string().min(1, '공연 이름을 입력해주세요.'),
  description: z.string().max(100, '설명은 100자 이내로 입력해주세요.').optional(),
  datetime: z.union([z.string(), z.date()]).refine(
    (val) => new Date(val).getTime() > 0,
    { message: '유효한 일시를 입력해주세요.' },
  ),
  location: z.string().min(1, '장소를 입력해주세요.'),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
});

export type CreatePerformanceInput = z.infer<typeof createPerformanceSchema>;

export const updatePerformanceSchema = createPerformanceSchema.partial();

export type UpdatePerformanceInput = z.infer<typeof updatePerformanceSchema>;

export const listPerformancesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
});

export type ListPerformancesParams = z.infer<typeof listPerformancesSchema>;

export const listSetlistSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type ListSetlistParams = z.infer<typeof listSetlistSchema>;

export const addSetlistSchema = z.object({
  videoId: z.number().int().positive('유효한 영상 ID여야 합니다.'),
});

export type AddSetlistInput = z.infer<typeof addSetlistSchema>;

export const updateSetlistOrderSchema = z.object({
  order: z.array(
    z.object({
      setlistId: z.number().int().positive('유효한 선정 곡 ID여야 합니다.'),
      orderIndex: z.number().int().min(1, '순서는 1 이상이어야 합니다.'),
    }),
  ).min(1, '최소 하나의 곡이 필요합니다.'),
});

export type UpdateSetlistOrderInput = z.infer<typeof updateSetlistOrderSchema>;
