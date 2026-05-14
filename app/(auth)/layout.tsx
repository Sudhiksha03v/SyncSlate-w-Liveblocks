'use client';

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSignUp = pathname === '/sign-up';

  return (
    <main className="flex min-h-screen w-full bg-[#020408] text-white overflow-hidden font-sans">
      {/* Left Side: Modern Motion Block (Hidden on Sign Up) */}
      {!isSignUp && (
        <section className="relative hidden lg:flex flex-1 flex-col items-center justify-center p-12 overflow-hidden border-r border-white/5 bg-black">
          {/* Animated Background Elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.08, 0.15, 0.08]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute size-[600px] bg-blue-600/10 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -45, 0],
              opacity: [0.04, 0.08, 0.04]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute size-[400px] bg-purple-600/10 blur-[100px] rounded-full"
          />

          <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
            {/* Logo Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-12"
            >
              <div className="relative p-8 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl group transition-all hover:border-blue-500/20">
                 <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
                 <Image 
                  src="/assets/images/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="relative z-10 animate-[spin_12s_linear_infinite]"
                />
              </div>
            </motion.div>

            {/* Text Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-300 to-white text-transparent bg-clip-text uppercase leading-none">
                SyncSlate
              </h1>
              <p className="text-gray-500 font-bold leading-relaxed italic text-xl px-4">
                "Collab so smooth, it feels like cheating."
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Right Side / Center Side: Auth Form */}
      <section className={cn("flex flex-1 items-center justify-center p-12 relative bg-[#020408]", isSignUp && "w-full")}>
        {/* Background Orbs (Always visible for ambiance) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md flex flex-col items-center"
        >
          {isSignUp && (
            <Link href="/" className="mb-12 flex items-center gap-2 group">
              <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} className="group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-black tracking-tighter uppercase">SyncSlate</span>
            </Link>
          )}
          {children}
        </motion.div>
      </section>
    </main>
  )
}

export default AuthLayout
