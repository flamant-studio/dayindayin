import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import path from "path";

const DROPBOX = "/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/WEBSITE ASSETS";

const uploads = [
  { src: `${DROPBOX}/_temp_mocks/asset_tufting_3.jpg`,       pathname: "tufting/hero.jpg",      contentType: "image/jpeg" },
  { src: `${DROPBOX}/_temp_mocks/asset_embroidery_1.jpg`,    pathname: "embroidery/hero.jpg",   contentType: "image/jpeg" },
  { src: `${DROPBOX}/_temp_mocks/asset_painting_1.jpg`,      pathname: "painting/hero.jpg",     contentType: "image/jpeg" },
  { src: `${DROPBOX}/_temp_mocks/lifestyle_mock_1.jpg`,      pathname: "photography/hero.jpg",  contentType: "image/jpeg" },
  { src: `${DROPBOX}/_assets_generic_profile-pics/stine_profile_compressed_1.jpg`, pathname: "profile/stine.jpg", contentType: "image/jpeg" },
];

for (const { src, pathname, contentType } of uploads) {
  process.stdout.write(`Uploading ${pathname}... `);
  const buffer = readFileSync(src);
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType,
    allowOverwrite: true,
  });
  console.log(blob.url);
}
