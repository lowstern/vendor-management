import express from 'express';
import multer from 'multer';
import { supabase } from '../server.js';
import { fileProcessingQueue } from '../jobs/queues.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExt = '.' + file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${fileExt} not allowed. Allowed: ${allowedTypes.join(', ')}`), false);
    }
  },
});

// Upload file to Supabase Storage
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { companyId, consultantId, legalCaseId, type, vendorName, contractDate, expirationDate, monthlyCost, notes } = req.body;
    const userId = req.user.id;

    // Generate unique file name
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `contracts/${companyId || 'general'}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(process.env.STORAGE_BUCKET || 'vendor-documents')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(process.env.STORAGE_BUCKET || 'vendor-documents')
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { data: document, error: dbError } = await supabase
      .from('contract_documents')
      .insert({
        company_id: companyId || null,
        consultant_id: consultantId || null,
        legal_case_id: legalCaseId || null,
        name: req.file.originalname,
        type: type || 'contract',
        file_url: urlData.publicUrl,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        uploaded_by: userId,
        vendor_name: vendorName,
        contract_date: contractDate || null,
        expiration_date: expirationDate || null,
        monthly_cost: monthlyCost ? parseFloat(monthlyCost) : null,
        notes: notes || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save file metadata' });
    }

    // Queue file for processing
    await fileProcessingQueue.add('process-file', {
      fileId: document.id,
      fileUrl: urlData.publicUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });

    res.json({
      success: true,
      document,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Get file
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: document, error } = await supabase
      .from('contract_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !document) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List files for a company
router.get('/company/:companyId', authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;

    const { data: documents, error } = await supabase
      .from('contract_documents')
      .select('*')
      .eq('company_id', companyId)
      .order('uploaded_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get file info
    const { data: document, error: fetchError } = await supabase
      .from('contract_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !document) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check permissions (user must be admin or owner)
    if (req.user.role !== 'admin' && document.uploaded_by !== userId) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Delete from storage
    const filePath = document.file_url.split('/').pop();
    await supabase.storage
      .from(process.env.STORAGE_BUCKET || 'vendor-documents')
      .remove([filePath]);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('contract_documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

