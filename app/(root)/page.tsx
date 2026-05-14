'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/shared/Header';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap, ShieldCheck, Sparkles, ArrowRight, Layers, MousePointer2, Share2, Instagram, Twitter, MessageCircle } from 'lucide-react';
import React from 'react';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#020408] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Floating Centered Nav */}
      <motion.div 
        initial={{ y: -100, x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        className="fixed top-8 left-1/2 z-[100] w-[90%] max-w-4xl"
      >
        <nav className="flex items-center justify-between px-8 py-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/assets/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="group-hover:rotate-12 transition-transform duration-500" 
            />
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text">
              SYNCSLATE
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <SignedOut>
              <Link href="/sign-in" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/sign-in" className="gradient-blue px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 transition-all text-white">
                Start Cooking
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="gradient-blue px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all text-white">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-56 pb-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-medium italic tracking-wide backdrop-blur-sm"
        >
          where ideas find their flow
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6 px-4"
        >
          Collab without the<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-200 to-blue-600">brain fog.</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-sm md:text-base text-gray-400 font-medium mb-12 leading-relaxed px-8"
        >
          Think together in real-time. SyncSlate is the multiplayer editor built for speed, precision, and high performance teams. Zero latency, infinite flow.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/dashboard" className="gradient-blue group flex items-center justify-center gap-4 px-12 py-5 rounded-full text-xl font-black shadow-[0_15px_50px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all active:scale-95 text-white">
            Get Started <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>

      {/* Modern Bento Grid Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          {/* Card 1: Large Feature */}
          <BentoCard className="md:col-span-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="size-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Zap size={32} />
                </div>
                <h3 className="text-4xl font-black tracking-tight mb-6">Main Character Energy</h3>
                <p className="text-gray-400 max-w-md text-lg leading-relaxed font-medium">
                  Experience speed that makes other apps look like they&apos;re lagging on 2G. Instant sync, zero friction.
                </p>
              </div>
              <div className="mt-20 flex gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-2 w-12 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors" />
                 ))}
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Small Feature */}
          <BentoCard className="md:col-span-4 group flex flex-col items-center justify-center text-center">
             <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="size-20 rounded-[2rem] bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 mx-auto"
                >
                  <MousePointer2 size={40} />
                </motion.div>
                <h3 className="text-2xl font-black mb-4">Real-time Presence</h3>
                <p className="text-gray-500 font-medium">See everyone, miss nothing.</p>
             </div>
          </BentoCard>

          {/* Card 3: Small Feature */}
          <BentoCard className="md:col-span-4 group flex flex-col items-center justify-center text-center">
             <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10">
                <div className="size-20 rounded-[2rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 mx-auto group-hover:rotate-[360deg] transition-transform duration-1000">
                  <Share2 size={40} />
                </div>
                <h3 className="text-2xl font-black mb-4">Smart Sharing</h3>
                <p className="text-gray-500 font-medium">Collab hits different.</p>
             </div>
          </BentoCard>

          {/* Card 4: Wide Feature */}
          <BentoCard className="md:col-span-8 group flex flex-col md:flex-row items-center gap-12">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 flex-1">
              <div className="size-16 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-400 mb-8 border border-green-500/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-4xl font-black tracking-tight mb-6">Rent-Free Security</h3>
              <p className="text-gray-400 leading-relaxed font-medium text-lg">
                Your docs stay yours. We protect your ideas like they&apos;re state secrets. Pure privacy, no cap.
              </p>
            </div>
            <div className="relative z-10 hidden lg:block">
               <div className="size-48 rounded-full border-4 border-dashed border-white/5 animate-[spin_30s_linear_infinite] flex items-center justify-center">
                  <div className="size-32 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center justify-center">
                    <Sparkles size={40} className="text-white/20" />
                  </div>
               </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Ultra Modern Footer */}
      <footer className="relative pt-32 pb-20 px-6 bg-[#020408] overflow-hidden">
        {/* Background Text - More subtle and visible with stroke */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[18vw] font-black select-none pointer-events-none whitespace-nowrap leading-none tracking-tighter opacity-[0.03] text-transparent [text-stroke:1px_white] [-webkit-text-stroke:1px_white]">
          SYNCSLATE
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10 border-t border-white/5 pt-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <Image src="/assets/images/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-2xl font-black tracking-tighter">SYNCSLATE</span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              The high-performance workspace for teams who actually care about taste.
            </p>
            <div className="flex gap-4">
               {[Twitter, Instagram, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:bg-white/10 hover:text-white transition-all">
                    <Icon size={20} />
                  </a>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/30">Product</h4>
            <ul className="space-y-4 text-gray-400 font-bold text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/30">Company</h4>
            <ul className="space-y-4 text-gray-400 font-bold text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
             <h4 className="text-lg font-black mb-4 italic tracking-tight">Got ideas?</h4>
             <p className="text-gray-500 text-sm font-medium mb-6">Join our beta and help us shape the future of collab.</p>
             <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                Join Beta
             </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-white/5 flex items-center justify-center">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">
            DESIGNED FOR THE NEXT GENERATION
          </p>
        </div>
      </footer>
    </div>
  );
};

const BentoCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative p-10 rounded-[3rem] bg-[#09111f]/40 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-blue-500/10 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default LandingPage;