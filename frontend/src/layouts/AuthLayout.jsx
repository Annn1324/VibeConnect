import '../components/auth/AuthShared.css';

export default function AuthLayout({ children, pageClassName = '', shellClassName = '' }) {
  const pageClassNames = ['auth-page', pageClassName].filter(Boolean).join(' ');
  const shellClassNames = ['auth-shell', shellClassName].filter(Boolean).join(' ');

  return (
    <div className={pageClassNames}>
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <div className={shellClassNames}>
        {children}
      </div>
    </div>
  );
}
