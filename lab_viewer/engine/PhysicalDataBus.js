/**
 * PhysicalDataBus.js — Real-World Physicalized Data Outputs & LIMS Studio
 * 
 * Manages:
 * 1. 3D Thermal Receipt Printers (Paper strip extrusion, GLP audit trail view, copy-to-clipboard)
 * 2. Front USB Thumb Drives (Direct browser download of raw analytical .CSV files)
 * 3. User's Office PC & LIMS Post-Run Results Studio (Spectra, kinetics curves, buffer calculations)
 * 4. Physical On-Bench Spiral Lab Notebook (Logging experiment data & rubric checks)
 */
import { labAudio } from "./LabSFXMixer.js";

export class PhysicalDataBus {
  constructor() {
    this.receiptModal = null;
    this.notebookModal = null;
    this.activeRunData = new Map();

    this._initDefaultRunData();
    this._injectModalContainers();
  }

  _initDefaultRunData() {
    this.activeRunData.set("spectrophotometer", {
      title: "Shimadzu UV-2600i Spectrophotometer",
      standard: "NGSS HS-PS1-5 / AP Chem Unit 5 (Kinetics)",
      date: new Date().toISOString().split("T")[0],
      method: "KINETICS_RATE_LAW_590NM",
      sample: "Crystal Violet + 0.1M NaOH",
      columns: ["Time (s)", "Absorbance (590nm)", "ln(A)", "1/A"],
      rows: [
        [0, 0.854, -0.158, 1.171],
        [30, 0.712, -0.340, 1.404],
        [60, 0.594, -0.521, 1.684],
        [90, 0.495, -0.703, 2.020],
        [120, 0.413, -0.884, 2.421],
        [150, 0.344, -1.067, 2.907],
        [180, 0.287, -1.248, 3.484]
      ],
      conclusion: "Linear fit on ln(A) vs time (R² = 0.9982) confirms Pseudo-First Order Reaction."
    });

    this.activeRunData.set("dissolution_tester", {
      title: "Agilent 708-DS USP Dissolution Tester",
      standard: "USP <711> Dissolution - Apparatus 2 Paddles",
      date: new Date().toISOString().split("T")[0],
      method: "USP_ACETAMINOPHEN_37C_50RPM",
      sample: "Acetaminophen 500mg Tablets (Lot: ACM-2026-X)",
      columns: ["Time (min)", "Vessel 1 Q%", "Vessel 2 Q%", "Vessel 3 Q%", "Vessel 4 Q%", "Mean Q%"],
      rows: [
        [5, 34.2, 36.1, 33.8, 35.5, 34.9],
        [10, 58.4, 61.2, 59.0, 60.1, 59.7],
        [15, 74.8, 77.2, 75.3, 76.0, 75.8],
        [30, 84.6, 86.2, 85.0, 85.8, 85.4],
        [45, 96.1, 98.0, 96.8, 97.4, 97.1]
      ],
      conclusion: "Q (30 min) = 85.4% >= 80% (USP Stage 1 Acceptance Criteria: PASS)."
    });

    this.activeRunData.set("karl_fischer", {
      title: "Metrohm 901 Titrando Karl Fischer",
      standard: "USP <921> Method 1 / EP 2.5.12 (Water Determination)",
      date: new Date().toISOString().split("T")[0],
      method: "KF_VOLUMETRIC_ONE_COMPONENT",
      sample: "Lyophilized Drug Substance Vial 04",
      columns: ["Parameter", "Measured Value", "Specification", "Status"],
      rows: [
        ["Sample Net Weight", "0.1248 g", "0.1000 - 0.1500 g", "OK"],
        ["Endpoint Volume Vep", "2.418 mL", "—", "RECORD"],
        ["Titer (Hydranal)", "4.982 mg/mL", "4.90 - 5.10 mg/mL", "PASS"],
        ["Total Water Mass", "12.046 mg H2O", "—", "CALCULATED"],
        ["Water Content (% w/w)", "9.65%", "<= 10.0%", "PASS"],
        ["Endpoint Drift", "12.4 uL/min", "<= 20.0 uL/min", "PASS"]
      ],
      conclusion: "Moisture content meets USP specification."
    });
  }

  _injectModalContainers() {
    // Thermal Receipt Slip Container
    const receiptDiv = document.createElement("div");
    receiptDiv.id = "thermal-receipt-modal";
    receiptDiv.className = "lab-modal-backdrop is-hidden";
    receiptDiv.innerHTML = `
      <div class="thermal-paper-slip">
        <div class="thermal-paper-tear top"></div>
        <div class="thermal-header">
          <div class="thermal-brand">SREdesigns · LAB INSTRUMENT SYSTEMS</div>
          <div class="thermal-title" id="receipt-title">GLP CALIBRATION REPORT</div>
          <div class="thermal-meta" id="receipt-meta">DATE: 2026-10-27 · OPERATOR: CHEM_01</div>
        </div>
        <div class="thermal-body" id="receipt-body"></div>
        <div class="thermal-footer">
          <div class="thermal-barcode">||| | |||| || | ||||| ||| |||| |</div>
          <div class="thermal-actions">
            <button class="thermal-btn" id="btn-copy-receipt">Copy Raw Data</button>
            <button class="thermal-btn" id="btn-close-receipt">Done</button>
          </div>
        </div>
        <div class="thermal-paper-tear bottom"></div>
      </div>
    `;
    document.body.appendChild(receiptDiv);
    this.receiptModal = receiptDiv;

    receiptDiv.querySelector("#btn-close-receipt").addEventListener("click", () => {
      receiptDiv.classList.add("is-hidden");
    });

    receiptDiv.querySelector("#btn-copy-receipt").addEventListener("click", () => {
      const text = receiptDiv.querySelector("#receipt-body").innerText;
      navigator.clipboard?.writeText(text);
      labAudio.playButtonClick();
      alert("GLP Audit Trail copied to clipboard!");
    });
  }

  // Extrude & View Thermal Paper Slip
  printThermalSlip(machineId) {
    labAudio.playPrinterChirp();
    const data = this.activeRunData.get(machineId) || this.activeRunData.get("dissolution_tester");

    const titleEl = this.receiptModal.querySelector("#receipt-title");
    const metaEl = this.receiptModal.querySelector("#receipt-meta");
    const bodyEl = this.receiptModal.querySelector("#receipt-body");

    titleEl.textContent = data.title;
    metaEl.textContent = `STANDARD: ${data.standard}\nDATE: ${data.date} · METHOD: ${data.method}`;

    let html = `<div class="thermal-sample">SAMPLE: ${data.sample}</div>`;
    html += `<table class="thermal-table"><thead><tr>`;
    data.columns.forEach((col) => { html += `<th>${col}</th>`; });
    html += `</tr></thead><tbody>`;
    data.rows.forEach((row) => {
      html += `<tr>`;
      row.forEach((cell) => { html += `<td>${cell}</td>`; });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    html += `<div class="thermal-conclusion">RESULT: ${data.conclusion}</div>`;

    bodyEl.innerHTML = html;
    this.receiptModal.classList.remove("is-hidden");
  }

  // Trigger USB Thumb Drive CSV Download
  downloadUsbCSV(machineId) {
    labAudio.playButtonClick();
    const data = this.activeRunData.get(machineId) || this.activeRunData.get("spectrophotometer");

    let csvContent = `data:text/csv;charset=utf-8,`;
    csvContent += `# SREdesigns Laboratory Digital Twin System\n`;
    csvContent += `# Instrument: ${data.title}\n`;
    csvContent += `# Standard: ${data.standard}\n`;
    csvContent += `# Date: ${data.date}\n`;
    csvContent += `# Method: ${data.method}\n`;
    csvContent += `# Sample: ${data.sample}\n\n`;

    csvContent += data.columns.join(",") + "\n";
    data.rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${machineId}_Analytical_Run_${data.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const physicalDataBus = new PhysicalDataBus();
