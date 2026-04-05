import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { Mail, Lock, EyeClosed, Eye, UserRound, LogIn } from "lucide-react"
import { useRegister } from "../hooks/useAuth"
import { registerSchema, type RegisterFormData } from "../schemas/auth.schemas"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { mutate: registerUser, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data, { onSuccess: () => navigate("/dashboard") })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <img src="/Logo.svg" alt="Financy" className="h-8" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1">
            Comece a controlar suas finanças ainda hoje
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-light border border-red-base/30 px-4 py-3 text-sm text-red-dark">
            {(error as Error).message || "Erro ao criar conta"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <div
              className={clsx(
                "flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white transition-colors",
                errors.name ? "border-red-base" : "border-gray-300 focus-within:border-brand-base"
              )}
            >
              <UserRound className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                autoComplete="name"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-xs text-red-base">{errors.name.message}</p>}
          </div>

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
                autoComplete="new-password"
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
            {errors.password ? (
              <p className="text-xs text-red-base">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-gray-400">A senha deve ter no mínimo 8 caracteres</p>
            )}
          </div>

          <button
            id="btn-register"
            type="submit"
            disabled={isPending}
            className="cursor-pointer w-full bg-brand-base hover:bg-brand-dark disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-3 transition-colors"
          >
            {isPending ? "Criando conta..." : "Cadastrar"}
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
          Já tem uma conta?
        </p>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          Fazer login
        </Link>
      </div>
    </div>
  )
}
