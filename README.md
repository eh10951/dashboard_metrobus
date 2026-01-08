# 📊 Metrobús Analytics Dashboard - CDMX

Este proyecto es una plataforma de visualización de datos de las incidencias reportadas en el sistema de transporte **Metrobús de la Ciudad de México**. El objetivo es transformar datos brutos de registros de atención ciudadana en información accionable a través de un dashboard interactivo moderno.

## 🚀 Tecnologías Utilizadas

### Procesamiento de Datos (Python)
*   **Pandas & OpenPyXL**: Para la limpieza, filtrado y normalización de más de 16,000 registros de Excel.
*   **JSON Handling**: Conversión de datos estructurados para su consumo en la web.

### Visualización Inteactiva (React)
*   **React + Vite**: Para una interfaz de usuario rápida y eficiente.
*   **TailwindCSS**: Diseño premium con modo oscuro "Glassmorphism".
*   **Recharts**: Gráficos dinámicos de alto rendimiento.
*   **Framer Motion**: Animaciones fluidas para mejorar la experiencia de usuario.
*   **Lucide React**: Iconografía moderna.

## 📈 Funcionalidades Clave

1.  **Limpieza de Datos Inteligente**: El script de Python elimina registros duplicados, folios inválidos y normaliza nombres de estaciones y categorías.
2.  **KPIs en Tiempo Real**:
    *   **Total de Reportes**: Conteo dinámico tras limpieza.
    *   **Eficiencia de Atención**: Porcentaje de casos resueltos.
    *   **Categoría Principal**: Identificación del problema más recurrente.
3.  **Gráficos Interactivos**: Tendencias cronológicas, distribución por líneas de transporte y desglose de estatus de reportes.
4.  **Filtros Dinámicos**: Capacidad de filtrar toda la información por cada línea del sistema Metrobús.

## 🔧 Cómo Ejecutar el Proyecto

### 1. Backend (Limpieza)
```bash
python data_processing/convert_to_json_final.py
```

### 2. Dashboard
```bash
cd dashboard
npm install
npm run dev
```

---
Este dashboard fue desarrollado como una solución profesional para el análisis de transporte público, demostrando habilidades en **Data Engineering** y **Frontend Development**.
