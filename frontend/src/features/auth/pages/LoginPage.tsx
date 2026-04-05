import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { Mail, Lock, EyeClosed, Eye, UserRoundPlus } from "lucide-react"
import { useLogin } from "../hooks/useAuth"
import { loginSchema, type LoginFormData } from "../schemas/auth.schemas"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      { onSuccess: () => navigate("/dashboard") }
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <img src="/Logo.svg" alt="Financy" className="h-8" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Entre na sua conta para continuar
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-light border border-red-base/30 px-4 py-3 text-sm text-red-dark">
            {(error as Error).message || "Credenciais inválidas"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <div
              className={clsx(
                "flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white transition-colors",
                errors.email ? "border-red-base" : "border-gray-300 focus-within:border-brand-base"
              )}
            >
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                autoComplete="email"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-red-base">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div
              className={clsx(
                "flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white transition-colors",
                errors.password ? "border-red-base" : "border-gray-300 focus-within:border-brand-base"
              )}
            >
              <Lock className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-base">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-brand-base"
                {...register("rememberMe")}
              />
              <span className="text-sm text-gray-600">Lembrar-me</span>
            </label>
            <button
              type="button"
              className="cursor-pointer text-sm text-brand-base hover:text-brand-dark font-medium transition-colors"
            >
              Recuperar senha
            </button>
          </div>

          <button
            id="btn-login"
            type="submit"
            disabled={isPending}
            className="cursor-pointer w-full bg-brand-base hover:bg-brand-dark disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-3 transition-colors"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">ou</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mb-3">
          Ainda não tem uma conta?
        </p>
        <Link
          to="/cadastro"
          className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserRoundPlus className="h-4 w-4" />
          Criar conta
        </Link>
      </div>
    </div>
  )
}
