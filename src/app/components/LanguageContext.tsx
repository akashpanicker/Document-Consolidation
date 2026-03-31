import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  "header.preJobPlanning": { en: "Document Consolidation", es: "Consolidación de Documentos" },
  "header.login": { en: "Login", es: "Iniciar Sesión" },
  "header.siteConditions": { en: "Site Conditions", es: "Condiciones del Sitio" },
  "header.safetyBriefingDashboard": { en: "Safety Briefing Dashboard", es: "Panel de Instrucciones de Seguridad" },
  "header.online": { en: "Online", es: "En Línea" },

  // Login
  "login.emailId": { en: "Email ID", es: "Correo Electrónico" },
  "login.enterEmail": { en: "Enter your Email ID", es: "Ingrese su correo electrónico" },
  "login.password": { en: "Password", es: "Contraseña" },
  "login.enterPassword": { en: "Enter your password", es: "Ingrese su contraseña" },
  "login.forgotCredentials": { en: "Forgot credentials?", es: "¿Olvidó sus credenciales?" },
  "login.signIn": { en: "SIGN IN", es: "INICIAR SESIÓN" },
  "login.signInSSO": { en: "Sign in with SSO", es: "Iniciar sesión con SSO" },
  "login.subtitle": { en: "RigSafe Document Consolidation", es: "RigSafe Consolidación de Documentos" },
  "login.footer": { en: "H&P Field Operations System", es: "Sistema de Operaciones de Campo H&P" },
  "login.systemOnline": { en: "System Online", es: "Sistema En Línea" },

  // Weather Setup
  "weather.title": { en: "Morning Site Conditions", es: "Condiciones Matutinas del Sitio" },
  "weather.sectionTitle": { en: "Rig Weather Conditions", es: "Climáticas Actuales" },
  "weather.autoDetect": { en: "Auto-detect from GPS", es: "Auto-detectar por GPS" },
  "weather.rig": { en: "Rig", es: "Equipo de Perforación" },
  "weather.selectRig": { en: "Select a rig...", es: "Seleccione un equipo..." },
  "weather.weather": { en: "Weather", es: "Clima" },
  "weather.selectWeather": { en: "Select or type weather conditions...", es: "Seleccione o escriba condiciones climáticas..." },
  "weather.siteConditions": { en: "Site Conditions", es: "Condiciones del Sitio" },
  "weather.selectConditions": { en: "Select or type site conditions...", es: "Seleccione o escriba condiciones del sitio..." },
  "weather.newCrew": { en: "New Crew Member on Shift? (Optional)", es: "¿Nuevo Miembro de Cuadrilla en Turno? (Opcional)" },
  "weather.selectCrew": { en: "Select or type crew members...", es: "Seleccione o escriba miembros de cuadrilla..." },
  "weather.inputPlan": { en: "What Job are we doing today? (Optional)", es: "¿Qué trabajo estamos haciendo hoy? (Opcional)" },
  "weather.inputPlanPlaceholder": { en: "Describe today's planned work — e.g. Running 9-5/8 casing, making up connections on rig floor, circulating mud system...", es: "Describa el trabajo planificado para hoy — ej. Corriendo casing 9-5/8, haciendo conexiones en el piso del equipo, circulando sistema de lodo..." },
  "weather.selectPlan": { en: "Select a plan...", es: "Seleccione un plan..." },
  "weather.hazards": { en: "Additional Site Hazards (Optional)", es: "Peligros Adicionales del Sitio (Opcional)" },
  "weather.hazardsPlaceholder": { en: "E.g. wet surfaces from overnight rain, high UV index, construction near rig floor...", es: "Ej. superficies mojadas por lluvia nocturna, alto índice UV, construcción cerca del piso del equipo..." },
  "weather.aiNote": { en: "AI will generate role-specific safety instructions based on the weather and site conditions you enter above.", es: "La IA generará instrucciones de seguridad específicas por rol basadas en las condiciones climáticas y del sitio que ingrese arriba." },
  "weather.back": { en: "Back", es: "Atrás" },
  "weather.generate": { en: "Generate Briefing →", es: "Generar Instrucciones →" },

  // Weather options
  "weather.opt.clear": { en: "Clear", es: "Despejado" },
  "weather.opt.partlyCloudy": { en: "Partly Cloudy", es: "Parcialmente Nublado" },
  "weather.opt.overcast": { en: "Overcast", es: "Nublado" },
  "weather.opt.lightRain": { en: "Light Rain", es: "Lluvia Ligera" },
  "weather.opt.heavyRain": { en: "Heavy Rain", es: "Lluvia Fuerte" },
  "weather.opt.thunderstorm": { en: "Thunderstorm", es: "Tormenta Eléctrica" },
  "weather.opt.highWinds": { en: "High Winds", es: "Vientos Fuertes" },
  "weather.opt.fog": { en: "Fog", es: "Niebla" },
  "weather.opt.snow": { en: "Snow", es: "Nieve" },

  // Site condition options
  "weather.cond.normal": { en: "Normal", es: "Normal" },
  "weather.cond.wetSurfaces": { en: "Wet Surfaces", es: "Superficies Mojadas" },
  "weather.cond.muddy": { en: "Muddy", es: "Lodoso" },
  "weather.cond.icy": { en: "Icy", es: "Helado" },
  "weather.cond.highDust": { en: "High Dust", es: "Mucho Polvo" },
  "weather.cond.scaffolding": { en: "Scaffolding in Use", es: "Andamios en Uso" },
  "weather.cond.maintenance": { en: "Equipment Maintenance Ongoing", es: "Mantenimiento de Equipos en Curso" },
  "weather.cond.restricted": { en: "Restricted Access Zone Active", es: "Zona de Acceso Restringido Activa" },

  // Briefing Dashboard
  "briefing.roles": { en: "Roles", es: "Roles" },
  "briefing.complete": { en: "✓ Complete", es: "✓ Completo" },
  "briefing.reviewed": { en: "Reviewed", es: "Revisado" },
  "briefing.notReviewed": { en: "Not Reviewed", es: "No Revisado" },
  "briefing.inProgress": { en: "In Progress", es: "En Progreso" },
  "briefing.notStarted": { en: "Not Started", es: "No Iniciado" },
  "briefing.aiTitle": { en: "AI-Generated Safety Instructions", es: "Instrucciones de Seguridad Generadas por IA" },
  "briefing.weatherAlert": { en: "Weather Alert: Light rain increases slip risk on rig floor. Monitor wind speed — current 18 MPH is in the caution zone for lifting operations.", es: "Alerta Climática: La lluvia ligera aumenta el riesgo de resbalones en el piso del equipo. Monitoree la velocidad del viento — 18 MPH actual está en zona de precaución para operaciones de izaje." },
  "briefing.ppe": { en: "PERSONAL PROTECTIVE EQUIPMENT", es: "EQUIPO DE PROTECCIÓN PERSONAL" },
  "briefing.preShift": { en: "PRE-SHIFT CHECKS", es: "VERIFICACIONES PRE-TURNO" },
  "briefing.emergency": { en: "EMERGENCY PROCEDURES", es: "PROCEDIMIENTOS DE EMERGENCIA" },
  "briefing.addInstruction": { en: "+ Add instruction", es: "+ Agregar instrucción" },
  "briefing.typeSafety": { en: "Type safety instruction...", es: "Escriba instrucción de seguridad..." },
  "briefing.custom": { en: "CUSTOM", es: "PERSONALIZADO" },
  "briefing.back": { en: "Back", es: "Atrás" },
  "briefing.download": { en: "DOWNLOAD BRIEFING REPORT ↓", es: "DESCARGAR INFORME DE INSTRUCCIONES ↓" },
  "briefing.visibility": { en: "Visibility: 2–5 miles", es: "Visibilidad: 3–8 km" },
  "briefing.lightRainWeather": { en: "Light Rain — 42°F — 18 MPH Winds", es: "Lluvia Ligera — 6°C — 29 km/h Vientos" },

  // Briefing checklist items
  "briefing.ppe1": { en: "Steel-toed boots with slip-resistant soles — mandatory (wet conditions)", es: "Botas con punta de acero con suelas antideslizantes — obligatorio (condiciones húmedas)" },
  "briefing.ppe2": { en: "Hard hat with chin strap fastened", es: "Casco con correa de barbilla ajustada" },
  "briefing.ppe3": { en: "High-visibility rain gear — required due to precipitation", es: "Equipo de lluvia de alta visibilidad — requerido por precipitación" },
  "briefing.ppe4": { en: "Non-slip gloves rated for wet environments", es: "Guantes antideslizantes clasificados para ambientes húmedos" },
  "briefing.pre1": { en: "Confirm rig floor drainage — no standing water", es: "Confirmar drenaje del piso del equipo — sin agua estancada" },
  "briefing.pre2": { en: "Verify all floor grating secured and anti-slip mats placed", es: "Verificar todas las rejillas del piso aseguradas y tapetes antideslizantes colocados" },
  "briefing.pre3": { en: "Check BOP controls for moisture ingress", es: "Revisar controles del BOP por ingreso de humedad" },
  "briefing.pre4": { en: "Confirm wind speed within safe limits for all planned lifts (current: 18 MPH — caution)", es: "Confirmar velocidad del viento dentro de límites seguros para todos los izajes planificados (actual: 29 km/h — precaución)" },
  "briefing.em1": { en: "Review muster point — confirm accessible in current visibility", es: "Revisar punto de reunión — confirmar accesible con visibilidad actual" },
  "briefing.em2": { en: "Confirm radio channel and backup comms", es: "Confirmar canal de radio y comunicaciones de respaldo" },
  "briefing.em3": { en: "Identify nearest sheltered evacuation route", es: "Identificar la ruta de evacuación con refugio más cercana" },

  // Driller checklist items
  "briefing.driller1": { en: "Confirm BOP test completed before spudding operations", es: "Confirmar prueba de BOP completada antes de iniciar perforación" },
  "briefing.driller2": { en: "Verify weight indicator and deadline anchor are calibrated", es: "Verificar que el indicador de peso y ancla de línea muerta estén calibrados" },
  "briefing.driller3": { en: "Monitor hook load limits — do not exceed rated capacity", es: "Monitorear límites de carga del gancho — no exceder capacidad nominal" },
  "briefing.driller4": { en: "Confirm top drive torque settings for today's pipe size", es: "Confirmar ajustes de torque del top drive para el tamaño de tubería de hoy" },
  "briefing.driller5": { en: "Check driller's console emergency stop is functional", es: "Verificar que el paro de emergencia de la consola del perforador sea funcional" },

  // Floorman 1 checklist items
  "briefing.floorman1_1": { en: "Inspect all tongs and dies before making connections", es: "Inspeccionar todas las tenazas y dados antes de hacer conexiones" },
  "briefing.floorman1_2": { en: "Confirm stabbing board is secured before running casing", es: "Confirmar que la tabla de guía esté asegurada antes de correr revestimiento" },
  "briefing.floorman1_3": { en: "Wear cut-resistant gloves during all pipe handling", es: "Usar guantes resistentes a cortes durante todo manejo de tubería" },
  "briefing.floorman1_4": { en: "Verify floor safety gates are latched before rotary is engaged", es: "Verificar que las puertas de seguridad del piso estén cerradas antes de activar la mesa rotaria" },
  "briefing.floorman1_5": { en: "Keep clear of the rotary table during drilling operations", es: "Mantenerse alejado de la mesa rotaria durante operaciones de perforación" },
  "briefing.floorman1_6": { en: "Check cat line and tugger line for wear before use", es: "Revisar línea de gato y línea de arrastre por desgaste antes de usar" },

  // Floorman 2 checklist items
  "briefing.floorman2_1": { en: "Confirm iron roughneck is properly aligned before each connection", es: "Confirmar que el iron roughneck esté alineado correctamente antes de cada conexión" },
  "briefing.floorman2_2": { en: "Inspect spinning chain condition and replace if worn", es: "Inspeccionar condición de la cadena giratoria y reemplazar si está desgastada" },
  "briefing.floorman2_3": { en: "Keep personnel clear of the V-door during pipe pickup", es: "Mantener al personal alejado de la puerta en V durante recogida de tubería" },
  "briefing.floorman2_4": { en: "Verify all hand tools are secured and inventoried", es: "Verificar que todas las herramientas manuales estén aseguradas e inventariadas" },
  "briefing.floorman2_5": { en: "Report any dropped objects immediately to the Driller", es: "Reportar cualquier objeto caído inmediatamente al Perforador" },
  "briefing.floorman2_6": { en: "Confirm drill line slip-and-cut schedule is up to date", es: "Confirmar que el programa de deslizamiento y corte de línea de perforación esté actualizado" },

  // Pit Hand checklist items
  "briefing.pithand1": { en: "Check all pit levels and record baseline readings", es: "Verificar todos los niveles de fosa y registrar lecturas base" },
  "briefing.pithand2": { en: "Monitor mud weight and viscosity every 30 minutes", es: "Monitorear peso y viscosidad del lodo cada 30 minutos" },
  "briefing.pithand3": { en: "Inspect shaker screens for damage before circulating", es: "Inspeccionar mallas de zaranda por daños antes de circular" },
  "briefing.pithand4": { en: "Confirm chemical inventory levels — flag any low stock", es: "Confirmar niveles de inventario químico — señalar cualquier stock bajo" },
  "briefing.pithand5": { en: "Verify trip tank is zeroed and functional before tripping", es: "Verificar que el tanque de viaje esté en cero y funcional antes de viaje" },
  "briefing.pithand6": { en: "Check all agitators and degasser are running correctly", es: "Verificar que todos los agitadores y desgasificador funcionen correctamente" },

  // Derrickman checklist items
  "briefing.derrickman1": { en: "Inspect elevator links and bails before tripping operations", es: "Inspeccionar eslabones y agarraderas del elevador antes de operaciones de viaje" },
  "briefing.derrickman2": { en: "Confirm monkey board safety latch is engaged", es: "Confirmar que el pestillo de seguridad de la tabla del encuellador esté activado" },
  "briefing.derrickman3": { en: "Verify derrick lights are operational for low-visibility conditions", es: "Verificar que las luces de la torre estén operativas para condiciones de baja visibilidad" },
  "briefing.derrickman4": { en: "Check all racking board fingers are properly positioned", es: "Verificar que todos los dedos de la charola estén posicionados correctamente" },
  "briefing.derrickman5": { en: "Inspect traveling block and crown-o-matic settings", es: "Inspeccionar bloque viajero y ajustes del crown-o-matic" },
  "briefing.derrickman6": { en: "Confirm escape line and derrick safety harness are in good condition", es: "Confirmar que la línea de escape y arnés de seguridad de torre estén en buen estado" },

  // Language switcher
  "lang.language": { en: "LANGUAGE", es: "IDIOMA" },

  // Print modal
  "print.printing": { en: "Printing Briefing Report", es: "Imprimiendo Reporte de Instrucciones" },
  "print.preparing": { en: "Preparing safety instructions for all 5 roles...", es: "Preparando instrucciones de seguridad para los 5 roles..." },
  "print.role.driller": { en: "Printing Driller instructions...", es: "Imprimiendo instrucciones de Perforador..." },
  "print.role.floorman1": { en: "Printing Floorman 1 instructions...", es: "Imprimiendo instrucciones de Cuadrillero 1..." },
  "print.role.floorman2": { en: "Printing Floorman 2 instructions...", es: "Imprimiendo instrucciones de Cuadrillero 2..." },
  "print.role.pithand": { en: "Printing Pit Hand instructions...", es: "Imprimiendo instrucciones de Encargado de Fosas..." },
  "print.role.derrickman": { en: "Printing Derrickman instructions...", es: "Imprimiendo instrucciones de Encuellador..." },
  "print.complete": { en: "Briefing Report Printed!", es: "¡Reporte de Instrucciones Impreso!" },
  "print.message": { en: "Great work! Your crew's safety briefing is ready. Stay safe out there and have a great shift.", es: "¡Buen trabajo! Las instrucciones de seguridad de su cuadrilla están listas. Manténganse seguros y que tengan un excelente turno." },
  "print.reinforceLabel": { en: "Want to reinforce today's safety instructions?", es: "¿Desea reforzar las instrucciones de seguridad de hoy?" },
  "print.watchVideos": { en: "Watch Safety Videos", es: "Ver Videos de Seguridad" },
  "print.close": { en: "Close", es: "Cerrar" },

  // Safety Videos
  "videos.title": { en: "SAFETY VIDEOS", es: "VIDEOS DE SEGURIDAD" },
  "videos.nowWatching": { en: "Now watching", es: "Viendo ahora" },
  "videos.watched": { en: "Watched", es: "Visto" },
  "videos.notWatched": { en: "Not Watched", es: "No Visto" },

  // User dropdown
  "user.logout": { en: "Logout", es: "Cerrar Sesión" },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}