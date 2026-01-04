import express from 'express';
import { supabase } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all companies for user's firm
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .eq('firm_id', req.user.firm_id)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ companies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single company
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .eq('firm_id', req.user.firm_id)
      .single();

    if (error || !company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get related data
    const [consultants, saasProducts, legalCases, documents] = await Promise.all([
      supabase.from('consultants').select('*').eq('company_id', id),
      supabase.from('saas_products').select('*').eq('company_id', id),
      supabase.from('legal_cases').select('*').eq('company_id', id),
      supabase.from('contract_documents').select('*').eq('company_id', id),
    ]);

    res.json({
      company: {
        ...company,
        consultants: consultants.data || [],
        saasProducts: saasProducts.data || [],
        legalCases: legalCases.data || [],
        documents: documents.data || [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create company
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, industry, description, logo_url, employees, headquarters } = req.body;

    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        firm_id: req.user.firm_id,
        name,
        industry,
        description,
        logo_url,
        employees: employees ? parseInt(employees) : null,
        headquarters,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update company
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: company, error } = await supabase
      .from('companies')
      .update(req.body)
      .eq('id', id)
      .eq('firm_id', req.user.firm_id)
      .select()
      .single();

    if (error || !company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

