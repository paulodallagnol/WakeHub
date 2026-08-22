// Service Worker mínimo, necessário para o navegador considerar
// o site "instalável" como PWA (ícone próprio + tela cheia).

const CACHE_NAME = "wakehub-v1";

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    self.clients.claim();
});

// Passa as requisições direto. Só intercepta recursos do próprio site
// (mesma origem) - CDNs externos (como a biblioteca MQTT) são deixados
// para o navegador tratar normalmente, evitando travar o carregamento.
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) {
        return; // não intercepta - deixa o navegador buscar normalmente
    }

    event.respondWith(
        fetch(event.request).catch(() =>
            caches.match(event.request).then((res) => res || Response.error())
        )
    );
});
