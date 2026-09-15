import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://ctrl-love-instruments.ctrl-love-4138.chatgpt.site";
const HOME = "https://www.ctrlpluslove.com/";

function navigationFix() {
  return `<script>(function(){
    var HOME=${JSON.stringify(HOME)};
    function isHomeLink(a){
      if(!a) return false;
      var raw=a.getAttribute('href')||'';
      if(raw==='/'||raw===''||raw==='https://ctrlpluslove.com/'||raw==='https://www.ctrlpluslove.com/'||raw==='https://ctrl-love-instruments.ctrl-love-4138.chatgpt.site/' ) return true;
      var text=(a.textContent||'').toLowerCase();
      return text.includes('back to')||text.includes('mothership')||text.trim()==='ctrl+love'||text.trim()==='ctrlpluslove.com';
    }
    document.addEventListener('click',function(e){
      var target=e.target instanceof Element?e.target.closest('a'):null;
      if(isHomeLink(target)){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        window.location.href=HOME;
      }
    },true);
    function patch(){
      document.querySelectorAll('a').forEach(function(a){if(isHomeLink(a))a.setAttribute('href',HOME);});
    }
    patch();
    new MutationObserver(patch).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
  })();</script>`;
}

async function proxy(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await context.params;
  const suffix = path.length ? `/${path.join('/')}` : '/';
  const upstreamUrl = new URL(suffix, UPSTREAM);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);
  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers.set('user-agent', userAgent);

  const upstream = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    redirect: 'follow',
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') || '';

  if (contentType.includes('text/html')) {
    let html = await upstream.text();
    const fix = navigationFix();
    html = html.includes('</body>') ? html.replace('</body>', `${fix}</body>`) : `${html}${fix}`;
    return new NextResponse(html, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
        'cache-control': 'no-store',
      },
    });
  }

  const body = await upstream.arrayBuffer();
  const responseHeaders = new Headers();
  if (contentType) responseHeaders.set('content-type', contentType);
  const cacheControl = upstream.headers.get('cache-control');
  if (cacheControl) responseHeaders.set('cache-control', cacheControl);

  return new NextResponse(body, { status: upstream.status, headers: responseHeaders });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, context);
}

export async function HEAD(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, context);
}
