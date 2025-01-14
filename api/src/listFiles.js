export async function listFiles(storage, BUCKET_NAME, prefix = "") {
  try {
    const [files] = await storage.bucket(BUCKET_NAME).getFiles({ prefix });
    const fileNames = files.map((file) => file.name);
    console.log("Files in bucket:", fileNames);
    return fileNames;
  } catch (error) {
    console.error("Error accessing bucket:", error);
  }
}
