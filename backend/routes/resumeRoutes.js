const express = require('express');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const { analyzeResume } = require('../services/resumeAnalysis');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 1, fieldSize: 10000 } }).single('resume');
router.post('/', (req, res) => {
  upload(req, res, async error => {
    if (error) return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Choose a PDF smaller than 5 MB.' : 'Upload one PDF and try again.' });
    const file = req.file;
    if (!file || !/\.pdf$/i.test(file.originalname) || !file.buffer.subarray(0, 1024).includes(Buffer.from('%PDF-'))) return res.status(400).json({ message: 'Choose a valid PDF resume.' });
    let skills;
    try {
      skills = JSON.parse(req.body.skills || '[]');
      if (!Array.isArray(skills) || skills.length > 100 || skills.some(skill => typeof skill !== 'string' || skill.length > 100)) throw new Error('Invalid skills');
    } catch { return res.status(400).json({ message: 'The profile skills could not be read. Refresh and try again.' }); }
    let parser;
    try {
      parser = new PDFParse({ data: new Uint8Array(file.buffer), isEvalSupported: false });
      const info = await parser.getInfo();
      if (info.total > 10) return res.status(400).json({ message: 'Choose a resume with 10 pages or fewer.' });
      const result = await parser.getText();
      const text = result.pages.map(page => page.text).join('\n');
      if (text.trim().length < 40) return res.status(422).json({ message: 'Not enough readable text was found. Use a text-based PDF exported from Word or Google Docs; scanned images are not supported yet.' });
      return res.json({ fileName: file.originalname, pages: info.total, ...analyzeResume(text, skills) });
    } catch {
      return res.status(422).json({ message: 'This PDF could not be read. Try a PDF that is not password-protected, or export it again.' });
    } finally {
      if (parser) await parser.destroy().catch(() => {});
    }
  });
});
module.exports = router;
