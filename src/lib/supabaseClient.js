import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohiarspehfssrstldmdv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaWFyc3BlaGZzc3JzdGxkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDkzMjUsImV4cCI6MjA4NDQyNTMyNX0.aEY4Ki2AKufBCTJndQBhqvpujA2wIgWR9DXC0b8pWIw';

export const supabase = createClient(supabaseUrl, supabaseKey);
