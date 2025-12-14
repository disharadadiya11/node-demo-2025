const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const s3Client = require("./s3.client");
const { AWS_S3_BUCKET } = require("../../config/env");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

class S3Service {
  async uploadFile(fileBuffer, fileName, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await s3Client.send(command);
      return `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.log("S3 upload failed:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  async deleteFile(fileName) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: fileName,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      console.log("S3 delete failed:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  async getSignedUrl(fileName, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: fileName,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.log("S3 signed URL generation failed:", error);
      throw new Error("Failed to generate signed URL");
    }
  }
}

module.exports = new S3Service();
