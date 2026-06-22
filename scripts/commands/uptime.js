const fs = require("fs-extra");
const moment = require("moment-timezone");
const { createCanvas } = require("canvas");

module.exports.config = {
  name: "uptime",
  version: "2.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "Show bot uptime with generated image",
  prefix: true,
  category: "System",
  cooldowns: 1
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const now = moment.tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  const width = 700;
  const height = 380;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#0f0c29");
  grad.addColorStop(0.5, "#302b63");
  grad.addColorStop(1, "#24243e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.strokeStyle = "#7c3aed";
  ctx.lineWidth = 1;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.font = "bold 62px sans-serif";
  ctx.textAlign = "center";
  const titleGrad = ctx.createLinearGradient(0, 0, width, 0);
  titleGrad.addColorStop(0, "#a855f7");
  titleGrad.addColorStop(1, "#ec4899");
  ctx.fillStyle = titleGrad;
  ctx.fillText("JOY BOT", width / 2, 85);

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#c4b5fd";
  ctx.fillText("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", width / 2, 110);

  ctx.textAlign = "left";
  const left = 60;

  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#f0abfc";
  ctx.fillText("⏱  UPTIME", left, 155);

  ctx.font = "bold 42px sans-serif";
  const uptimeGrad = ctx.createLinearGradient(left, 0, width - left, 0);
  uptimeGrad.addColorStop(0, "#34d399");
  uptimeGrad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = uptimeGrad;
  ctx.fillText(`${String(hours).padStart(2,"0")}h  ${String(minutes).padStart(2,"0")}m  ${String(seconds).padStart(2,"0")}s`, left, 205);

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`🕐  ${now}`, left, 238);

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#c4b5fd";
  ctx.textAlign = "center";
  ctx.fillText("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", width / 2, 265);

  ctx.textAlign = "left";
  ctx.font = "bold 22px sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.fillText("👑  OWNER  :  JOY AHMED", left, 305);

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("🤖  PREFIX  :  " + (global.config?.PREFIX || "."), left, 338);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.textAlign = "right";
  ctx.fillText("powered by JOY BOT", width - 30, height - 20);

  const imgPath = __dirname + "/cache/uptime_gen.png";
  await fs.ensureDir(__dirname + "/cache");
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imgPath, buffer);

  api.sendMessage(
    { attachment: fs.createReadStream(imgPath) },
    threadID,
    () => {
      try { fs.unlinkSync(imgPath); } catch (_) {}
    },
    messageID
  );
};
