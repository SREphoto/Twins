/**
 * ChemMate Theme Manager — Modular Theme Controller for all Twins
 * Synchronizes Modern, Retro, and Night modes across DOM, Three.js, URL params, and postMessage.
 */
export function initChemMateTheme({
  twinName = 'InstrumentTwin',
  scene = null,
  ambLight = null,
  dirLight = null,
  rimLight = null,
  gridHelper = null,
  onThemeChange = null,
} = {}) {
  let currentTheme = 'modern';

  // Cache initial Three.js light/scene states
  const initial3D = {
    background: scene?.background ? scene.background.clone() : null,
    ambColor: ambLight?.color ? ambLight.color.clone() : null,
    ambIntensity: ambLight?.intensity ?? 0.65,
    dirColor: dirLight?.color ? dirLight.color.clone() : null,
    dirIntensity: dirLight?.intensity ?? 1.2,
    rimColor: rimLight?.color ? rimLight.color.clone() : null,
    rimIntensity: rimLight?.intensity ?? 0.5,
  };

  const btnModern = document.getElementById('btn-view-modern');
  const btnRetro = document.getElementById('btn-view-retro');
  const btnNight = document.getElementById('btn-view-night');

  function apply3DTheme(theme) {
    if (!scene) return;
    if (theme === 'night') {
      if (scene.background) scene.background.setHex(0x0a0c10);
      if (ambLight) {
        ambLight.color.setHex(0x1a202c);
        ambLight.intensity = 0.45;
      }
      if (dirLight) {
        dirLight.color.setHex(0xffffff);
        dirLight.intensity = 0.95;
      }
      if (rimLight) {
        rimLight.color.setHex(0xff3344);
        rimLight.intensity = 0.65;
      }
      if (gridHelper?.material) {
        gridHelper.material.color?.setHex?.(0x1a202c);
      }
    } else if (theme === 'retro') {
      if (scene.background) scene.background.setHex(0xf2ece1);
      if (ambLight) {
        ambLight.color.setHex(0xfffaed);
        ambLight.intensity = 0.85;
      }
      if (dirLight) {
        dirLight.color.setHex(0xfffaee);
        dirLight.intensity = 1.35;
      }
      if (rimLight) {
        rimLight.color.setHex(0xd62828);
        rimLight.intensity = 0.35;
      }
      if (gridHelper?.material) {
        gridHelper.material.color?.setHex?.(0xd0c4af);
      }
    } else {
      if (initial3D.background && scene.background) scene.background.copy(initial3D.background);
      if (initial3D.ambColor && ambLight) {
        ambLight.color.copy(initial3D.ambColor);
        ambLight.intensity = initial3D.ambIntensity;
      }
      if (initial3D.dirColor && dirLight) {
        dirLight.color.copy(initial3D.dirColor);
        dirLight.intensity = initial3D.dirIntensity;
      }
      if (initial3D.rimColor && rimLight) {
        rimLight.color.copy(initial3D.rimColor);
        rimLight.intensity = initial3D.rimIntensity;
      }
      if (gridHelper?.material) {
        gridHelper.material.color?.setHex?.(0x2a3545);
      }
    }
  }

  function setTheme(theme) {
    const raw = String(theme || '').toLowerCase();
    if (raw === 'night') currentTheme = 'night';
    else if (raw === 'retro' || raw === 'chemmate') currentTheme = 'retro';
    else currentTheme = 'modern';

    btnModern?.classList.toggle('active', currentTheme === 'modern');
    btnRetro?.classList.toggle('active', currentTheme === 'retro');
    btnNight?.classList.toggle('active', currentTheme === 'night');

    if (currentTheme === 'modern') {
      delete document.body.dataset.theme;
    } else {
      document.body.dataset.theme = currentTheme;
    }

    try {
      localStorage.setItem('twins_lab_theme', currentTheme);
    } catch (_) {}

    apply3DTheme(currentTheme);

    if (typeof onThemeChange === 'function') {
      try {
        onThemeChange(currentTheme);
      } catch (err) {
        console.error('onThemeChange error:', err);
      }
    }
  }

  // Click bindings
  btnModern?.addEventListener('click', () => setTheme('modern'));
  btnRetro?.addEventListener('click', () => setTheme('retro'));
  btnNight?.addEventListener('click', () => setTheme('night'));

  // Listen to postMessage from parent (e.g. lab_viewer)
  window.addEventListener('message', (ev) => {
    if (ev.data && typeof ev.data === 'object' && ev.data.type === 'SET_THEME') {
      setTheme(ev.data.theme);
    }
  });

  // Check URL query parameters (?theme=modern|retro|night) or localStorage
  const qParams = new URLSearchParams(window.location.search);
  const qTheme = qParams.get('theme') || localStorage.getItem('twins_lab_theme') || 'modern';
  setTheme(qTheme);

  // Expose global API
  if (twinName) {
    window[twinName] = window[twinName] || {};
    window[twinName].setTheme = setTheme;
    window[twinName].getTheme = () => currentTheme;
  }

  return {
    setTheme,
    getTheme: () => currentTheme,
  };
}
