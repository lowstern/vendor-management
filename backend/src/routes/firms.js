import express from 'express';
import { supabase } from '../server.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get firm settings
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data: firm, error } = await supabase
      .from('firms')
      .select('*')
      .eq('id', req.user.firm_id)
      .single();

    if (error || !firm) {
      return res.status(404).json({ error: 'Firm not found' });
    }

    res.json({ firm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update firm settings (admin only)
router.put('/me', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { data: firm, error } = await supabase
      .from('firms')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.firm_id)
      .select()
      .single();

    if (error || !firm) {
      return res.status(404).json({ error: 'Firm not found' });
    }

    res.json({ firm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

