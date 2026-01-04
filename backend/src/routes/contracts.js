import express from 'express';
import { supabase } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get contracts for a company
router.get('/company/:companyId', authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;

    const { data: contracts, error } = await supabase
      .from('contract_documents')
      .select('*')
      .eq('company_id', companyId)
      .order('uploaded_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ contracts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

