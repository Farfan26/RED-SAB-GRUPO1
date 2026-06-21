import React, { useState } from 'react';
import { Mentor, Student, Course } from '../types';
import { 
  Award, Clock, Users, BookOpen, CheckCircle, Plus, Send, 
  Heart, Calendar, Upload, FileText, History, Star, User, Smartphone
} from 'lucide-react';

interface MentorPanelProps {
  mentor: Mentor;
  allMentees: Student[];
  allCourses: Course[];
  onLogHours: (mentorId: string, hours: number, description: string) => void;
}

export default function MentorPanel({
  mentor,
  allMentees,
  allCourses,
  onLogHours
}: MentorPanelProps) {
  // Mobile subtabs definition for premium navigation
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'mentees' | 'resources'>('profile');

  // Local state to log tutoring session
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>(mentor.menteeIds[0] || 'all');
  const [sessionHours, setSessionHours] = useState<number>(2);
  const [sessionCourse, setSessionCourse] = useState<string>(allCourses[0]?.name || 'Cálculo I');
  const [sessionSummary, setSessionSummary] = useState<string>('');
  const [showLogFeedback, setShowLogFeedback] = useState<boolean>(false);

  // Local state for simulator resource uploading
  const [resourceTitle, setResourceTitle] = useState<string>('');
  const [resourceCategory, setResourceCategory] = useState<string>('Cálculo I');
  const [sharedResources, setSharedResources] = useState<Array<{ title: string; category: string; date: string; size: string }>>([
    { title: 'Formulario Derivadas.pdf', category: 'Cálculo I', date: 'Hoy', size: '1.2 MB' },
    { title: 'Pautas Algebra Lineal.pdf', category: 'Álgebra', date: 'Ayer', size: '850 KB' }
  ]);
  const [showResourceFeedback, setShowResourceFeedback] = useState<boolean>(false);

  // Local state to simulate hour logs ledger
  const [pastSessionsLogs, setPastSessionsLogs] = useState<Array<{ id: number; mentee: string; course: string; hours: number; date: string; status: 'Aprobado' | 'Pendiente' }>>([
    { id: 1, mentee: 'Kevin Farfán', course: 'Cálculo I', hours: 2, date: '18/06/2026', status: 'Aprobado' },
    { id: 2, mentee: 'Daniel Farfán', course: 'Física I', hours: 3, date: '19/06/2026', status: 'Aprobado' },
    { id: 3, mentee: 'Milagros Chunga', course: 'Álgebra', hours: 2, date: '20/06/2026', status: 'Pendiente' }
  ]);

  // Local state for sending mental health encouragement
  const [encouragedStudents, setEncouragedStudents] = useState<{ [studentId: string]: boolean }>({});

  // Volunteer hour goals progress
  const hourGoal = 60;
  const progressPercent = Math.min(100, Math.round((mentor.horasVoluntariado / hourGoal) * 100));

  // Find assigned mentees
  const assignedMentees = allMentees.filter(m => mentor.menteeIds.includes(m.id));

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionSummary.trim() || sessionHours <= 0) return;
    
    // Trigger hour logging
    const targetName = selectedMenteeId === 'all' 
      ? 'Grupo Completo' 
      : allMentees.find(m => m.id === selectedMenteeId)?.name || 'Estudiante';
    const detail = `Tutoría de ${sessionCourse} dictada a ${targetName}: ${sessionSummary}`;
    
    onLogHours(mentor.id, sessionHours, detail);
    
    // Append to past log history local simulation
    setPastSessionsLogs(prev => [
      {
        id: Date.now(),
        mentee: targetName,
        course: sessionCourse,
        hours: sessionHours,
        date: 'Hoy',
        status: 'Pendiente'
      },
      ...prev
    ]);

    // Clear & show feedback
    setSessionSummary('');
    setShowLogFeedback(true);
    setTimeout(() => setShowLogFeedback(false), 5000);
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;

    setSharedResources(prev => [
      {
        title: resourceTitle.endsWith('.pdf') ? resourceTitle : `${resourceTitle}.pdf`,
        category: resourceCategory,
        date: 'Hoy',
        size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
      },
      ...prev
    ]);

    setResourceTitle('');
    setShowResourceFeedback(true);
    setTimeout(() => setShowResourceFeedback(false), 3000);
  };

  const handleSendEncouragingMessage = (studentId: string) => {
    setEncouragedStudents(prev => ({ ...prev, [studentId]: true }));
    setTimeout(() => {
      // Auto-reset encouragement state
      setEncouragedStudents(prev => ({ ...prev, [studentId]: false }));
    }, 5000);
  };

  return (
    <div className="flex flex-col space-y-6" id="mentor-panel">
      
      {/* 1. MOBILE RESPONSIVE TABS NAVIGATOR (Strict 44px touch targets) */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex overflow-x-auto gap-1 self-center w-full max-w-2xl" id="mentor-secondary-tabs">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-amber-500 text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <User className="h-4 w-4" /> Mi Perfil y Registro
        </button>
        <button
          onClick={() => setActiveSubTab('mentees')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'mentees'
              ? 'bg-amber-500 text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4" /> Mis Becarios ({assignedMentees.length})
        </button>
        <button
          onClick={() => setActiveSubTab('resources')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'resources'
              ? 'bg-amber-500 text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Upload className="h-4 w-4" /> Compartir Guías
        </button>
      </div>

      {/* 2. TAB CONTROLLER RENDERING */}

      {/* PROFILE & LOGGING TAB */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="panel-tab-profile">
          
          {/* Profile Card & Voluntary Goal */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-fullPointer pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-black text-center flex items-center justify-center text-xl shadow-md border-2 border-white">
                  {mentor.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 leading-tight text-base font-sans">{mentor.name}</h3>
                  <p className="text-xxs text-slate-500 font-mono mt-1">{mentor.carrera}</p>
                  <span className="text-[10px] mt-2 inline-block px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                    Ciclo {mentor.ciclo} • Académico Superior
                  </span>
                </div>
              </div>

              {/* Progress Convalidation Gauge */}
              <div className="border-t border-slate-100 pt-4 text-left">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-extrabold text-slate-600 flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
                    <Clock className="h-4.5 w-4.5 text-amber-500" />
                    Horas convalidables: <strong className="text-slate-805 text-xs">{mentor.horasVoluntariado} h</strong>
                  </span>
                  <span className="text-slate-400 font-mono text-xxs">Meta: {hourGoal}h</span>
                </div>
                
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner mt-2">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="mt-3.5 bg-amber-50 p-3 rounded-xl border border-amber-150 text-[11px] leading-relaxed text-amber-900">
                  <span className="block font-bold">Faltan {Math.max(0, hourGoal - mentor.horasVoluntariado)} horas</span>
                  Para convalidar formalmente tu voluntariado oficial del período y obtener tu Certificado de Voluntariado UDEP.
                </div>
              </div>
            </div>

            {/* General Mentorship Stats */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-center mt-4">
              <div className="text-left">
                <span className="text-xxs uppercase text-slate-400 font-bold block font-mono">Bajo tu guardia</span>
                <span className="text-base font-black text-slate-850 font-mono mt-0.5 block">
                  {assignedMentees.length} de {mentor.maxMentees} becarios
                </span>
              </div>
              <div className="text-right">
                <span className="text-xxs uppercase text-slate-400 font-bold block font-mono">Estatus Aula</span>
                <span className="text-xxs font-extrabold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-150 inline-block mt-0.5">
                  100% Sintonizado
                </span>
              </div>
            </div>
          </div>

          {/* Tutoring session hourly log */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              Acreditar Horas de Tutoría (Célula REDSAB)
            </h4>

            <form onSubmit={handleSubmitSession} className="space-y-4">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block font-mono mb-1">Alumno Beneficiario (Mentee)</label>
                <select
                  id="session-mentee-select"
                  value={selectedMenteeId}
                  onChange={(e) => setSelectedMenteeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-750 font-bold rounded-xl px-3 py-2.5 text-xs outline-none focus:border-amber-500"
                >
                  <option value="all">Soporte Multigrupal (Todos los becarios)</option>
                  {assignedMentees.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block font-mono">Curso o Asignatura dictada</label>
                  <select
                    id="session-course-select"
                    value={sessionCourse}
                    onChange={(e) => setSessionCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-750 font-semibold rounded-xl px-3 py-2.5 text-xs outline-none focus:border-amber-500"
                  >
                    {allCourses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block font-mono font-sans">Horas dictadas</label>
                  <input
                    id="session-hours-input"
                    type="number"
                    min="1"
                    max="10"
                    value={sessionHours}
                    onChange={(e) => setSessionHours(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-extrabold rounded-xl px-3 py-2.5 text-xs outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-widest block font-mono">Temario & Evidencia del Acompañamiento</label>
                <textarea
                  id="session-summary-text"
                  rows={2}
                  placeholder="Ej. Revisamos inducción matemática, factorización compleja de la guia 1 y brindamos aliento emocional..."
                  value={sessionSummary}
                  onChange={(e) => setSessionSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3 text-xs outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <button
                id="btn-log-session"
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 text-xs transition-transform font-bold flex items-center justify-center gap-1.5 shadow min-h-[44px]"
              >
                <Send className="h-4 w-4" /> Registrar sesión para Acreditación
              </button>
            </form>

            {showLogFeedback && (
              <div className="text-xxs font-semibold text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-250 flex items-center gap-1.5 animate-bounce">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 fill-emerald-100" /> 
                <span>¡Perfecto! Sesión de tutoría registrada y transferida en tiempo real a la Oficina de Bienestar para auditar.</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MY MENTEES LIST TAB */}
      {activeSubTab === 'mentees' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left space-y-4 animate-fade-in" id="panel-tab-mentees">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" />
              Semaforización & Estado de mis Becarios
            </h3>
            <p className="text-xxs text-slate-400 font-sans mt-0.5">Control preventivo del promedio acumulado y factores motivacionales de cada uno de tus mentees.</p>
          </div>

          <div className="space-y-4">
            {assignedMentees.map(mentee => {
              const coursesInTrouble = Object.keys(mentee.grades).filter(courseId => {
                const grades = mentee.grades[courseId] || [];
                if (grades.length === 0) return false;
                return (grades.reduce((a, b) => a + b, 0) / grades.length) < 11.5;
              });

              const isEncouragedNow = encouragedStudents[mentee.id];

              return (
                <div key={mentee.id} className="border border-slate-150 p-4 rounded-2xl space-y-4 hover:border-amber-400 bg-slate-50/20 hover:bg-white transition-all text-left">
                  
                  {/* Top line with student profile */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-755 font-black text-xs flex items-center justify-center border shrink-0">
                        {mentee.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs md:text-sm leading-tight">{mentee.name}</h4>
                        <span className="text-xxs text-slate-400 block font-mono mt-0.5">{mentee.carrera} • Ciclo {mentee.ciclo}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-sans">Promedio actual:</span>
                        <span className={`text-xs font-black font-mono leading-none ${
                          mentee.promedio >= 14 ? 'text-emerald-600' : mentee.promedio >= 11.5 ? 'text-amber-500' : 'text-rose-600'
                        }`}>
                          {mentee.promedio.toFixed(1)}
                        </span>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                        mentee.promedio >= 14 ? 'bg-emerald-50 text-emerald-800 border-emerald-150' :
                        mentee.promedio >= 11.5 ? 'bg-amber-50 text-amber-800 border-amber-250' : 'bg-rose-50 text-rose-800 border-rose-150'
                      } border`}>
                        {mentee.promedio >= 14 ? 'ÓPTIMO' : mentee.promedio >= 11.5 ? 'ATENCIÓN' : '🆘 RIESGO'}
                      </div>
                    </div>
                  </div>

                  {/* Course breakdown & Nivelacion recommended checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2 text-xxs">
                      <span className="font-extrabold text-slate-400 block uppercase font-mono tracking-wider text-[9px]">Cursos con promedio crítico:</span>
                      {coursesInTrouble.length > 0 ? (
                        <div className="space-y-1.5">
                          {coursesInTrouble.map(cId => {
                            const courseObj = allCourses.find(c => c.id === cId);
                            const gList = mentee.grades[cId] || [];
                            const avg = Number((gList.reduce((a, b) => a + b, 0) / gList.length).toFixed(1));
                            return (
                              <div key={cId} className="flex justify-between items-center bg-rose-50 border border-rose-100 text-rose-800 px-2.5 py-1 rounded-md font-bold">
                                <span>{courseObj?.name || cId}</span>
                                <span className="font-mono text-xxs bg-white px-1.5 py-0.2 rounded border">PROM: {avg}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-850 p-2 rounded-lg font-bold border border-emerald-100 flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-550" /> Todos los cursos por encima de 11.5
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2 text-xxs">
                      <span className="font-extrabold text-slate-400 block uppercase font-mono tracking-wider text-[9px]">Célula de Nivelación Recomendada:</span>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 text-slate-600 block">
                          <input type="checkbox" defaultChecked={mentee.promedio >= 13} className="rounded text-amber-500 accent-amber-500 focus:ring-0 shrink-0" />
                          <span>Repasar guía práctica de Líneas y Planos</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-600 block">
                          <input type="checkbox" defaultChecked={mentee.streak >= 3} className="rounded text-amber-500 accent-amber-500 focus:ring-0 shrink-0" />
                          <span>Estudiar 1 micro-cápsula C3 de Cálculo interactivo</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-600 block">
                          <input type="checkbox" defaultChecked={true} className="rounded text-amber-500 accent-amber-500 focus:ring-0 shrink-0" />
                          <span>Check-in mental obligatorio semanal</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bottom interactions / Emotional encouragement trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xxs bg-slate-100/50 p-2.5 rounded-xl gap-2 font-sans border text-slate-500">
                    <span className="font-mono block">Sintonía emocional del alumno: <strong>Estable (Check de Hoy)</strong></span>
                    <button 
                      onClick={() => handleSendEncouragingMessage(mentee.id)}
                      disabled={isEncouragedNow}
                      className={`font-extrabold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all min-h-[36px] ${
                        isEncouragedNow 
                          ? 'bg-emerald-500 text-white cursor-default' 
                          : 'bg-amber-500 text-white hover:bg-amber-600 shadow-xxs'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 shrink-0 ${isEncouragedNow ? 'fill-white stroke-none animate-ping' : ''}`} />
                      {isEncouragedNow ? '¡Mensaje Enviado!' : 'Enviar Botón de Aliento'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STUDY RESOURCES TAB */}
      {activeSubTab === 'resources' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left space-y-4 animate-fade-in" id="panel-tab-resources">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-500" />
              Gestor de Recursos Compartidos / Cheat Sheets
            </h3>
            <p className="text-xxs text-slate-400 font-sans mt-0.5">Sube resúmenes o guías en PDF para que tus becarios las descarguen en su panel PWA y ganen Ecopuntos adicionales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Upload form */}
            <form onSubmit={handleUploadResource} className="space-y-4 border border-slate-150 p-4 rounded-2xl bg-slate-50/20">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block font-mono">Publicar Nueva Ficha Académica</span>
              
              <div className="space-y-1">
                <label className="text-xxs text-slate-500 font-bold font-mono">Título del Material</label>
                <input
                  type="text"
                  placeholder="Ej. Métodos de Integración Rápida"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  className="w-full bg-white border border-slate-250 p-2.5 rounded-xl text-xs outline-none focus:border-amber-500 font-sans font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs text-slate-500 font-bold font-mono">Categoría de Curso</label>
                <select
                  value={resourceCategory}
                  onChange={(e) => setResourceCategory(e.target.value)}
                  className="w-full bg-white border border-slate-250 p-2.5 rounded-xl text-xs outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="Cálculo I">Cálculo I</option>
                  <option value="Física I">Física I</option>
                  <option value="Álgebra">Álgebra</option>
                  <option value="Química General">Química General</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-xs font-bold transition-transform flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
              >
                <Upload className="h-4 w-4" /> Publicar Documento PDF
              </button>
            </form>

            {/* List of uploaded guides */}
            <div className="space-y-3">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block font-mono text-left">Documentos Activos en el Repositorio</span>
              
              {sharedResources.map((res, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150 text-left">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-xl shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-slate-850 block truncate leading-none">{res.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">{res.category} • {res.size} • Sincronizado: {res.date}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100 flex items-center gap-0.5 shrink-0">
                    <Star className="h-3 w-3 fill-emerald-300 stroke-none" /> +10 Ecopuntos
                  </span>
                </div>
              ))}

              {showResourceFeedback && (
                <div className="text-xxs font-semibold text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  ✅ Documento indexado exitosamente. Se ha habilitado la descarga y notificado a la célula mentada.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. AUDITED VOLUNTEER HISTORY LOG (Always shown) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left space-y-4" id="ledger-history">
        <div>
          <h4 className="font-extrabold text-slate-800 text-xs md:text-sm flex items-center gap-2 font-mono uppercase tracking-widest">
            <History className="h-4.5 w-4.5 text-amber-500" />
            Bitácora de Sesiones de Tutoría para Acreditación
          </h4>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">Todos tus registros de horas voluntarias son convalidados bajo supervisión de Bienestar de la Dirección de Estudios de la UDEP.</p>
        </div>

        <div className="space-y-2.5">
          {pastSessionsLogs.map(log => (
            <div key={log.id} className="flex justify-between items-center text-xs p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-left gap-3">
              <div>
                <span className="font-bold text-slate-750 block text-xs leading-none">{log.course} para {log.mentee}</span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">Registrado el {log.date} • Duración: <strong className="text-slate-650 font-black">{log.hours} Horas</strong></span>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg font-mono ${
                log.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250 animate-fade-in' : 'bg-slate-250 text-slate-500 border'
              }`}>
                {log.status === 'Aprobado' ? '✓ CONVALIDADO' : '⌛ PENDIENTE'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
