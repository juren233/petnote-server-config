/**
 * PetNote 官方服务器配置同步端点
 *
 * 功能：为 PetNote App 提供官方服务器地址的动态配置
 *
 * 更新服务器地址步骤：
 * 1. 修改 wrangler.toml 中的 OFFICIAL_SERVER_URL
 * 2. git commit && git push
 * 3. GitHub Actions 自动部署（约 30 秒）
 * 4. 全球 CDN 缓存刷新（1-5 分钟）
 * 5. 用户下次启动 App 自动获取新地址
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // 仅允许 GET 请求
    if (request.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method Not Allowed' }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }
      );
    }

    // 构建配置响应
    const config = {
      server_url: env.OFFICIAL_SERVER_URL || 'wss://petnote.juren233.top/ws',
      updated_at: new Date().toISOString(),
      version: '1.0.0',
    };

    return new Response(JSON.stringify(config, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=300', // CDN 缓存 5 分钟
      },
    });
  },
};
