import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { Mail, UserRound, LogOut } from "lucide-react"
import { Separator } from "@/core/components/ui/separator"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useUpdateMe } from "@/features/auth/hooks/useAuth"
import { getInitials } from "@utils/formatters"
import { profileSchema, type ProfileFormData } from "../schemas/profile.schemas"

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const updateMe = useUpdateMe()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  })

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
  }

  const onSubmit = (data: ProfileFormData) => {
    updateMe.mutate(data.name)
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 mb-4">
            {user ? getInitials(user.name) : "?"}
          </div>
          <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        <Separator className="mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
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
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-xs text-red-base">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="flex-1 text-sm text-gray-500">{user?.email}</span>
            </div>
            <p className="text-xs text-gray-400">O e-mail não pode ser alterado</p>
          </div>

          <button
            type="submit"
            disabled={updateMe.isPending}
            className="cursor-pointer w-full bg-brand-base hover:bg-brand-dark disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-3 transition-colors"
          >
            {updateMe.isPending ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="cursor-pointer mt-3 w-full flex items-center justify-center gap-2 border border-gray-200 text-danger hover:bg-red-light text-sm font-medium rounded-lg py-3 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </div>
    </div>
  )
}
