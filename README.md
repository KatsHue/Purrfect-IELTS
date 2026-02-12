<div align="justify">

<h2 align="center"> 🐱 Purrfect IELTS </h2>

**Purrfect IELTS** es una plataforma de práctica para el examen IELTS que simula condiciones reales de evaluación mediante **módulos de Speaking y Writing**. <br> <br> La aplicación incorpora retroalimentación automatizada basada en inteligencia artificial para analizar gramática, coherencia, vocabulario y fluidez, además de grabación y transcripción de audio para prácticas orales. <br> <br> Incluye un **chatbot basado en una red neuronal** entrenada con información oficial del examen, que ofrece orientación, tips y estrategias y responde dudas frecuentes, así como un módulo de seguimiento que permite visualizar el progreso del usuario mediante métricas y analíticos de desempeño. <br>

<div align ="center"> 
  
> 💡 El sitio está desplegado en render free tier por lo que tardará unos segundos en iniciar.<br>

<a href="https://purrfect-ielts.onrender.com/" target="_blank"><strong>💻 Purrfect IELTS</strong></a> <br>

📚 <strong>Proyecto Modular 2026A</strong>
</div>


</div>

---
## 📖 Descripción

**Purrfect IELTS** es una aplicación web orientada a la preparación del examen de certificación IELTS General, con énfasis en las secciones de **Speaking** y **Writing**. La plataforma ofrece:

- ✅ Simulaciones interactivas de las tareas del examen
- ✅ Retroalimentación automatizada mediante inteligencia artificial
- ✅ Evaluación de fluidez, gramática, coherencia y vocabulario
- ✅ Chatbot especializado con información sobre el examen
- ✅ Seguimiento detallado del progreso del usuario

> La retroalimentación generada tiene fines educativos y no representa una evaluación oficial del examen IELTS.
---

## ✨ Características

### 🎤 Módulo de Speaking
- **Task 1:** Entrevista personal (4-5 minutos)
- **Task 2:** Discurso individual (3-4 minutos)
- **Task 3:** Discusión guiada (4-5 minutos)
- Transcripción automática (AssemblyAI)
- Evaluación con IA (GPT-4o-mini)

### ✍️ Módulo de Writing
- **Task 1:** Redacción funcional (carta formal/informal/semi-formal)
- **Task 2:** Ensayo argumentativo
- Análisis automático de gramática y coherencia

### 📊 Analíticos y Progreso
- Historial completo de prácticas
- Banda promedio obtenida
- Racha de práctica
- Minutos acumulados (últimos 30 días)
- Gráficas interactivas de desempeño

### 🤖 Chatbot Inteligente
- Red neuronal entrenada con 29 intenciones IELTS
- Información oficial (Cambridge, British Council)
- Disponible 24/7
- Respuestas contextuales y estrategias de estudio
- 84.5% de precisión en validación

---

### Distribución de Componentes

| Componente | Tecnología | Infraestructura | Responsabilidad |
|------------|------------|-----------------|-----------------|
| **Frontend** | React + TypeScript | Render Cloud | Interfaz de usuario |
| **Backend** | Node.js + Express | Render Cloud | Autenticación JWT, gestión de usuarios, analíticos |
| **Base de Datos** | MongoDB | Atlas (Cloud) | Persistencia de datos |
| **Chatbot** | Flask + PyTorch | Hugging Face Spaces | Clasificación de intenciones, respuestas IELTS |
| **Transcripción** | AssemblyAI API | External Service | Conversión audio → texto |
| **Evaluación IA** | OpenRouter + GPT | External Service | Análisis lingüístico automático |
| **Email** | SendGrid | External Service | Verificación de cuentas |

---

## 👥 Autores

- **Katia Salcedo** 
- **Manuel Nuñez** 
- **Paloma Beltrán** 
