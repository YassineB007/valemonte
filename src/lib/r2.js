import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a File object to Cloudflare R2.
 * @param {File} file - The file from FormData (must be a Web API File object).
 * @param {string} folder - The virtual folder inside the bucket (e.g. "products", "collections").
 * @returns {Promise<string>} - The public CDN URL of the uploaded file.
 */
export async function uploadFileToR2(file, folder = "products") {
  // Generate a unique filename to avoid collisions
  const ext = file.name.split(".").pop();
  const uniqueName = `${crypto.randomUUID()}.${ext}`;
  const key = `${folder}/${uniqueName}`;

  // Convert the Web File API object into a Buffer for the S3 SDK
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  // Return the public URL via the R2.dev CDN subdomain
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}
