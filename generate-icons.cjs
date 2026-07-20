const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const colors = {
  primary: "#008069",
};

const createIcon = async (size) => {
  const buffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${colors.primary}" />
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 10}" fill="#d9fdd3" />
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 20}" fill="${colors.primary}" />
        </svg>`),
      },
    ])
    .png()
    .toBuffer();

  const filePath = path.join(__dirname, "public", `pwa-${size}x${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created ${filePath}`);
};

(async () => {
  await createIcon(192);
  await createIcon(512);
})();
