import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [showQR, setShowQR] = useState(false);

  return (
    <footer style={{
      width: '100vw',
      left: 0,
      right: 0,
      position: 'relative',
      background: 'linear-gradient(90deg, #3e2723 0%, #795548 100%)',
      color: '#fff',
      textAlign: 'center',
      padding: '1.5rem 0',
      fontFamily: 'inherit',
      fontSize: '1rem',
      letterSpacing: '0.05em',
      boxShadow: '0 -2px 12px rgba(60,40,20,0.12)',
      marginTop: 'auto',
      marginLeft: 'calc(50% - 50vw)',
      marginRight: 'calc(50% - 50vw)',
    }}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
        <div style={{fontWeight: 600, fontSize: '1.1rem'}}>Photograph Web © {new Date().getFullYear()} by James Feng</div>
        <div style={{display: 'flex', gap: '1.2rem', justifyContent: 'center'}}>
          <a href="https://www.instagram.com/james_filmphotographer?igsh=bWt2MWh5dXVlcWhq&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{color: '#fff', opacity: 0.85}} aria-label="Instagram">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.1 0.9a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/></svg>
          </a>
          <a
            href="#"
            onMouseEnter={() => setShowQR(true)}
            onMouseLeave={() => setShowQR(false)}
            style={{color: '#fff', opacity: 0.85, position: 'relative'}}
            aria-label="Xiaohongshu"
          >
            <svg width="32" height="28" fill="currentColor" viewBox="0 0 32 28">
              <rect x="2" y="4" width="28" height="20" rx="8" fill="#F43F5E"/>
              <text x="16" y="18" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold">小红书</text>
            </svg>
            {showQR && (
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '-180%',
                transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.98)',
                borderRadius: '1rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                padding: '0.7rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <img src="/images/rednote.png" alt="小红书二维码" style={{width: '100px', height: '100px', objectFit: 'contain', borderRadius: '0.5rem'}} />
                <span style={{marginTop: '0.5rem', color: '#F43F5E', fontWeight: 600, fontSize: '0.95rem'}}>Scan</span>
              </div>
            )}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 