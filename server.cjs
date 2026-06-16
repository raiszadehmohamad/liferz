var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// api/server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "15mb" }));
app.post("/api/parse-task", (req, res) => {
  const textToParse = req.body.text || "";
  const priority = textToParse.includes("\u0628\u0627\u0644\u0627") || textToParse.includes("\u0641\u0648\u0631\u06CC") ? "high" : "medium";
  let category = "\u06A9\u0627\u0631\u0647\u0627\u06CC \u0634\u062E\u0635\u06CC";
  if (textToParse.includes("\u0628\u06CC\u0645\u0647") || textToParse.includes("\u0645\u0627\u0644\u06CC") || textToParse.includes("\u0628\u0627\u0646\u06A9")) category = "\u0645\u0627\u0644\u06CC \u0648 \u0627\u0642\u062A\u0635\u0627\u062F\u06CC";
  if (textToParse.includes("\u067E\u0631\u0648\u0698\u0647") || textToParse.includes("\u062C\u0644\u0633\u0647") || textToParse.includes("\u06A9\u0627\u0631")) category = "\u0627\u0645\u0648\u0631 \u06A9\u0627\u0631\u06CC / \u0634\u063A\u0644\u06CC";
  if (textToParse.includes("\u0648\u0631\u0632\u0634") || textToParse.includes("\u062F\u0648\u06CC\u062F\u0646") || textToParse.includes("\u0633\u0644\u0627\u0645\u062A\u06CC")) category = "\u0633\u0644\u0627\u0645\u062A\u06CC \u0648 \u0648\u0631\u0632\u0634";
  const calculatedDate = textToParse.includes("\u0641\u0631\u062F\u0627") ? new Date(Date.now() + 864e5).toISOString().split("T")[0] : req.body.currentDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  res.json({
    title: textToParse.replace(/فردا|امروز|بعد از ظهر|صبح|ساعت/g, "").trim() || textToParse,
    description: "\u062A\u062D\u0644\u06CC\u0644 \u0645\u062D\u0644\u06CC (\u0622\u0641\u0644\u0627\u06CC\u0646)",
    priority,
    category,
    dueDate: calculatedDate,
    timeOfDay: textToParse.includes("\u0635\u0628\u062D") ? "morning" : textToParse.includes("\u0639\u0635\u0631") || textToParse.includes("\u0638\u0647\u0631") ? "afternoon" : "anytime"
  });
});
app.post("/api/transcribe-voice", (req, res) => {
  res.json({ transcription: "\u0633\u06CC\u0633\u062A\u0645 \u0635\u0648\u062A\u06CC \u0628\u0647 \u0639\u0644\u062A \u0645\u062D\u0644\u06CC\u200C\u0633\u0627\u0632\u06CC \u06A9\u0644\u0627 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A." });
});
app.post("/api/analyze-productivity", (req, res) => {
  res.json({ text: "\u0627\u06CC\u0646 \u0642\u0627\u0628\u0644\u06CC\u062A \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0634\u062F\u0647 \u0627\u0633\u062A." });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: /* @__PURE__ */ new Date() });
});
var startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Liferz local server running on port ${PORT}`);
  });
};
startServer();
//# sourceMappingURL=server.cjs.map
