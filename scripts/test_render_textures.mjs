import { spawn } from "child_process";
import fs from "fs";

const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new",
  "--remote-debugging-port=9283",
  "--window-size=800,600",
  "--disable-gpu-sandbox",
  "--no-sandbox",
  "about:blank"
]);

const sleep = ms => new Promise(r => setTimeout(r, ms));

setTimeout(async () => {
  const res = await fetch("http://127.0.0.1:9283/json/list");
  const pages = await res.json();
  const page = pages.find(p => p.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    }
  };

  const send = (method, params = {}) => new Promise(resolve => {
    const id = msgId++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

  const testExpr = `
    (function() {
      // 1. Enhanced Brick Canvas
      const cBrick = document.createElement("canvas");
      cBrick.width = 1024;
      cBrick.height = 512;
      const ctxB = cBrick.getContext("2d");
      ctxB.fillStyle = "#a2998d";
      ctxB.fillRect(0, 0, 1024, 512);

      // Stipple mortar
      for (let i = 0; i < 4000; i++) {
        ctxB.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
        ctxB.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
      }

      const brickColors = [
        "#9e422c", "#8d3824", "#b24d35", "#782e1e", "#5c2619",
        "#ab4832", "#6e2f20", "#c1583d", "#86321f", "#4e2117"
      ];
      const rowH = 32;
      const brickW = 96;
      const gap = 4;

      for (let y = 0; y < 512; y += rowH) {
        const rowIdx = Math.floor(y / rowH);
        const xOffset = (rowIdx % 2) * (brickW / 2);
        for (let x = -brickW; x < 1024 + brickW; x += brickW + gap) {
          const bx = x + xOffset;
          const col = brickColors[Math.floor(Math.random() * brickColors.length)];
          ctxB.fillStyle = col;
          ctxB.fillRect(bx, y + gap / 2, brickW, rowH - gap);

          // Subtle brick surface stippling
          for (let s = 0; s < 12; s++) {
            ctxB.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.08)";
            ctxB.fillRect(bx + Math.random() * (brickW - 4), y + gap/2 + Math.random() * (rowH - gap - 4), 3, 2);
          }

          // Shading: bottom and right shadow
          ctxB.fillStyle = "rgba(0, 0, 0, 0.28)";
          ctxB.fillRect(bx, y + rowH - gap / 2 - 2, brickW, 2);
          ctxB.fillRect(bx + brickW - 2, y + gap / 2, 2, rowH - gap);

          // Highlight: top and left
          ctxB.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctxB.fillRect(bx, y + gap / 2, brickW, 1.5);
          ctxB.fillRect(bx, y + gap / 2, 1.5, rowH - gap);
        }
      }

      // 2. Paver Canvas
      const cPaver = document.createElement("canvas");
      cPaver.width = 512;
      cPaver.height = 512;
      const ctxP = cPaver.getContext("2d");
      ctxP.fillStyle = "#1e232a";
      ctxP.fillRect(0, 0, 512, 512);

      const paverColors = ["#485260", "#3a434f", "#556070", "#313842", "#404a56", "#2d343d"];
      const pRowH = 32;
      const pW = 64;
      const pGap = 3;

      for (let y = 0; y < 512; y += pRowH) {
        const rowIdx = Math.floor(y / pRowH);
        const xOffset = (rowIdx % 2) * (pW / 2);
        for (let x = -pW; x < 512 + pW; x += pW + pGap) {
          const px = x + xOffset;
          ctxP.fillStyle = paverColors[Math.floor(Math.random() * paverColors.length)];
          ctxP.fillRect(px, y + pGap / 2, pW, pRowH - pGap);

          // Paver bevels
          ctxP.fillStyle = "rgba(0, 0, 0, 0.35)";
          ctxP.fillRect(px, y + pRowH - pGap / 2 - 2, pW, 2);
          ctxP.fillRect(px + pW - 2, y + pGap / 2, 2, pRowH - pGap);
          ctxP.fillStyle = "rgba(255, 255, 255, 0.12)";
          ctxP.fillRect(px, y + pGap / 2, pW, 1.5);
          ctxP.fillRect(px, y + pGap / 2, 1.5, pRowH - pGap);
        }
      }

      // 3. Birch Bark Canvas
      const cBark = document.createElement("canvas");
      cBark.width = 512;
      cBark.height = 1024;
      const ctxK = cBark.getContext("2d");
      // Creamy base with subtle vertical grad
      const bGrad = ctxK.createLinearGradient(0, 0, 0, 1024);
      bGrad.addColorStop(0, "#f4f1ea");
      bGrad.addColorStop(0.7, "#ebe6db");
      bGrad.addColorStop(1.0, "#2a241e"); // dark furrowed base
      ctxK.fillStyle = bGrad;
      ctxK.fillRect(0, 0, 512, 1024);

      // Lenticels: horizontal dark dashes
      for (let l = 0; l < 240; l++) {
        const lx = Math.random() * 512;
        const ly = Math.random() * 850;
        const len = 8 + Math.random() * 45;
        const thick = 1.5 + Math.random() * 3.5;
        ctxK.fillStyle = Math.random() > 0.3 ? "#1e1a17" : "#3d352e";
        ctxK.fillRect(lx, ly, len, thick);
        if (Math.random() > 0.7) {
          // slight curl shadow under lenticel
          ctxK.fillStyle = "rgba(0,0,0,0.18)";
          ctxK.fillRect(lx - 2, ly + thick, len + 4, 1.5);
        }
      }

      return {
        brick: cBrick.toDataURL("image/png"),
        paver: cPaver.toDataURL("image/png"),
        bark: cBark.toDataURL("image/png")
      };
    })()
  `;

  const evalRes = await send("Runtime.evaluate", { expression: testExpr, returnByValue: true });
  const val = evalRes.result.result.value;

  fs.writeFileSync("docs/media/audit/test_brick_enhanced.png", Buffer.from(val.brick.replace(/^data:image\/png;base64,/, ""), "base64"));
  fs.writeFileSync("docs/media/audit/test_paver.png", Buffer.from(val.paver.replace(/^data:image\/png;base64,/, ""), "base64"));
  fs.writeFileSync("docs/media/audit/test_birch_bark.png", Buffer.from(val.bark.replace(/^data:image\/png;base64,/, ""), "base64"));
  console.log("All 3 test textures written successfully!");

  chrome.kill("SIGKILL");
  process.exit(0);
}, 2000);
