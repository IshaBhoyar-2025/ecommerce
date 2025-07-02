// lib/s3.ts
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

export async function uploadToS3(buffer: Buffer, key: string, contentType: string) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "private", // Set to 'public-read' if you want the file to be publicly accessible
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location; // ✅ This is the public URL
}
