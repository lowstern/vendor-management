import express from 'express';
import { supabase } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get consultants for a company
router.get('/company/:companyId', authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;

    const { data: consultants, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('company_id', companyId)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ consultants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single consultant
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: consultant, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.json({ consultant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create consultant
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { data: consultant, error } = await supabase
      .from('consultants')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ consultant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update consultant (including OaaS fields)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: consultant, error } = await supabase
      .from('consultants')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.json({ consultant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

