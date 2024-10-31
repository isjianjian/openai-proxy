const OPENAI_API_HOST = "api.openai.com";

Deno.serve(async (request) => {
  const url = new URL(request.url);
  url.host = OPENAI_API_HOST;

  const newRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: "follow",
  });

  const response = await fetch(newRequest);
  
  // 检查响应是否支持流式传输
  if (response.body) {
    const { readable, writable } = new TransformStream();
    
    response.body.pipeTo(writable); // 将响应体传输到可写流
    return new Response(readable, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  } else {
    return response; // 如果没有流式数据，直接返回响应
  }
});
