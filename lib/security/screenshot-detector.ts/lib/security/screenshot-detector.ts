export function initScreenshotDetection() {
  if (typeof window === 'undefined') return;

  // Detect PrintScreen key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      showScreenshotWarning();
      logSecurityEvent('screenshot_printscreen');
    }
  });

  // Detect Ctrl/Cmd+Shift+S
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      showScreenshotWarning();
      logSecurityEvent('screenshot_shortcut');
    }
  });

  // Block right-click on sensitive content
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-sensitive]')) {
      e.preventDefault();
      logSecurityEvent('context_menu_sensitive');
    }
  });
}

function showScreenshotWarning() {
  const existing = document.querySelector('.screenshot-warning');
  if (existing) return;

  const warning = document.createElement('div');
  warning.className = 'screenshot-warning';
  Object.assign(warning.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(220, 38, 38, 0.95)',
    color: 'white',
    padding: '24px 32px',
    borderRadius: '12px',
    zIndex: '999999',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  });
  warning.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 8px;">⚠️</div>
    <div>لا يُسمح بأخذ لقطات الشاشة!</div>
    <div style="font-size: 12px; margin-top: 8px; opacity: 0.85;">هذا الإجراء تم تسجيله</div>
  `;
  document.body.appendChild(warning);
  setTimeout(() => warning.remove(), 3000);
}

function logSecurityEvent(type: string) {
  fetch('/api/security/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
  }).catch(() => {});
}

export function addWatermark(userId: string) {
  if (typeof window === 'undefined') return;

  const watermark = document.createElement('div');
  Object.assign(watermark.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    background: 'rgba(0, 0, 0, 0.65)',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '11px',
    zIndex: '10000',
    pointerEvents: 'none',
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
  });
  watermark.textContent = `${userId} | ${new Date().toISOString().substring(0, 19)}`;
  document.body.appendChild(watermark);
}
