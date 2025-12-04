/**
 * Content Protection Script
 * Prevents copying, printing, inspecting, screenshots, and view-source attempts
 * Include in every page: <script src="js/content-protection.js"></script>
 */

(function () {
    'use strict';

    // Prevent right-click context menu
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Prevent text selection and dragging
    ['selectstart', 'dragstart'].forEach(function (eventName) {
        document.addEventListener(eventName, function (e) {
            e.preventDefault();
        });
    });

    // Disable user-select via injected CSS
    document.addEventListener('DOMContentLoaded', function () {
        var style = document.createElement('style');
        style.textContent = '*{user-select:none !important;-webkit-user-select:none !important;-ms-user-select:none !important;}';
        document.head.appendChild(style);
    });

    // Block common keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        var key = e.key.toLowerCase();

        // Block Ctrl / Cmd combos
        if (e.ctrlKey || e.metaKey) {
            if (['c', 'x', 'v', 'a', 's', 'p', 'u'].includes(key)) {
                e.preventDefault();
                return false;
            }
        }

        // Block Print Screen (limited)
        if (key === 'printscreen') {
            navigator.clipboard.writeText('');
            alert('Screenshots are disabled on this page.');
            e.preventDefault();
            return false;
        }

        // Block F12 and DevTools shortcuts
        if (
            key === 'f12' ||
            (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
            (e.ctrlKey && key === 'u')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // Disable printing
    window.print = function () {
        alert('Printing is disabled on this page.');
        return false;
    };
    window.addEventListener('beforeprint', function (e) {
        alert('Printing is disabled on this page.');
        e.preventDefault();
        return false;
    });

    // Prevent copy events
    document.addEventListener('copy', function (e) {
        e.clipboardData.setData('text/plain', '');
        e.preventDefault();
        alert('Copying is disabled on this page.');
    });

    // Detect DevTools via viewport difference
    var devToolsOpen = false;
    setInterval(function () {
        if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                document.body.innerHTML =
                    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:1.2rem;color:#111;">' +
                    'Developer tools detected. Please close DevTools to continue.' +
                    '</div>';
            }
        } else {
            devToolsOpen = false;
        }
    }, 500);

    // Disable Ctrl + Mouse wheel zoom
    document.addEventListener(
        'wheel',
        function (e) {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        },
        { passive: false }
    );

    // Disable drag & drop
    ['dragover', 'drop'].forEach(function (eventName) {
        document.addEventListener(eventName, function (e) {
            e.preventDefault();
        });
    });

    // Disable image context menu & dragging
    function protectImages(root) {
        root.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
            img.setAttribute('draggable', 'false');
        });
    }
    protectImages(document);

    // Observe dynamic images
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1) {
                    if (node.matches('img') || node.querySelector('img')) {
                        protectImages(node.matches('img') ? node.parentNode : node);
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Console warning
    console.log('%cWarning', 'color: red; font-size: 40px; font-weight: bold;');
    console.log(
        '%cThis browser feature is intended for developers. Closing this console helps protect the content.',
        'color: red; font-size: 16px;'
    );
})();

