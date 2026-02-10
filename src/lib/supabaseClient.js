import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtiaqyrroguvymtmiads.supabase.co'
const supabaseAnonKey = 'sb_publishable_uZiFpFKOF0kZPo70keokQQ_dL49OGvC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
