"use strict";

const { Service } = require("egg");
const path = require("path");
const fse = require("fs-extra");
const nodemeller = require("nodemailer");
const userEmail = "mayi15515143250@163.com";
const transporter = nodemeller.createTransport({
  service: "163",
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: "AJQTXZPXIHBQNEVU",
  },
});
class ToolsService extends Service {
  async mergeChunk(filePath, fileHash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_FILEPATH, fileHash);
    let chunks = await fse.readdir(chunkDir);
    chunks.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
    chunks = chunks.map((cp) => path.resolve(chunkDir, cp));
    await this.margeChunks(filePath, chunks, size);
  }
  async margeChunks(dest, chunks, size) {
    const pipStream = (filePath, writeStream) =>
      new Promise((resolve) => {
        const readStream = fse.createReadStream(filePath);
        readStream.on("end", () => {
          fse.unlinkSync(filePath);
          resolve();
        });
        readStream.pipe(writeStream);
      });

    await Promise.all(
      chunks.map((filePath, index) =>
        pipStream(
          filePath,
          fse.createWriteStream(dest, {
            start: index * size,
            // end: (index + 1) * size,
          })
        )
      )
    );
  }
  async sendEmail(email, subject, text, html) {
    const sendOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(sendOptions);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ToolsService;
