# Zentro

> Plataforma web enfocada en el bienestar universitario que conecta estudiantes a través del intercambio de conocimientos, la colaboración académica y la organización de actividades deportivas.

---

## Overview

Zentro es una aplicación desarrollada para fortalecer la comunidad estudiantil mediante espacios de aprendizaje colaborativo y actividades deportivas organizadas por los mismos estudiantes.

La plataforma permite que los usuarios compartan conocimientos, soliciten apoyo académico, creen oportunidades de colaboración y participen en actividades deportivas fuera de los horarios convencionales de la universidad.

El proyecto nace como una solución a la falta de herramientas que integren el bienestar académico y deportivo en un solo entorno digital, promoviendo la interacción, el aprendizaje entre pares y una vida universitaria más activa.

---

## Current Scope

### Features

* Registro e inicio de sesión de usuarios.
* Gestión y edición de perfiles estudiantiles.
* Publicación y visualización de intercambios académicos.
* Creación y exploración de oportunidades de aprendizaje colaborativo.
* Navegación entre módulos académicos y deportivos.
* Organización de actividades y encuentros deportivos entre estudiantes.

### Status

> El repositorio se encuentra en la fase de construcción del MVP, con las pantallas principales implementadas, navegación funcional y estructura preparada para la integración completa con Supabase.

---

## Architecture

### Responsibilities

* Gestionar la autenticación y acceso de usuarios.
* Facilitar la publicación y consulta de oportunidades académicas.
* Permitir la creación y organización de actividades deportivas.
* Centralizar la interacción entre estudiantes en una única plataforma.
* Mantener una experiencia de usuario responsive y accesible.

### Integrations

* Supabase Authentication.
* Supabase Database.
* React Router.
* Vite Development Server.

---

## Tech Stack

| Category | Technologies                      |
| -------- | --------------------------------- |
| Core     | React, TypeScript, Vite           |
| Routing  | React Router DOM                  |
| Backend  | Supabase                          |
| Styling  | CSS Modules / Custom CSS          |
| State    | React Hooks (useState, useEffect) |
| Tooling  | ESLint, Git, GitHub               |

> Consultar `package.json` para las versiones específicas.

---

## Getting Started

### Prerequisites

* Node.js 20+
* npm

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

---

## Environment Variables

Crear un archivo `.env.local`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Las credenciales deben obtenerse desde el proyecto configurado en Supabase.

---

## Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| npm run dev     | Inicia el servidor de desarrollo |
| npm run build   | Genera la versión de producción  |
| npm run preview | Visualiza la build localmente    |
| npm run lint    | Ejecuta ESLint                   |

---

## Development Standards

* Arquitectura basada en componentes reutilizables.
* Uso de TypeScript para tipado estático.
* Convención de commits semánticos.
* Separación de responsabilidades por módulos.
* Desarrollo colaborativo mediante Git Flow.

Ejemplo de commit:

```text
feat: add academic exchange page
```

```text
fix: resolve navigation issue on dashboard
```

---

## Project Structure

```text
src/
├── components/
├── pages/
├── layout/
├── services/
├── assets/
├── styles/
├── router/
└── main.tsx
```

---

## Documentation

La documentación del proyecto incluye:

```text
docs/
├── benchmark.md
├── architecture.md
├── route-map.md
├── diagrams/
└── presentation/
```

---

## Ownership

**Team:** Zentro Development Team

**Maintainers:**

* Juan Esteban Ospina
* Felipe González
* Juan Jose Correa

---

## Vision

Zentro busca convertirse en un punto de encuentro para la comunidad universitaria, donde los estudiantes puedan potenciar su aprendizaje, compartir conocimientos y participar activamente en actividades deportivas y colaborativas, fortaleciendo así el bienestar integral dentro de la universidad.