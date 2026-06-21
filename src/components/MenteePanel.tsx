import React, { useState } from 'react';
import { Student, Course, LessonCapsule, LoanItem, AcademicRisk, LoanRequest } from '../types';
import { 
  GraduationCap, Award, BookOpen, Calculator, Play, CheckCircle, 
  AlertTriangle, HelpCircle, Sparkles, Plus, Send, Download, 
  MessageSquare, User, Smartphone, Trophy, Flame, ChevronRight, FileText
} from 'lucide-react';

interface MenteePanelProps {
  student: Student;
  allCourses: Course[];
  allCapsules: LessonCapsule[];
  allLoanItems: LoanItem[];
  allMentors: any[];
  onAddGrade: (studentId: string, courseId: string, grade: number) => void;
  onRequestLoan: (studentId: string, itemId: string) => void;
  activeLoans: LoanRequest[];
  onAddEcopuntos: (studentId: string, amount: number) => void;
  onIncreaseStreak: (studentId: string) => void;
}

export default function MenteePanel({
  student,
  allCourses,
  allCapsules,
  allLoanItems,
  allMentors,
  onAddGrade,
  onRequestLoan,
  activeLoans,
  onAddEcopuntos,
  onIncreaseStreak
}: MenteePanelProps) {
  // Navigation tabs for responsive screens
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'grades' | 'capsules' | 'services'>('overview');

  // Local state for grade insertion
  const [selectedCourseId, setSelectedCourseId] = useState<string>(allCourses[0]?.id || '');
  const [newGradeValue, setNewGradeValue] = useState<number | ''>('');
  
  // Local state for active micro-capsule quiz
  const [activeCapsuleId, setActiveCapsuleId] = useState<string | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);

  // Local state for emotional check-in
  const [moodStatus, setMoodStatus] = useState<string>('Estable');
  const [showMoodFeedback, setShowMoodFeedback] = useState<boolean>(false);

  // Simulated Chat history with Mentor
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'me' | 'mentor'; text: string; time: string }>>([
    { sender: 'mentor', text: '¡Hola Kevin! Vi que estuviste repasando Derivadas en la PWA. ¿Cómo vas para la Práctica 1?', time: '09:12 AM' },
    { sender: 'me', text: 'Hola Sofía, un poco confundido con las reglas de la cadena.', time: '09:15 AM' },
    { sender: 'mentor', text: 'No te preocupes. Descárgate la Cheat Sheet de Derivadas que subí abajo y hoy a las 5:00 PM nos reunimos en la Biblioteca.', time: '09:18 AM' }
  ]);
  const [pendingMessage, setPendingMessage] = useState<string>('');

  // Find mentor
  const assignedMentor = allMentors.find(m => m.id === student.mentorId);

  // Calculate Gamified Ranks based on Ecopuntos
  const getScholarRank = (points: number) => {
    if (points >= 300) return { title: 'Líder de Oro 🥇', next: 'Máxima Distinción', color: 'text-amber-500 bg-amber-500/10 border-amber-200' };
    if (points >= 150) return { title: 'Becario Sobresaliente 🥈', next: `${300 - points} pts para Líder de Oro`, color: 'text-slate-700 bg-slate-350/10 border-slate-300' };
    return { title: 'Becario Aspirante 🥉', next: `${150 - points} pts para Sobresaliente`, color: 'text-amber-700 bg-orange-700/5 border-orange-200' };
  };

  const rankInfo = getScholarRank(student.ecopuntos);

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGradeValue === '' || newGradeValue < 0 || newGradeValue > 20) return;
    onAddGrade(student.id, selectedCourseId, Number(newGradeValue));
    setNewGradeValue('');
  };

  const handleQuizSubmit = (capsule: LessonCapsule) => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === capsule.quiz.correctIndex) {
      setQuizResult('correct');
      onAddEcopuntos(student.id, 50);
      onIncreaseStreak(student.id);
    } else {
      setQuizResult('incorrect');
    }
  };

  const startQuiz = (capsuleId: string) => {
    setActiveCapsuleId(capsuleId);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleMoodCheck = (mood: string) => {
    setMoodStatus(mood);
    setShowMoodFeedback(true);
    setTimeout(() => setShowMoodFeedback(false), 5000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMessage.trim()) return;
    const userMsg = pendingMessage;
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'me', text: userMsg, time: 'Ahora mismo' }]);
    setPendingMessage('');

    // Responsive mock answer from mentor
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'mentor', 
        text: '¡Entendido! Acabo de registrar esto. Te veo pronto en el campus para aclarar tus dudas.', 
        time: 'Hace un momento' 
      }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col space-y-6" id="mentee-panel">
      
      {/* 1. MOBILE RESPONSIVE TABS NAVIGATOR (Strict 44px touch targets) */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex overflow-x-auto gap-1 self-center w-full max-w-2xl" id="mentee-secondary-tabs">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <User className="h-4 w-4" /> Resumen
        </button>
        <button
          onClick={() => setActiveSubTab('grades')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'grades'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Notas Clini
        </button>
        <button
          onClick={() => setActiveSubTab('capsules')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'capsules'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Play className="h-4 w-4" /> Co-Aprendizaje
        </button>
        <button
          onClick={() => setActiveSubTab('services')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'services'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="h-4 w-4" /> Casio & Chats
        </button>
      </div>

      {/* 2. TAB CONTROLLER RENDERING */}

      {/* OVERVIEW SUB-TAB */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="panel-tab-overview">
          
          {/* Profile overview card (Gamified) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-udep-yellow/10 to-transparent rounded-full pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-udep-blue-dark text-white font-black text-center flex items-center justify-center text-xl shadow-lg relative border-2 border-white">
                  {student.name.substring(0, 2).toUpperCase()}
                  <span className="absolute -bottom-1 -right-1 bg-udep-yellow text-udep-blue-dark font-mono text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm border">
                    C{student.ciclo}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 leading-tight text-base font-sans">{student.name}</h3>
                  <span className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded-md mt-1 inline-block">
                    {student.carrera}
                  </span>
                </div>
              </div>

              {/* Gamification Level Shield */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${rankInfo.color}`}>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-slate-400 block">Rango de Becario</span>
                  <span className="text-xs font-extrabold text-slate-800 block">{rankInfo.title}</span>
                  <p className="text-[10px] text-slate-500 font-sans">{rankInfo.next}</p>
                </div>
                <Trophy className="h-9 w-9 text-udep-yellow/80 fill-udep-yellow/20 stroke-2 flex-shrink-0" />
              </div>

              {/* Essential Statistics Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xxs">
                  <span className="text-[9px] uppercase text-slate-450 font-bold block font-sans">Promedio</span>
                  <span className={`text-lg font-black font-mono block mt-1 ${
                    student.promedio >= 14 ? 'text-emerald-600' : student.promedio >= 11.5 ? 'text-amber-500' : 'text-rose-600'
                  }`}>
                    {student.promedio.toFixed(1)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xxs">
                  <span className="text-[9px] uppercase text-slate-450 font-bold block font-mono">Ecopuntos</span>
                  <span className="text-lg font-black text-amber-500 font-mono flex items-center justify-center gap-0.5 mt-1">
                    <Sparkles className="h-4.5 w-4.5 fill-amber-300 stroke-amber-500 shrink-0" />
                    {student.ecopuntos}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xxs">
                  <span className="text-[9px] uppercase text-slate-450 font-bold block font-sans">Racha (Días)</span>
                  <span className="text-lg font-black text-emerald-600 font-mono block mt-1">
                    🔥 {student.streak}
                  </span>
                </div>
              </div>
            </div>

            {/* Semaforo status explanation */}
            <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
              student.risk === AcademicRisk.Low 
                ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                : student.risk === AcademicRisk.Medium 
                  ? 'bg-amber-50 border-amber-150 text-amber-800' 
                  : 'bg-rose-50 border-rose-150 text-rose-800'
            }`}>
              <span className="flex-shrink-0 mt-0.5 animate-pulse relative flex h-3.5 w-3.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  student.risk === AcademicRisk.Low ? 'bg-emerald-400' : student.risk === AcademicRisk.Medium ? 'bg-amber-400' : 'bg-rose-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                  student.risk === AcademicRisk.Low ? 'bg-emerald-500' : student.risk === AcademicRisk.Medium ? 'bg-amber-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <div className="text-[11px] leading-relaxed">
                <span className="font-extrabold uppercase tracking-wide text-xxs block font-mono mb-0.5">Semáforo de Permanencia REDSAB</span>
                {student.risk === AcademicRisk.Low && "¡Felicidades! Estás en zona verde. Sigue acumulando Ecopuntos viendo cápsulas avanzadas."}
                {student.risk === AcademicRisk.Medium && "Atención intermedia. Estás cerca del promedio límite de beca (11.5). Solicita apoyo a tu mentor."}
                {student.risk === AcademicRisk.High && "Alerta Crítica. Tu promedio parcial actual puede comprometer tu beca. Se ha notificado a Bienestar para soporte urgente."}
              </div>
            </div>
          </div>

          {/* Core Mentor Support & Mood Check-in */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="bg-amber-500/10 text-amber-700 font-sans font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                🤝 Acompañamiento Psicosocial Horizontal
              </span>
              
              {assignedMentor ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-base shadow-sm relative shrink-0">
                      {assignedMentor.name.substring(0, 2).toUpperCase()}
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 h-3 w-3 rounded-full border-2 border-white" title="Tutor Conectado"></span>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm leading-none">{assignedMentor.name}</h5>
                      <p className="text-xxs text-slate-400 font-sans mt-1">Tu Hermano Mayor ({assignedMentor.carrera}, Ciclo {assignedMentor.ciclo})</p>
                      <div className="flex gap-1 flex-wrap mt-2">
                        {assignedMentor.especialidades.map((s, idx) => (
                          <span key={idx} className="bg-slate-200/60 text-slate-600 rounded text-[9px] px-1.5 py-0.2 font-semibold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PDF Cheat sheets shared by mentor */}
                  <div className="space-y-2">
                    <span className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Recursos Compartidos por tu Hermano Mayor</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150 hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4.5 w-4.5 text-rose-500" />
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-700 block max-w-[150px] truncate leading-none">Formulario Derivadas.pdf</span>
                            <span className="text-[9px] text-slate-400 font-mono block">Cálculo I • 1.2 MB</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onAddEcopuntos(student.id, 10)}
                          className="p-1.5 text-udep-blue-light hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-xxs"
                          title="Descargar"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150 hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4.5 w-4.5 text-emerald-500" />
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-700 block max-w-[150px] truncate leading-none">Pautas Algebra Lineal.pdf</span>
                            <span className="text-[9px] text-slate-400 font-mono block">Álgebra • 850 KB</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onAddEcopuntos(student.id, 10)}
                          className="p-1.5 text-udep-blue-light hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-xxs"
                          title="Descargar"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Emotional Wellness check-in buttons */}
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-xxs font-extrabold text-slate-400 block mb-2 font-mono uppercase tracking-widest">¿CÓMO VA TU BIENESTAR HOY? (Sintonía Psicoemocional)</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { text: 'Estudiando seguro 😎', state: 'Seguro' },
                        { text: 'Un poco saturado/a 😵‍💫', state: 'Saturado' },
                        { text: 'Necesito tutoría urgente! 🆘', state: 'Necesito Auxilio' }
                      ].map((mood, idx) => (
                        <button
                          key={idx}
                          id={`mood-btn-${idx}`}
                          onClick={() => handleMoodCheck(mood.state)}
                          className={`text-xxs px-3.5 py-2.5 rounded-xl border font-bold cursor-pointer transition-all ${
                            moodStatus === mood.state 
                              ? 'bg-udep-blue-dark text-white border-udep-blue-dark shadow-md' 
                              : 'bg-slate-50 hover:bg-slate-105 hover:border-slate-300 text-slate-600 border-slate-200'
                          }`}
                        >
                          {mood.text}
                        </button>
                      ))}
                    </div>
                    {showMoodFeedback && (
                      <div className="mt-3 text-xxs font-semibold text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-150 flex items-center gap-1.5">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 fill-emerald-100" /> 
                        <span>Estado enviado en tiempo real a {assignedMentor.name} y al departamento de Bienestar. ¡Estamos contigo!</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <HelpCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">Buscando Hermano Mayor ideal...</p>
                  <p className="text-xxs text-slate-400 mt-1 max-w-sm mx-auto">La Oficina de Bienestar está procesando tu emparejamiento predictivo. En breve tendrás un mentor asignado.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* GRADES TAB */}
      {activeSubTab === 'grades' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 animate-fade-in" id="panel-tab-grades">
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-udep-blue-light" />
                Monitoreo Clínico de Notas en la UDEP
              </h4>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">El sistema semaforiza tus notas de manera predictiva para prevenir pérdidas involuntarias de beca.</p>
            </div>

            <div className="space-y-3.5">
              {allCourses.map(course => {
                const courseGrades = student.grades[course.id] || [];
                const courseAverage = courseGrades.length > 0 
                  ? Number((courseGrades.reduce((a, b) => a + b, 0) / courseGrades.length).toFixed(1))
                  : null;
                
                return (
                  <div key={course.id} className="flex flex-col sm:flex-row justify-between sm:items-center text-xs p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 border border-slate-150 transition-all gap-2">
                    <div>
                      <span className="font-extrabold text-slate-800 text-sm block">{course.name}</span>
                      <span className="text-xxs font-mono text-slate-400 block bg-slate-200/50 px-1.5 py-0.5 rounded-sm mt-1 inline-block">{course.code} • {course.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xxs font-sans text-slate-400 font-bold block sm:inline">Calificaciones:</span>
                        <div className="flex gap-1.5 overflow-hidden">
                          {courseGrades.length > 0 ? (
                            courseGrades.map((g, idx) => (
                              <span key={idx} className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                g >= 11 ? 'bg-slate-200 text-slate-700' : 'bg-red-50 text-red-650 font-extrabold'
                              }`}>{g}</span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xxs font-sans italic">Sin calificaciones parciales registradas</span>
                          )}
                        </div>
                      </div>

                      {courseAverage !== null && (
                        <div className="text-right pl-4 border-l border-slate-200">
                          <span className="text-[9px] font-bold text-slate-400 block font-sans">Promedio</span>
                          <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg block mt-0.5 ${
                            courseAverage >= 14 ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' : 
                            courseAverage >= 11.5 ? 'bg-amber-50 text-amber-800 border border-amber-150' : 
                            'bg-rose-50 text-rose-800 border border-rose-150'
                          }`}>
                            {courseAverage}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick simulated grade addition */}
            <form onSubmit={handleGradeSubmit} className="border-t border-slate-150 pt-5 space-y-4">
              <div>
                <span className="text-xxs font-extrabold uppercase text-slate-400 tracking-wider block font-mono mb-1">Simular Registro de Calificación Parcial</span>
                <p className="text-[10px] text-slate-400 font-sans">Agrega notas simuladas para ver cómo reacciona predictivamente el semáforo y se calcula tu promedio.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xxs text-slate-500 font-bold font-mono">Asignatura</label>
                  <select
                    id="grade-course-select"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-750 font-bold rounded-xl px-3 py-2.5 text-xs outline-none focus:border-udep-blue-light"
                  >
                    {allCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xxs text-slate-500 font-bold font-mono">Calificación Obtenida</label>
                  <input
                    id="grade-value-input"
                    type="number"
                    min="0"
                    max="20"
                    placeholder="Nota (0 al 20)"
                    value={newGradeValue}
                    onChange={(e) => setNewGradeValue(e.target.value === '' ? '' : Math.min(20, Math.max(0, Number(e.target.value))))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-850 font-black rounded-xl px-3 py-2.5 text-xs outline-none focus:border-udep-blue-light font-mono"
                  />
                </div>
              </div>

              <button
                id="btn-add-grade"
                type="submit"
                className="w-full bg-udep-blue-light hover:bg-udep-blue-dark text-white rounded-xl py-3 text-xs transition-transform font-bold flex items-center justify-center gap-1.5 shadow hover:scale-[1.01] min-h-[44px]"
              >
                <Plus className="h-4.5 w-4.5 stroke-[2.5]" /> Guardar Nota y Recalcular Semáforo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CAPSULES TAB */}
      {activeSubTab === 'capsules' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 animate-fade-in" id="panel-tab-capsules">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Play className="h-5 w-5 text-udep-blue-light animate-pulse" />
                Cápsulas de Co-Aprendizaje (Micro-Learning C3)
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Videos compactos menores a 5 minutos, diseñados por alumnos superiores para repasar temas álgidos.</p>
            </div>
            <span className="text-xxs font-mono font-bold bg-slate-100 border text-slate-600 px-3 py-1 rounded-xl self-start md:self-center">
              Compiladas por Grupo 1: 4 de 60
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {allCapsules.map(capsule => {
              const isCurrentQuizActive = activeCapsuleId === capsule.id;
              
              return (
                <div key={capsule.id} className="border border-slate-150 rounded-2xl hover:border-slate-300 overflow-hidden flex flex-col justify-between bg-slate-50/20 hover:bg-white transition-all relative">
                  
                  {/* Thumbnail Player */}
                  <div className="relative h-32 w-full bg-slate-800 overflow-hidden shrink-0">
                    <img 
                      src={capsule.videoUrlMock} 
                      alt={capsule.title} 
                      className="object-cover w-full h-full opacity-60 hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                    <span className="absolute bottom-2.5 right-2.5 font-mono text-xxs font-bold bg-slate-900/90 text-white px-2 py-0.5 rounded-md shadow">
                      ⏱️ {capsule.duration} min
                    </span>
                    <span className="absolute top-2.5 left-2.5 font-mono text-[9px] font-extrabold bg-udep-yellow text-udep-blue-dark px-2.5 py-0.5 rounded-lg shadow-md border border-white/20">
                      {capsule.courseName}
                    </span>
                    
                    {/* Centered Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => startQuiz(capsule.id)}
                        className="p-3.5 rounded-full bg-udep-blue-light/95 hover:bg-udep-blue-dark hover:scale-110 text-white shadow-xl transition-all active:scale-95"
                        title="Ver Video y Responder Quiz"
                      >
                        <Play className="h-6 w-6 fill-white" />
                      </button>
                    </div>
                  </div>

                  {/* Capsule text */}
                  <div className="p-4 flex-grow space-y-2">
                    <h5 className="font-extrabold text-slate-800 text-xs md:text-sm leading-snug line-clamp-1">{capsule.title}</h5>
                    <p className="text-xxs text-slate-550 leading-relaxed line-clamp-2">{capsule.description}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        capsule.difficulty === 'Fácil' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        capsule.difficulty === 'Media' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>Dificultad: {capsule.difficulty}</span>
                      
                      <button
                        onClick={() => startQuiz(capsule.id)}
                        className="text-xxs text-udep-blue-light font-black hover:underline flex items-center gap-1.5"
                      >
                        Abordar Aprendizaje +50 pts
                      </button>
                    </div>
                  </div>

                  {/* Active Quiz Overlay */}
                  {isCurrentQuizActive && (
                    <div className="border-t border-slate-200 bg-white p-4 space-y-3.5 relative z-10">
                      <div className="flex items-center gap-1">
                        <HelpCircle className="h-4.5 w-4.5 text-udep-yellow-dark" />
                        <h6 className="font-extrabold text-slate-800 text-xs leading-none">Cuestionario Rápido de Comprensión</h6>
                      </div>
                      <p className="text-xxs text-slate-650 leading-relaxed font-sans bg-slate-50 p-2.5 rounded-xl border border-slate-100">{capsule.quiz.question}</p>
                      
                      <div className="space-y-1.5">
                        {capsule.quiz.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedQuizAnswer(oIdx)}
                            className={`w-full text-left p-3 rounded-xl text-xxs transition-colors border block min-h-[44px] cursor-pointer ${
                              quizSubmitted 
                                ? oIdx === capsule.quiz.correctIndex 
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold' 
                                  : selectedQuizAnswer === oIdx 
                                    ? 'bg-rose-50 border-rose-400 text-rose-800' 
                                    : 'bg-white border-slate-100 text-slate-400'
                                : selectedQuizAnswer === oIdx
                                  ? 'bg-udep-blue-light/5 border-udep-blue-light text-udep-blue-dark font-extrabold'
                                  : 'bg-white hover:bg-slate-50/50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-mono text-[10px] inline-block mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </button>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => setActiveCapsuleId(null)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xxs font-bold min-h-[44px]"
                          >
                            Cerrar
                          </button>
                          <button
                            disabled={selectedQuizAnswer === null}
                            onClick={() => handleQuizSubmit(capsule)}
                            className="px-5 py-2.5 bg-udep-blue-light disabled:bg-slate-200 hover:bg-udep-blue-dark text-white rounded-xl text-xxs font-bold shadow-md min-h-[44px]"
                          >
                            Enviar Respuesta +50 pts
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5 pt-3.5 border-t border-slate-150">
                          {quizResult === 'correct' ? (
                            <div className="text-xxs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-250 flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-udep-yellow fill-emerald-300 animate-bounce" />
                              <span>¡Respuesta Correcta! Sumaste +50 Ecopuntos y extendiste tu racha a 🔥 {student.streak + 1}</span>
                            </div>
                          ) : (
                            <div className="text-xxs font-bold text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                              ❌ Respuesta incorrecta. Revisa el video tutorial de la cápsula y vuelve a intentarlo.
                            </div>
                          )}
                          <div className="text-[10px] text-slate-600 leading-relaxed bg-slate-100/80 p-3 rounded-xl border border-slate-200">
                            <strong>Fundamento Académico:</strong> {capsule.quiz.explanation}
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                setActiveCapsuleId(null);
                                setQuizSubmitted(false);
                                setQuizResult(null);
                              }}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xxs font-bold min-h-[44px]"
                            >
                              Finalizar Cápsula
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SERVICES TAB */}
      {activeSubTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="panel-tab-services">
          
          {/* Casio Hub */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Calculator className="h-5 w-5 text-udep-blue-light" />
                C3: Hub Logístico de Hardware & Préstamos
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Utiliza tus Ecopuntos para reservar calculadoras Casio homologadas y libros guía para exámenes.</p>
            </div>

            <div className="space-y-3">
              {allLoanItems.map(item => {
                const hasEcopuntos = student.ecopuntos >= item.ecopuntosCost;
                return (
                  <div key={item.id} className="border border-slate-150 p-3.5 rounded-2xl flex items-start gap-3 bg-slate-50/20 hover:bg-white hover:border-slate-350 transition-all text-left">
                    <div className="p-2 bg-slate-100 text-slate-650 rounded-xl mt-1 shrink-0">
                      {item.type === 'Calculadora' ? <Calculator className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <div className="flex-grow space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase font-bold">{item.type}</span>
                      <h5 className="font-bold text-slate-800 text-xs leading-none">{item.name}</h5>
                      <p className="text-[10px] text-slate-550 font-mono">Código Barras: {item.serialOrTitle}</p>
                      
                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                        <span className={`font-bold ${item.availableStock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          En Stock: {item.availableStock} / {item.totalStock}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">Costo: {item.ecopuntosCost} pts</span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => onRequestLoan(student.id, item.id)}
                          disabled={item.availableStock === 0 || !hasEcopuntos}
                          className={`px-4 py-2 rounded-xl text-xxs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1 min-h-[40px] cursor-pointer ${
                            item.availableStock > 0 && hasEcopuntos
                              ? 'bg-udep-blue-light hover:bg-udep-blue-dark text-white'
                              : 'bg-slate-550 text-slate-300 cursor-not-allowed border bg-slate-100'
                          }`}
                        >
                          {item.availableStock === 0 ? 'Agotado' : !hasEcopuntos ? 'Insuficientes Ecopuntos' : 'Solicitar Préstamo'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Loan log */}
            <div className="border-t border-slate-150 pt-4">
              <h4 className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-3.5 font-mono text-left">Mis Solicitudes Activas</h4>
              <div className="space-y-2.5">
                {activeLoans.filter(l => l.studentId === student.id).length > 0 ? (
                  activeLoans.filter(l => l.studentId === student.id).map(loan => (
                    <div key={loan.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 border border-slate-150 rounded-xl text-left gap-2 leading-tight">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500 shrink-0">
                          {loan.itemType === 'Calculadora' ? <Calculator className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 block text-xs">{loan.itemName}</span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Entrega: {loan.requestDate} • Límite: <strong className="text-rose-500">{loan.dueDate}</strong></span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-xxs font-bold rounded-lg font-mono flex-shrink-0 ${
                        loan.status === 'Devuelto' ? 'bg-emerald-150 text-emerald-800' :
                        loan.status === 'Retrasado' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {loan.status === 'Devuelto' ? 'Devuelto' : loan.status === 'Retrasado' ? '⚠️ DEMORADO' : 'Prestado'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-450 text-xxs italic text-left">No tienes ningún préstamo de material físico o científico registrado.</p>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Chat Box */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-udep-blue-light/10 text-udep-blue-light rounded-xl">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-none">Canal de Chat Horizontal</h4>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">Co-aprendizaje sin estigmas con tu Hermano Mayor</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Sofia está en línea"></span>
              </div>

              {/* Message scroll log */}
              <div className="space-y-3 h-52 overflow-y-auto p-2 border-slate-150 bg-slate-50/30 rounded-xl border p-3.5 flex flex-col justify-end text-left" id="chat-messages-container">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`max-w-[85%] p-2.5 rounded-2xl text-xs space-y-0.5 ${
                    msg.sender === 'me' 
                      ? 'bg-udep-blue-dark text-white rounded-tr-none self-end' 
                      : 'bg-white text-slate-700 border border-slate-150 rounded-tl-none self-start shadow-xxs'
                  }`}>
                    <p className="font-medium leading-relaxed">{msg.text}</p>
                    <span className={`text-[8px] font-mono block text-right leading-none ${msg.sender === 'me' ? 'text-slate-300' : 'text-slate-405'}`}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Hacer consulta rápida de cálculo o álgebra..."
                  value={pendingMessage}
                  onChange={(e) => setPendingMessage(e.target.value)}
                  className="flex-grow bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl outline-none focus:border-udep-blue-light"
                />
                <button
                  type="submit"
                  disabled={!pendingMessage.trim()}
                  className="p-2.5 bg-udep-blue-light disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-udep-blue-dark text-white rounded-xl shadow-xs shrink-0 flex items-center justify-center min-h-[44px]"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>
              <span className="text-[9px] text-slate-400 block text-center font-sans">El chat se almacena con cifrado local para proteger tu privacidad. Es libre de estigma.</span>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
