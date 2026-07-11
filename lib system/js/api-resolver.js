// ZHI Library - Global API Resolver & Port Auto-Detector
(function() {
    const ports = [3000, 3001, 3002];
    let detectedBase = localStorage.getItem("detected_api_base") || "http://localhost:3000";
    
    // Set a global variable for immediate use
    window.API_BASE_URL = detectedBase;
    
    // Define a global promise that resolves once the port is checked
    window.API_RESOLVED_PROMISE = new Promise((resolve) => {
        if (window.location.protocol === "file:") {
            Promise.any(ports.map(port => {
                const base = `http://localhost:${port}`;
                return fetch(base + "/api/books?limit=1", { method: "HEAD", mode: "cors" })
                    .then(res => {
                        if (res.ok || res.status === 200 || res.status === 404 || res.status === 401) {
                            return base;
                        }
                        throw new Error("Port not active");
                    });
            }))
            .then(activeBase => {
                window.API_BASE_URL = activeBase;
                localStorage.setItem("detected_api_base", activeBase);
                console.log("ZHI Library API resolved at:", activeBase);
                resolve(activeBase);
            })
            .catch(err => {
                console.warn("ZHI Library API auto-detection failed, using fallback:", detectedBase);
                resolve(detectedBase);
            });
        } else {
            window.API_BASE_URL = "";
            resolve("");
        }
    });

    // Global fetch interceptor
    const ORIGINAL_FETCH = window.fetch;
    window.fetch = function(url, options) {
        const API_BASE_URL = window.API_BASE_URL || "";
        if (typeof url === "string" && url.startsWith("/api")) {
            url = API_BASE_URL + url;
        }
        return ORIGINAL_FETCH(url, options);
    };
})();
