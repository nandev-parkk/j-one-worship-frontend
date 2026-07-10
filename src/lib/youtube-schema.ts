import { z } from 'zod';

export const registerYouTubeVideoSchema = z.object({
  videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, '유효한 YouTube 영상이 아닙니다.'),
});
