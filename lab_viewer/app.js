/**
 * Twins lab viewer — shared lab desk + machine selector.
 * Ready machines load full package viewers (controls + 3D).
 * Switches animate the instrument off the desk, then load the next.
 */
import { listMachines, getMachine } from "./machines/registry.js?v=20260725-lab";
import { createTransitionScene } from "./transition_scene.js?v=20260725-lab";

const selectEl = document.getElementById("machine-select");
const frameEl = document.getElementById("machine-frame");
const hostEl = document.getElementById("transition-host");
const pillEl = document.getElementById("status-pill");
const detailEl = document.getElementById("status-detail");
const bannerEl = document.getElementById("switch-banner");
const btnModern = document.getElementById("btn-view-modern");
const btnRetro = document.getElementById("btn-view-retro");
const btnNight = document.getElementById("btn-view-night");

let currentId = null;
let switching = false;
let transition = null;
let currentTheme = "modern";

function resolveTargetUrl(viewerUrl, theme) {
  try {
    const u = new URL(viewerUrl, location.href);
    if (theme && theme !== "modern") {
      u.searchParams.set("theme", theme);
    } else {
      u.searchParams.delete("theme");
    }
    return u.href;
  } catch {
    return viewerUrl;
  }
}

function setTheme(theme) {
  const raw = String(theme || "").toLowerCase();
  if (raw === "night") currentTheme = "night";
  else if (raw === "retro" || raw === "chemmate") currentTheme = "retro";
  else currentTheme = "modern";

  btnModern?.classList.toggle("active", currentTheme === "modern");
  btnRetro?.classList.toggle("active", currentTheme === "retro");
  btnNight?.classList.toggle("active", currentTheme === "night");

  if (currentTheme === "modern") {
    delete document.body.dataset.theme;
  } else {
    document.body.dataset.theme = currentTheme;
  }

  try {
    localStorage.setItem("twins_lab_theme", currentTheme);
  } catch (_) {}

  // Update transition scene if active
  if (transition?.setTheme) {
    transition.setTheme(currentTheme);
  }

  // Notify currently loaded twin iframe via postMessage and direct API
  try {
    frameEl.contentWindow?.postMessage({ type: "SET_THEME", theme: currentTheme }, "*");
    frameEl.contentWindow?.CentrifugeTwin?.setTheme?.(currentTheme);
  } catch (_) {}
}

function setStatus(mode, detail) {
  if (pillEl) {
    pillEl.textContent = mode;
    pillEl.classList.toggle("switching", mode === "SWITCHING");
    pillEl.classList.toggle("ready", mode === "READY");
  }
  if (detailEl) detailEl.textContent = detail || "";
}

function showBanner(text, show) {
  if (!bannerEl) return;
  bannerEl.textContent = text || "";
  bannerEl.classList.toggle("show", !!show);
}

function fillSelect() {
  const machines = listMachines();
  selectEl.innerHTML = "";
  for (const m of machines) {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent =
      m.status === "ready" ? m.name : `${m.name} (planned)`;
    selectEl.appendChild(opt);
  }
}

function showFrame(url) {
  frameEl.classList.remove("is-hidden");
  if (transition) transition.setVisible(false);
  const target = resolveTargetUrl(url, currentTheme);
  if (frameEl.src !== target) {
    frameEl.src = target;
  }
}

function showTransition() {
  frameEl.classList.add("is-hidden");
  if (transition) transition.setVisible(true);
}

/**
 * @param {string} nextId
 * @param {{ initial?: boolean }} [opts]
 */
async function selectMachine(nextId, opts = {}) {
  if (switching) return;
  const next = getMachine(nextId);
  if (!next) return;
  if (!opts.initial && next.id === currentId) return;

  switching = true;
  selectEl.disabled = true;
  setStatus("SWITCHING", `Moving ${currentId ? "current machine off desk" : "onto desk"}…`);
  showBanner(
    currentId
      ? `Clearing desk → loading ${next.name}`
      : `Loading ${next.name}`,
    true
  );

  showTransition();

  try {
    if (!transition) {
      transition = createTransitionScene(hostEl);
      transition.setTheme(currentTheme);
      window.addEventListener("resize", () => transition?.resize());
    } else {
      transition.setTheme(currentTheme);
      transition.resize();
    }

    const outKind = currentId
      ? getMachine(currentId).transitionKind
      : next.transitionKind;
    const inKind = next.transitionKind;

    if (opts.initial) {
      await transition.setDockMachine(inKind);
      // brief beat so the desk is visible before diving into the twin
      await new Promise((r) => setTimeout(r, 450));
    } else {
      await transition.playSwitch({
        outKind,
        inKind,
        durationMs: 1000,
      });
    }

    const targetUrl = resolveTargetUrl(next.viewerUrl, currentTheme);

    // Load interactive twin (full control panels for ready machines)
    frameEl.onload = () => {
      setStatus(
        "READY",
        next.status === "ready"
          ? `${next.name} · ${next.panelHint}`
          : `${next.name} · planned package`
      );
      showBanner("", false);
      showFrame(targetUrl);
      try {
        frameEl.contentWindow?.postMessage({ type: "SET_THEME", theme: currentTheme }, "*");
        frameEl.contentWindow?.CentrifugeTwin?.setTheme?.(currentTheme);
      } catch (_) {}
      switching = false;
      selectEl.disabled = false;
    };
    frameEl.onerror = () => {
      setStatus("READY", `Failed to load ${next.name}`);
      showBanner("", false);
      switching = false;
      selectEl.disabled = false;
    };

    currentId = next.id;
    selectEl.value = next.id;
    // Force reload even if same URL (after planned → ready later)
    frameEl.src = targetUrl;
    // If cached and already loaded, onload may not fire — safety timer
    setTimeout(() => {
      if (switching && selectEl.value === next.id) {
        setStatus(
          "READY",
          next.status === "ready"
            ? `${next.name} · ${next.panelHint}`
            : `${next.name} · planned package`
        );
        showBanner("", false);
        showFrame(targetUrl);
        try {
          frameEl.contentWindow?.postMessage({ type: "SET_THEME", theme: currentTheme }, "*");
          frameEl.contentWindow?.CentrifugeTwin?.setTheme?.(currentTheme);
        } catch (_) {}
        switching = false;
        selectEl.disabled = false;
      }
    }, 2500);
  } catch (err) {
    console.error(err);
    setStatus("READY", `Switch failed: ${err.message || err}`);
    showBanner("", false);
    switching = false;
    selectEl.disabled = false;
  }
}

// Boot
fillSelect();
const params = new URLSearchParams(location.search);
const initialTheme = params.get("theme") || localStorage.getItem("twins_lab_theme") || "modern";
setTheme(initialTheme);

btnModern?.addEventListener("click", () => setTheme("modern"));
btnRetro?.addEventListener("click", () => setTheme("retro"));
btnNight?.addEventListener("click", () => setTheme("night"));

const startId = params.get("machine") || "centrifuge";
selectEl.addEventListener("change", () => selectMachine(selectEl.value));

selectMachine(startId, { initial: true });

window.LabViewer = {
  setTheme,
  getTheme: () => currentTheme,
  selectMachine,
};
