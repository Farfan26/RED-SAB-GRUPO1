import React, { useState } from 'react';
import { Student, Mentor, AcademicAlert, LoanItem, LoanRequest, AcademicRisk } from '../types';
import { 
  ShieldAlert, Users, Calculator, RefreshCw, CheckCircle, Clock, Trash2, 
  Plus, AlertCircle, HelpCircle, UserCheck, Search, Filter, Megaphone, BarChart3, Smartphone, FileText
} from 'lucide-react';

interface BienestarPanelProps {
  students: Student[];
  mentors: Mentor[];
  alerts: AcademicAlert[];
  loanItems: LoanItem[];
  loanRequests: LoanRequest[];
  onAttendAlert: (alertId: string, notes: string) => void;
  onExecuteMatching: () => void;
  onReplenishStock: (itemId: string, count: number) => void;
  onReturnLoan: (loanId: string) => void;
}

export default function BienestarPanel({
  students,
  mentors,
  alerts,
  loanItems,
  loanRequests,
  onAttendAlert,
  onExecuteMatching,
  onReplenishStock,
  onReturnLoan
}: BienestarPanelProps) {
  // Mobile sub-tab selector
  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'logistics' | 'directory' | 'notifications'>('alerts');

  // Search and filter state for directory tab
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | AcademicRisk.High | AcademicRisk.Medium | AcademicRisk.Low>('ALL');

  // Local state for alert resolution notes
  const [attendingAlertId, setAttendingAlertId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  // Workshop campaign notification simulation tool
  const [workshopTitle, setWorkshopTitle] = useState<string>('');
  const [workshopTarget, setWorkshopTarget] = useState<string>('all');
  const [workshopFeedback, setWorkshopFeedback] = useState<string | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<Array<{ title: string; target: string; date: string; aud: number }>>([
    { title: 'Taller de Nivelación Pre-Práctica Cálculo I', target: 'Alumnos en Semáforo Rojo y Ámbar', date: 'Hace 2 horas', aud: 12 },
    { title: 'Asesoría Grupal de Álgebra Lineal - Viernes', target: 'Alumnos Mentores y Mentees', date: 'Ayer', aud: 40 }
  ]);

  // Unassigned Mentees & Available Mentors lists
  const unassignedMentees = students.filter(m => !m.mentorId);
  const availableMentors = mentors.filter(m => m.menteeIds.length < m.maxMentees);

  // Stats calculate
  const totalStudents = students.length;
  const highRiskCount = students.filter(s => s.risk === AcademicRisk.High).length;
  const mediumRiskCount = students.filter(s => s.risk === AcademicRisk.Medium).length;
  const lowRiskCount = students.filter(s => s.risk === AcademicRisk.Low).length;
  const scholarshipRetentionPercent = 98.3; 

  const handleResolveAlert = (id: string) => {
    if (!resolutionNotes.trim()) return;
    onAttendAlert(id, resolutionNotes);
    setAttendingAlertId(null);
    setResolutionNotes('');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopTitle.trim()) return;

    const audienceCount = workshopTarget === 'red-amber' 
      ? (highRiskCount + mediumRiskCount) 
      : students.length + mentors.length;

    setActiveCampaigns(prev => [
      {
        title: workshopTitle,
        target: workshopTarget === 'red-amber' ? 'Semáforo Rojo y Ámbar' : 'Toda la comunidad RED SAB',
        date: 'Enviado ahora',
        aud: audienceCount
      },
      ...prev
    ]);

    setWorkshopFeedback(`¡Campaña masiva enviada exitosamente a ${audienceCount} estudiantes/mentores!`);
    setWorkshopTitle('');
    setTimeout(() => setWorkshopFeedback(null), 5000);
  };

  // Directory filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.carrera.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'ALL' ? true : student.risk === filterRisk;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-1 md:p-4 text-left" id="bienestar-panel">
      
      {/* 1. KEY RETENTION KPIS HEADER AND STATUS GENERAL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Tasa de Retención</span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-lg md:text-xl font-black text-emerald-600 font-mono">{scholarshipRetentionPercent}%</span>
            <span className="text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg font-bold border border-emerald-100">Meta: &gt;98%</span>
          </div>
          <span className="text-[10px] text-slate-450 mt-1 block">Condición regular garantizada</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Colas Rojas &lt; 24h</span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-lg md:text-xl font-black text-rose-600 font-mono">
              {alerts.filter(a => a.status === 'Pendiente').length} casos
            </span>
            <span className="text-[10px] text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-100 font-sans font-bold">Predictivo</span>
          </div>
          <span className="text-[10px] text-slate-450 mt-1 block">Casos que precisan tutor de urgencia</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Ecosystema Mentores</span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-lg md:text-xl font-black text-slate-800 font-mono">
              {mentors.length} Activos
            </span>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-150 font-sans font-bold">Ratio 1:4</span>
          </div>
          <span className="text-[10px] text-slate-450 mt-1 block">Tutores evaluados de guardia</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Focos del Semáforo</span>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
              🟢 {lowRiskCount}
            </span>
            <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
              🟡 {mediumRiskCount}
            </span>
            <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full border border-rose-150 flex items-center gap-0.5 animate-pulse">
              🔴 {highRiskCount}
            </span>
          </div>
        </div>

      </div>

      {/* 2. MOBILE RESPONSIVE TABS NAVIGATOR (Strict 44px touch targets) */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex overflow-x-auto gap-1 self-center w-full max-w-4xl" id="bienestar-secondary-tabs">
        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'alerts'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="h-4 w-4" /> Alertas Predictivas
        </button>
        <button
          onClick={() => setActiveSubTab('logistics')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'logistics'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Calculator className="h-4 w-4" /> Inventario & Préstamos
        </button>
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'directory'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4" /> Directorio de Adaptación
        </button>
        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap ${
            activeSubTab === 'notifications'
              ? 'bg-udep-blue-dark text-white shadow'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Megaphone className="h-4 w-4" /> Notificar Talleres
        </button>
      </div>

      {/* 3. SUBTAB CONTENT RENDERING */}

      {/* ALERTS TAB */}
      {activeSubTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" id="panel-tab-alerts">
          
          {/* Active early alerts queue */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                  Semaforización Automática (Casos Críticos)
                </h3>
                <p className="text-xxs text-slate-400 font-sans mt-0.5 leading-normal">Detonador proactivo emitido cuando el promedio parcial de calificaciones escolares es inferior a 11.5.</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                Límite: &lt;24h
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map(alert => {
                const isUnderAttendance = attendingAlertId === alert.id;
                return (
                  <div key={alert.id} className={`border p-3.5 rounded-xl space-y-3.5 transition-all text-left ${
                    alert.status === 'Atendido' 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-80' 
                      : 'bg-rose-50/30 border-rose-150 text-slate-800 shadow-sm hover:border-rose-300'
                  }`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 text-xs md:text-sm">{alert.studentName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-200/60 rounded text-slate-500 font-bold">{alert.studentCarrera}</span>
                        </div>
                        <p className="text-xxs text-slate-500 leading-normal">
                          Curso Crítico: <strong className="text-slate-700">{alert.courseName}</strong> • Promedio: <strong className="text-rose-600 font-mono text-xs">{alert.average.toFixed(1)}</strong>
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[9px] font-mono block text-slate-405">{alert.timestamp}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded bg-white border inline-block mt-1 font-mono uppercase ${
                          alert.status === 'Atendido' ? 'text-emerald-700 border-emerald-250 bg-emerald-50' : 'text-rose-700 border-rose-200 animate-pulse'
                        }`}>
                          {alert.status === 'Atendido' ? 'Atendido' : '🚨 Pendiente'}
                        </span>
                      </div>
                    </div>

                    {alert.notes && (
                      <div className="text-xxs p-2.5 bg-white rounded-xl border border-slate-150 text-slate-650 leading-relaxed italic text-left">
                        <strong>Protocolo de Apoyo Registrado:</strong> {alert.notes} {alert.atendidoAt && `(${alert.atendidoAt})`}
                      </div>
                    )}

                    {alert.status === 'Pendiente' && !isUnderAttendance && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setAttendingAlertId(alert.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xxs px-3.5 py-2 rounded-xl transition-all shadow flex items-center gap-1.5 min-h-[36px] cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4" /> Desplegar Contención Social
                        </button>
                      </div>
                    )}

                    {isUnderAttendance && (
                      <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-3">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-mono">Consolidar Formulario de Contención</label>
                        <textarea
                          id="resolution-notes-text"
                          rows={2}
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Ej. Suministrada calculadora FX-99 y coordinadas 3 sesiones de nivelación con su Hermano Mayor..."
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl outline-none focus:border-rose-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setAttendingAlertId(null)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xxs font-bold min-h-[36px]"
                          >
                            Cancelar
                          </button>
                          <button
                            disabled={!resolutionNotes.trim()}
                            onClick={() => handleResolveAlert(alert.id)}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xxs font-extrabold shadow min-h-[36px]"
                          >
                            Proceder con Resolución
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* C2: Matching Engine controls */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-udep-blue-light" />
                Matching Acoplamiento Horizontal 1:4
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5 leading-normal">Vinculación automatizada para emparejar becarios vulnerables con tutores idóneos de los ciclos superiores de la misma escuela profesional.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 space-y-2 text-left">
                <span className="text-[9px] font-black text-slate-400 block font-mono uppercase tracking-wider">Becarios Huérfanos:</span>
                <div className="space-y-1">
                  {unassignedMentees.length > 0 ? (
                    unassignedMentees.map(m => (
                      <span key={m.id} className="text-xxs font-semibold bg-rose-50 text-rose-800 px-2.5 py-1 rounded-md block border border-rose-100">
                        🚨 {m.name} ({m.carrera.substring(0, 15)}...)
                      </span>
                    ))
                  ) : (
                    <span className="text-xxs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 border border-emerald-150 rounded-md block font-bold">✓ 100% Emparejados</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 space-y-2 text-left">
                <span className="text-[9px] font-black text-slate-400 block font-mono uppercase tracking-wider">Tutorías Disponibles:</span>
                <div className="space-y-1">
                  {availableMentors.length > 0 ? (
                    availableMentors.map(m => {
                      const slots = m.maxMentees - m.menteeIds.length;
                      return (
                        <span key={m.id} className="text-xxs font-mono bg-indigo-50 text-indigo-805 px-2.5 py-1 rounded-md block border border-indigo-100">
                          👤 {m.name} ({slots} vacantes)
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xxs text-slate-400 italic block">No hay tutores con cupos libres.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
              <p className="text-xxs text-slate-500 leading-normal max-w-sm">El algoritmo prioriza de manera ponderada afinidad vocacional de carreras, asimetría escolar e historial de sintonía emocional.</p>
              
              <button
                id="btn-run-matching"
                disabled={unassignedMentees.length === 0 || availableMentors.length === 0}
                onClick={onExecuteMatching}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer shrink-0 ${
                  unassignedMentees.length > 0 && availableMentors.length > 0
                    ? 'bg-udep-blue-light text-white hover:bg-udep-blue-dark hover:scale-[1.02]'
                    : 'bg-slate-100 text-slate-350 cursor-not-allowed border'
                }`}
              >
                <UserCheck className="h-4.5 w-4.5 shrink-0" /> Ejecutar Algoritmo Automatizado
              </button>
            </div>
          </div>

        </div>
      )}

      {/* LOGISTICS TAB */}
      {activeSubTab === 'logistics' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-6 animate-fade-in" id="panel-tab-logistics">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Calculator className="h-5 w-5 text-udep-blue-light animate-pulse" />
                Auditoría Física & Logística de Soporte Práctico
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5 leading-normal">Control centralizado del stock de calculadoras científicas Casio fx-99LAX y libros de texto guía subvencionados.</p>
            </div>
            <span className="text-xxs font-mono text-slate-400 bg-slate-50 border px-3 py-1 rounded-xl block self-start">
              Auditoría: Regular
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side items stock */}
            <div className="space-y-4 text-left">
              <span className="text-xxs font-extrabold text-slate-400 block font-mono uppercase tracking-widest border-b pb-1">Inventario General (UDEP)</span>
              {loanItems.map(item => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 space-y-2 text-left hover:bg-slate-100/50 transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-805 block">{item.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xxs font-mono text-slate-500 font-medium">
                    <span>Disponibilidad: <strong>{item.availableStock} de {item.totalStock} uds</strong></span>
                    <button
                      onClick={() => onReplenishStock(item.id, 1)}
                      className="text-udep-blue-light border border-udep-blue-light hover:bg-udep-blue-light/5 text-xxs px-2.5 py-1 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      +1 Abastecer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side loan requests queue */}
            <div className="md:col-span-2 space-y-4 text-left">
              <span className="text-xxs font-extrabold text-slate-400 block font-mono uppercase tracking-widest border-b pb-1">Casos de Préstamo Activos</span>
              
              <div className="space-y-2.5">
                {loanRequests.length > 0 ? (
                  loanRequests.map(loan => (
                    <div key={loan.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs hover:bg-white transition-all gap-3 text-left leading-normal">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{loan.itemName}</span>
                          <span className={`text-[9px] px-2 py-0.2 rounded-md font-black uppercase ${
                            loan.itemType === 'Calculadora' ? 'bg-indigo-50 text-indigo-750' : 'bg-emerald-50 text-emerald-755'
                          }`}>{loan.itemType}</span>
                        </div>
                        <p className="text-xxs text-slate-500 font-mono">
                          Becario: <strong className="text-slate-700">{loan.studentName}</strong> • Retorno Máximo: <strong className="text-rose-500">{loan.dueDate}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className={`px-2.5 py-1 text-xxs font-bold rounded-lg font-mono ${
                          loan.status === 'Devuelto' ? 'bg-slate-205 text-slate-600' : 
                          loan.status === 'Retrasado' ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' : 'bg-amber-100 text-amber-800 border border-amber-205'
                        }`}>
                          {loan.status === 'Devuelto' ? 'Regresado' : loan.status === 'Retrasado' ? 'Atrasado' : 'Asignado'}
                        </span>
                        {loan.status !== 'Devuelto' && (
                          <button
                            onClick={() => onReturnLoan(loan.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xxs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm min-h-[36px]"
                          >
                            Registrar Devolución
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-450 text-xxs italic text-left py-4">No se registran solicitudes logísticas en esta gestión.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTORY TAB */}
      {activeSubTab === 'directory' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left space-y-4 animate-fade-in" id="panel-tab-directory">
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-udep-blue-light" />
                Directorio General de Becarios RED SAB
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Auditoría central de su promedio general, sintonía de autoaprendizaje y tutor asignado.</p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-150">
            <div className="sm:col-span-7 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar becario por nombre o carrera..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2 text-xs rounded-xl outline-none focus:border-udep-blue-light"
              />
            </div>
            <div className="sm:col-span-5 flex gap-2">
              <div className="w-full relative">
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl outline-none focus:border-udep-blue-light font-semibold"
                >
                  <option value="ALL">Todos los Estados Gral</option>
                  <option value={AcademicRisk.Low}>Semaforó Verde (Óptimo)</option>
                  <option value={AcademicRisk.Medium}>Semáforo Ámbar (Alerta)</option>
                  <option value={AcademicRisk.High}>Semáforo Rojo (Peligro)</option>
                </select>
              </div>
            </div>
          </div>

          {/* List layout */}
          <div className="space-y-2.5">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => {
                const tutorObj = mentors.find(m => m.id === student.mentorId);
                return (
                  <div key={student.id} className="border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-350 bg-slate-50/10 hover:bg-white transition-all text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-xs md:text-sm">{student.name}</span>
                        <span className="text-[10px] text-slate-450 block font-mono bg-slate-100 rounded px-1.5 py-0.2">{student.carrera} (Ciclo {student.ciclo})</span>
                      </div>
                      <p className="text-xxs text-slate-500 font-mono">
                        Correo: <strong className="text-slate-650">{student.email}</strong> • Copas/Ecopuntos: <strong className="text-amber-600">✨ {student.ecopuntos} pts</strong> • Racha: <strong className="text-slate-700">🔥 {student.streak} días</strong>
                      </p>
                      <p className="text-xxs text-slate-450">
                        Hermano Mayor Asignado: <strong className="text-slate-600">{tutorObj ? tutorObj.name : 'Nininguno'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5 justify-between sm:justify-end shrink-0">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-mono font-bold leading-none">PROM INDIVIDUAL</span>
                        <span className={`text-sm font-black font-mono block mt-1 ${
                          student.promedio >= 14 ? 'text-emerald-600' : student.promedio >= 11.5 ? 'text-amber-500' : 'text-rose-600'
                        }`}>{student.promedio.toFixed(1)}</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-xxs font-black font-mono border ${
                        student.risk === AcademicRisk.Low ? 'bg-emerald-50 text-emerald-800 border-emerald-150' :
                        student.risk === AcademicRisk.Medium ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-150 animate-pulse'
                      }`}>
                        {student.risk === AcademicRisk.Low ? 'VERDE' : student.risk === AcademicRisk.Medium ? 'ÁMBAR' : '🚨 ROJO'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-xxs italic py-6">No se encontraron estudiantes que coincidan con la búsqueda.</p>
            )}
          </div>

        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left space-y-4 animate-fade-in" id="panel-tab-notifications">
          
          <div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-udep-blue-light animate-bounce" />
              Notificador de Campañas Académicas & Talleres
            </h3>
            <p className="text-xxs text-slate-400 font-sans mt-0.5">Envía notificaciones de alerta general en la PWA (vía push y SMS simulado) sobre reforzamientos gratuitos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Action form */}
            <form onSubmit={handleCreateCampaign} className="space-y-4 border border-slate-150 p-4 rounded-xl bg-slate-50/50">
              <span className="text-xxs font-bold text-slate-400 block font-mono uppercase tracking-widest border-b pb-1">REMITIR ALERTA DE REFORZAMIENTO</span>
              
              <div className="space-y-1">
                <label className="text-xxs text-slate-500 font-bold font-mono">Nombre de Proyecto o Taller</label>
                <input
                  type="text"
                  placeholder="Ej. Taller Pre-Sustentación de Cálculo Integral"
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                  className="w-full bg-white border border-slate-250 p-2.5 rounded-xl text-xs outline-none focus:border-udep-blue-light font-sans font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs text-slate-500 font-bold font-mono">Público Destinatario</label>
                <select
                  value={workshopTarget}
                  onChange={(e) => setWorkshopTarget(e.target.value)}
                  className="w-full bg-white border border-slate-250 p-2.5 rounded-xl text-xs outline-none focus:border-udep-blue-light font-semibold"
                >
                  <option value="all">Socio General (Todos los registrados)</option>
                  <option value="red-amber">Focalizado urgente (Semáforo Rojo y Ámbar)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-udep-blue-light hover:bg-udep-blue-dark text-white rounded-xl py-3 text-xs font-bold transition-all shadow min-h-[44px]"
              >
                Transmitir Notificación General
              </button>
            </form>

            {/* Campaign archive */}
            <div className="space-y-3">
              <span className="text-xxs font-bold text-slate-400 block font-mono uppercase tracking-widest border-b pb-1">Historial de Transmisiones</span>
              
              <div className="space-y-2">
                {activeCampaigns.map((camp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                    <span className="text-xxs font-mono text-slate-400 block">{camp.date} • Alcance: {camp.aud} becarios</span>
                    <h5 className="text-xs font-black text-slate-805 leading-tight">{camp.title}</h5>
                    <p className="text-[10px] text-slate-500">Destinatario: {camp.target}</p>
                  </div>
                ))}
              </div>

              {workshopFeedback && (
                <div className="text-xxs font-semibold text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-250 animate-bounce">
                  {workshopFeedback}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
