<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Users,
  Code2,
  SearchCheck,
  Headset,
  ShieldCheck,
  Network,
  Megaphone,
  Briefcase,
  User,
  Share2,
  Check,
  Copy,
  BookOpen,
  ArrowRight,
  RotateCcw
} from 'lucide-vue-next'

// --- ESTADO DE LA TARJETA PLEGABLE 3D (DÍPTICO DE LUJO) ---
const cardFoldState = ref('closed') // 'closed' | 'opening' | 'opened'

const recipientEditionText = computed(() => {
  const trimmed = collaboratorName.value.trim()
  return trimmed 
    ? `Edición especial para ${trimmed}`
    : 'Edición especial para el equipo de Overskull'
})

const openCard = () => {
  if (cardFoldState.value !== 'closed') return
  // Paso 1 (0ms – 700ms): La cubierta frontal gira sobre su borde izquierdo en 3D (rotateY: -165deg)
  cardFoldState.value = 'opening'
  
  // Paso 2 (400ms – 950ms): Despliegue suave de la carta interior completa
  setTimeout(() => {
    cardFoldState.value = 'opened'
  }, 680)
}

const closeCard = () => {
  cardFoldState.value = 'closed'
}

// 3D Tilt interactivo para la portada cerrada
const coverRef = ref(null)
const coverTilt = ref({
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
  glareOpacity: 0
})

const handleCoverMove = (e) => {
  const el = coverRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = clientX - rect.left
  const y = clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  coverTilt.value = {
    rotateX: ((y - centerY) / centerY) * -10,
    rotateY: ((x - centerX) / centerX) * 10,
    glareX: (x / rect.width) * 100,
    glareY: (y / rect.height) * 100,
    glareOpacity: 0.22
  }
}

const handleCoverLeave = () => {
  coverTilt.value = {
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0
  }
}

// --- EFECTO 3D PARALLAX, PROFUNDIDAD Y REFLEJO ESPECULAR ---
const cardRef = ref(null)
const cardTilt = ref({
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
  glareOpacity: 0
})

const handleCardMove = (e) => {
  const el = cardRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = clientX - rect.left
  const y = clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  cardTilt.value = {
    rotateX: ((y - centerY) / centerY) * -8,
    rotateY: ((x - centerX) / centerX) * 8,
    glareX: (x / rect.width) * 100,
    glareY: (y / rect.height) * 100,
    glareOpacity: 0.18
  }
}

const handleCardLeave = () => {
  cardTilt.value = {
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0
  }
}

// --- 1. PERSONALIZACIÓN POR NOMBRE (?nombre= en URL) ---
const collaboratorName = ref('')
const canvasRef = ref(null)
let cleanupCanvas = null

onMounted(() => {
  try {
    const params = new URLSearchParams(window.location.search)
    const paramName = params.get('nombre')
    if (paramName && paramName.trim()) {
      collaboratorName.value = paramName.trim()
    }
  } catch (e) {
    // Entorno seguro
  }

  // Inicializar animación de fondo tipo circuitos y lluvia de datos
  cleanupCanvas = initBackgroundCanvas()
})

onUnmounted(() => {
  if (cleanupCanvas) cleanupCanvas()
})

// Motor de animación en Canvas: Flujo de circuitos, haces de luz y nodos luminosos (basado en la referencia)
const initBackgroundCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return null
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  let width = (canvas.width = window.innerWidth)
  let height = (canvas.height = window.innerHeight)
  let animationFrameId = null

  const handleResize = () => {
    if (!canvas) return
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    createElements()
  }
  window.addEventListener('resize', handleResize)

  let streams = []
  let binaryNodes = []

  const createElements = () => {
    streams = []
    binaryNodes = []
    const count = Math.min(Math.floor(width / 20), 75)

    // Haces de datos verticales con nodos terminales
    for (let i = 0; i < count; i++) {
      const isTopDown = Math.random() > 0.45
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 50 + Math.random() * 150,
        speed: (0.5 + Math.random() * 1.5) * (isTopDown ? 1 : -1),
        nodeRadius: 2 + Math.random() * 3.5,
        alpha: 0.2 + Math.random() * 0.6,
        isTopDown,
        color: Math.random() > 0.35 ? '56, 189, 248' : (Math.random() > 0.5 ? '6, 182, 212' : '147, 197, 253'),
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.025 + Math.random() * 0.035
      })
    }

    // Fragmentos de código binario y etiquetas flotantes
    const binaryTexts = ['01', '0100000', '11 1 0', '1 0 0 11 0', '01', '11 0', '0100000', '1101', '00 1', '10110', '010', '11']
    const bCount = Math.min(Math.floor(width / 45), 32)
    for (let i = 0; i < bCount; i++) {
      binaryNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        text: binaryTexts[Math.floor(Math.random() * binaryTexts.length)],
        alpha: 0.15 + Math.random() * 0.4,
        speed: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2
      })
    }
  }

  createElements()

  const render = () => {
    ctx.clearRect(0, 0, width, height)

    // 1. Dibujar fragmentos binarios flotantes
    ctx.font = '10px "JetBrains Mono", monospace'
    for (let i = 0; i < binaryNodes.length; i++) {
      const b = binaryNodes[i]
      b.phase += 0.02
      const currentAlpha = b.alpha * (0.65 + 0.35 * Math.sin(b.phase))
      ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha})`
      ctx.fillText(b.text, b.x, b.y)
      b.y += b.speed
      if (b.y > height + 20) b.y = -20
      if (b.y < -20) b.y = height + 20
    }

    // 2. Dibujar líneas verticales de circuitos y nodos luminosos (efecto fibra óptica / data stream)
    for (let i = 0; i < streams.length; i++) {
      const s = streams[i]
      s.y += s.speed
      s.pulse += s.pulseSpeed

      // Envoltura continua
      if (s.isTopDown && s.y - s.length > height) {
        s.y = -s.length
        s.x = Math.random() * width
      } else if (!s.isTopDown && s.y + s.length < 0) {
        s.y = height + s.length
        s.x = Math.random() * width
      }

      const pulseAlpha = s.alpha * (0.75 + 0.25 * Math.sin(s.pulse))

      // Línea vertical con gradiente que se desvanece en la cola
      const tailY = s.isTopDown ? s.y - s.length : s.y + s.length
      const gradient = ctx.createLinearGradient(s.x, tailY, s.x, s.y)
      gradient.addColorStop(0, `rgba(${s.color}, 0)`)
      gradient.addColorStop(0.7, `rgba(${s.color}, ${pulseAlpha * 0.5})`)
      gradient.addColorStop(1, `rgba(${s.color}, ${pulseAlpha})`)

      ctx.beginPath()
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.3
      ctx.moveTo(s.x, tailY)
      ctx.lineTo(s.x, s.y)
      ctx.stroke()

      // Halo difuso / resplandor alrededor del nodo
      const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.nodeRadius * 4)
      glowGrad.addColorStop(0, `rgba(${s.color}, ${pulseAlpha * 0.95})`)
      glowGrad.addColorStop(0.35, `rgba(${s.color}, ${pulseAlpha * 0.35})`)
      glowGrad.addColorStop(1, `rgba(${s.color}, 0)`)

      ctx.beginPath()
      ctx.fillStyle = glowGrad
      ctx.arc(s.x, s.y, s.nodeRadius * 4, 0, Math.PI * 2)
      ctx.fill()

      // Núcleo blanco brillante en el centro del nodo
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(pulseAlpha + 0.3, 1)})`
      ctx.arc(s.x, s.y, s.nodeRadius * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    animationFrameId = requestAnimationFrame(render)
  }

  render()

  return () => {
    window.removeEventListener('resize', handleResize)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }
}

const dynamicTitle = computed(() => {
  const trimmed = collaboratorName.value.trim()
  return trimmed 
    ? `¡Feliz Día del Hombre, ${trimmed}!`
    : '¡Feliz Día Internacional del Hombre, equipo Overskull!'
})

// --- 2. ÁREAS CON COLORES DE ACENTO, MENSAJES E ICONOS ---
const areas = [
  {
    id: 'general',
    name: 'General',
    accentColor: '#E2E8F0',
    icon: Users,
    message: 'Feliz Día del Hombre a cada integrante de Overskull: gracias por su buen humor, cercanía y compromiso para hacer de este un gran lugar para trabajar.'
  },
  {
    id: 'programadores',
    name: 'Programadores',
    accentColor: '#3B82F6',
    icon: Code2,
    message: 'Feliz Día del Hombre a nuestros programadores: gracias por convertir ideas en soluciones reales, mantener la calma en cada deploy y aportar su talento en cada línea de código.'
  },
  {
    id: 'qa',
    name: 'QA',
    accentColor: '#10B981',
    icon: SearchCheck,
    message: 'Feliz Día del Hombre a nuestro equipo de QA: gracias por su ojo clínico, paciencia y detalle para que cada lanzamiento llegue impecable a producción.'
  },
  {
    id: 'soporte',
    name: 'Soporte',
    accentColor: '#F59E0B',
    icon: Headset,
    message: 'Feliz Día del Hombre a soporte: gracias por estar siempre presentes, resolver cada incidencia con calma y acompañar al equipo y a los clientes cuando más lo necesitan.'
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    accentColor: '#06B6D4',
    icon: ShieldCheck,
    message: 'Feliz Día del Hombre a ciberseguridad: gracias por anticiparse a cada riesgo, cuidar cada acceso y proteger nuestra operación con criterio y precisión.'
  },
  {
    id: 'redes',
    name: 'Redes',
    accentColor: '#818CF8',
    icon: Network,
    message: 'Feliz Día del Hombre a redes: gracias por mantener la conectividad estable, la infraestructura firme y el trabajo del equipo avanzando sin cortes.'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    accentColor: '#FB7185',
    icon: Megaphone,
    message: 'Feliz Día del Hombre a marketing: gracias por su creatividad, energía y empeño para darle voz e identidad a Overskull y conectar lo que hacemos con el mundo.'
  },
  {
    id: 'gestion',
    name: 'Gestión',
    accentColor: '#EAB308',
    icon: Briefcase,
    message: 'Feliz Día del Hombre a gestión: gracias por su criterio, organización y acompañamiento para ordenar prioridades, destrabar avances y mantener el rumbo del equipo.'
  }
]

const activeAreaId = ref('general')
const activeArea = computed(() => {
  return areas.find(a => a.id === activeAreaId.value) || areas[0]
})

// --- 3. FONDO MONOCROMÁTICO CON CÓDIGOS Y TOKENS REALES (Denso y Abundante) ---
const codeTokens = [
  { text: 'sprint_ok', area: 'gestion' },
  { text: 'milestone_done', area: 'gestion' },
  { text: 'roadmap_sync', area: 'gestion' },
  { text: 'scope_clear', area: 'gestion' },
  { text: 'backlog_groomed', area: 'gestion' },
  { text: 'git push origin main', area: 'programadores' },
  { text: 'QA_APPROVED', area: 'qa' },
  { text: '200 OK', area: 'programadores' },
  { text: 'nmap -sV -Pn', area: 'ciberseguridad' },
  { text: 'ping 10.0.0.1 -t', area: 'redes' },
  { text: 'SELECT * FROM core', area: 'programadores' },
  { text: 'CTR +4.8%', area: 'marketing' },
  { text: 'ssh overskull@cluster', area: 'ciberseguridad' },
  { text: 'deploy --prod --skip-cache', area: 'programadores' },
  { text: 'ticket #resolved', area: 'soporte' },
  { text: 'SLA: 99.99%', area: 'soporte' },
  { text: 'assert.strictEqual(status, 200)', area: 'qa' },
  { text: 'BGP route established', area: 'redes' },
  { text: 'reach +120%', area: 'marketing' },
  { text: 'zero-trust policy', area: 'ciberseguridad' },
  { text: 'latency < 1.4ms', area: 'redes' },
  { text: 'npm run test:e2e', area: 'qa' },
  { text: 'incident: closed (0s downtime)', area: 'soporte' },
  { text: 'brand: Overskull', area: 'marketing' },
  { text: 'team: Overskull 2026', area: 'general' },
  { text: 'cultura & compañerismo', area: 'general' },
  { text: '19-noviembre', area: 'general' },
  { text: 'docker-compose up -d', area: 'programadores' },
  { text: 'ssl: tls_1.3 verified', area: 'ciberseguridad' },
  { text: 'packet-loss: 0.00%', area: 'redes' },
  { text: 'csat: 100%', area: 'soporte' },
  { text: 'cypress run --headless', area: 'qa' },
  { text: 'const overskull = true;', area: 'programadores' },
  { text: 'git commit -m "feat: core"', area: 'programadores' },
  { text: 'refactor: clean-arch', area: 'programadores' },
  { text: 'async/await Promise.all()', area: 'programadores' },
  { text: 'Kubernetes: cluster healthy', area: 'redes' },
  { text: 'curl -I https://overskull.dev', area: 'programadores' },
  { text: 'HTTP/2 200 OK', area: 'programadores' },
  { text: 'branch: main protected', area: 'ciberseguridad' },
  { text: 'pull request #42 approved', area: 'qa' },
  { text: 'build: success (3.8s)', area: 'programadores' },
  { text: 'CPU: 14% | RAM: 3.2GB', area: 'redes' },
  { text: 'AES-256-GCM encrypted', area: 'ciberseguridad' },
  { text: 'campaign: launch +45%', area: 'marketing' },
  { text: 'uptime: 365 days 0s', area: 'soporte' },
  { text: 'DNS lookup: 12ms', area: 'redes' },
  { text: 'auth: bearer token valid', area: 'ciberseguridad' }
]

// 38 filas continuas, compactas y muy abundantes
const backgroundRows = Array.from({ length: 38 }, (_, rowIdx) => {
  const shift = (rowIdx * 4) % codeTokens.length
  const baseTokens = [...codeTokens.slice(shift), ...codeTokens.slice(0, shift)]
  return {
    id: rowIdx,
    directionClass: rowIdx % 2 === 0 ? 'animate-marquee-left' : 'animate-marquee-right',
    durationStyle: {
      animationDuration: `${30 + (rowIdx % 7) * 3}s`
    },
    tokens: [...baseTokens, ...baseTokens]
  }
})

const isTokenHighlighted = (tokenArea) => {
  if (activeAreaId.value === 'general') {
    return tokenArea === 'general'
  }
  return tokenArea === activeAreaId.value
}

// --- 4. COPIAR ENLACE PERSONALIZADO ---
const copiedLink = ref(false)
const copyPersonalizedLink = async () => {
  try {
    const url = new URL(window.location.href)
    const name = collaboratorName.value.trim()
    if (name) {
      url.searchParams.set('nombre', name)
    } else {
      url.searchParams.delete('nombre')
    }
    await navigator.clipboard.writeText(url.toString())
    copiedLink.value = true
    setTimeout(() => {
      copiedLink.value = false
    }, 2800)
  } catch (err) {
    // Fallback seguro
  }
}
</script>

<template>
  <div class="relative min-h-screen w-full bg-[#172536] text-[#F8FAFC] flex flex-col justify-between items-center py-6 sm:py-10 px-4 sm:px-6 overflow-hidden selection:bg-white/20 selection:text-white">

    <!-- ======================================================== -->
    <!-- CANVAS: Flujo de Circuitos, Haces de Luz y Nodos Luminosos -->
    <!-- (Inspirado en la referencia técnica de líneas y partículas) -->
    <!-- ======================================================== -->
    <canvas 
      ref="canvasRef" 
      class="pointer-events-none absolute inset-0 w-full h-full z-0 opacity-80"
    ></canvas>

    <!-- ======================================================== -->
    <!-- 1. FONDO MONOCROMÁTICO CON CÓDIGOS EN MOVIMIENTO SUTIL   -->
    <!-- Densidad visual pura, -rotate-3 y reacción por área     -->
    <!-- ======================================================== -->
    <div 
      class="pointer-events-none select-none absolute inset-[-30%] overflow-hidden -rotate-3 flex flex-col justify-between z-0 opacity-60"
      aria-hidden="true"
    >
      <div
        v-for="row in backgroundRows"
        :key="row.id"
        class="whitespace-nowrap flex font-mono text-[10px] sm:text-[11px] leading-tight py-[2px]"
      >
        <div 
          :class="row.directionClass"
          :style="row.durationStyle"
        >
          <span
            v-for="(token, tIdx) in row.tokens"
            :key="tIdx"
            class="inline-block mx-3 font-mono transition-colors duration-500"
            :class="[
              isTokenHighlighted(token.area)
                ? 'text-white/35 font-medium'
                : 'text-white/[0.07] font-normal'
            ]"
          >
            {{ token.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Barra de utilidad superior discreta -->
    <div class="relative z-10 w-full max-w-3xl flex items-center justify-between pb-3 text-xs text-[#94A3B8] font-mono">
      <span class="tracking-wider uppercase text-[11px]">
        Overskull • Software Team
      </span>
      <div v-if="cardFoldState === 'opened'" class="flex items-center space-x-2">
        <button
          @click="closeCard"
          type="button"
          class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md border border-white/10 bg-[#111C29]/60 hover:bg-[#111C29] text-[#94A3B8] hover:text-white transition-all text-xs cursor-pointer"
          title="Cerrar tarjeta"
        >
          <RotateCcw class="w-3.5 h-3.5 text-slate-300" :stroke-width="1.5" />
          <span>Cerrar tarjeta</span>
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 1. PORTADA 3D CERRADA: DÍPTICO DE LUJO CON PLIEGUE REAL   -->
    <!-- w-[340px] sm:w-[400px] h-[480px], perspective: 1600px    -->
    <!-- ======================================================== -->
    <div
      v-if="cardFoldState !== 'opened'"
      class="relative z-10 my-auto transition-all duration-700 ease-out flex flex-col items-center justify-center p-2"
      :class="{ 'opacity-0 scale-95 pointer-events-none translate-x-[-40px]': cardFoldState === 'opening' }"
    >
      <div 
        class="perspective-1600 select-none cursor-pointer"
        @click="openCard"
        @mousemove="handleCoverMove"
        @mouseleave="handleCoverLeave"
        @touchmove="handleCoverMove"
        @touchend="handleCoverLeave"
      >
        <!-- Objeto Físico en 3D (Díptico cerrado) -->
        <div 
          ref="coverRef"
          class="relative w-[340px] sm:w-[400px] h-[480px] rounded-2xl bg-[#0e1723] shadow-2xl card-3d-surface border border-white/10"
          :style="{
            transform: `rotateX(${coverTilt.rotateX}deg) rotateY(${coverTilt.rotateY}deg)`,
            boxShadow: `0 35px 70px -15px rgba(0, 0, 0, 0.9), ${-coverTilt.rotateY * 3}px ${coverTilt.rotateX * 3}px 45px rgba(56, 189, 248, 0.08)`
          }"
        >
          <!-- Hoja interior que se vislumbra por debajo -->
          <div class="absolute inset-0 rounded-2xl bg-[#111C29] border border-white/10 p-6 flex flex-col justify-between overflow-hidden">
            <div class="opacity-10 font-brand text-4xl text-white text-center mt-12">Overskull</div>
            <div class="opacity-20 text-[10px] font-mono text-center text-slate-400">19 DE NOVIEMBRE • 2026</div>
          </div>

          <!-- Cubierta Frontal Plegable 3D (Se abre sobre el lomo izquierdo: rotateY(-165deg)) -->
          <div 
            class="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#182637] via-[#111C29] to-[#0c1521] border border-white/20 shadow-2xl fold-cover-3d border-l-4 border-slate-600/70 spine-shadow overflow-hidden p-6 sm:p-8 flex flex-col justify-between items-center text-center group"
            :class="{ 'rotate-y-fold opacity-0': cardFoldState === 'opening' }"
          >
            <!-- Reflejo especular holográfico dinámico en la portada -->
            <div 
              class="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-50 overflow-hidden"
              :style="{
                opacity: coverTilt.glareOpacity,
                background: `radial-gradient(circle at ${coverTilt.glareX}% ${coverTilt.glareY}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 70%)`
              }"
            ></div>

            <!-- Marco decorativo fino interior tipo papelería fina -->
            <div class="pointer-events-none absolute inset-3 rounded-xl border border-white/15"></div>

            <!-- Cabecera de la Portada: Emblema / Año -->
            <div class="relative z-10 pt-2">
              <span class="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-[#94A3B8] border border-white/10 bg-white/[0.04] px-3 py-1 rounded-full">
                19 DE NOVIEMBRE
              </span>
            </div>

            <!-- Centro de la Portada: Logotipo Overskull + Línea divisoria + Fecha -->
            <div class="relative z-10 flex flex-col items-center">
              <h2 class="font-brand text-4xl sm:text-5xl text-white font-normal tracking-wide drop-shadow-lg">
                Overskull
              </h2>
              
              <!-- Línea divisoria limpia -->
              <div class="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent my-4"></div>

              <span class="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#94A3B8] font-medium">
                Día Internacional del Hombre
              </span>
            </div>

            <!-- Pie de la Portada: Pestaña / Sello minimalista blanco con icono BookOpen -->
            <div class="relative z-10 pb-2 flex flex-col items-center">
              <div class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-[#172536] hover:bg-slate-100 font-medium text-xs shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95">
                <BookOpen class="w-4 h-4 text-[#172536]" :stroke-width="1.5" />
                <span>Haz clic para abrir la tarjeta</span>
                <ArrowRight class="w-3.5 h-3.5 text-[#172536] group-hover:translate-x-0.5 transition-transform" :stroke-width="1.5" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 2. TARJETA PRINCIPAL (max-w-3xl) ELEGANTE Y RESPIRADA     -->
    <!-- Logo Overskull en blanco + Insignia geométrica SVG       -->
    <!-- ======================================================== -->
    <main 
      v-if="cardFoldState === 'opened'"
      class="relative z-10 w-full max-w-3xl my-auto animate-fadeIn perspective-1200"
    >
      <div 
        ref="cardRef"
        @mousemove="handleCardMove"
        @mouseleave="handleCardLeave"
        @touchmove="handleCardMove"
        @touchend="handleCardLeave"
        class="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] via-[#111C29]/95 to-[#111C29] backdrop-blur-md shadow-2xl p-6 sm:p-10 card-3d-surface overflow-hidden"
        :style="{
          transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
          boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.8), ${-cardTilt.rotateY * 3}px ${cardTilt.rotateX * 3}px 40px rgba(56, 189, 248, 0.08)`
        }"
      >
        <!-- Reflejo especular holográfico dinámico que sigue al cursor -->
        <div 
          class="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-50 overflow-hidden"
          :style="{
            opacity: cardTilt.glareOpacity,
            background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)`
          }"
        ></div>

        <!-- Cabecera en 3D Depth Layer: Logo Overskull + Insignia Geométrica SVG -->
        <div class="depth-layer-md flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-white/10 gap-4">
          <!-- Logo de Overskull en blanco cursiva elegante -->
          <div class="flex items-center space-x-3">
            <h1 class="font-brand text-3xl sm:text-4xl text-white font-normal tracking-wide">
              Overskull
            </h1>
          </div>

          <!-- Insignia Geométrica SVG con 19 NOV • DÍA INTERNACIONAL DEL HOMBRE -->
          <div class="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[11px] sm:text-xs font-mono tracking-wider text-slate-300">
            <!-- Icono Geométrico SVG -->
            <svg class="w-4 h-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
            <span class="font-medium text-white/90">19 NOV • DÍA INTERNACIONAL DEL HOMBRE</span>
          </div>
        </div>

        <!-- Personalizador de Nombre de Colaborador en 3D Depth Layer -->
        <div class="depth-layer-sm pt-5 pb-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#172536]/40 border border-white/10 rounded-xl px-3.5 py-2">
            <label for="collab-name" class="flex items-center space-x-2 text-xs text-[#94A3B8] font-mono shrink-0">
              <User class="w-3.5 h-3.5 text-slate-300" :stroke-width="1.5" />
              <span>Personalizar para:</span>
            </label>
            <input
              id="collab-name"
              v-model="collaboratorName"
              type="text"
              placeholder="Escribe un nombre (ej. Carlos, Andrés...)"
              class="w-full sm:w-72 bg-transparent text-xs sm:text-sm text-white placeholder:text-[#94A3B8]/60 focus:outline-none font-sans px-1"
            />
          </div>
        </div>

        <!-- Titular y Mensaje Central en 3D Depth Layer -->
        <div class="depth-layer-md pt-4 pb-2 text-center sm:text-left">
          <h2 class="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-3.5">
            {{ dynamicTitle }}
          </h2>
          <p class="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-normal">
            Hoy celebramos a quienes hacen que Overskull crezca cada día. Más allá del trabajo, los entregables y los retos técnicos, valoramos su calidad humana, su criterio, su compañerismo y su bienestar. Gracias por ser parte de este equipo.
          </p>
        </div>

        <!-- Divisor Sutil -->
        <div class="border-t border-white/10 my-6"></div>

        <!-- ======================================================== -->
        <!-- 3. SELECTOR DE ÁREAS EN 3D DEPTH LAYER                    -->
        <!-- ======================================================== -->
        <div class="depth-layer-lg mb-6">
          <div class="flex items-center justify-between mb-3 px-0.5">
            <span class="text-xs uppercase font-mono tracking-wider text-[#94A3B8]">
              Selecciona tu área
            </span>
          </div>

          <!-- Botones con icono y color propio del rol -->
          <div class="flex flex-wrap gap-2 items-center justify-start">
            <button
              v-for="area in areas"
              :key="area.id"
              @click="activeAreaId = area.id"
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 select-none flex items-center space-x-2 focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer"
              :style="{
                backgroundColor: activeAreaId === area.id ? area.accentColor : 'transparent',
                color: activeAreaId === area.id ? (area.id === 'general' ? '#172536' : '#ffffff') : '#94A3B8',
                borderColor: activeAreaId === area.id ? area.accentColor : 'rgba(255, 255, 255, 0.15)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }"
            >
              <component 
                :is="area.icon" 
                class="w-3.5 h-3.5" 
                :stroke-width="1.5"
                :style="{ color: activeAreaId === area.id ? (area.id === 'general' ? '#172536' : '#ffffff') : area.accentColor }"
              />
              <span class="font-medium">{{ area.name }}</span>
            </button>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- 4. BLOQUE DE MENSAJE E ILUSTRACIÓN SVG EN 3D DEPTH LAYER  -->
        <!-- ======================================================== -->
        <div 
          class="depth-layer-lg rounded-xl border bg-[#172536]/70 p-5 sm:p-7 min-h-[160px] transition-all duration-300 relative overflow-hidden"
          :style="{ borderColor: `${activeArea.accentColor}40` }"
        >
          <Transition
            mode="out-in"
            enter-active-class="transition duration-250 ease-out"
            enter-from-class="opacity-0 translate-y-1 scale-98"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-1 scale-98"
          >
            <div :key="activeArea.id" class="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
              
              <!-- Texto del Mensaje -->
              <div class="flex-1 text-center md:text-left">
                <div class="inline-flex items-center space-x-2 mb-2">
                  <span 
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: activeArea.accentColor }"
                  ></span>
                  <span 
                    class="text-xs font-mono uppercase tracking-wider font-semibold"
                    :style="{ color: activeArea.accentColor }"
                  >
                    {{ activeArea.name }}
                  </span>
                </div>
                <p class="text-sm sm:text-base text-[#F8FAFC] leading-relaxed">
                  {{ activeArea.message }}
                </p>
              </div>

              <!-- Ilustración Vectorial (SVG) limpia y geométrica según el área -->
              <div class="shrink-0 flex items-center justify-center w-40 sm:w-48 h-32 select-none">
                
                <!-- GENERAL (#E2E8F0): Gráfico geométrico de equipo y reconocimiento -->
                <svg v-if="activeArea.id === 'general'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Hexágono exterior de equipo -->
                  <polygon points="100,15 165,52 165,115 100,145 35,115 35,52" stroke="#E2E8F0" stroke-width="1.75" stroke-dasharray="4 3" opacity="0.4" />
                  <!-- Nodos de conexión de personas -->
                  <circle cx="100" cy="15" r="4" fill="#E2E8F0" />
                  <circle cx="165" cy="52" r="4" fill="#E2E8F0" />
                  <circle cx="165" cy="115" r="4" fill="#E2E8F0" />
                  <circle cx="100" cy="145" r="4" fill="#E2E8F0" />
                  <circle cx="35" cy="115" r="4" fill="#E2E8F0" />
                  <circle cx="35" cy="52" r="4" fill="#E2E8F0" />
                  <!-- Líneas radiales hacia el centro -->
                  <line x1="100" y1="15" x2="100" y2="55" stroke="#E2E8F0" stroke-width="1.5" opacity="0.6" />
                  <line x1="165" y1="52" x2="125" y2="70" stroke="#E2E8F0" stroke-width="1.5" opacity="0.6" />
                  <line x1="165" y1="115" x2="125" y2="90" stroke="#E2E8F0" stroke-width="1.5" opacity="0.6" />
                  <line x1="100" y1="145" x2="100" y2="105" stroke="#E2E8F0" stroke-width="1.5" opacity="0.6" />
                  <line x1="35" y1="115" x2="75" y2="90" stroke="#E2E8F0" stroke-width="1.5" opacity="0.6" />
                  <line x1="35" y1="52" x2="75" y2="70" stroke="#E2E8F0" stroke-width="1.5" opacity="0.6" />
                  <!-- Emblema central de reconocimiento / Estrella geométrica -->
                  <polygon points="100,50 112,70 135,75 118,90 122,112 100,100 78,112 82,90 65,75 88,70" fill="#E2E8F0" fill-opacity="0.12" stroke="#E2E8F0" stroke-width="1.75" />
                  <circle cx="100" cy="80" r="10" stroke="#E2E8F0" stroke-width="1.5" />
                </svg>

                <!-- PROGRAMADORES (#3B82F6): Ventana de editor de código y bloques de estructura -->
                <svg v-else-if="activeArea.id === 'programadores'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Ventana IDE -->
                  <rect x="25" y="20" width="150" height="110" rx="8" fill="#3B82F6" fill-opacity="0.08" stroke="#3B82F6" stroke-width="1.75" />
                  <!-- Barra de título con botones -->
                  <line x1="25" y1="42" x2="175" y2="42" stroke="#3B82F6" stroke-width="1.5" opacity="0.5" />
                  <circle cx="38" cy="31" r="2.5" fill="#3B82F6" />
                  <circle cx="48" cy="31" r="2.5" fill="#3B82F6" opacity="0.7" />
                  <circle cx="58" cy="31" r="2.5" fill="#3B82F6" opacity="0.5" />
                  <text x="75" y="34" font-family="monospace" font-size="8" fill="#3B82F6" opacity="0.8">overskull.ts</text>
                  <!-- Bloques de código estructurado y etiquetas -->
                  <path d="M 45 60 L 37 68 L 45 76" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M 60 60 L 68 68 L 60 76" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <line x1="80" y1="68" x2="135" y2="68" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" />
                  <!-- Llaves { } y líneas de funciones -->
                  <line x1="45" y1="92" x2="110" y2="92" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" opacity="0.8" />
                  <line x1="55" y1="104" x2="145" y2="104" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" opacity="0.6" />
                  <line x1="55" y1="116" x2="95" y2="116" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" opacity="0.6" />
                  <rect x="100" y="112" width="6" height="8" fill="#3B82F6" opacity="0.9" />
                </svg>

                <!-- QA (#10B981): Lupa de inspección con indicadores de validación -->
                <svg v-else-if="activeArea.id === 'qa'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Retícula de pruebas de fondo -->
                  <rect x="30" y="25" width="85" height="100" rx="6" stroke="#10B981" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.4" />
                  <line x1="40" y1="45" x2="70" y2="45" stroke="#10B981" stroke-width="1.5" opacity="0.5" />
                  <line x1="40" y1="65" x2="80" y2="65" stroke="#10B981" stroke-width="1.5" opacity="0.5" />
                  <line x1="40" y1="85" x2="65" y2="85" stroke="#10B981" stroke-width="1.5" opacity="0.5" />
                  <line x1="40" y1="105" x2="90" y2="105" stroke="#10B981" stroke-width="1.5" opacity="0.5" />
                  <!-- Lupa de inspección isométrica geométrica -->
                  <circle cx="115" cy="65" r="36" fill="#10B981" fill-opacity="0.1" stroke="#10B981" stroke-width="2" />
                  <circle cx="115" cy="65" r="28" stroke="#10B981" stroke-width="1" stroke-dasharray="4 2" opacity="0.6" />
                  <!-- Indicador de check de validación ✓ -->
                  <path d="M 103 65 L 111 73 L 129 55" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  <!-- Mango de la lupa con ángulo exacto -->
                  <line x1="141" y1="91" x2="168" y2="118" stroke="#10B981" stroke-width="4.5" stroke-linecap="round" />
                  <circle cx="168" cy="118" r="3" fill="#10B981" />
                </svg>

                <!-- SOPORTE (#F59E0B): Auriculares de asistencia con ondas de conexión -->
                <svg v-else-if="activeArea.id === 'soporte'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Diadema de auriculares -->
                  <path d="M 55 80 C 55 42, 145 42, 145 80" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" fill="none" />
                  <!-- Almohadillas / Auriculares geométricos -->
                  <rect x="42" y="70" width="16" height="32" rx="6" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="2" />
                  <rect x="142" y="70" width="16" height="32" rx="6" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="2" />
                  <!-- Micrófono de asistencia -->
                  <path d="M 150 95 Q 150 120, 115 120" stroke="#F59E0B" stroke-width="2" fill="none" stroke-linecap="round" />
                  <rect x="105" y="115" width="12" height="9" rx="3" fill="#F59E0B" />
                  <!-- Ondas concéntricas de conexión / audio -->
                  <path d="M 166 75 C 174 80, 174 92, 166 97" stroke="#F59E0B" stroke-width="1.75" stroke-linecap="round" fill="none" opacity="0.8" />
                  <path d="M 174 68 C 186 76, 186 100, 174 108" stroke="#F59E0B" stroke-width="1.75" stroke-linecap="round" fill="none" opacity="0.5" />
                  <path d="M 34 75 C 26 80, 26 92, 34 97" stroke="#F59E0B" stroke-width="1.75" stroke-linecap="round" fill="none" opacity="0.8" />
                  <path d="M 26 68 C 14 76, 14 100, 26 108" stroke="#F59E0B" stroke-width="1.75" stroke-linecap="round" fill="none" opacity="0.5" />
                </svg>

                <!-- CIBERSEGURIDAD (#06B6D4): Escudo geométrico de protección y nodos -->
                <svg v-else-if="activeArea.id === 'ciberseguridad'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Escudo facetado perimetral -->
                  <polygon points="100,18 152,38 152,82 100,132 48,82 48,38" fill="#06B6D4" fill-opacity="0.08" stroke="#06B6D4" stroke-width="2" stroke-linejoin="round" />
                  <!-- Capa interna geométrica -->
                  <polygon points="100,32 138,48 138,80 100,118 62,80 62,48" stroke="#06B6D4" stroke-width="1.25" stroke-dasharray="3 3" opacity="0.6" />
                  <!-- Candado cibernético central -->
                  <rect x="86" y="70" width="28" height="24" rx="4" fill="#06B6D4" fill-opacity="0.25" stroke="#06B6D4" stroke-width="1.75" />
                  <path d="M 92 70 L 92 60 C 92 53, 108 53, 108 60 L 108 70" stroke="#06B6D4" stroke-width="2" fill="none" />
                  <circle cx="100" cy="79" r="2.5" fill="#06B6D4" />
                  <line x1="100" y1="81.5" x2="100" y2="87" stroke="#06B6D4" stroke-width="2" />
                  <!-- Nodos perimetrales -->
                  <circle cx="48" cy="38" r="3" fill="#06B6D4" />
                  <circle cx="152" cy="38" r="3" fill="#06B6D4" />
                  <circle cx="100" cy="18" r="3" fill="#06B6D4" />
                  <circle cx="100" cy="132" r="3" fill="#06B6D4" />
                </svg>

                <!-- REDES (#818CF8): Topología de nodos y enlaces activos -->
                <svg v-else-if="activeArea.id === 'redes'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Nodo Router Central -->
                  <circle cx="100" cy="75" r="18" fill="#818CF8" fill-opacity="0.2" stroke="#818CF8" stroke-width="2" />
                  <circle cx="100" cy="75" r="7" fill="#818CF8" />
                  <!-- Enlaces radiales con datos -->
                  <line x1="100" y1="57" x2="100" y2="28" stroke="#818CF8" stroke-width="1.75" stroke-dasharray="3 2" />
                  <line x1="116" y1="67" x2="152" y2="45" stroke="#818CF8" stroke-width="1.75" />
                  <line x1="114" y1="85" x2="150" y2="108" stroke="#818CF8" stroke-width="1.75" />
                  <line x1="86" y1="85" x2="50" y2="108" stroke="#818CF8" stroke-width="1.75" stroke-dasharray="3 2" />
                  <line x1="84" y1="67" x2="48" y2="45" stroke="#818CF8" stroke-width="1.75" />
                  <!-- Nodos periféricos -->
                  <circle cx="100" cy="24" r="8" fill="#818CF8" fill-opacity="0.1" stroke="#818CF8" stroke-width="1.75" />
                  <circle cx="156" cy="42" r="8" fill="#818CF8" fill-opacity="0.1" stroke="#818CF8" stroke-width="1.75" />
                  <circle cx="154" cy="112" r="8" fill="#818CF8" fill-opacity="0.1" stroke="#818CF8" stroke-width="1.75" />
                  <circle cx="46" cy="112" r="8" fill="#818CF8" fill-opacity="0.1" stroke="#818CF8" stroke-width="1.75" />
                  <circle cx="44" cy="42" r="8" fill="#818CF8" fill-opacity="0.1" stroke="#818CF8" stroke-width="1.75" />
                  <!-- Paquetes de red circulando -->
                  <circle cx="134" cy="56" r="3" fill="#818CF8" />
                  <circle cx="68" cy="97" r="3" fill="#818CF8" />
                </svg>

                <!-- MARKETING (#FB7185): Altavoz estilizado con curvas de alcance e identidad -->
                <svg v-else-if="activeArea.id === 'marketing'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Cuerpo del megáfono / altavoz -->
                  <polygon points="50,60 90,46 115,38 115,112 90,104 50,90" fill="#FB7185" fill-opacity="0.15" stroke="#FB7185" stroke-width="2" stroke-linejoin="round" />
                  <rect x="42" y="60" width="10" height="30" rx="3" fill="#FB7185" stroke="#FB7185" stroke-width="1.5" />
                  <!-- Mango con ángulo -->
                  <polygon points="70,95 78,98 68,124 58,120" fill="#FB7185" stroke="#FB7185" stroke-width="1.5" />
                  <!-- Ondas expansivas de alcance e identidad -->
                  <path d="M 126 55 C 138 65, 138 85, 126 95" stroke="#FB7185" stroke-width="2" stroke-linecap="round" fill="none" />
                  <path d="M 137 45 C 154 60, 154 90, 137 105" stroke="#FB7185" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />
                  <path d="M 148 35 C 172 55, 172 95, 148 115" stroke="#FB7185" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5" />
                  <!-- Destellos de impacto -->
                  <polygon points="172,40 176,46 182,48 176,50 172,56 168,50 162,48 168,46" fill="#FB7185" />
                </svg>

                <!-- GESTIÓN (#EAB308): Tablero Kanban geométrico, planificación y nodos de milestone -->
                <svg v-else-if="activeArea.id === 'gestion'" class="w-full h-full" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Tablero / Marco exterior de planificación -->
                  <rect x="25" y="20" width="150" height="110" rx="8" fill="#EAB308" fill-opacity="0.07" stroke="#EAB308" stroke-width="1.75" />
                  <!-- Columnas de Kanban -->
                  <line x1="75" y1="20" x2="75" y2="130" stroke="#EAB308" stroke-width="1.25" stroke-dasharray="3 3" opacity="0.4" />
                  <line x1="125" y1="20" x2="125" y2="130" stroke="#EAB308" stroke-width="1.25" stroke-dasharray="3 3" opacity="0.4" />
                  <!-- Encabezados de columnas -->
                  <rect x="33" y="28" width="34" height="6" rx="2" fill="#EAB308" opacity="0.75" />
                  <rect x="83" y="28" width="34" height="6" rx="2" fill="#EAB308" opacity="0.75" />
                  <rect x="133" y="28" width="34" height="6" rx="2" fill="#EAB308" opacity="0.75" />
                  <!-- Tarjetas en Columna 1 (Backlog / Ideas) -->
                  <rect x="33" y="40" width="34" height="20" rx="4" fill="#EAB308" fill-opacity="0.15" stroke="#EAB308" stroke-width="1.25" />
                  <line x1="39" y1="48" x2="57" y2="48" stroke="#EAB308" stroke-width="1.5" stroke-linecap="round" />
                  <line x1="39" y1="54" x2="50" y2="54" stroke="#EAB308" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
                  <rect x="33" y="66" width="34" height="22" rx="4" fill="#EAB308" fill-opacity="0.15" stroke="#EAB308" stroke-width="1.25" />
                  <line x1="39" y1="75" x2="60" y2="75" stroke="#EAB308" stroke-width="1.5" stroke-linecap="round" />
                  <line x1="39" y1="81" x2="52" y2="81" stroke="#EAB308" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
                  <!-- Tarjetas en Columna 2 (En progreso / Sprint) -->
                  <rect x="83" y="40" width="34" height="32" rx="4" fill="#EAB308" fill-opacity="0.2" stroke="#EAB308" stroke-width="1.5" />
                  <line x1="89" y1="49" x2="110" y2="49" stroke="#EAB308" stroke-width="1.5" stroke-linecap="round" />
                  <line x1="89" y1="56" x2="103" y2="56" stroke="#EAB308" stroke-width="1.5" stroke-linecap="round" opacity="0.7" />
                  <!-- Barra de progreso miniatura en tarjeta -->
                  <rect x="89" y="63" width="22" height="3" rx="1.5" fill="#EAB308" fill-opacity="0.3" />
                  <rect x="89" y="63" width="15" height="3" rx="1.5" fill="#EAB308" />
                  <!-- Tarjetas en Columna 3 (Completadas / Milestones) -->
                  <rect x="133" y="40" width="34" height="22" rx="4" fill="#EAB308" fill-opacity="0.25" stroke="#EAB308" stroke-width="1.25" />
                  <polyline points="143,51 147,55 157,45" stroke="#EAB308" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                  <rect x="133" y="68" width="34" height="22" rx="4" fill="#EAB308" fill-opacity="0.25" stroke="#EAB308" stroke-width="1.25" />
                  <polyline points="143,79 147,83 157,73" stroke="#EAB308" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                  <!-- Nodos de Roadmap / Timeline en la base -->
                  <line x1="35" y1="114" x2="165" y2="114" stroke="#EAB308" stroke-width="1.5" opacity="0.5" />
                  <circle cx="50" cy="114" r="3.5" fill="#EAB308" />
                  <circle cx="100" cy="114" r="4.5" fill="#EAB308" stroke="#172536" stroke-width="1.5" />
                  <circle cx="150" cy="114" r="3.5" fill="#EAB308" />
                </svg>

              </div>

            </div>
          </Transition>
        </div>

      </div>
    </main>

    <!-- Footer Discreto -->
    <footer class="relative z-10 w-full max-w-3xl text-center pt-5 text-[11px] sm:text-xs text-[#94A3B8]/80 font-mono">
      <span>Overskull • 19 de Noviembre • Día Internacional del Hombre</span>
    </footer>

  </div>
</template>
