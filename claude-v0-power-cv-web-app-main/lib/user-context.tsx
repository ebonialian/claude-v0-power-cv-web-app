"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, Plan, AnalysisResult, UserProfile } from './types'
import { getBrowserSupabaseClient } from '@/lib/supabase/client'

interface UserContextType {
  user: User | null
  isLoading: boolean
  isPro: boolean
  analyses: AnalysisResult[]
  userProfile: UserProfile | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, fullName: string) => Promise<boolean>
  logout: () => void
  updatePlan: (plan: Plan) => void
  addAnalysis: (analysis: AnalysisResult) => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const ANALYSES_KEY = 'powercv_analyses'
const PROFILE_KEY = 'powercv_profile'

const supabase = getBrowserSupabaseClient()

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUserFromSupabase = async () => {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      setUser(null)
      return null
    }

    const authUser = data.user

    const { data: profileData } = await supabase
      .from('profiles')
      .select('plan, full_name, created_at, lemonsqueezy_renews_at, lemonsqueezy_manage_url')
      .eq('id', authUser.id)
      .maybeSingle()

    const plan: Plan = profileData?.plan === 'pro' ? 'pro' : 'free'
    const fullName =
      profileData?.full_name ||
      (authUser.user_metadata as { full_name?: string } | null)?.full_name ||
      authUser.email?.split('@')[0] ||
      'Usuario'

    const createdAt =
      profileData?.created_at ||
      // @ts-expect-error - created_at existe en el usuario de Supabase
      authUser.created_at ||
      new Date().toISOString()

    const mappedUser: User = {
      id: authUser.id,
      email: authUser.email || '',
      fullName,
      plan,
      createdAt,
      lemonsqueezyRenewsAt: (profileData as any)?.lemonsqueezy_renews_at ?? null,
      lemonsqueezyManageUrl: (profileData as any)?.lemonsqueezy_manage_url ?? null,
    }

    setUser(mappedUser)
    return mappedUser
  }

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      setIsLoading(true)

      // Cargar datos locales relacionados a análisis (no auth)
      const savedAnalyses = typeof window !== 'undefined' ? localStorage.getItem(ANALYSES_KEY) : null
      const savedProfile = typeof window !== 'undefined' ? localStorage.getItem(PROFILE_KEY) : null

      if (savedAnalyses) {
        setAnalyses(JSON.parse(savedAnalyses))
      }
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }

      await refreshUserFromSupabase()

      if (isMounted) {
        setIsLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUserFromSupabase()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return false
    await refreshUserFromSupabase()
    return true
  }

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    if (!email || password.length < 6 || !fullName) return false

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error || !data.user) {
      return false
    }

    // Crear/actualizar perfil en Supabase
    await supabase
      .from('profiles')
      .upsert(
        {
          id: data.user.id,
          email,
          full_name: fullName,
          plan: 'free',
        },
        { onConflict: 'id' }
      )

    // Intentar iniciar sesión directo luego de registrarse
    await supabase.auth.signInWithPassword({ email, password })

    await refreshUserFromSupabase()
    return true
  }

  const logout = () => {
    supabase.auth.signOut().finally(() => {
      setUser(null)
      setAnalyses([])
      setUserProfile(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ANALYSES_KEY)
        localStorage.removeItem(PROFILE_KEY)
      }
    })
  }

  const updatePlan = (plan: Plan) => {
    if (!user) return

    const run = async () => {
      await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            plan,
          },
          { onConflict: 'id' }
        )

      await refreshUserFromSupabase()
    }

    run()
  }

  const addAnalysis = (analysis: AnalysisResult) => {
    const newAnalyses = [analysis, ...analyses]
    setAnalyses(newAnalyses)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ANALYSES_KEY, JSON.stringify(newAnalyses))
    }

    // Actualizar estadísticas locales
    if (userProfile) {
      const newTotal = userProfile.totalAnalyses + 1
      const newAvg =
        (userProfile.scorePromedio * userProfile.totalAnalyses + analysis.scoreTotal) / newTotal
      const updatedProfile = {
        ...userProfile,
        totalAnalyses: newTotal,
        scorePromedio: Math.round(newAvg),
      }
      setUserProfile(updatedProfile)
      if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile))
      }
    }
  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (userProfile) {
      const updated = { ...userProfile, ...profile }
      setUserProfile(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isPro: user?.plan === 'pro',
        analyses,
        userProfile,
        login,
        register,
        logout,
        updatePlan,
        addAnalysis,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
