/**
 * Cloudflare Worker for OpenAI ChatKit Session Generation
 *
 * This worker securely generates session tokens for the ChatKit widget
 * without exposing your OpenAI API key to the client.
 *
 * Uses direct API call to ChatKit Sessions endpoint since the SDK doesn't
 * include this endpoint yet.
 *
 * Security features:
 * - CORS protection
 * - Request validation
 * - Error handling
 */

export default {
  async fetch(request, env) {
    // CORS configuration
    const allowedOrigins = [
      'https://digitalhealthcrc.github.io/SynD-DGF',
      'https://digitalhealthcrc.github.io', // Fallback for root domain
      'http://localhost:8000',
      'http://127.0.0.1:8000'
    ];

    const origin = request.headers.get('Origin');
    const isAllowed = allowedOrigins.some(allowed => origin?.startsWith(allowed));

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Method not allowed',
        message: 'Only POST requests are accepted'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    try {
      // Validate environment variables
      if (!env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }
      if (!env.CHATKIT_WORKFLOW_ID) {
        throw new Error('CHATKIT_WORKFLOW_ID not configured');
      }

      // Call OpenAI ChatKit Sessions API directly
      // Reference: https://openai.github.io/chatkit-js/guides/authentication/
      const sessionResponse = await fetch('https://api.openai.com/v1/chatkit/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'chatkit_beta=v1'
        },
        body: JSON.stringify({
          user: 'anonymous',
          workflow: {
            id: env.CHATKIT_WORKFLOW_ID
          }
        })
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({}));
        console.error('OpenAI API error:', sessionResponse.status, errorData);
        throw new Error(`OpenAI API returned ${sessionResponse.status}: ${JSON.stringify(errorData)}`);
      }

      const session = await sessionResponse.json();

      // Return client secret for ChatKit widget
      return new Response(JSON.stringify({
        client_secret: session.client_secret
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Error creating ChatKit session:', error);

      // Return error response
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to create chat session. Please try again later.',
        details: env.DEBUG === 'true' ? error.message : undefined
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};
