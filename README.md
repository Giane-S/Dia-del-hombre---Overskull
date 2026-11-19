# 🏛️ Tarjeta Conmemorativa • Día Internacional del Hombre | Overskull

Aplicación web interactiva desarrollada en **Vue 3 (`<script setup>`)** y **Tailwind CSS** para los colaboradores de **Overskull**.

---

## 🎨 Novedades y Composición Visual

1. **Efecto 3D Realista, Parallax e Iluminación Especular:**
   - **Inclinación 3D en tiempo real (Tilt):** Al mover el ratón o deslizar en móvil sobre el sobre o la carta, estos reaccionan inclinándose en el espacio 3D (`rotateX`, `rotateY`) con amortiguación suave tipo resorte.
   - **Reflejo especular holográfico:** Un halo de brillo dinámico sigue la posición del cursor/toque simulando un acabado de papelería satinada.
   - **Capas de profundidad 3D (Z-Index Parallax):** Los elementos internos (logotipo, insignia, selector de roles e ilustración SVG) flotan en diferentes planos de profundidad (`translateZ`), creando una sensación tridimensional auténtica.

2. **Portada 3D Plegable de Lujo (Díptico Realista):**
   - Tarjeta física vertical (`w-[340px] sm:w-[400px] h-[480px]`) con perspectiva 3D (`perspective: 1600px`), volumen en el lomo y respuesta háptica/inclinación dinámica al mover el ratón o deslizar en móvil.
   - Marco interior fino, logotipo **Overskull** en blanco en el centro, línea divisoria, fecha conmemorativa y dedicatoria personalizada (*Edición especial para [Nombre]* o *Edición especial para el equipo de Overskull*).
   - Botón minimalista blanco con icono `BookOpen` y `ArrowRight`: *Haz clic para abrir la tarjeta*.
   - **Animación 3D de desdoblamiento:** La cubierta gira 165° sobre su lomo izquierdo (`transform: rotateY(-165deg)` con `transform-origin: left center`), y la carta interior se despliega suavemente en pantalla completa.
   - Botón en la barra superior con icono `RotateCcw`: *Cerrar tarjeta* para volver a ver el pliegue tridimensional.

2. **Tarjeta Principal (`max-w-3xl`) con Insignia Geométrica SVG:**
   - Nombre **Overskull** en tipografía script en blanco puro.
   - Insignia geométrica vectorial SVG: `19 NOV • DÍA INTERNACIONAL DEL HOMBRE`.

2. **Ilustraciones Vectoriales (SVG) Geométricas por Área:**
   - **General (`#E2E8F0`):** Gráfico geométrico de equipo y reconocimiento (red hexagonal y estrella de reconocimiento).
   - **Programadores (`#3B82F6`):** Ventana de editor de código estructurado, llaves `{ }`, sintaxis y bloques de código.
   - **QA (`#10B981`):** Lupa de inspección isométrica con indicadores de verificación `✓` y retícula de testing.
   - **Soporte (`#F59E0B`):** Auriculares de diadema con ondas concéntricas de conexión y micrófono de asistencia.
   - **Ciberseguridad (`#06B6D4`):** Escudo facetado perimetral con candado cibernético central y nodos de seguridad.
   - **Redes (`#818CF8`):** Topología de red con nodo central de ruteo, enlaces de fibra y paquetes en tránsito.
   - **Marketing (`#FB7185`):** Altavoz geométrico estilizado con ondas expansivas de alcance e identidad de marca.

3. **Mecánicas Interactivas (Basadas en Iconos):**
   - **Selector de áreas:** Botones con iconos finos de `lucide-vue-next` y el color de acento propio de cada rol.
   - **Barra de reacciones (sin emojis, solo con iconos):**
     - `Coffee`: *Café por el equipo*
     - `Award`: *Buen trabajo*
     - `TrendingUp`: *A seguir sumando*
     - `Users`: *Gran compañero*
   - **Personalización dinámica:** Campo sutil con icono `User` (soporta parámetro `?nombre=` en la URL) y botón con icono `Share2` para copiar el enlace directo.

4. **Fondo Dinámico con Flujo de Circuitos y Monograma de Códigos:**
   - **Canvas interactivo de alta eficiencia:** Haces verticales de datos, circuitos luminosos con gradiente y nodos circulares brillantes con halo difuso, acompañados de fragmentos binarios flotantes (`01`, `0100000`, `11 1 0`) inspirados en estética de fibra óptica y redes de datos.
   - **Monograma de códigos:** Trama continua inclinada a `-rotate-3` con comandos técnicos reales que reaccionan lumínicamente según el área activa.

---

## 🛠️ Comandos

```bash
# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```
