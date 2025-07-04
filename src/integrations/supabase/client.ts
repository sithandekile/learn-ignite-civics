// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kvemuzptsyfhtqouroto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2ZW11enB0c3lmaHRxb3Vyb3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjcyNjYsImV4cCI6MjA2NzA0MzI2Nn0.pouQrXNbr58Icx5GXM5O7dC6s3D69jeDl9X7Y9ySz6Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});