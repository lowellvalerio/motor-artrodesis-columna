const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function limpiar(txt) {
  return (txt || "")
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/\.\s*\./g, ".")
    .trim();
}

function unir(lista) {
  const l = (lista || []).filter(Boolean);
  if (!l.length) return "";
  if (l.length === 1) return l[0];
  return l.slice(0, -1).join(", ") + " y " + l[l.length - 1];
}

function rango(desde, hasta) {
  if (desde && hasta && desde !== hasta) return `desde ${desde} hasta ${hasta}`;
  if (desde) return `a nivel de ${desde}`;
  if (hasta) return `hasta ${hasta}`;
  return "";
}

function rangoDx(desde, hasta) {
  return rango(desde, hasta)
    .replace("desde ", "")
    .replace("a nivel de ", "a nivel ");
}

function textoCajas(h) {
  if (!h.caja || h.caja === "No") return "";

  if (h.caja === "Nivel único") {
    return h.cajaNivelUnico ? `caja intersomática en ${h.cajaNivelUnico}` : "";
  }

  if (h.caja === "Niveles consecutivos") {
    if (!h.cajaNivelInicial || !h.cajaNivelFinal) return "";
    if (h.cajaNivelInicial === h.cajaNivelFinal) {
      return `caja intersomática en ${h.cajaNivelInicial}`;
    }
    return `cajas intersomáticas desde ${h.cajaNivelInicial} hasta ${h.cajaNivelFinal}`;
  }

  if (h.caja === "Niveles intercalados") {
    const niveles = h.cajaNiveles || [];
    if (!niveles.length) return "";
    if (niveles.length === 1) return `caja intersomática en ${niveles[0]}`;
    return `cajas intersomáticas en ${unir(niveles)}`;
  }

  return "";
}

function textoCementoplastia(h) {
  if (!h.cementoplastia || h.cementoplastia === "No") return "";

  if (h.cementoplastia === "Nivel único") {
    return h.cementoplastiaNivelUnico
      ? `cementoplastia vertebral en ${h.cementoplastiaNivelUnico}`
      : "";
  }

  if (h.cementoplastia === "Niveles consecutivos") {
    if (!h.cementoplastiaNivelInicial || !h.cementoplastiaNivelFinal) return "";
    if (h.cementoplastiaNivelInicial === h.cementoplastiaNivelFinal) {
      return `cementoplastia vertebral en ${h.cementoplastiaNivelInicial}`;
    }
    return `cementoplastias vertebrales desde ${h.cementoplastiaNivelInicial} hasta ${h.cementoplastiaNivelFinal}`;
  }

  if (h.cementoplastia === "Niveles intercalados") {
    const niveles = h.cementoplastiaNiveles || [];
    if (!niveles.length) return "";
    if (niveles.length === 1) return `cementoplastia vertebral en ${niveles[0]}`;
    return `cementoplastias vertebrales en ${unir(niveles)}`;
  }

  return "";
}

function esPelvisDestino(hasta) {
  return (hasta || "").toLowerCase().includes("ilíac");
}

function generarArtrodesis(h) {
  const tipo = h.tipoFijacion || "Posterior";
  const r = rango(h.desde, h.hasta);
  let descripcion = "";
  let diagnostico = "";

  if (tipo === "Posterior") {
    descripcion = `Se identifican cambios postquirúrgicos por artrodesis posterior instrumentada mediante barras longitudinales y tornillos transpediculares ${r}`;
    diagnostico = `Cambios postquirúrgicos por fijación vertebral posterior instrumentada ${rangoDx(h.desde, h.hasta)}`;
  }

  if (tipo === "Anterior") {
    descripcion = `Se identifican cambios postquirúrgicos por artrodesis anterior instrumentada ${r}`;
    diagnostico = `Cambios postquirúrgicos por fijación vertebral anterior instrumentada ${rangoDx(h.desde, h.hasta)}`;
  }

  if (tipo === "Anterior y posterior") {
    descripcion = `Se identifican cambios postquirúrgicos por artrodesis anterior y posterior instrumentada ${r}`;
    diagnostico = `Cambios postquirúrgicos por fijación vertebral anterior y posterior instrumentada ${rangoDx(h.desde, h.hasta)}`;
  }

  if (tipo === "Caja intersomática aislada") {
    const cajas = textoCajas(h);
    descripcion = `Se identifican cambios postquirúrgicos por colocación de ${cajas || "caja intersomática en el nivel intervenido"}`;
    diagnostico = `Cambios postquirúrgicos por ${cajas || "caja intersomática"}`;
  }

  if (h.anclajePelvico && h.anclajePelvico !== "No") {
    if (esPelvisDestino(h.hasta)) {
      descripcion += ` mediante ${h.anclajePelvico.toLowerCase()}`;
      diagnostico += ` mediante ${h.anclajePelvico.toLowerCase()}`;
    } else {
      descripcion += `, con extensión pélvica mediante ${h.anclajePelvico.toLowerCase()}`;
      diagnostico += `, con extensión pélvica mediante ${h.anclajePelvico.toLowerCase()}`;
    }
  }

  const cajas = textoCajas(h);
  if (cajas && tipo !== "Caja intersomática aislada") {
    descripcion += `, asociado a ${cajas}`;
    diagnostico += `, asociado a ${cajas}`;
  }

  const cemento = textoCementoplastia(h);
  if (cemento) {
    descripcion += `, asociado a ${cemento}`;
    diagnostico += `, asociado a ${cemento}`;
  }

  if (h.estadoMaterial === "Sin complicaciones") {
    descripcion += `. El material de osteosíntesis se observa íntegro, sin signos evidentes de aflojamiento, fractura, migración ni desconexión`;
    diagnostico += `. Material de osteosíntesis sin complicaciones mecánicas evidentes`;
  }

  if (h.estadoMaterial === "Aflojamiento") {
    descripcion += `. Se identifican signos sugestivos de aflojamiento del material de osteosíntesis`;
    diagnostico += `. Signos sugestivos de aflojamiento del material`;
  }

  if (h.estadoMaterial === "Fractura") {
    descripcion += `. Se identifica fractura del material de osteosíntesis`;
    diagnostico += `. Fractura del material de osteosíntesis`;
  }

  if (h.estadoMaterial === "Migración") {
    descripcion += `. Se identifica migración del material de osteosíntesis`;
    diagnostico += `. Migración del material de osteosíntesis`;
  }

  if (h.estadoMaterial === "Desconexión") {
    descripcion += `. Se identifica desconexión del material de osteosíntesis`;
    diagnostico += `. Desconexión del material de osteosíntesis`;
  }

  if (h.estadoMaterial === "Aflojamiento y fractura") {
    descripcion += `. Se identifican signos sugestivos de aflojamiento y fractura del material de osteosíntesis`;
    diagnostico += `. Signos sugestivos de aflojamiento y fractura del material`;
  }

  if (h.estadoMaterial === "Aflojamiento y migración") {
    descripcion += `. Se identifican signos sugestivos de aflojamiento y migración del material de osteosíntesis`;
    diagnostico += `. Signos sugestivos de aflojamiento y migración del material`;
  }

  if (!descripcion.endsWith(".")) descripcion += ".";
  if (!diagnostico.endsWith(".")) diagnostico += ".";

  return {
    descripcion: limpiar(descripcion),
    diagnostico: limpiar(diagnostico)
  };
}

function rangoLaminectomia(h) {
  if (h.tipoNivelesLaminectomia === "Nivel único") {
    return h.nivelUnicoLaminectomia ? `a nivel de ${h.nivelUnicoLaminectomia}` : "";
  }

  if (h.tipoNivelesLaminectomia === "Múltiples consecutivos") {
    return rango(h.desde, h.hasta);
  }

  if (h.tipoNivelesLaminectomia === "Múltiples intercalados") {
    const niveles = h.nivelesIntercaladosLaminectomia || [];
    return niveles.length ? `en ${unir(niveles)}` : "";
  }

  return "";
}

function generarLaminectomia(h) {
  const procedimiento = h.tipoLaminectomia || "Laminectomía";
  const proc = procedimiento.toLowerCase();
  let lado = h.ladoLaminectomia ? ` ${h.ladoLaminectomia.toLowerCase()}` : "";

  if (
    proc.includes("derecha") ||
    proc.includes("izquierda") ||
    proc.includes("bilateral")
  ) {
    lado = "";
  }

  const r = rangoLaminectomia(h);

  return {
    descripcion: limpiar(`Se identifican cambios postquirúrgicos por ${proc}${lado} ${r}.`),
    diagnostico: limpiar(`Cambios postquirúrgicos por ${proc}${lado} ${r}.`)
  };
}

function generarItem(h) {
  if (h.tipo === "artrodesis") return generarArtrodesis(h);
  if (h.tipo === "laminectomia") return generarLaminectomia(h);
  return { descripcion: "", diagnostico: "" };
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    motor: "artrodesis-laminectomia",
    endpoints: ["/generar-artrodesis"]
  });
});

app.post("/generar-artrodesis", (req, res) => {
  try {
    const hallazgos = Array.isArray(req.body.hallazgos) ? req.body.hallazgos : [];

    const resultados = hallazgos
      .map(generarItem)
      .filter(x => x.descripcion || x.diagnostico);

    res.json({
      descripcion: resultados.map(x => x.descripcion).filter(Boolean).join(" "),
      diagnostico: resultados.map(x => x.diagnostico).filter(Boolean).join("\n")
    });
  } catch (error) {
    res.status(500).json({
      error: "Error generando artrodesis",
      detalle: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Motor artrodesis activo en puerto ${PORT}`);
});
