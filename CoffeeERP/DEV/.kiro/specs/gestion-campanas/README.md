# 📊 Sistema de Gestión de Campañas Publicitarias

## 📋 Resumen del Proyecto

Sistema integral para administrar campañas publicitarias en redes sociales, con seguimiento de métricas clave (CPC, CAC, ROI) y generación de reportes analíticos.

## 🎯 Objetivos

- Crear y gestionar campañas con múltiples anuncios
- Capturar resultados de anuncios (clics, inversión)
- Calcular automáticamente métricas (CPC, CAC)
- Visualizar dashboards con gráficos interactivos
- Generar reportes mensuales y anuales
- Administrar catálogos (tipos, clasificaciones)

## 👥 Usuarios

- **Jefa de publicidad**: Acceso completo
- **Jefe de atención a clientes**: Solo visualización
- **Auxiliares de marketing**: Solo visualización

## 🏗️ Arquitectura

```
campanas/
├── index.php                    # Vista principal
├── ctrl/                        # Controladores PHP
│   ├── ctrl-campaign.php
│   ├── ctrl-dashboard.php
│   ├── ctrl-summary.php
│   ├── ctrl-history.php
│   └── ctrl-admin.php
├── mdl/                         # Modelos PHP
│   ├── mdl-campaign.php
│   ├── mdl-dashboard.php
│   ├── mdl-summary.php
│   ├── mdl-history.php
│   └── mdl-admin.php
└── js/                          # Scripts JavaScript
    ├── campaign.js
    ├── dashboard.js
    ├── summary.js
    ├── history.js
    └── admin.js
```

## 📊 Módulos

### 1. Dashboard
- KPIs principales (inversión, clics, CPC, CAC)
- Gráficos comparativos anuales
- Tendencias mensuales

### 2. Gestión de Campañas
- Crear campañas con nombre automático
- Agregar múltiples anuncios
- Capturar resultados y calcular CPC

### 3. Resumen de Campaña
- Reporte mensual detallado
- Desglose por anuncio
- Totales y promedios por campaña

### 4. Historial Anual
- Reporte CPC (inversión/clics por mes)
- Reporte CAC (inversión/clientes por mes)
- Comparativas anuales

### 5. Administrador
- Gestión de tipos de anuncios
- Gestión de clasificaciones
- CRUD completo de catálogos

## 🗄️ Base de Datos

### Tablas Principales

- **campaña**: Campañas publicitarias
- **anuncio**: Anuncios de cada campaña
- **tipo_anuncio**: Catálogo de tipos (video, publicación, reel)
- **clasificacion_anuncio**: Catálogo de clasificaciones (pauta 1, pauta 2)
- **red_social**: Catálogo de redes sociales

## 🔧 Stack Tecnológico

- **Frontend**: jQuery, TailwindCSS, Chart.js
- **Backend**: PHP 7.4+, MySQL
- **Framework**: CoffeeSoft (MVC)

## 📈 Métricas Calculadas

- **CPC (Costo Por Clic)**: `total_monto / total_clics`
- **CAC (Costo de Adquisición)**: `inversión / número_clientes`
- **CPC Promedio**: `(suma CPC anuncios) / número_anuncios`

## 🚀 Próximos Pasos

1. Revisar requirements.md
2. Revisar design.md
3. Ejecutar tareas de tasks.md
4. Comenzar con la tarea 1: "Set up project structure"

## 📝 Documentación

- [Requirements](./requirements.md) - Requisitos detallados
- [Design](./design.md) - Diseño técnico
- [Tasks](./tasks.md) - Plan de implementación

---

**Creado por:** CoffeeIA ☕  
**Framework:** CoffeeSoft  
**Fecha:** 2025
