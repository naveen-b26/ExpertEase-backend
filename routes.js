const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

router.post('/waitlist', async (req, res) => {
  const { email } = req.body;
  console.log(email);

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format',
    });
  }

  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check Error:', checkError);
      return res.status(500).json({
        success: false,
        error: 'Database check error',
        details: checkError,
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{
        email: email,
        created_at: new Date().toISOString(),
      }])
      .select();

    if (insertError) {
      console.error('Insert Full Error:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to add email to waitlist',
        details: insertError,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Email added to waitlist',
      data,
    });

  } catch (error) {
    console.error('Catch Error:', error);
    res.status(500).json({
      success: false,
      error: 'Unexpected server error',
      details: error.message,
    });
  }
});

module.exports = router; 