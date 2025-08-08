import { supabase, checkDatabaseConnection } from './supabase';

export const testDatabaseConnection = async () => {
  console.log('Testing database connection...');
  
  try {
    const result = await checkDatabaseConnection();
    console.log('Database connection result:', result);
    
    if (result.connected) {
      console.log('✅ Database connected successfully!');
      return { success: true, message: 'Database connected' };
    } else {
      console.log('❌ Database connection failed:', result.error);
      return { success: false, message: result.error };
    }
  } catch (error) {
    console.error('❌ Database test error:', error);
    return { success: false, message: error.message };
  }
};

export const testSupabaseClient = () => {
  console.log('Supabase client status:');
  console.log('- URL:', supabase?.supabaseUrl);
  console.log('- Configured:', !!supabase);
  console.log('- Client created:', !!supabase?.from);
  
  return {
    url: supabase?.supabaseUrl,
    configured: !!supabase,
    clientCreated: !!supabase?.from
  };
};
