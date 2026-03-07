"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, Plan, AnalysisResult, UserProfile } from './types'

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

const STORAGE_KEY = 'powercv_user'
const ANALYSES_KEY = 'powercv_analyses'
const PROFILE_KEY = 'powercv_profile'

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem(STORAGE_KEY)
    const savedAnalyses = localStorage.getItem(ANALYSES_KEY)
    const savedProfile = localStorage.getItem(PROFILE_KEY)
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedAnalyses) {
      setAnalyses(JSON.parse(savedAnalyses))
    }
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated login - in production would call API
    // For demo, we accept any email/password combo
    if (email && password.length >= 6) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        fullName: email.split('@')[0],
        plan: 'free',
        createdAt: new Date().toISOString()
      }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    if (email && password.length >= 6 && fullName) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        fullName,
        plan: 'free',
        createdAt: new Date().toISOString()
      }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      
      // Create initial profile
      const newProfile: UserProfile = {
        userId: newUser.id,
        habilidadesDetectadas: [],
        problemasRecurrentes: [],
        scorePromedio: 0,
        totalAnalyses: 0
      }
      setUserProfile(newProfile)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile))
      
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setAnalyses([])
    setUserProfile(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ANALYSES_KEY)
    localStorage.removeItem(PROFILE_KEY)
  }

  const updatePlan = (plan: Plan) => {
    if (user) {
      const updatedUser = { ...user, plan }
      setUser(updatedUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
    }
  }

  const addAnalysis = (analysis: AnalysisResult) => {
    const newAnalyses = [analysis, ...analyses]
    setAnalyses(newAnalyses)
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(newAnalyses))
    
    // Update profile stats
    if (userProfile) {
      const newTotal = userProfile.totalAnalyses + 1
      const newAvg = ((userProfile.scorePromedio * userProfile.totalAnalyses) + analysis.scoreTotal) / newTotal
      const updatedProfile = {
        ...userProfile,
        totalAnalyses: newTotal,
        scorePromedio: Math.round(newAvg)
      }
      setUserProfile(updatedProfile)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile))
    }
  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (userProfile) {
      const updated = { ...userProfile, ...profile }
      setUserProfile(updated)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
    }
  }

  return (
    <UserContext.Provider value={{
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
      updateUserProfile
    }}>
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
