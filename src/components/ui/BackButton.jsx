import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

export default function BackButton({
  text = 'Kembali',
  className = '',
  onClick,
  fallback = '/',
  admin = false,
  ariaLabel = 'Kembali',
  style = {},
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      try {
        onClick(e);
      } catch (err) {
        // swallow user handler errors but continue navigation
        // eslint-disable-next-line no-console
        console.error('BackButton onClick handler error', err);
      }
    }

    // Prevent infinite back navigation: if there is no meaningful history, go to safe fallback
    try {
      const hasHistory = typeof window !== 'undefined' && window.history && window.history.length > 1;
      if (hasHistory) {
        navigate(-1);
      } else {
        navigate(admin ? '/admin' : fallback);
      }
    } catch (err) {
      // fallback navigation if anything fails
      navigate(admin ? '/admin' : fallback);
    }
  };

  return (
    <button
      type="button"
      className={`back-button ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      style={style}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="back-button-text">{text}</span>
    </button>
  );
}
