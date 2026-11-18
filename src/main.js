// Datos comerciales editables. Reemplazar el número provisional antes de publicar.
const SITE_CONFIG = {
  whatsappNumber: "56991740923", // Formato internacional, sin + ni espacios.
  domain: "quickpages.cl",
  prices: {
    setup: 60000,
    monthly: 5000,
  },
};

const demos = {
  peluqueria: {
    number: "01",
    slug: "estilonorte",
    brand: "ESTILO NORTE",
    kicker: "PELUQUERÍA · BARBERÍA",
    headline: "Tu estilo,<br>sin esperas.",
    description: "Cortes, color y barba con atención personalizada.",
    cta: "Reserva tu hora ↗",
    service1: "Corte & peinado",
    service2: "Color & tratamiento",
    service3: "Perfilado de barba",
    location: "Av. Principal 123 · Santiago",
    asideTitle: "Una reserva a dos toques.",
    asideText: "Servicios fáciles de comparar, horarios visibles y un botón de reserva siempre a mano.",
  },
  electricista: {
    number: "02",
    slug: "voltioservicio",
    brand: "VOLTIOSERVICIO",
    kicker: "ELECTRICIDAD · URGENCIAS · INSTALACIONES",
    headline: "Soluciones<br>bien conectadas.",
    description: "Atención para hogares y pequeños comercios, con presupuesto claro.",
    cta: "Pide un presupuesto ↗",
    service1: "Instalaciones eléctricas",
    service2: "Detección de fallas",
    service3: "Mantención preventiva",
    location: "Atención a domicilio · Región Metropolitana",
    asideTitle: "Confianza antes de la visita.",
    asideText: "Especialidades, cobertura y medios de contacto visibles para facilitar una solicitud de presupuesto.",
  },
  reposteria: {
    number: "03",
    slug: "dulcesur",
    brand: "DULCE SUR",
    kicker: "REPOSTERÍA ARTESANAL · PEDIDOS",
    headline: "Un detalle dulce<br>para cada día.",
    description: "Tortas, pasteles y encargos para celebraciones preparados con dedicación.",
    cta: "Cotiza tu pedido ↗",
    service1: "Tortas personalizadas",
    service2: "Dulces para eventos",
    service3: "Cajas para regalar",
    location: "Retiro coordinado · Concepción",
    asideTitle: "Tus productos dan la primera impresión.",
    asideText: "Una vitrina ordenada para mostrar variedades, tiempos de encargo y condiciones antes de cotizar.",
  },
};

const formatCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

document.querySelectorAll('[data-config="domain"]').forEach((element) => {
  element.textContent = SITE_CONFIG.domain;
});
document.querySelectorAll("[data-price]").forEach((element) => {
  const key = element.dataset.price;
  element.textContent = formatCLP.format(SITE_CONFIG.prices[key]);
});
document.getElementById("current-year").textContent = new Date().getFullYear();

// Menú móvil accesible y cerrable con teclado.
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

function closeMenu(returnFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  mobileMenu.hidden = true;
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
  mobileMenu.hidden = !willOpen;
});
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) closeMenu(true);
});
window.addEventListener("resize", () => {
  if (window.innerWidth >= 980 && !mobileMenu.hidden) closeMenu();
});

// El selector cambia tanto el contenido como el color de toda la vista previa.
const tabs = [...document.querySelectorAll("[data-demo]")];
const demoPanel = document.getElementById("demo-panel");
let demoTimer;

function selectDemo(tab) {
  const demo = demos[tab.dataset.demo];
  if (!demo || tab.getAttribute("aria-selected") === "true") return;

  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  demoPanel.classList.add("is-switching");
  clearTimeout(demoTimer);
  demoTimer = setTimeout(() => {
    demoPanel.dataset.theme = tab.dataset.demo;
    demoPanel.setAttribute("aria-labelledby", tab.id);
    Object.entries(demo).forEach(([key, value]) => {
      const target = demoPanel.querySelector(`[data-demo-field="${key}"]`);
      if (!target) return;
      if (key === "headline") target.innerHTML = value;
      else target.textContent = value;
    });
    demoPanel.classList.remove("is-switching");
  }, 140);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectDemo(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    tabs[nextIndex].focus();
    selectDemo(tabs[nextIndex]);
  });
});

// Formulario local: prepara el mensaje sin almacenar los datos en un servidor.
const leadForm = document.getElementById("lead-form");
const status = document.getElementById("form-status");
const planInput = document.getElementById("selected-plan");
const planFeedback = document.getElementById("plan-feedback");

function setStatus(message, isError = false) {
  status.textContent = message;
  status.dataset.state = isError ? "error" : "success";
}

function validateForm() {
  if (leadForm.checkValidity()) return true;
  leadForm.reportValidity();
  setStatus("Completa tu nombre, negocio y rubro para continuar.", true);
  return false;
}

function buildMessage() {
  const data = new FormData(leadForm);
  const lines = [
    "Hola, Impulsa Local. Quiero conversar sobre una landing para mi negocio.",
    "",
    `Nombre: ${data.get("nombre").trim()}`,
    `Negocio: ${data.get("negocio").trim()}`,
    `Rubro: ${data.get("rubro")}`,
  ];
  if (data.get("plan")) lines.push(`Plan de interés: ${data.get("plan")}`);
  if (data.get("mensaje").trim()) lines.push(`Objetivo: ${data.get("mensaje").trim()}`);
  lines.push("", "¿Me puedes contar los próximos pasos?");
  return lines.join("\n");
}

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;
  const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
  const whatsappWindow = window.open(url, "_blank");
  if (whatsappWindow) {
    whatsappWindow.opener = null;
    setStatus("Abrimos WhatsApp con tu mensaje listo para revisar y enviar.");
  } else {
    setStatus("Tu navegador bloqueó la nueva pestaña. Te llevaremos a WhatsApp en esta misma página.");
    window.location.href = url;
  }
});

document.getElementById("copy-request").addEventListener("click", async () => {
  if (!validateForm()) return;
  const message = buildMessage();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message);
    } else {
      const helper = document.createElement("textarea");
      helper.value = message;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      if (!copied) throw new Error("copy-unavailable");
    }
    setStatus("Solicitud copiada. Ya puedes pegarla en tu canal de contacto preferido.");
  } catch {
    setStatus("No pudimos copiar automáticamente. Selecciona el texto del formulario y vuelve a intentarlo.", true);
  }
});

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    planInput.value = link.dataset.plan;
    planFeedback.textContent = `Plan seleccionado: ${link.dataset.plan}. Lo incluiremos en tu mensaje.`;
    planFeedback.hidden = false;
  });
});
