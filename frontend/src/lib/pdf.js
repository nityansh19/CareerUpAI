export async function extractPdf(file) {
  if (file.size > 5 * 1024 * 1024)
    throw new Error("Choose a PDF smaller than 5 MB.");
  if (!/\.pdf$/i.test(file.name)) throw new Error("Choose a PDF file.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!new TextDecoder().decode(bytes.slice(0, 1024)).includes("%PDF-"))
    throw new Error("This file is not a valid PDF.");
  const pdfjs = await import("pdfjs-dist");
  const { default: workerUrl } =
    await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const task = pdfjs.getDocument({ data: bytes, isEvalSupported: false });
  try {
    const doc = await task.promise;
    if (doc.numPages > 10)
      throw new Error("Choose a resume with 10 pages or fewer.");
    let text = "";
    for (let page = 1; page <= doc.numPages; page++) {
      const content = await (await doc.getPage(page)).getTextContent();
      text +=
        content.items
          .map((item) => item.str + (item.hasEOL ? "\n" : " "))
          .join("") + "\n";
    }
    if (text.trim().length < 80)
      throw new Error(
        "This PDF has too little readable text. Export a text-based PDF or use Paste text. Scanned PDFs need OCR.",
      );
    return { text, pages: doc.numPages };
  } catch (error) {
    if (error.name === "PasswordException")
      throw new Error("Choose a PDF without password protection.", {
        cause: error,
      });
    throw error;
  } finally {
    await task.destroy();
  }
}
