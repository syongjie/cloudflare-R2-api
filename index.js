
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 预检请求（CORS）
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 限定只支持 PUT 方法
    if (request.method !== 'PUT') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          'Allow': 'PUT',
          ...corsHeaders,
        },
      });
    }

    const url = new URL(request.url);
    const objectName = url.pathname.replace(/^\/+/, '');

    if (!objectName) {
      return new Response('File name is required', {
        status: 400,
        headers: corsHeaders,
      });
    }

    try {
      const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
      const body = request.body;

      console.log(`Uploading file: ${objectName} with Content-Type: ${contentType}`);
      console.log('ENV keys:', Object.keys(env));

      // 使用绑定名称（确保与绑定设置一致）
      await env["my-upoud-image"].put(objectName, body, {
        httpMetadata: { contentType },
      });

      return new Response('Upload successful', {
        status: 200,
        headers: corsHeaders,
      });

    } catch (err) {
      console.error('R2 upload failed:', err);

      return new Response(`Internal Server Error: ${err.message || err}`, {
        status: 500,
        headers: corsHeaders,
      });
    }
  }
};