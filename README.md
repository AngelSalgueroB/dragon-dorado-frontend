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