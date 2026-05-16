import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock, Info, Send, KeyRound, ArrowLeft } from 'lucide-react';
// NEU: Import für den Google Button
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onLoginSuccess }) => {
  // UI States: 'login' | 'register' | 'forgot_request' | 'forgot_submit'
  const [viewState, setViewState] = useState('login'); 
  
  // Formular Felder
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  
  // UI Helfer
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- NORMALE ANMELDUNG / REGISTRIERUNG ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = viewState === 'register' ? 'register' : 'login';
    
    try {
      const payload = { email, password };
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      
      if (viewState === 'register') {
        toast.info("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
        setViewState('login');
      } else {
        localStorage.setItem('token', res.data.token);
        toast.success("Erfolgreich eingeloggt!");
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Ein Fehler ist aufgetreten.");
    }
  };

  // --- NEU: GOOGLE LOGIN HANDLER ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      // Wir senden den Google-Token an unser Backend zur Verifizierung
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });

      // Backend antwortet mit unserem eigenen JWT Token
      localStorage.setItem('token', res.data.token);
      toast.success("Mit Google angemeldet!");
      onLoginSuccess(res.data.user);
      
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error("Google Anmeldung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  // --- PASSWORT VERGESSEN LOGIK (Unverändert) ---
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password-request', { email });
      setViewState('forgot_submit');
      toast.success("Code gesendet! Bitte E-Mail prüfen.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Fehler beim Senden.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password-submit', { 
        email, code: resetCode, newPassword 
      });
      toast.success("Passwort geändert! Bitte einloggen.");
      setViewState('login');
      setPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Fehler beim Ändern.");
    }
  };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* HEADER */}
        <div style={styles.header}>
          {viewState === 'login' && <LogIn size={40} color="#007bff" />}
          {viewState === 'register' && <UserPlus size={40} color="#28a745" />}
          {(viewState === 'forgot_request' || viewState === 'forgot_submit') && <KeyRound size={40} color="#ffc107" />}
          
          <h2 style={styles.title}>
            {viewState === 'login' && 'Willkommen zurück'}
            {viewState === 'register' && 'Konto erstellen'}
            {(viewState === 'forgot_request' || viewState === 'forgot_submit') && 'Passwort wiederherstellen'}
          </h2>
          <p style={styles.subtitle}>
            {viewState === 'login' && 'Bitte melde dich an, um fortzufahren.'}
            {viewState === 'register' && 'Starte deine Reise mit uns.'}
            {viewState === 'forgot_request' && 'Wir senden dir einen Code zu.'}
            {viewState === 'forgot_submit' && 'Gib den Code und dein neues Passwort ein.'}
          </p>
        </div>

        {/* FORMS (Login & Register) */}
        {(viewState === 'login' || viewState === 'register') && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.iconLeft} />
              <input 
                style={styles.input} 
                type="email" 
                placeholder="E-Mail Adresse" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.iconLeft} />
              <input 
                style={styles.input} 
                type={showPassword ? "text" : "password"} 
                placeholder="Passwort" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit" style={styles.btn}>
              {viewState === 'login' ? 'Einloggen' : 'Registrieren'}
              <Send size={18} />
            </button>
            
            {/* --- NEU: GOOGLE LOGIN BEREICH --- */}
            <div style={styles.divider}>
              <span style={styles.dividerText}>oder</span>
            </div>
            
            <div style={styles.googleWrapper}>
               <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Anmeldung fehlgeschlagen")}
                  theme="filled_blue"
                  shape="pill"
                  text={viewState === 'login' ? 'signin_with' : 'signup_with'}
                 width="360"
               />
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORMS (Unverändert) */}
        {viewState === 'forgot_request' && (
          <form onSubmit={handleForgotRequest} style={styles.form}>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.iconLeft} />
              <input style={styles.input} type="email" placeholder="Deine E-Mail" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" style={styles.btn}>Code senden</button>
            <button type="button" onClick={() => setViewState('login')} style={{...styles.btn, background: '#6c757d'}}>Zurück</button>
          </form>
        )}

        {viewState === 'forgot_submit' && (
          <form onSubmit={handleForgotSubmit} style={styles.form}>
            <div style={styles.infoBox}><Info size={16}/><span>Code an <b>{email}</b> gesendet.</span></div>
            <div style={styles.inputWrapper}>
              <KeyRound size={20} style={styles.iconLeft} />
              <input style={styles.input} type="text" placeholder="6-stelliger Code" value={resetCode} onChange={e => setResetCode(e.target.value)} required />
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.iconLeft} />
              <input style={styles.input} type="password" placeholder="Neues Passwort" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <button type="submit" style={styles.btn}>Passwort ändern</button>
          </form>
        )}

        {/* FOOTER LINKS */}
        <div style={styles.footerLinks}>
          {viewState === 'login' && (
            <>
              <span onClick={() => setViewState('forgot_request')} style={styles.forgotLink}>Passwort vergessen?</span>
              <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                Neu hier? <span onClick={() => setViewState('register')} style={styles.switchText}>Konto erstellen</span>
              </div>
            </>
          )}
          
          {viewState === 'register' && (
             <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
               Bereits registriert? <span onClick={() => setViewState('login')} style={styles.switchText}>Zum Login</span>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Styles
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f0f2f5', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  header: { marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  title: { margin: '0', fontSize: '1.8rem', color: '#333' },
  subtitle: { margin: '0', fontSize: '0.95rem', color: '#666' },
  infoBox: { display: 'flex', alignItems: 'center', gap: '8px', background: '#e7f1ff', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#0056b3', marginBottom: '15px', textAlign: 'left' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  iconLeft: { position: 'absolute', left: '12px', color: '#999' },
  input: { width: '100%', padding: '12px 40px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center', padding: 0 },
  btn: { padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontSize: '1rem' },
  
  // Footer Links Styles
  footerLinks: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  switchText: { fontSize: '0.9rem', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' },
  forgotLink: { fontSize: '0.9rem', color: '#6c757d', cursor: 'pointer' },

  // --- NEUE STYLES FÜR GOOGLE ---
  divider: { display: 'flex', alignItems: 'center', margin: '15px 0' },
  dividerText: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: '0.85rem', 
    color: '#999', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '10px',
    // Kleiner CSS-Hack für Linien links und rechts (funktioniert in JS-Styles oft nur bedingt, daher hier vereinfacht oder als CSS-Klasse besser. 
    // Aber für Inline-Styles ist dies eine einfache Variante:)
  },
  googleWrapper: { display: 'flex', justifyContent: 'center', width: '100%' }
};

export default Login;