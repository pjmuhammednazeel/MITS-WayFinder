import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohiarspehfssrstldmdv.supabase.co';
const supabaseKey = 'sb_publishable_jASBHig6-DQ4v8NymDmuVw_vV0LUzW0';

export const supabase = createClient(supabaseUrl, supabaseKey);
