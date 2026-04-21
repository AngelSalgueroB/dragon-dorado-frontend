# Dragon Dorado - Frontend Application

Aplicación web Single-Page Application (SPA) para la gestión operativa del restaurante Dragon Dorado. Este sistema proporciona interfaces optimizadas para distintos roles (Administrador, Mozo, Cocinero), garantizando agilidad en la toma de pedidos y visualización en tiempo real.

## 1) Descripción general

### Propósito
Este proyecto expone la capa de presentación (Front-End) del sistema, diseñada con un enfoque "Mobile-First" y una arquitectura basada en componentes. Cubre los flujos críticos del restaurante:
* **Módulo de Seguridad:** Autenticación de personal.
* **Módulo de Administración:** Panel de control (Dashboard) con KPIs.
* **Módulo de Salón:** Mapa de mesas interactivo y gestión de estados.
* **Módulo de Ventas:** Comanda digital táctil para la toma rápida de pedidos con notas a cocina.
* **Módulo de Cocina:** Monitor KDS (Kitchen Display System) de alto contraste para gestión de tickets.

### Stack tecnológico
* **Framework:** React 18
* **Herramienta de Construcción:** Vite
* **Estilos y UI:** Tailwind CSS (configurado con paleta institucional corporativa)
* **Enrutamiento:** React Router Dom v6
* **Iconografía:** Lucide React
* **Despliegue:** Vercel (Proyectado) / Entorno Node.js

## 2) Estructura del proyecto
El proyecto sigue una arquitectura modular agrupada por funcionalidad (Feature-Sliced Design simplificado):

```text
src/
|- assets/               # Imágenes, logos y recursos estáticos
|- components/           # Componentes UI reutilizables (Botones, Tarjetas, Modales)
|- pages/                # Vistas principales de la aplicación
|  |- admin/             # Dashboard y reportes
|  |  |- Dashboard.jsx
|  |- auth/              # Seguridad y acceso
|  |  |- Login.jsx
|  |- kitchen/           # Interfaces de cocina
|  |  |- KdsMonitor.jsx
|  |- salon/             # Gestión de mesas y comandas
|  |  |- TableMap.jsx
|  |  |- TakeOrder.jsx
|- App.jsx               # Configuración de React Router y layout principal
|- index.css             # Directivas de Tailwind y estilos globales
|- main.jsx              # Punto de entrada de la aplicación React
```

## 3) Instalación y puesta en marcha

### Requisitos previos
* Node.js (v18.x o superior recomendado)
* npm (v9.x o superior)

### Entorno de Desarrollo Local
Clonar el repositorio e instalar dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo (Vite):

```bash
npm run dev
```

El aplicativo estará disponible en: `http://localhost:5173`

Construir para producción:

```bash
npm run build
```
*(Generará la carpeta `dist/` con los archivos estáticos optimizados).*

## 4) Sistema de Diseño y UI/UX
El Front-End implementa una interfaz Cyber-Minimalista, diseñada específicamente para reducir la fatiga visual del personal durante jornadas largas y entornos de alta presión (como la cocina).

**Paleta de Colores Institucional (`tailwind.config.js`):**
* `chifa-black` (`#121212` / `#1a1a1a`): Fondos base y tarjetas para alto contraste.
* `chifa-gold` (`#d4af37`): Acciones principales, branding y métricas positivas.
* `chifa-red` (`#b30000` / `#8b0000`): Alertas críticas, pedidos demorados y acentos institucionales.

## 5) Integración con Backend (Próximamente)
Actualmente, las interfaces del Sprint 1 funcionan mediante *mocking* de datos para validación de UI/UX y flujos de enrutamiento.

En los próximos sprints, se configurarán las variables de entorno en el archivo `.env` para consumir la API REST en Spring Boot:

```env
VITE_API_URL=http://localhost:8080/api/v1
```
*(Nota: Las variables de entorno en Vite deben tener el prefijo `VITE_` para ser accesibles en el código cliente mediante `import.meta.env`).*

## 6) Estándares de Desarrollo
El equipo sigue el estándar **Conventional Commits** para el control de versiones:
* `feat:` Nuevas características o módulos (ej. `feat: agregar vista de KDS`).
* `fix:` Corrección de errores.
* `style:` Cambios visuales o de formato (CSS/Tailwind).
* `refactor:` Reestructuración de código sin alterar funcionalidad.