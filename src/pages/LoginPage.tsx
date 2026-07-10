import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/ui/Footer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'
import { loginSchema, type LoginSchema } from '@/lib/auth-schema'
import { Eye, EyeOff } from 'lucide-react'
import logo from '/public/logo.png'
import * as React from 'react'

/* ──────────────────────────── Semicolon Cross Mark ──────────────────────────── */

/**
 * J-One Worship 의 시그니처 마크.
 * 세미콜론(;) 을 십자가로 재해석 — 정지 후 계속하기, 예배의 본질.
 */
const SemicolonCross: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Vertical cross arm */}
    <line
      x1="40"
      y1="18"
      x2="40"
      y2="62"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Horizontal cross bar */}
    <line
      x1="26"
      y1="36"
      x2="54"
      y2="36"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)

/* ──────────────────────────── Brand Panel ──────────────────────────── */

const BrandPanel: React.FC = () => (
  <div className="relative hidden lg:flex lg:w-[420px] shrink-0 flex-col justify-between overflow-hidden p-10">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0F2B54] via-[#2977DC] to-[#6A9DE0]" />

    {/* Decorative circles */}
    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10 bg-white" />
    <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-5 bg-white" />

    {/* Content — relative to stay above decorations */}
    <div className="relative z-10 flex flex-col items-center text-center text-white">
      <SemicolonCross size={64} />
      {/*<h1*/}
      {/*  className="mt-6 text-3xl font-bold tracking-tight text-white"*/}
      {/*>*/}
      {/*  J-One Worship*/}
      {/*</h1>*/}
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        함께 예배하는 모든 순간을
        <br />
        하나로 연결합니다
      </p>
    </div>

    <div className="relative z-10">
      <p className="text-xs leading-relaxed text-white/50">
        우리의 소망이신 예수님만을 예배합니다.
      </p>
    </div>
  </div>
)

/* ──────────────────────────── Login Form ──────────────────────────── */

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useLogin()

  const [showPassword, setShowPassword] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginSchema) => {
    login(data, {
      onSuccess: () => {
        navigate('/')
      },
      onError: (error) => {
        const axiosError = error as {
          response?: { data?: { error?: { message?: string } }; status?: number }
        }
        const serverMessage = axiosError.response?.data?.error?.message
        if (serverMessage) {
          setFieldError(serverMessage)
          return
        }
        if (!axiosError.response) {
          setFieldError('네트워크 연결을 확인해 주세요.')
        } else if ((axiosError.response?.status ?? 0) >= 500) {
          setFieldError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        } else {
          setFieldError('로그인에 실패했습니다. 다시 시도해 주세요.')
        }
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-16 w-[480px] xl:w-[520px]">
      {/* Logo — shown on all screen sizes */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="logo" className="w-[80px]" />
      </div>

      {/* Heading */}
      <div className="w-full lg:max-w-md">
        <h2 className="text-2xl font-semibold tracking-tight">로그인</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 w-full lg:max-w-md space-y-5"
        noValidate
      >
        {/* Alert — always rendered to prevent layout shift */}
        <div
          className={`rounded-lg px-3 sm:px-4 py-3 text-sm ${fieldError ? 'visible bg-[#FDE8E8] text-[#D92020]' : 'hidden'}`}
          role="alert"
          aria-live="polite"
        >
          {fieldError}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-[#333333]">
            아이디
          </Label>
          <Input
            className="placeholder:text-gray-400"
            id="username"
            type="text"
            placeholder="아이디를 입력해주세요."
            disabled={isPending}
            aria-invalid={!!errors.username}
            {...register('username')}
          />
          {errors.username && (
            <p className="text-xs text-[#D92020]" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[#333333]">
            비밀번호
          </Label>
          <div className="relative">
            <Input
              className="placeholder:text-gray-400 pr-10"
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="비밀번호를 입력해주세요."
              disabled={isPending}
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 outline-none"
              tabIndex={-1}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-[#A9A9A9]" />
              ) : (
                <Eye size={18} className="text-[#A9A9A9]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[#D92020]" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full h-10 text-sm font-medium rounded-lg bg-gradient-to-br from-[#2977DC] to-[#6A9DE0]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"
                aria-hidden="true"
              />
              로그인 중…
            </span>
          ) : (
            '로그인'
          )}
        </Button>
      </form>
    </div>
  )
}

/* ──────────────────────────── Page ──────────────────────────── */

export const LoginPage: React.FC = () => (
  <div className="flex h-dvh w-full overflow-hidden bg-white">
    <BrandPanel />
    <div className="relative flex flex-1 flex-col overflow-hidden lg:overflow-y-auto">
      {/* Mobile-only decorative circles */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 lg:hidden" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#0F2B54]/5 lg:hidden" />
      <div className="pointer-events-none absolute right-10 top-1/3 h-40 w-40 rounded-full bg-[#2977DC]/5 lg:hidden" />
      <div className="flex flex-1 items-center justify-center">
        <LoginForm />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  </div>
)
