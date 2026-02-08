const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Handle root and home
    let filePath = '.' + req.url;
    
    // Default to index.html for root
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Add .html extension if no extension provided
    if (!path.extname(filePath)) {
        filePath += '.html';
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Try alternative paths
            let altPath = filePath;
            
            if (filePath === './auth.html') {
                altPath = './pages/auth.html';
            } else if (filePath === './cart.html') {
                altPath = './pages/cart.html';
            } else if (filePath === './products.html') {
                altPath = './pages/products.html';
            } else if (filePath === './about.html') {
                altPath = './pages/about.html';
            } else if (filePath === './contact.html') {
                altPath = './pages/contact.html';
            }
            
            fs.readFile(altPath, (altErr, altData) => {
                if (altErr) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - File Not Found</h1><p>The file you requested could not be found.</p>');
                    return;
                }
                
                // Determine content type
                const ext = path.extname(altPath).toLowerCase();
                let contentType = 'text/html';
                if (ext === '.css') contentType = 'text/css';
                else if (ext === '.js') contentType = 'application/javascript';
                else if (ext === '.json') contentType = 'application/json';
                else if (ext === '.png') contentType = 'image/png';
                else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
                else if (ext === '.gif') contentType = 'image/gif';
                else if (ext === '.svg') contentType = 'image/svg+xml';
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(altData);
            });
            return;
        }
        
        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'text/html';
        if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.json') contentType = 'application/json';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   Moksh Delights Server Running        ║
    ╠════════════════════════════════════════╣
    ║                                        ║
    ║   Open your browser and go to:        ║
    ║   http://localhost:${PORT}                  ║
    ║                                        ║
    ║   Press Ctrl+C to stop server         ║
    ║                                        ║
    ╚════════════════════════════════════════╝
    `);
});
