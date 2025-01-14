export async function generateSignedUrls(
  storage,
  bucketName,
  fileNames,
  prefix = "",
) {
  return await Promise.all(
    fileNames.map(async (cleanedFileName) => {
      const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      };
      const filePath = `${prefix}${cleanedFileName}`; // Reapply the prefix if provided
      const file = storage.bucket(bucketName).file(filePath);
      const [url] = await file.getSignedUrl(options);
      return { filename: cleanedFileName, signedUrl: url };
    }),
  );
}
