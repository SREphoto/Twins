"""
UV-Vis Spectrophotometer Controller State Engine
Simulates a research-grade dual-beam UV-Vis spectrophotometer (190.0–1100.0 nm).
Implements Beer-Lambert absorption physics, multi-cell carousel indexing,
wavelength stepping, baseline auto-zeroing, and safety interlocks.
"""

from enum import Enum, auto
import math
from typing import Dict, List, Optional, Tuple


class SpectroState(Enum):
    POWER_OFF = auto()
    INITIALIZING = auto()
    READY = auto()
    MEASURING = auto()
    SCANNING = auto()
    ZEROING = auto()
    CELL_INDEXING = auto()
    FAULT_LID_OPEN = auto()


class MeasureMode(Enum):
    PHOTOMETRIC = "Photometric (Fixed λ)"
    SPECTRUM = "Spectrum Scan"
    KINETICS = "Kinetics (Time)"


class SampleProfile:
    """Analytical spectrum definition based on Gaussian absorption bands."""
    def __init__(self, name: str, description: str, bands: List[Tuple[float, float, float]], baseline_offset: float = 0.002):
        self.name = name
        self.description = description
        # bands: list of (center_wavelength_nm, peak_absorbance, fwhm_nm)
        self.bands = bands
        self.baseline_offset = baseline_offset

    def absorbance_at(self, wl_nm: float) -> float:
        total_abs = self.baseline_offset
        for center_wl, peak_a, fwhm in self.bands:
            # Gaussian peak: sigma = fwhm / (2 * sqrt(2 * ln(2)))
            sigma = fwhm / 2.35482
            diff = wl_nm - center_wl
            total_abs += peak_a * math.exp(-0.5 * (diff / sigma) ** 2)
        return max(0.0, total_abs)


STANDARD_SAMPLES: Dict[int, SampleProfile] = {
    1: SampleProfile("Deionized Water Blank", "Reference solvent (A = 0.000)", [], baseline_offset=0.000),
    2: SampleProfile("KMnO4 (Potassium Permanganate)", "Permanganate purple solution (λmax = 525 nm)", [
        (508.0, 0.62, 22.0),
        (525.0, 1.25, 26.0),
        (546.0, 0.95, 24.0)
    ]),
    3: SampleProfile("Calf Thymus DNA", "Nucleic acid in TE buffer (λmax = 260 nm, A260/A280 = 1.85)", [
        (260.0, 1.15, 34.0),
        (280.0, 0.62, 40.0)
    ]),
    4: SampleProfile("BSA - Bradford Assay", "Coomassie blue protein conjugate (λmax = 595 nm)", [
        (595.0, 1.42, 55.0)
    ]),
    5: SampleProfile("Methylene Blue", "Thiazine dye (λmax = 664 nm with shoulder at 612 nm)", [
        (612.0, 0.45, 30.0),
        (664.0, 1.68, 38.0)
    ]),
    6: SampleProfile("Empty Chamber Slot", "Air reference", [], baseline_offset=0.001)
}


class SpectrophotometerController:
    def __init__(self):
        self.state = SpectroState.READY
        self.mode = MeasureMode.PHOTOMETRIC

        # Wavelength parameters (nm)
        self.min_wavelength = 190.0
        self.max_wavelength = 1100.0
        self.current_wavelength = 525.0  # Default to KMnO4 peak
        self.lamp_switchover_wavelength = 340.0

        # Hardware interlocks and carousel
        self.chamber_lid_open = False
        self.active_cell_position = 1  # 1 to 6
        self.total_cells = 6

        # Scan setup
        self.scan_start_nm = 400.0
        self.scan_end_nm = 700.0
        self.scan_speed_nm_min = 1200.0
        self.scan_current_nm = 400.0
        self.scan_data: List[Tuple[float, float]] = []

        # Baseline zero offset per wavelength
        self.baseline_offsets: Dict[float, float] = {}
        self.global_zero_offset = 0.0

        # Measurements
        self.last_absorbance = 0.000
        self.last_transmittance_pct = 100.0

    @property
    def active_lamp(self) -> str:
        """Determines active light source based on wavelength position."""
        if self.state == SpectroState.POWER_OFF:
            return "OFF"
        if self.current_wavelength < self.lamp_switchover_wavelength:
            return "DEUTERIUM_UV"
        return "TUNGSTEN_VIS"

    def power_toggle(self) -> bool:
        if self.state == SpectroState.POWER_OFF:
            self.state = SpectroState.INITIALIZING
            return True
        self.state = SpectroState.POWER_OFF
        return False

    def set_chamber_lid(self, is_open: bool):
        self.chamber_lid_open = is_open
        if is_open:
            if self.state in (SpectroState.MEASURING, SpectroState.SCANNING, SpectroState.ZEROING):
                self.state = SpectroState.FAULT_LID_OPEN
        elif self.state == SpectroState.FAULT_LID_OPEN:
            self.state = SpectroState.READY

    def set_wavelength(self, wl_nm: float) -> bool:
        if self.state in (SpectroState.POWER_OFF, SpectroState.INITIALIZING, SpectroState.SCANNING):
            return False
        clamped = max(self.min_wavelength, min(self.max_wavelength, round(wl_nm, 1)))
        self.current_wavelength = clamped
        return True

    def select_cell(self, position: int) -> bool:
        if self.state in (SpectroState.POWER_OFF, SpectroState.SCANNING):
            return False
        if not (1 <= position <= self.total_cells):
            return False
        self.active_cell_position = position
        return True

    def advance_cell(self) -> int:
        next_pos = (self.active_cell_position % self.total_cells) + 1
        self.select_cell(next_pos)
        return self.active_cell_position

    def auto_zero(self) -> bool:
        """Performs baseline zeroing using reference blank."""
        if self.chamber_lid_open or self.state == SpectroState.POWER_OFF:
            return False
        self.state = SpectroState.ZEROING
        # Measure current sample/blank raw absorbance and set as offset
        sample = STANDARD_SAMPLES.get(self.active_cell_position, STANDARD_SAMPLES[1])
        raw_abs = sample.absorbance_at(self.current_wavelength)
        self.global_zero_offset = raw_abs
        self.state = SpectroState.READY
        self.measure()
        return True

    def measure(self) -> Optional[Tuple[float, float]]:
        """Takes a fixed-wavelength reading at current wavelength."""
        if self.chamber_lid_open:
            self.state = SpectroState.FAULT_LID_OPEN
            return None
        if self.state == SpectroState.POWER_OFF:
            return None

        sample = STANDARD_SAMPLES.get(self.active_cell_position, STANDARD_SAMPLES[1])
        raw_abs = sample.absorbance_at(self.current_wavelength)
        corrected_abs = max(0.0, raw_abs - self.global_zero_offset)

        # Beer-Lambert: T = 10^(-A), %T = 100 * 10^(-A)
        # Clamped for numerical stability
        t_pct = 100.0 * (10.0 ** (-corrected_abs))
        self.last_absorbance = round(corrected_abs, 4)
        self.last_transmittance_pct = round(t_pct, 2)
        return (self.last_absorbance, self.last_transmittance_pct)

    def start_scan(self, start_nm: float = 400.0, end_nm: float = 700.0) -> bool:
        if self.chamber_lid_open or self.state == SpectroState.POWER_OFF:
            return False
        self.scan_start_nm = max(self.min_wavelength, min(self.max_wavelength, start_nm))
        self.scan_end_nm = max(self.scan_start_nm + 10.0, min(self.max_wavelength, end_nm))
        self.scan_current_nm = self.scan_start_nm
        self.scan_data = []
        self.state = SpectroState.SCANNING
        return True

    def stop_scan(self):
        if self.state == SpectroState.SCANNING:
            self.state = SpectroState.READY

    def tick(self, dt_sec: float = 0.1):
        """Simulation tick for scanning and transitions."""
        if self.state == SpectroState.INITIALIZING:
            self.state = SpectroState.READY
            self.measure()
        elif self.state == SpectroState.SCANNING:
            if self.chamber_lid_open:
                self.state = SpectroState.FAULT_LID_OPEN
                return

            # Advance wavelength based on scan speed (nm/min -> nm/sec)
            step_nm = (self.scan_speed_nm_min / 60.0) * dt_sec
            self.scan_current_nm += step_nm
            self.current_wavelength = min(self.scan_end_nm, round(self.scan_current_nm, 1))

            sample = STANDARD_SAMPLES.get(self.active_cell_position, STANDARD_SAMPLES[1])
            val = max(0.0, sample.absorbance_at(self.current_wavelength) - self.global_zero_offset)
            self.scan_data.append((self.current_wavelength, val))

            if self.scan_current_nm >= self.scan_end_nm:
                self.state = SpectroState.READY
                self.measure()
