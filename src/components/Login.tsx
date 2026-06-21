import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, ShieldAlert, Award, Users, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle standard login process
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo institucional de la UDEP.');
      return;
    }
    if (!password) {
      setError('Por favor, ingresa tu contraseña.');
      return;
    }

    // Matching mock domains and roles
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail.includes('bienestar') || normalizedEmail.includes('admin')) {
      onLogin(UserRole.Bienestar, email);
    } else if (normalizedEmail.includes('sofia') || normalizedEmail.includes('mentor')) {
      onLogin(UserRole.Mentor, email);
    } else {
      onLogin(UserRole.Mentee, email);
    }
  };

  // Quick Action triggers for easy grading and demo
  const handleQuickLogin = (role: UserRole) => {
    if (role === UserRole.Bienestar) {
      onLogin(UserRole.Bienestar, 'bienestar@udep.edu.pe');
    } else if (role === UserRole.Mentor) {
      onLogin(UserRole.Mentor, 'sofia.benites@alumnos.udep.edu.pe');
    } else {
      onLogin(UserRole.Mentee, 'kevin.quispe@alumnos.udep.edu.pe');
    }
  };

  return (
    <div className="min-h-screen bg-udep-cream flex flex-col justify-between" id="login-screen">
      {/* Top Brand Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-8 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-udep-blue-dark p-2 rounded-xl text-white shadow-md">
            <GraduationCap className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <span className="font-bold text-lg text-udep-blue-dark tracking-tight">RED SAB <span className="text-udep-yellow font-mono text-xs bg-udep-blue-dark/5 px-2 py-0.5 rounded">DIGITAL</span></span>
            <p className="text-[10px] text-slate-500 font-sans leading-none">Universidad de Piura</p>
          </div>
        </div>
        <span className="text-xxs text-slate-400 font-mono">Piloto Académico IPD-2026-I</span>
      </div>

      {/* Main Grid: Info + Login Card */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-grow">
        
        {/* Left Column: Project Presentation and Causal Logic */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="bg-udep-blue-light/10 text-udep-blue-light font-sans font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Grupo 1 Presenta: Red de Soporte Académico para Becarios
          </span>
          
          <h1 className="text-3xl md:text-5xl font-black text-udep-blue-dark tracking-tight leading-none font-sans">
            Garantizando la <span className="text-udep-blue-light underline decoration-udep-yellow decoration-4">Permanencia</span> de Nuestros Talentos.
          </h1>
          
          <p className="text-sm text-slate-605 leading-relaxed font-sans max-w-xl">
            La transición de la escuela pública al rigor de la UDEP no debe ser un obstáculo insalvable. 
            <strong> RED SAB Digital</strong> conecta a becarios de primeros ciclos con tutores pares horizontales,
            mitigando el estigma sociocultural y detectando alertas académicas a tiempo mediante semaforización predictiva.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs">
              <span className="text-xs font-bold text-slate-800 block">Tutoría Horizontal</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">Emparejamiento 1:4 con "Hermanos Mayores" de ciclos avanzados.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs">
              <span className="text-xs font-bold text-slate-800 block">Semaforización</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">Monitoreo clínico predictivo para alertas tempranas &lt; 24h.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs">
              <span className="text-xs font-bold text-slate-800 block">Hub Logístico</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">Préstamo asertivo de calculadoras Casio y libros guía.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Login Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-2xl relative overflow-hidden" id="login-card">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-udep-blue-dark via-udep-blue-light to-udep-yellow"></div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-1">Ingresa al portal institucional de soporte REDSAB</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div id="login-error" className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-xl text-xxs flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">Correo Institucional UDEP</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="ej. alumno@alumnos.udep.edu.pe"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-udep-blue-light"
                />
              </div>
            </div>

            <div>
              <label className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">Contraseña de Alumno</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-udep-blue-light"
                />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full bg-udep-blue-dark hover:bg-udep-blue-light text-white rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-101 cursor-pointer"
            >
              Autenticar y Entrar <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Selector for Evaluators */}
          <div className="border-t border-slate-150 pt-5 mt-6 space-y-3">
            <span className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest block font-mono flex items-center gap-1.5 justify-center">
              <Sparkles className="h-3.5 w-3.5 text-udep-yellow-dark" />
              ACCESO RÁPIDO PARA EVALUADORES (Simular Rol)
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                id="quick-login-mentee"
                onClick={() => handleQuickLogin(UserRole.Mentee)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-udep-blue-light/5 border border-slate-150 rounded-xl p-2.5 text-left text-xxs transition-colors group cursor-pointer"
              >
                <div className="p-1.5 bg-udep-blue-light/10 text-udep-blue-light rounded-lg">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <span className="font-extrabold text-slate-750 block leading-none">Ingresar como Alumno Becado (Mentee)</span>
                  <span className="text-[10px] text-slate-450 mt-1 block">Kevin Alexander Quispe • Ciclo 1</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-udep-blue-light transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                id="quick-login-mentor"
                onClick={() => handleQuickLogin(UserRole.Mentor)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-amber-500/5 border border-slate-150 rounded-xl p-2.5 text-left text-xxs transition-colors group cursor-pointer"
              >
                <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <span className="font-extrabold text-slate-750 block leading-none">Ingresar como Hermano Mayor (Mentor)</span>
                  <span className="text-[10px] text-slate-450 mt-1 block font-sans">Sofía Lorena Benites • Ciclo 8 (Industrial)</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                id="quick-login-bienestar"
                onClick={() => handleQuickLogin(UserRole.Bienestar)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-red-500/5 border border-slate-150 rounded-xl p-2.5 text-left text-xxs transition-colors group cursor-pointer"
              >
                <div className="p-1.5 bg-red-100/70 text-red-600 rounded-lg">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <span className="font-extrabold text-slate-750 block leading-none">Oficina de Bienestar (Administrador/Monitoreo)</span>
                  <span className="text-[10px] text-slate-450 mt-1 block">Semaforización predictiva integral</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-red-500 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer references */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xxs font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 leading-none">
          <span>Universidad de Piura (UDEP) • Campus Piura</span>
          <span>Desarrollado in-house por Grupo 1 • IPD-2026-I</span>
        </div>
      </footer>
    </div>
  );
}
