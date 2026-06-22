# motor-artrodesis-columna# Motor Artrodesis Columna

Motor lingüístico para generación automática de descripciones e impresiones diagnósticas de artrodesis vertebral y cambios postquirúrgicos de columna.

## Funciones

Genera automáticamente:

- Artrodesis instrumentada
- Fijación anterior
- Fijación posterior
- Fijación combinada
- Cajas intersomáticas
- Cementoplastias vertebrales
- Laminectomías
- Hemilaminectomías
- Laminotomías
- Foraminotomías
- Facetectomías
- Colecciones postquirúrgicas
- Neumorraquis
- Enfisema celular subcutáneo
- Grapas quirúrgicas
- Pseudoartrosis
- Estenosis residual
- Artrosis facetaria residual
- Complicaciones del material de osteosíntesis

## Endpoint

POST

/api/generar-artrodesis

## Request

```json
{
  "hallazgos":[]
}
```

## Response

```json
{
  "descripcion":"...",
  "diagnostico":"..."
}
```

## Instalación local

```bash
npm install
npm start
```

Servidor:

```bash
http://localhost:3000
```

## Deploy

Compatible con:

- Render
- Railway
- Fly.io
- VPS Node.js

## Tecnología

- Node.js
- Express
- CORS
