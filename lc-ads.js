
(() => {
  "use strict";

  const script = document.currentScript;
  const appId = script?.dataset.app || "general";
  const base = new URL("./", script.src);

  if (document.getElementById("lc-ads-widget")) return;

  let timer = null;
  let currentIndex = 0;

  const safeUrl = value => {
    try {
      const url = new URL(value, location.href);
      return ["https:", "http:"].includes(url.protocol)
        ? url.href : "#";
    } catch {
      return "#";
    }
  };

  async function init() {
    try {
      const response = await fetch(
        new URL("ads.json", base),
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Error al cargar campañas");

      const data = await response.json();

      if (!data.enabled) return;

      const today = new Date().toISOString().slice(0, 10);

      const campaigns = (data.campaigns || [])
        .filter(ad =>
          ad.enabled &&
          Array.isArray(ad.apps) &&
          (ad.apps.includes("all") || ad.apps.includes(appId)) &&
          (!ad.startDate || ad.startDate <= today) &&
          (!ad.endDate || ad.endDate >= today) &&
          ad.link
        )
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));

      const ads = campaigns.length ? campaigns : [data.default];

      if (!ads[0]) return;

      const style = document.createElement("style");

      style.textContent = `
        #lc-ads-widget {
          position:fixed;
          right:14px;
          bottom:14px;
          width:290px;
          max-width:calc(100vw - 28px);
          z-index:999999;
          font-family:Arial,sans-serif;
          color:#fff;
          background:#111827;
          border:1px solid #374151;
          border-radius:13px;
          box-shadow:0 5px 25px #0005;
          overflow:hidden;
          animation:lcAdsIn .3s ease;
        }
        #lc-ads-widget * {box-sizing:border-box}
        #lc-ads-widget .head {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:9px 12px;
          background:#1f2937;
          color:#fbbf24;
          font-size:10px;
          font-weight:bold;
        }
        #lc-ads-widget button {
          background:none;
          border:0;
          color:white;
          font-size:21px;
          cursor:pointer;
        }
        #lc-ads-widget .content {
          display:flex;
          align-items:center;
          gap:11px;
          padding:12px;
        }
        #lc-ads-widget img {
          width:65px;height:65px;
          object-fit:cover;border-radius:9px;
        }
        #lc-ads-widget .info {flex:1;min-width:0}
        #lc-ads-widget .title {
          font-size:14px;font-weight:bold;margin-bottom:5px;
        }
        #lc-ads-widget .description {
          font-size:11px;color:#cbd5e1;line-height:1.4;
        }
        #lc-ads-widget .link {
          display:inline-block;margin-top:8px;
          color:#60a5fa;font-size:11px;font-weight:bold;
          text-decoration:none;
        }
        @keyframes lcAdsIn {
          from {opacity:0;transform:translateY(12px)}
          to {opacity:1;transform:translateY(0)}
        }
      `;

      document.head.appendChild(style);

      const widget = document.createElement("div");
      widget.id = "lc-ads-widget";

      const header = document.createElement("div");
      header.className = "head";

      const label = document.createElement("span");
      header.appendChild(label);

      const close = document.createElement("button");
      close.textContent = "×";
      close.setAttribute("aria-label", "Cerrar publicidad");
      close.onclick = () => {
        clearInterval(timer);
        widget.remove();
      };
      header.appendChild(close);

      const content = document.createElement("div");
      content.className = "content";

      const img = document.createElement("img");
      img.alt = "";
      img.hidden = true;

      const info = document.createElement("div");
      info.className = "info";

      const title = document.createElement("div");
      title.className = "title";

      const description = document.createElement("div");
      description.className = "description";

      const link = document.createElement("a");
      link.className = "link";
      link.textContent = "Conocer más ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      info.append(title, description, link);
      content.append(img, info);
      widget.append(header, content);
      document.body.appendChild(widget);

      function showAd(index) {
        const ad = ads[index];

        label.textContent = ad.label || "PUBLICIDAD";
        title.textContent = ad.title || "Publicidad LC";
        description.textContent = ad.description || "";
        link.href = safeUrl(ad.link || "");

        if (ad.image && safeUrl(ad.image) !== "#") {
          img.src = safeUrl(ad.image);
          img.hidden = false;
        } else {
          img.hidden = true;
        }

        currentIndex = index;
      }

      showAd(0);

      const interval = Math.max(
        5,
        Number(data.rotationSeconds) || 12
      );

      if (ads.length > 1) {
        timer = setInterval(() => {
          showAd((currentIndex + 1) % ads.length);
        }, interval * 1000);
      }

    } catch (error) {
      console.error("LC Ads:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
