import { useState } from 'react';
import { Tooth } from './Tooth';
import { 
  COLORS, 
  allTeethIds, 
  initialToothState, 
  type ToothState, 
  type Surface 
} from '../../types/odontogram.types';

interface ClinicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalHistoryModal = ({ isOpen, onClose }: ClinicalHistoryModalProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const [teeth, setTeeth] = useState<ToothState[]>(() => allTeethIds.map(initialToothState));
  const [selectedColor, setSelectedColor] = useState(COLORS[1].hex);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setRadioValue = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateSurface = (id: number, surface: Surface) => {
    setTeeth(prevTeeth => prevTeeth.map(t => t.id === id ? { ...t, [surface]: selectedColor } : t));
  };

  const openNote = (id: number) => {
    const tooth = teeth.find(t => t.id === id);
    if (tooth) {
      setNoteText(tooth.note || '');
      setActiveNoteId(id);
    }
  };

  const saveNote = () => {
    setTeeth(prevTeeth => prevTeeth.map(t => t.id === activeNoteId ? { ...t, note: noteText } : t));
    setActiveNoteId(null);
  };

  const getQuadrant = (start: number, end: number) => {
    const q: ToothState[] = [];
    if (start > end) {
      for (let i = start; i >= end; i--) { const t = teeth.find(x => x.id === i); if (t) q.push(t); }
    } else {
      for (let i = start; i <= end; i++) { const t = teeth.find(x => x.id === i); if (t) q.push(t); }
    }
    return q;
  };

  const InputField = ({ label, name, type = "text", width = "w-full", className="" }: any) => (
    <div className={`flex flex-col ${width} ${className}`}>
      <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 tracking-wider">{label}</label>
      <input 
        type={type} name={name} 
        value={formData[name] || ''} 
        onChange={handleInputChange} 
        className="border-b border-outline-variant focus:border-primary outline-none px-1 py-1 text-sm bg-transparent transition-colors text-on-surface"
      />
    </div>
  );

  const QuestionRow = ({ label, name, detailLabel }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-outline-variant/30 py-2 hover:bg-surface-container-low transition-colors">
      <div className="flex-1 text-sm text-on-surface font-medium">{label}</div>
      <div className="flex items-center gap-4 w-32 shrink-0">
        <label className="flex items-center gap-1 cursor-pointer text-sm text-on-surface">
          <input type="radio" name={name} checked={formData[name] === 'SI'} onChange={() => setRadioValue(name, 'SI')} className="accent-primary w-4 h-4" /> SI
        </label>
        <label className="flex items-center gap-1 cursor-pointer text-sm text-on-surface">
          <input type="radio" name={name} checked={formData[name] === 'NO'} onChange={() => setRadioValue(name, 'NO')} className="accent-primary w-4 h-4" /> NO
        </label>
      </div>
      {detailLabel && (
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-on-surface-variant whitespace-nowrap">{detailLabel}</span>
          <input type="text" name={`${name}_detalle`} value={formData[`${name}_detalle`] || ''} onChange={handleInputChange} className="flex-1 border-b border-outline-variant focus:border-primary outline-none text-sm bg-transparent px-1 transition-colors text-on-surface" />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 overflow-y-auto print:bg-white print:p-0">
      <div className="min-h-screen py-10 px-4 flex items-center justify-center pointer-events-none">
        
        {/* Modal Container */}
        <div className="max-w-5xl w-full mx-auto bg-surface shadow-2xl rounded-xl print:shadow-none print:w-full pointer-events-auto relative">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-error-container text-on-surface hover:text-error transition-colors z-10 print:hidden cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* --- ENCABEZADO --- */}
          <header className="border-b-4 border-on-surface p-8 flex justify-between items-start rounded-t-xl bg-surface-container-lowest">
            <div>
              <h1 className="text-2xl font-black text-on-surface tracking-wider">HISTORIA CLÍNICA GENERAL</h1>
              <div className="mt-4 flex gap-6">
                <InputField label="Lugar" name="lugar" width="w-48" />
                <InputField label="Fecha" name="fecha" type="date" width="w-40" />
              </div>
            </div>
            <div className="text-right flex flex-col gap-3 pr-10">
              <InputField label="Odontólogo" name="odontologo" width="w-64" />
              <InputField label="N° de Matrícula" name="matricula" width="w-32" className="self-end" />
            </div>
          </header>

          {/* --- DATOS DEL PACIENTE --- */}
          <section className="p-8 border-b border-outline-variant bg-surface-bright">
            <h2 className="text-xs font-bold bg-on-surface text-surface inline-block px-3 py-1 mb-4 rounded-sm tracking-wider uppercase">Datos del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
              <InputField label="Paciente (Apellidos y Nombres)" name="paciente" className="md:col-span-2" />
              <InputField label="O. Social" name="obraSocial" />
              <InputField label="N° AFIL" name="numAfil" />
              
              <InputField label="F. Nac." name="fNac" type="date" />
              <InputField label="Edad" name="edad" />
              <InputField label="Estado Civil" name="estadoCivil" />
              <InputField label="Nacionalidad" name="nacionalidad" />
              
              <InputField label="N° de Doc." name="numDoc" />
              <InputField label="Teléfono Fijo" name="telefono" />
              <InputField label="Celular" name="celular" />
              <div className="hidden md:block"></div>
  
              <InputField label="Domicilio (calle, núm., barrio, localidad)" name="domicilio" className="md:col-span-4" />
              
              <InputField label="Profesión / Actividad" name="profesion" className="md:col-span-2" />
              <InputField label="Titular" name="titular" />
              <InputField label="Jerarquía" name="jerarquia" />
              <InputField label="Lugar de trabajo" name="lugarTrabajo" className="md:col-span-4" />
            </div>
          </section>

          {/* --- CUESTIONARIO MÉDICO (Anamnesis) --- */}
          <section className="p-8 border-b border-outline-variant bg-surface-container-lowest">
            <div className="mb-4">
              <h2 className="text-xs font-bold bg-on-surface text-surface inline-block px-3 py-1 rounded-sm tracking-wider uppercase">Cuestionario Médico</h2>
              <p className="text-xs text-error font-bold mt-1 italic">Este cuestionario tiene el tenor de una "Declaración Jurada"</p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {/* Columna Izquierda */}
              <div>
                <QuestionRow label="Padre con vida?" name="padreVivo" detailLabel="Enfermedad:" />
                <QuestionRow label="Madre con vida?" name="madreViva" detailLabel="Enfermedad:" />
                <QuestionRow label="Hermanos?" name="hermanos" detailLabel="Sanos?" />
                <QuestionRow label="Sufre de alguna enfermedad?" name="sufreEnfermedad" detailLabel="De qué?" />
                <QuestionRow label="Hace algún tratamiento médico?" name="tratamientoMedico" detailLabel="Cuál?" />
                <div className="py-2 border-b border-outline-variant/30">
                  <InputField label="Qué medicamento/s consume habitualmente?" name="medsHabituales" />
                </div>
                <div className="py-2 border-b border-outline-variant/30">
                  <InputField label="Qué medicamentos ha consumido en los ultimos 5 años?" name="meds5Anos" />
                </div>
                <QuestionRow label="Realiza algún deporte?" name="deporte" detailLabel="Nota malestar?" />
                <div className="py-2 border-b border-outline-variant/30">
                  <InputField label="Realiza tratamiento homeopático, Acupuntura, otros?" name="homeopatia" />
                </div>
                <div className="py-2 border-b border-outline-variant/30 flex gap-4">
                  <InputField label="Médico clínico" name="medicoClinico" />
                  <InputField label="Clínica/Hospital (derivación)" name="hospital" />
                </div>
                <QuestionRow label="Es alérgico a alguna droga?" name="alergico" detailLabel="Cuál?" />
                <div className="flex gap-4 ml-4 text-sm mb-2 text-on-surface">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="alergiaAnestesia" onChange={handleInputChange} className="accent-primary"/> A la anestesia</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="alergiaPenicilina" onChange={handleInputChange} className="accent-primary"/> A la penicilina</label>
                  <InputField label="Otros" name="alergiaOtros" width="w-32" />
                </div>
              </div>
  
              {/* Columna Derecha */}
              <div>
                <QuestionRow label="Otra enfermedad infecto-contagiosa?" name="infectoContagiosa" />
                <QuestionRow label="Tuvo transfusiones?" name="transfusiones" detailLabel="Cuándo?" />
                <QuestionRow label="Fue operado alguna vez?" name="operado" detailLabel="De qué/Cuándo?" />
                <QuestionRow label="Tiene algún problema respiratorio?" name="respiratorio" detailLabel="Cuál?" />
                <QuestionRow label="Fuma?" name="fuma" />
                <QuestionRow label="Está embarazada?" name="embarazada" detailLabel="Meses:" />
                <div className="py-2 border-b border-outline-variant/30">
                  <InputField label="Recomendación de su médico que quiera dejar constancia?" name="recomendacionMedica" />
                </div>
                <QuestionRow label="Tiene problema de colágeno (hiperlaxitud)?" name="colageno" />
                <QuestionRow label="Antecedentes de fiebre reumática?" name="fiebreReumatica" detailLabel="Protege con medicación?" />
                <QuestionRow label="Es diabético?" name="diabetico" detailLabel="Controlado con?" />
                <QuestionRow label="Tiene algún problema cardíaco?" name="cardiaco" detailLabel="Cuál?" />
                <QuestionRow label="Toma seguido aspirina y/o anticoagulante?" name="aspirina" detailLabel="Frecuencia?" />
                <QuestionRow label="Tiene presión alta?" name="presionAlta" />
                <QuestionRow label="Chagas?" name="chagas" detailLabel="Tratamiento?" />
                <div className="flex gap-2">
                  <div className="flex-1"><QuestionRow label="Problemas renales?" name="renales" /></div>
                  <div className="flex-1"><QuestionRow label="Ulcera Gástrica?" name="ulcera" /></div>
                </div>
                <div className="flex items-center gap-4 py-2 border-b border-outline-variant/30 text-sm text-on-surface">
                  <span className="font-medium text-on-surface">Tuvo hepatitis?</span>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="hepatitis" onChange={() => setRadioValue('hepatitis', 'SI')} className="accent-primary"/> SI</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="hepatitis" onChange={() => setRadioValue('hepatitis', 'NO')} className="accent-primary"/> NO</label>
                  <span className="ml-2 text-on-surface-variant">De qué tipo?</span>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="hepA" onChange={handleInputChange} className="accent-primary"/> A</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="hepB" onChange={handleInputChange} className="accent-primary"/> B</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="hepC" onChange={handleInputChange} className="accent-primary"/> C</label>
                </div>
                <QuestionRow label="Tiene algún problema hepático?" name="hepatico" detailLabel="Cuál?" />
                <QuestionRow label="Tuvo convulsiones?" name="convulsiones" />
                <QuestionRow label="Es epiléptico?" name="epileptico" detailLabel="Medicación:" />
                <QuestionRow label="Ha tenido Sífilis o Gonorrea?" name="venereas" />
              </div>
            </div>
          </section>

          {/* --- CUESTIONARIO ODONTOLÓGICO --- */}
          <section className="p-8 border-b border-outline-variant bg-surface-bright">
            <h2 className="text-xs font-bold bg-on-surface text-surface inline-block px-3 py-1 mb-4 rounded-sm tracking-wider uppercase">Historia Clínica Odontológica</h2>
            
            <div className="mb-4">
              <InputField label="Por qué asistió a la consulta?" name="motivoConsulta" className="mb-4" />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <QuestionRow label="Cuando le sacan una muela o se lastima, sangra mucho?" name="sangraMucho" />
                <QuestionRow label="Cicatriza bien?" name="cicatrizaBien" />
                <QuestionRow label="Consultó antes con algún otro profesional?" name="consultoOtro" detailLabel="Resultados?" />
                <QuestionRow label="Tomó algún medicamento?" name="tomoMedicamentoOdonto" detailLabel="Nombre:" />
                <QuestionRow label="Sufrió algún golpe en los dientes?" name="golpeDientes" detailLabel="Cómo se produjo?" />
                <QuestionRow label="Se le fracturó algún diente?" name="fracturaDiente" detailLabel="Cuál/Tratamiento?" />
                <div className="py-2 border-b border-outline-variant/30 text-on-surface">
                  <span className="text-sm font-medium text-on-surface mb-2 block">Tiene dificultad para:</span>
                  <div className="grid grid-cols-2 gap-2 text-sm ml-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="difHablar" onChange={handleInputChange} className="accent-primary"/> Hablar</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="difMasticar" onChange={handleInputChange} className="accent-primary"/> Masticar</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="difAbrir" onChange={handleInputChange} className="accent-primary"/> Abrir la boca</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="difTragar" onChange={handleInputChange} className="accent-primary"/> Tragar alimentos</label>
                  </div>
                </div>
              </div>
  
              <div>
                 <div className="py-2 border-b border-outline-variant/30 text-on-surface">
                  <div className="flex items-center gap-4 text-sm font-medium text-on-surface mb-2">
                    Ha tenido dolor?
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tuvoDolor" onChange={() => setRadioValue('tuvoDolor', 'SI')} className="accent-primary"/> SI</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tuvoDolor" onChange={() => setRadioValue('tuvoDolor', 'NO')} className="accent-primary"/> NO</label>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm ml-4 bg-surface-container-lowest p-3 rounded border border-outline-variant">
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorSuave" onChange={handleInputChange} className="accent-primary"/> Suave</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorModerado" onChange={handleInputChange} className="accent-primary"/> Moderado</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorIntenso" onChange={handleInputChange} className="accent-primary"/> Intenso</label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorTemporario" onChange={handleInputChange} className="accent-primary"/> Temporario</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorIntermitente" onChange={handleInputChange} className="accent-primary"/> Intermitente</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorContinuo" onChange={handleInputChange} className="accent-primary"/> Continuo</label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorEspontaneo" onChange={handleInputChange} className="accent-primary"/> Espontáneo</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="dolorProvocado" onChange={handleInputChange} className="accent-primary"/> Provocado</label>
                      <div className="ml-4 flex flex-col text-xs text-on-surface-variant">
                        <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="provocadoFrio" onChange={handleInputChange} className="accent-primary"/> Al frio</label>
                        <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="provocadoCalor" onChange={handleInputChange} className="accent-primary"/> Al calor</label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <InputField label="Localizado dónde?" name="dolorLocalizado" />
                    <InputField label="Irradiado hacia dónde?" name="dolorIrradiado" />
                  </div>
                  <InputField label="Puede calmarlo con algo?" name="calmaDolorCon" className="mt-2" />
                </div>
              </div>
            </div>
          </section>

          {/* --- EXAMEN CLÍNICO --- */}
          <section className="p-8 border-b border-outline-variant bg-surface-container-lowest">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <QuestionRow label="Observó algo anormal en labios/lengua/paladar/piso?" name="anormalTejidos" />
                <QuestionRow label="Sale pus de algún lugar de su boca?" name="pusBoca" detailLabel="De dónde?" />
                <QuestionRow label="Tiene movilidad en sus dientes?" name="movilidadDientes" />
                <QuestionRow label="Al morder siente altos los dientes?" name="altosMorder" />
                <QuestionRow label="Ha tenido la cara hinchada?" name="caraHinchada" />
                <div className="text-sm py-2 ml-4 flex gap-4 text-on-surface-variant">
                  Se puso: 
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="hielo" onChange={handleInputChange} className="accent-primary"/> Hielo</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="calor" onChange={handleInputChange} className="accent-primary"/> Calor</label>
                  <InputField label="Otros" name="hinchazonOtros" width="w-32" />
                </div>
              </div>
              <div>
                <div className="py-2 border-b border-outline-variant/30 text-on-surface">
                  <span className="text-sm font-medium text-on-surface mb-2 block">Qué tipo de lesiones presenta:</span>
                  <div className="grid grid-cols-3 gap-2 text-sm ml-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="lesionManchas" onChange={handleInputChange} className="accent-primary"/> Manchas</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="lesionAbultamiento" onChange={handleInputChange} className="accent-primary"/> Abultamiento</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="lesionUlceraciones" onChange={handleInputChange} className="accent-primary"/> Ulceraciones</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" name="lesionAmpollas" onChange={handleInputChange} className="accent-primary"/> Ampollas</label>
                    <div className="col-span-2"><InputField label="Otros" name="lesionOtros" /></div>
                  </div>
                </div>
                <div className="py-2 border-b border-outline-variant/30 flex items-center gap-4 text-sm text-on-surface">
                  <span className="font-medium text-on-surface">Estado de la higiene bucal:</span>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="higiene" onChange={() => setRadioValue('higiene', 'Muy Bueno')} className="accent-primary"/> Muy bueno</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="higiene" onChange={() => setRadioValue('higiene', 'Bueno')} className="accent-primary"/> Bueno</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="higiene" onChange={() => setRadioValue('higiene', 'Deficiente')} className="accent-primary"/> Deficiente</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="higiene" onChange={() => setRadioValue('higiene', 'Malo')} className="accent-primary"/> Malo</label>
                </div>
                <QuestionRow label="Le sangran las encías?" name="sangranEncias" detailLabel="Cuándo?" />
                <div className="flex gap-4 mt-2">
                  <InputField label="Momentos de azúcar diario" name="azucarDiario" />
                  <InputField label="Índice de placa" name="indicePlaca" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-secondary-container/20 border border-secondary-container p-4 text-sm italic text-on-surface-variant rounded-lg text-center">
              "Declaro que he contestado todas las preguntas con honestidad y según mi conocimiento. Asimismo, he sido informado que los datos suministrados quedan reservados en la presente Historia Clínica y amparados en secreto profesional."
            </div>
          </section>

          {/* --- ODONTOGRAMA --- */}
          <section className="p-8 border-b border-outline-variant bg-primary-fixed/30">
            <h2 className="text-xl font-bold text-center text-on-surface mb-6">ODONTOGRAMA</h2>
            
            {/* Referencias */}
            <div className="flex flex-wrap gap-4 justify-center mb-8 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant">
              <span className="font-bold text-sm mr-2 flex items-center text-on-surface">REFERENCIAS:</span>
              {COLORS.map(color => (
                <button key={color.id} onClick={() => setSelectedColor(color.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${selectedColor === color.hex ? 'ring-2 ring-primary bg-surface-container-low shadow-inner' : 'hover:bg-surface-container-lowest border-outline-variant'}`}
                >
                  <div className={`w-4 h-4 border ${color.border} rounded-sm flex items-center justify-center`} style={{ backgroundColor: color.hex }}>
                    {color.id === 'ausente' && <span className="text-white font-bold text-[10px]">X</span>}
                  </div>
                  <span className="font-semibold text-on-surface">{color.label}</span>
                </button>
              ))}
            </div>
  
            <div className="flex flex-col items-center pb-4">
              {/* Adultos */}
              <div className="flex flex-col items-center">
                <div className="flex items-end">
                  <div className="flex gap-[2px] border-r-[3px] border-b-[3px] border-on-surface pr-2 pb-2">
                    {getQuadrant(18, 11).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="top" />)}
                  </div>
                  <div className="flex gap-[2px] border-l-[3px] border-b-[3px] border-on-surface pl-2 pb-2">
                    {getQuadrant(21, 28).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="top" />)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex gap-[2px] border-r-[3px] border-t-[3px] border-on-surface pr-2 pt-2">
                    {getQuadrant(48, 41).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="bottom" />)}
                  </div>
                  <div className="flex gap-[2px] border-l-[3px] border-t-[3px] border-on-surface pl-2 pt-2">
                    {getQuadrant(31, 38).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="bottom" />)}
                  </div>
                </div>
              </div>
  
              {/* Pediátricos */}
              <div className="relative flex flex-col items-center mt-10 w-full max-w-[700px]">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 italic text-on-surface-variant font-bold">Derecha</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 italic text-on-surface-variant font-bold">Izquierda</span>
                <div className="flex items-end">
                  <div className="flex gap-[2px] border-r-[3px] border-b-[3px] border-on-surface pr-2 pb-2">
                    {getQuadrant(55, 51).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="top" />)}
                  </div>
                  <div className="flex gap-[2px] border-l-[3px] border-b-[3px] border-on-surface pl-2 pb-2">
                    {getQuadrant(61, 65).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="top" />)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex gap-[2px] border-r-[3px] border-t-[3px] border-on-surface pr-2 pt-2">
                    {getQuadrant(85, 81).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="bottom" />)}
                  </div>
                  <div className="flex gap-[2px] border-l-[3px] border-t-[3px] border-on-surface pl-2 pt-2">
                    {getQuadrant(71, 75).map(t => <Tooth key={t.id} toothData={t} updateSurface={updateSurface} openNote={openNote} position="bottom" />)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- DATOS DENTALES ADICIONALES --- */}
          <section className="p-8 border-b border-outline-variant bg-surface-container-lowest">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputField label="Prótesis Fija" name="protesisFija" />
              <InputField label="Prótesis Removible" name="protesisRemovible" />
              <InputField label="Coronas" name="cantCoronas" />
              <InputField label="Cantidad de Dientes Existentes" name="dientesExistentes" />
            </div>
            
            <div className="flex flex-wrap gap-8 mt-6">
              <span className="font-bold text-on-surface text-sm">Estado bucal general:</span>
              <div className="flex items-center gap-2 text-sm text-on-surface">
                <span>Presencia de sarro</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="sarro" onChange={() => setRadioValue('sarro', 'SI')} className="accent-primary"/> SI</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="sarro" onChange={() => setRadioValue('sarro', 'NO')} className="accent-primary"/> NO</label>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface">
                <span>Enfermedad Periodontal</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="periodontal" onChange={() => setRadioValue('periodontal', 'SI')} className="accent-primary"/> SI</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="periodontal" onChange={() => setRadioValue('periodontal', 'NO')} className="accent-primary"/> NO</label>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-4">
              <InputField label="Diagnóstico presuntivo" name="diagnostico" />
              <InputField label="Plan de tratamiento fecha" name="planTratamiento" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 tracking-wider">Observaciones:</label>
                <textarea name="observaciones" value={formData.observaciones || ''} onChange={handleInputChange} className="w-full border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none p-3 text-sm bg-surface-bright resize-none h-24 text-on-surface"></textarea>
              </div>
              <div className="flex gap-4">
                <InputField label="Continúa en Anexo N°" name="anexo1" width="w-32" />
                <InputField label="Continúa en Anexo N°" name="anexo2" width="w-32" />
                <InputField label="Continúa en Anexo N°" name="anexo3" width="w-32" />
              </div>
            </div>
          </section>

          {/* --- CONSENTIMIENTO INFORMADO --- */}
          <section className="p-8 bg-surface-bright rounded-b-xl">
            <p className="text-sm text-justify text-on-surface-variant mb-6">
              He comprendido todas las explicaciones que se me han facilitado en lenguaje claro y sencillo, he podido realizar todas las observaciones y se me han aclarado todas las dudas; por lo que estoy completamente de acuerdo con el tratamiento que se me va a realizar.
            </p>
            
            <div className="flex flex-wrap items-end gap-2 text-sm mb-6 text-on-surface">
              El/la que suscribe <input type="text" name="firmaNombre" className="border-b border-on-surface bg-transparent outline-none w-64 text-center px-2" onChange={handleInputChange}/>
              DNI N° <input type="text" name="firmaDni" className="border-b border-on-surface bg-transparent outline-none w-32 text-center px-2" onChange={handleInputChange}/>
              con domicilio en calle <input type="text" name="firmaDomicilio" className="border-b border-on-surface bg-transparent outline-none flex-1 min-w-[200px] text-center px-2" onChange={handleInputChange}/>
            </div>
            <div className="text-sm mb-12 text-on-surface">
              otorgo mi consentimiento para realizar el tratamiento necesario para rehabilitar mi salud bucodental propuesta por el/la Dr/a MP. <input type="text" name="firmaDoc" className="border-b border-on-surface bg-transparent outline-none w-64 text-center px-2" onChange={handleInputChange}/>
            </div>
  
            <div className="flex justify-around items-end mt-16 pt-8">
              <div className="flex flex-col items-center w-64">
                <div className="w-full border-b border-on-surface h-8 mb-2"></div>
                <span className="text-xs text-on-surface-variant">Firma del paciente o tutor</span>
              </div>
              <div className="flex flex-col items-center w-64">
                <div className="w-full border-b border-on-surface h-8 mb-2"></div>
                <span className="text-xs text-on-surface-variant">Aclaración</span>
              </div>
              <div className="flex flex-col items-center w-48">
                <div className="w-full border-b border-on-surface h-8 mb-2"></div>
                <span className="text-xs text-on-surface-variant">DNI N°</span>
              </div>
            </div>
          </section>

          {/* Botones de acción flotantes (ocultos al imprimir) */}
          <div className="sticky bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-outline-variant p-4 flex justify-end gap-4 rounded-b-xl print:hidden">
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
              Imprimir PDF
            </button>
            <button 
              onClick={() => {
                console.log('Datos a guardar en BD:', { paciente: formData, odontograma: teeth });
                onClose();
              }} 
              className="flex items-center gap-2 bg-primary hover:bg-surface-tint text-on-primary font-label-md py-2.5 px-6 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Guardar Historial
            </button>
          </div>

        </div>
      </div>

      {/* --- MODAL DE ANOTACIONES DEL ODONTOGRAMA --- */}
      {activeNoteId !== null && (
        <div className="fixed inset-0 bg-on-background/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4 print:hidden">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-6 border border-outline-variant">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-on-surface">Anotaciones - Pieza {activeNoteId}</h3>
              <button onClick={() => setActiveNoteId(null)} className="text-on-surface-variant hover:text-on-surface text-2xl cursor-pointer">&times;</button>
            </div>
            <textarea
              className="w-full h-32 p-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-on-surface bg-surface-bright resize-none"
              placeholder="Escribe aquí los detalles del tratamiento, patologías, etc."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md cursor-pointer" onClick={() => setActiveNoteId(null)}>Cancelar</button>
              <button className="px-4 py-2 bg-primary hover:bg-surface-tint text-on-primary rounded-lg font-label-md cursor-pointer shadow-sm" onClick={saveNote}>Guardar Anotación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
