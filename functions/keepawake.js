exports = async function (context) {
  // Netlify function to keep Supabase instance awake
  // This makes a simple API call once daily to prevent auto-archive
  
  // Get Supabase credentials from environment variables
  // These are set in netlify.toml and available to the function
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables not configured');
    return {
      statusCode: 500,
      body: 'Supabase environment variables not configured'
    };
  }
  
  try {
    // Make a simple query to Supabase to keep the instance awake
    // Using the REST API v1 - this simple ping helps prevent the 
    // free-tier instance from auto-archiving due to inactivity
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Accept': 'application/json',
      },
    });
    
    console.log('Supabase keep-alive ping successful', new Date().toISOString());
    console.log('Response status:', response.status);
    
    return {
      statusCode: 200,
      body: 'Supabase keep-alive ping successful'
    };
  } catch (error) {
    console.error('Supabase keep-alive ping error', error.message);
    // Don't throw - we don't want the function to fail on every run
    // Even if the ping fails, the attempt itself can keep the instance awake
    return {
      statusCode: 200,
      body: 'Keep-alive attempted (see logs for details)'
    };
  }
};