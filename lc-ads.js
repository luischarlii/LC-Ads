
(() => {
  "use strict";

  // CONFIGURACIÓN DE LC ADS
  const config = {
    title: "Publicidad LC",
    description: "Anuncia aquí tu negocio o servicio.",
    image: "",
    link: "https://luischarlii.github.io/",
    label: "PUBLICIDAD",
    position: "bottom-right",
    showClose: true
  };

  // Evitar duplicar el anuncio
  if (document.getElementById("lc-ads-widget")) return;

  // ESTILOS
  const style = document.createElement("style");

  style.textContent = `
    #lc-ads-widget {
      position: fixed;
      right: 14px;
      bottom: 14px;
      width: 290px;
      max-width: calc(100vw - 28px);
      z-index: 999999;
      font-family: Arial, sans-serif;
      color: #fff;
      background: #111827;
      border: 1px solid #374151;
      border-radius: 13px;
      box-shadow: 0 5px 25px rgba(0,0,0,.30);
      overflow: hidden;
      animation: lcAdsAppear .35s ease;
    }

    #lc-ads-widget * {
      box-sizing: border-box;
    }

    #lc-ads-widget .lc-ads-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 12px;
      background: #1f2937;
      font-size: 10px;
      letter-spacing: 1px;
      color: #fbbf24;
      font-weight: bold;
    }

    #lc-ads-widget .lc-ads-close {
      background: transparent;
      color: #fff;
      border: 0;
      font-size: 21px;
      cursor: pointer;
      line-height: 1;
      padding: 0 3px;
    }

    #lc-ads-widget .lc-ads-content {
      display: flex;
      gap: 11px;
      align-items: center;
      padding: 12px;
    }

    #lc-ads-widget .lc-ads-image {
      width: 65px;
      height: 65px;
      object-fit: cover;
      border-radius: 9px;
      flex-shrink: 0;
    }

    #lc-ads-widget .lc-ads-info {
      min-width: 0;
      flex: 1;
    }

    #lc-ads-widget .lc-ads-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    #lc-ads-widget .lc-ads-description {
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.4;
    }

    #lc-ads-widget .lc-ads-link {
      display: inline-block;
      margin-top: 8px;
      color: #60a5fa;
      font-size: 11px;
      font-weight: bold;
      text-decoration: none;
    }

    @keyframes lcAdsAppear {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  document.head.appendChild(style);

  // CREAR VENTANA
  const widget = document.createElement("div");
  widget.id = "lc-ads-widget";

  const safeImage = config.image
    ? `<img class="lc-ads-image" src="${config.image}" alt="">`
    : "";

  widget.innerHTML = `
    <div class="lc-ads-header">
      <span>${config.label}</span>
      ${config.showClose
        ? '<button class="lc-ads-close" aria-label="Cerrar">×</button>'
        : ""}
    </div>

    <div class="lc-ads-content">
      ${safeImage}
      <div class="lc-ads-info">
        <div class="lc-ads-title"></div>
        <div class="lc-ads-description"></div>
        <a class="lc-ads-link"
           target="_blank"
           rel="noopener noreferrer">
           Conocer más ↗
        </a>
      </div>
    </div>
  `;

  widget.querySelector(".lc-ads-title").textContent =
    config.title;

  widget.querySelector(".lc-ads-description").textContent =
    config.description;

  const link = widget.querySelector(".lc-ads-link");
  link.href = config.link;

  if (config.showClose) {
    widget.querySelector(".lc-ads-close").addEventListener(
      "click",
      () => widget.remove()
    );
  }

  document.body.appendChild(widget);

})();
