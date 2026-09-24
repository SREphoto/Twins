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

let currentId = null;
let switching = false;
let transition = null;

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
  if (frameEl.src !== new URL(url, location.href).href) {
    frameEl.src = url;
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
      window.addEventListener("resize", () => transition?.resize());
    } else {
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

    // Load interactive twin (full control panels for ready machines)
    frameEl.onload = () => {
      setStatus(
        "READY",
        next.status === "ready"
          ? `${next.name} · ${next.panelHint}`
          : `${next.name} · planned package`
      );
      showBanner("", false);
      showFrame(next.viewerUrl);
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
    frameEl.src = next.viewerUrl;
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
        showFrame(next.viewerUrl);
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
const startId = params.get("machine") || "centrifuge";
selectEl.addEventListener("change", () => selectMachine(selectEl.value));

selectMachine(startId, { initial: true });
