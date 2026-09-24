"""
Sample materials, tube state, and visual separation after centrifugation.

Layers are bottom→top fractions (0–1 of fill height). Colours are CSS/hex strings
for the viewer; Blender can map the same IDs later.
"""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple


ROTOR_SLOTS = 24
RACK_SLOTS = 24  # 4×6 bench rack next to the instrument


class Location(str, Enum):
    ROTOR = "ROTOR"
    RACK = "RACK"


@dataclass(frozen=True)
class Layer:
    """One visible band of material in a tube (fraction of liquid height)."""

    name: str
    color: str  # #RRGGBB
    fraction: float  # 0–1, sum of layers ≈ 1


@dataclass(frozen=True)
class SampleMaterial:
    id: str
    label: str
    description: str
    # Homogeneous look before spin
    before_layers: Tuple[Layer, ...]
    # Separated look after a completed run (rpm/time/rcf thresholds apply)
    after_layers: Tuple[Layer, ...]
    # Minimum effective separation conditions
    min_rcf: float = 500.0
    min_time_s: float = 30.0
    min_rpm: float = 1000.0
    # Density imbalance contribution (relative mass units for optional balance check)
    density_factor: float = 1.0
    fill_fraction: float = 0.65  # how full the tube is (of tube body)

    def layers_for(self, separated: bool) -> Tuple[Layer, ...]:
        return self.after_layers if separated else self.before_layers


# --- Material library (lab-plausible visual approximations) ---

MATERIALS: Dict[str, SampleMaterial] = {
    "empty": SampleMaterial(
        id="empty",
        label="Empty",
        description="No sample",
        before_layers=(),
        after_layers=(),
        min_rcf=0,
        min_time_s=0,
        min_rpm=0,
        density_factor=0.0,
        fill_fraction=0.0,
    ),
    "whole_blood": SampleMaterial(
        id="whole_blood",
        label="Whole blood",
        description="EDTA whole blood → plasma / buffy coat / packed RBCs",
        before_layers=(Layer("mixed blood", "#8B0000", 1.0),),
        after_layers=(
            Layer("packed RBCs", "#6B0000", 0.45),
            Layer("buffy coat", "#E8D5A3", 0.05),
            Layer("plasma", "#FFF3C4", 0.50),
        ),
        min_rcf=1000.0,
        min_time_s=60.0,
        min_rpm=2000.0,
        density_factor=1.06,
    ),
    "blood_serum_clot": SampleMaterial(
        id="blood_serum_clot",
        label="Clotted blood (serum)",
        description="Serum separator style: clot pellet + clear serum",
        before_layers=(Layer("clotted blood", "#7A1F1F", 1.0),),
        after_layers=(
            Layer("clot", "#5C1010", 0.40),
            Layer("gel barrier", "#D4C48A", 0.08),
            Layer("serum", "#FFE8A0", 0.52),
        ),
        min_rcf=1200.0,
        min_time_s=90.0,
        min_rpm=2500.0,
        density_factor=1.05,
    ),
    "bacterial_culture": SampleMaterial(
        id="bacterial_culture",
        label="Bacterial culture",
        description="Turbid broth → cell pellet + clear supernatant",
        before_layers=(Layer("turbid broth", "#C4B87A", 1.0),),
        after_layers=(
            Layer("cell pellet", "#5A4A20", 0.12),
            Layer("supernatant", "#E8E0B8", 0.88),
        ),
        min_rcf=3000.0,
        min_time_s=120.0,
        min_rpm=5000.0,
        density_factor=1.02,
    ),
    "plasmid_miniprep": SampleMaterial(
        id="plasmid_miniprep",
        label="Plasmid miniprep lysate",
        description="Alkaline lysate → white debris pellet + clarified lysate",
        before_layers=(Layer("cloudy lysate", "#E0E8D0", 1.0),),
        after_layers=(
            Layer("debris pellet", "#F5F5F0", 0.18),
            Layer("cleared lysate", "#F8FFF0", 0.82),
        ),
        min_rcf=10000.0,
        min_time_s=180.0,
        min_rpm=12000.0,
        density_factor=1.03,
    ),
    "pcr_mix": SampleMaterial(
        id="pcr_mix",
        label="PCR master mix",
        description="Aqueous reagents — little visible change; may form tiny condensation ring",
        before_layers=(Layer("clear mix", "#E8F4FF", 1.0),),
        after_layers=(
            Layer("clear mix", "#E8F4FF", 0.97),
            Layer("meniscus / condensation", "#F5FBFF", 0.03),
        ),
        min_rcf=200.0,
        min_time_s=5.0,
        min_rpm=1000.0,
        density_factor=1.01,
        fill_fraction=0.25,
    ),
    "soil_slurry": SampleMaterial(
        id="soil_slurry",
        label="Soil / slurry",
        description="Muddy suspension → heavy sediment + cloudy then clearer supernatant",
        before_layers=(Layer("slurry", "#6B5344", 1.0),),
        after_layers=(
            Layer("sediment", "#3E2A1F", 0.35),
            Layer("silty layer", "#8A7360", 0.15),
            Layer("cloudy water", "#C4B8A8", 0.50),
        ),
        min_rcf=800.0,
        min_time_s=60.0,
        min_rpm=2000.0,
        density_factor=1.15,
    ),
    "milk": SampleMaterial(
        id="milk",
        label="Milk",
        description="Homogenized milk — cream-ish light band + denser body (simplified)",
        before_layers=(Layer("milk", "#FFF8EE", 1.0),),
        after_layers=(
            Layer("skim body", "#F2EDE4", 0.85),
            Layer("cream band", "#FFFCF5", 0.15),
        ),
        min_rcf=2000.0,
        min_time_s=300.0,
        min_rpm=4000.0,
        density_factor=1.03,
    ),
    "ink_suspension": SampleMaterial(
        id="ink_suspension",
        label="Ink / pigment suspension",
        description="Coloured particles sediment; clear carrier on top",
        before_layers=(Layer("ink mix", "#2A3F8F", 1.0),),
        after_layers=(
            Layer("pigment pellet", "#0D1535", 0.20),
            Layer("clear carrier", "#D0D8F0", 0.80),
        ),
        min_rcf=1500.0,
        min_time_s=90.0,
        min_rpm=3000.0,
        density_factor=1.04,
    ),
    "gradient_sucrose": SampleMaterial(
        id="gradient_sucrose",
        label="Sucrose gradient + lysate",
        description="Multi-band density gradient after spin",
        before_layers=(
            Layer("dense cushion", "#B8D4E8", 0.25),
            Layer("mid sucrose", "#D0E8F5", 0.35),
            Layer("sample load", "#E8C4C4", 0.40),
        ),
        after_layers=(
            Layer("cushion", "#A0C4E0", 0.22),
            Layer("band A", "#E8A0A0", 0.08),
            Layer("mid", "#C8DCE8", 0.30),
            Layer("band B", "#E8D080", 0.10),
            Layer("top buffer", "#F0F6FA", 0.30),
        ),
        min_rcf=8000.0,
        min_time_s=600.0,
        min_rpm=10000.0,
        density_factor=1.12,
        fill_fraction=0.80,
    ),
    "water_buffer": SampleMaterial(
        id="water_buffer",
        label="Clear buffer",
        description="Aqueous buffer — no visible pellet",
        before_layers=(Layer("buffer", "#E6F2FF", 1.0),),
        after_layers=(Layer("buffer", "#E6F2FF", 1.0),),
        min_rcf=100.0,
        min_time_s=1.0,
        min_rpm=500.0,
        density_factor=1.0,
    ),
    "oil_water": SampleMaterial(
        id="oil_water",
        label="Oil + water emulsion",
        description="Broken emulsion → aqueous bottom, oil top",
        before_layers=(Layer("emulsion", "#D4C89A", 1.0),),
        after_layers=(
            Layer("aqueous", "#B8D4E8", 0.55),
            Layer("oil", "#E8D48A", 0.45),
        ),
        min_rcf=500.0,
        min_time_s=45.0,
        min_rpm=1500.0,
        density_factor=0.95,
    ),
}


def list_materials() -> List[Dict[str, str]]:
    return [
        {"id": m.id, "label": m.label, "description": m.description}
        for m in MATERIALS.values()
        if m.id != "empty"
    ]


@dataclass
class Tube:
    """One physical microtube instance."""

    tube_id: str
    material_id: str = "empty"
    location: Location = Location.RACK
    slot: int = 0  # index in rotor 0..23 or rack 0..23
    separated: bool = False
    # Peak conditions seen while spinning (for partial separation later)
    peak_rcf: float = 0.0
    spun_time_s: float = 0.0
    cap_color: str = "#2563EB"

    def material(self) -> SampleMaterial:
        return MATERIALS.get(self.material_id, MATERIALS["empty"])

    def is_empty(self) -> bool:
        return self.material_id == "empty" or self.material().fill_fraction <= 0

    def layers(self) -> List[Dict[str, Any]]:
        mat = self.material()
        if mat.fill_fraction <= 0:
            return []
        return [
            {"name": ly.name, "color": ly.color, "fraction": ly.fraction}
            for ly in mat.layers_for(self.separated)
        ]

    def to_dict(self) -> Dict[str, Any]:
        mat = self.material()
        return {
            "tube_id": self.tube_id,
            "material_id": self.material_id,
            "material_label": mat.label,
            "location": self.location.value,
            "slot": self.slot,
            "separated": self.separated,
            "fill_fraction": mat.fill_fraction,
            "layers": self.layers(),
            "cap_color": self.cap_color,
            "peak_rcf": round(self.peak_rcf, 1),
            "spun_time_s": round(self.spun_time_s, 1),
            "description": mat.description,
        }

    def apply_run_result(self, peak_rcf: float, spun_time_s: float, peak_rpm: float) -> bool:
        """
        Update separation state after a completed spin.
        Returns True if appearance changed to separated.
        """
        if self.is_empty():
            return False
        self.peak_rcf = max(self.peak_rcf, peak_rcf)
        self.spun_time_s += spun_time_s
        mat = self.material()
        ok = (
            peak_rcf >= mat.min_rcf
            and spun_time_s >= mat.min_time_s
            and peak_rpm >= mat.min_rpm
        )
        if ok and not self.separated:
            self.separated = True
            return True
        # Partial: still mark separated if RCF and time close (80%) for demo friendliness
        if (
            not self.separated
            and peak_rcf >= mat.min_rcf * 0.8
            and spun_time_s >= mat.min_time_s * 0.8
            and peak_rpm >= mat.min_rpm * 0.8
        ):
            self.separated = True
            return True
        return False

    def remix(self) -> None:
        """Vortex / invert — clear separation."""
        self.separated = False
        self.peak_rcf = 0.0
        self.spun_time_s = 0.0


@dataclass
class LabBench:
    """
    Rotor slots + bench rack. Tubes move between them.
    Only lid-open / stopped operations allowed (enforced by caller).
    """

    tubes: Dict[str, Tube] = field(default_factory=dict)
    rotor: List[Optional[str]] = field(default_factory=lambda: [None] * ROTOR_SLOTS)
    rack: List[Optional[str]] = field(default_factory=lambda: [None] * RACK_SLOTS)
    _seq: int = 0
    default_cap_colors: Tuple[str, ...] = (
        "#2563EB",
        "#DC2626",
        "#16A34A",
        "#CA8A04",
        "#9333EA",
        "#0891B2",
        "#EA580C",
        "#DB2777",
    )

    def __post_init__(self) -> None:
        if not self.tubes and all(s is None for s in self.rack):
            self._seed_default_rack()

    def _seed_default_rack(self) -> None:
        """Start with a full rack of empty tubes ready to load samples."""
        for i in range(RACK_SLOTS):
            tid = self._new_tube_id()
            tube = Tube(
                tube_id=tid,
                material_id="empty",
                location=Location.RACK,
                slot=i,
                cap_color=self.default_cap_colors[i % len(self.default_cap_colors)],
            )
            self.tubes[tid] = tube
            self.rack[i] = tid

    def _new_tube_id(self) -> str:
        self._seq += 1
        return f"T{self._seq:03d}"

    def snapshot(self) -> Dict[str, Any]:
        return {
            "materials": list_materials(),
            "rotor": [
                self.tubes[t].to_dict() if t else None for t in self.rotor
            ],
            "rack": [
                self.tubes[t].to_dict() if t else None for t in self.rack
            ],
            "tubes": {k: v.to_dict() for k, v in self.tubes.items()},
            "rotor_count": sum(1 for t in self.rotor if t),
            "rack_count": sum(1 for t in self.rack if t),
            "balance": self.balance_report(),
        }

    def balance_report(self) -> Dict[str, Any]:
        """Simple opposite-pair balance check for loaded rotor tubes."""
        masses = []
        for i, tid in enumerate(self.rotor):
            if not tid:
                masses.append(0.0)
                continue
            tube = self.tubes[tid]
            mat = tube.material()
            masses.append(mat.density_factor * mat.fill_fraction)
        # Opposite slot is +12 mod 24
        imbalance = 0.0
        for i in range(12):
            imbalance += abs(masses[i] - masses[i + 12])
        ok = imbalance < 0.35  # soft threshold for demo
        return {
            "imbalance_score": round(imbalance, 3),
            "balanced": ok,
            "occupied_slots": [i for i, t in enumerate(self.rotor) if t],
        }

    def set_material(self, tube_id: str, material_id: str) -> None:
        if tube_id not in self.tubes:
            raise KeyError(tube_id)
        if material_id not in MATERIALS:
            raise KeyError(material_id)
        tube = self.tubes[tube_id]
        tube.material_id = material_id
        tube.separated = False
        tube.peak_rcf = 0.0
        tube.spun_time_s = 0.0

    def unload_rotor_to_rack(self, rotor_slot: int) -> str:
        """Remove tube from rotor → first free rack slot."""
        if not (0 <= rotor_slot < ROTOR_SLOTS):
            raise IndexError("rotor_slot")
        tid = self.rotor[rotor_slot]
        if not tid:
            raise ValueError("rotor slot empty")
        rack_slot = self._first_free_rack()
        if rack_slot is None:
            raise RuntimeError("rack full")
        self.rotor[rotor_slot] = None
        self.rack[rack_slot] = tid
        tube = self.tubes[tid]
        tube.location = Location.RACK
        tube.slot = rack_slot
        return tid

    def load_rack_to_rotor(self, rack_slot: int, rotor_slot: Optional[int] = None) -> str:
        """Load tube from rack into rotor (auto slot or specified)."""
        if not (0 <= rack_slot < RACK_SLOTS):
            raise IndexError("rack_slot")
        tid = self.rack[rack_slot]
        if not tid:
            raise ValueError("rack slot empty")
        if rotor_slot is None:
            rotor_slot = self._first_free_rotor()
        if rotor_slot is None:
            raise RuntimeError("rotor full")
        if not (0 <= rotor_slot < ROTOR_SLOTS):
            raise IndexError("rotor_slot")
        if self.rotor[rotor_slot] is not None:
            raise ValueError("rotor slot occupied")
        self.rack[rack_slot] = None
        self.rotor[rotor_slot] = tid
        tube = self.tubes[tid]
        tube.location = Location.ROTOR
        tube.slot = rotor_slot
        return tid

    def unload_all_rotor_to_rack(self) -> int:
        n = 0
        for i in range(ROTOR_SLOTS):
            if self.rotor[i]:
                self.unload_rotor_to_rack(i)
                n += 1
        return n

    def load_balanced_pair(self, material_id: str) -> List[str]:
        """Load two tubes of same material into opposite slots (demo helper)."""
        free = [i for i, t in enumerate(self.rotor) if t is None]
        if len(free) < 2:
            raise RuntimeError("need 2 free rotor slots")
        # pick first free and its opposite if free else second free
        a = free[0]
        b = (a + 12) % 24
        if self.rotor[b] is not None:
            b = free[1]
        ids = []
        for slot in (a, b):
            # take from rack first empty or empty material tube
            rs = self._first_rack_with_empty_or_any()
            if rs is None:
                raise RuntimeError("no rack tubes")
            tid = self.load_rack_to_rotor(rs, slot)
            self.set_material(tid, material_id)
            ids.append(tid)
        return ids

    def apply_centrifugation(
        self, peak_rcf: float, spun_time_s: float, peak_rpm: float
    ) -> List[str]:
        """Apply run result to all rotor tubes. Returns tube_ids that newly separated."""
        changed = []
        for tid in self.rotor:
            if not tid:
                continue
            tube = self.tubes[tid]
            if tube.apply_run_result(peak_rcf, spun_time_s, peak_rpm):
                changed.append(tid)
        return changed

    def remix_tube(self, tube_id: str) -> None:
        self.tubes[tube_id].remix()

    def _first_free_rack(self) -> Optional[int]:
        for i, t in enumerate(self.rack):
            if t is None:
                return i
        return None

    def _first_free_rotor(self) -> Optional[int]:
        for i, t in enumerate(self.rotor):
            if t is None:
                return i
        return None

    def _first_rack_with_empty_or_any(self) -> Optional[int]:
        for i, tid in enumerate(self.rack):
            if tid and self.tubes[tid].is_empty():
                return i
        for i, tid in enumerate(self.rack):
            if tid:
                return i
        return None
