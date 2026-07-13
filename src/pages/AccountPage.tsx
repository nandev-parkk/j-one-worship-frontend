import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetMe, useUpdateProfile, useChangePassword } from '@/hooks/useUsers'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/user-schema'
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/user-schema'
import type { UserRole, UserPart } from '@/lib/auth-types'

const roleLabels: Record<UserRole, string> = {
  admin: '관리자',
  manager: '매니저',
  user: '사용자',
}

const partLabels: Record<UserPart, string> = {
  vocal: '보컬',
  drums: '드럼',
  guitar: '기타',
  bass: '베이스',
  keyboard: '건반',
}

const partOptions: { value: UserPart | ''; label: string }[] = [
  { value: '', label: '선택 안 함' },
  { value: 'vocal', label: '보컬' },
  { value: 'drums', label: '드럼' },
  { value: 'guitar', label: '기타' },
  { value: 'bass', label: '베이스' },
  { value: 'keyboard', label: '건반' },
]

export const AccountPage = () => {
  const { data, isPending, isError } = useGetMe()

  // ── 기본 정보 폼 ──────────────────────────────────────────
  const {
    control: controlProfile,
    reset: resetProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      username: '',
      part: null,
    },
  })

  useEffect(() => {
    if (!data) return
    resetProfile({
      name: data.name,
      username: data.username,
      part: data.part,
    })
  }, [data, resetProfile])

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const onSubmitProfile = (formData: UpdateProfileInput) => {
    if (!data) return
    const input: UpdateProfileInput = { name: formData.name, username: formData.username }
    if (data.role !== 'user') {
      input.part = formData.part
    }
    updateProfile(
      { id: data.id, input },
      {
        onSuccess: () => {
          setProfileError(null)
          setFieldErrors({})
          setProfileSuccess(true)
          setTimeout(() => setProfileSuccess(false), 3000)
        },
        onError: (error) => {
          const axiosError = error as {
            response?: { data?: { error?: { message?: string; details?: { field: string; message: string }[] } }; status?: number }
          }
          const serverMessage = axiosError.response?.data?.error?.message
          const details = axiosError.response?.data?.error?.details
          if (details) {
            const errors: Record<string, string> = {}
            details.forEach((d) => { errors[d.field] = d.message })
            setFieldErrors(errors)
          }
          if (serverMessage) {
            setProfileError(serverMessage)
            return
          }
          if (!axiosError.response) {
            setProfileError('네트워크 연결을 확인해 주세요.')
          } else if ((axiosError.response?.status ?? 0) >= 500) {
            setProfileError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
          } else {
            setProfileError('기본 정보 수정에 실패했습니다. 다시 시도해 주세요.')
          }
          setProfileSuccess(false)
        },
      },
    )
  }

  // ── 비밀번호 변경 폼 ──────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  })

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<Record<string, string>>({})

  const onSubmitPassword = (formData: ChangePasswordInput) => {
    if (!data) return
    changePassword(
      { id: data.id, input: formData },
      {
        onSuccess: () => {
          setPasswordError(null)
          setPasswordFieldErrors({})
          setPasswordSuccess(true)
          setTimeout(() => setPasswordSuccess(false), 3000)
        },
        onError: (error) => {
          const axiosError = error as {
            response?: { data?: { error?: { message?: string; details?: { field: string; message: string }[] } }; status?: number }
          }
          const serverMessage = axiosError.response?.data?.error?.message
          const details = axiosError.response?.data?.error?.details
          if (details) {
            const errors: Record<string, string> = {}
            details.forEach((d) => { errors[d.field] = d.message })
            setPasswordFieldErrors(errors)
          }
          if (serverMessage) {
            setPasswordError(serverMessage)
            return
          }
          if (!axiosError.response) {
            setPasswordError('네트워크 연결을 확인해 주세요.')
          } else if ((axiosError.response?.status ?? 0) >= 500) {
            setPasswordError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
          } else {
            setPasswordError('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.')
          }
          setPasswordSuccess(false)
        },
      },
    )
  }

  // ── 로딩 / 에러 ──────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-1 items-center justify-center text-[#EF4444] text-sm">
        사용자 정보를 불러오지 못했습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#222222]">내 정보</h1>
      </div>

      {/* 기본 정보 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[#222222]">기본 정보</h2>

        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="flex flex-col gap-4" noValidate>
          {/* 필드 에러 메시지 */}
          {profileError && (
            <div className="rounded-lg px-3 sm:px-4 py-3 text-sm bg-[#FDE8E8] text-[#D92020]" role="alert">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="rounded-lg px-3 sm:px-4 py-3 text-sm bg-[#F0FDF4] text-[#16A34A]" role="status">
              기본 정보가 저장되었습니다.
            </div>
          )}

          {/* 이름 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">이름</Label>
            <Controller
              name="name"
              control={controlProfile}
              render={({ field }) => (
                <Input
                  {...field}
                  className={`h-10 rounded-lg text-sm ${(profileErrors.name || fieldErrors.name) ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                />
              )}
            />
            {(profileErrors.name || fieldErrors.name) && (
              <p className="text-xs text-[#D92020]">{profileErrors.name?.message ?? fieldErrors.name}</p>
            )}
          </div>

          {/* 아이디 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">아이디</Label>
            <Controller
              name="username"
              control={controlProfile}
              render={({ field }) => (
                <Input
                  {...field}
                  className={`h-10 rounded-lg text-sm ${(profileErrors.username || fieldErrors.username) ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                />
              )}
            />
            {(profileErrors.username || fieldErrors.username) && (
              <p className="text-xs text-[#D92020]">{profileErrors.username?.message ?? fieldErrors.username}</p>
            )}
          </div>

          {/* 역할 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">역할</Label>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                data.role === 'admin'
                  ? 'bg-[#EFF6FF] text-[#2977DC]'
                  : data.role === 'manager'
                    ? 'bg-[#F0FDF4] text-[#22C55E]'
                    : 'bg-[#F5F5F5] text-[#8F8F8F]'
              }`}
            >
              {roleLabels[data.role]}
            </span>
          </div>

          {/* 파트 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">파트</Label>
            {data.role === 'user' ? (
              <span className="text-sm text-[#8F8F8F]">
                {data.part ? partLabels[data.part] : '-'}
              </span>
            ) : (
              <Controller
                name="part"
                control={controlProfile}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(val) => field.onChange(val || null)}
                  >
                    <SelectTrigger className="h-10 rounded-lg text-sm border-[#E8E8E8]">
                      <SelectValue placeholder="파트를 선택해주세요." />
                    </SelectTrigger>
                    <SelectContent>
                      {partOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="h-9 text-sm font-medium rounded-lg bg-gradient-to-br from-[#2977DC] to-[#6A9DE0]"
            >
              {isUpdatingProfile ? '저장 중…' : '저장'}
            </Button>
          </div>
        </form>
      </div>

      <Separator className="bg-[#E8E8E8]" />

      {/* 비밀번호 변경 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[#222222]">비밀번호 변경</h2>

        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-4" noValidate>
          {/* 필드 에러 메시지 */}
          {passwordError && (
            <div className="rounded-lg px-3 sm:px-4 py-3 text-sm bg-[#FDE8E8] text-[#D92020]" role="alert">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-lg px-3 sm:px-4 py-3 text-sm bg-[#F0FDF4] text-[#16A34A]" role="status">
              비밀번호가 변경되었습니다.
            </div>
          )}

          {/* 현재 비밀번호 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">현재 비밀번호</Label>
            <div className="relative">
              <Input
                {...registerPassword('currentPassword')}
                type={showPassword ? 'text' : 'password'}
                className={`placeholder:text-gray-400 pr-10 h-10 rounded-lg text-sm ${((passwordErrors.currentPassword) || passwordFieldErrors.currentPassword) ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 outline-none"
                tabIndex={-1}
                aria-label={showPassword ? '숨기기' : '보기'}
              >
                {showPassword ? (
                  <Eye size={18} className="text-[#A9A9A9]" />
                ) : (
                  <EyeOff size={18} className="text-[#A9A9A9]" />
                )}
              </button>
            </div>
            {((passwordErrors.currentPassword) || passwordFieldErrors.currentPassword) && (
              <p className="text-xs text-[#D92020]">{passwordErrors.currentPassword?.message ?? passwordFieldErrors.currentPassword}</p>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">새 비밀번호</Label>
            <div className="relative">
              <Input
                {...registerPassword('newPassword')}
                type={showPassword ? 'text' : 'password'}
                className={`placeholder:text-gray-400 pr-10 h-10 rounded-lg text-sm ${((passwordErrors.newPassword) || passwordFieldErrors.newPassword) ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 outline-none"
                tabIndex={-1}
                aria-label={showPassword ? '숨기기' : '보기'}
              >
                {showPassword ? (
                  <Eye size={18} className="text-[#A9A9A9]" />
                ) : (
                  <EyeOff size={18} className="text-[#A9A9A9]" />
                )}
              </button>
            </div>
            {((passwordErrors.newPassword) || passwordFieldErrors.newPassword) && (
              <p className="text-xs text-[#D92020]">{passwordErrors.newPassword?.message ?? passwordFieldErrors.newPassword}</p>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="space-y-1.5">
            <Label className="text-[#333333]">새 비밀번호 확인</Label>
            <div className="relative">
              <Input
                {...registerPassword('newPasswordConfirm')}
                type={showPassword ? 'text' : 'password'}
                className={`placeholder:text-gray-400 pr-10 h-10 rounded-lg text-sm ${((passwordErrors.newPasswordConfirm) || passwordFieldErrors.newPasswordConfirm) ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 outline-none"
                tabIndex={-1}
                aria-label={showPassword ? '숨기기' : '보기'}
              >
                {showPassword ? (
                  <Eye size={18} className="text-[#A9A9A9]" />
                ) : (
                  <EyeOff size={18} className="text-[#A9A9A9]" />
                )}
              </button>
            </div>
            {((passwordErrors.newPasswordConfirm) || passwordFieldErrors.newPasswordConfirm) && (
              <p className="text-xs text-[#D92020]">{passwordErrors.newPasswordConfirm?.message ?? passwordFieldErrors.newPasswordConfirm}</p>
            )}
          </div>

          {/* 변경 버튼 */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="h-9 text-sm font-medium rounded-lg bg-gradient-to-br from-[#2977DC] to-[#6A9DE0]"
            >
              {isChangingPassword ? '변경 중…' : '비밀번호 변경'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
