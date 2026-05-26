# Documento de Definición: MVP Visual - Plataforma B2B Multicatálogo

**Desarrollado por:** ST Enterprise  
**Plataforma de Despliegue:** Tablet (Optimización táctil)  
**Tecnología Frontend:** Angular  
**Objetivo del MVP:** Proporcionar una demostración interactiva y de alta fidelidad para validar el modelo de negocio con proveedores mayoristas, cerrar acuerdos comerciales y asegurar el financiamiento inicial del desarrollo completo.

---

## 1. Alcance y Estrategia del MVP

El Producto Mínimo Viable (MVP) se construirá como una **Aplicación de Página Única (SPA) en Angular**. En esta fase, el objetivo es vender la experiencia y el flujo operativo. 

* **Enfoque 100% Visual:** Interfaz maquetada previamente con herramientas vectoriales profesionales (Affinity) para garantizar un acabado impecable.
* **Datos en Memoria (Mocked Data):** Para evitar tiempos de carga en la demostración y no depender de la conexión a internet en zonas de baja cobertura, el catálogo del MVP funcionará con un archivo JSON local precargado con imágenes reales (ej. repuestos vehiculares).
* **Cero Fricción Cognitiva:** Eliminación de descripciones de texto extensas. La toma de decisiones del comprador final se basará puramente en el reconocimiento visual del producto.

## 2. Flujos Funcionales a Demostrar (Historias de Usuario)

El cliente interactuará con cuatro módulos clave durante la presentación:

### A. Selector de Entorno (Multitenant Simulado)
* **Acción:** El agente ingresa a la aplicación y visualiza un panel con los logotipos de las 4 empresas representadas.
* **Resultado:** Al tocar un logotipo, la interfaz se adapta a los colores y catálogo de esa empresa específica (demostrando aislamiento de competencia).

### B. Navegación del Catálogo Visual
* **Acción:** Se presenta una cuadrícula (grid) de alta velocidad con las fotografías de los productos.
* **Interacción:** Al tocar un producto, aparece un control numérico grande (`+` y `-`) diseñado para "dedos gruesos" (UX para tablets). 
* **Resultado:** El agente selecciona "3 unidades" y el ícono del carrito se actualiza instantáneamente con una animación sutil.

### C. Gestión del Carrito y Cotización
* **Acción:** El agente abre el carrito lateral o pantalla de resumen.
* **Visualización:** Aparece el desglose: Fotografía en miniatura, cantidad seleccionada, precio unitario y cálculo del total automático.
* **Resultado:** Demuestra al cliente cómo se eliminan los errores de cálculo manuales.

### D. Cierre y Simulación de Despacho
* **Acción:** Botón de "Confirmar Pedido".
* **Simulación:** Pantalla de éxito indicando: *"Pedido enviado a la matriz de [Nombre de la Empresa]. Pendiente de aprobación y despacho."*
* **Valor de negocio percibido:** El dueño de la empresa entiende que él mantiene el control final de la venta y la facturación.

## 3. Requisitos de Interfaz (UI/UX)

* **Rendimiento:** Carga de imágenes optimizada (Lazy Loading) provista por Angular para manejar galerías extensas sin congelar el dispositivo.
* **Accesibilidad:** Alto contraste, botones de mínimo 48x48 píxeles para asegurar facilidad de toque en terreno.
* **Offline-First (Simulado):** La demostración debe fluir a 60 FPS ininterrumpidos durante la presentación de ventas.

## 4. Próximos Pasos Post-Cierre (Arquitectura Completa)

Una vez firmado el acuerdo y recibido el adelanto operativo, el MVP escalará a la arquitectura definitiva:
* **Backend:** Implementación de microservicios en Java (Spring Boot) para la gestión real del inventario y la lógica de negocio.
* **Base de Datos:** Migración a PostgreSQL para garantizar la integridad transaccional de los pedidos, control de stock bidireccional y el registro exacto de las comisiones del agente de ventas.