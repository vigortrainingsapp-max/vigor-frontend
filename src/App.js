import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import WeightForm from './components/WeightForm';
import WeightList from './components/WeightList';
import Dashboard from './components/Dashboard';
import Gallery from './components/Gallery';
import Login from './components/Login';
import TrainingDashboard from './components/TrainingDashboard';
import AddWorkout from './components/AddWorkout';
import Onboarding from './components/Onboarding';
import CaloriesCalculator from './components/CaloriesCalculator';
import MealTracker from './components/MealTracker';
import About from './components/About';
import { ToastContainer, toast } from 'react-toastify';
// Settings (Zahnrad) und X (Schließen) Icons hinzugefügt
import { LogOut, Dumbbell, User, Moon, Sun, Image as ImageIcon, Utensils, Info, Settings, X } from 'lucide-react'; 
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './components/LandingPage';

function App() {
  const { t, i18n } = useTranslation();
  
  const [weights, setWeights] = useState([]);
  const [sleepData, setSleepData] = useState([]); 
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState('body'); 
  const [showGallery, setShowGallery] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // <--- Neuer State für Einstellungen
  const [showOnboarding, setShowOnboarding] = useState(false); // Neuer State
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [existingOnboardingData, setExistingOnboardingData] = useState(null);
  const [showLandingPage, setShowLandingPage] = useState(!localStorage.getItem('token'));

  // --- 1. GLOBALE AXIOS KONFIGURATION (FIX FÜR 401 FEHLER) ---
  // Dieser Effekt sorgt dafür, dass JEDE Anfrage (auch aus Dashboard.js) den Token mitsendet.
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // --- 2. DATEN LADEN (FIX FÜR isLoggedIn FEHLER) ---
  useEffect(() => {
    if (token) {
      // Gewichts-Daten laden
      const fetchWeights = async () => {
        try {
          const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/weight');
          setWeights(res.data);
        } catch (err) { console.error(err); }
      };

      // Schlaf-Daten laden
      const fetchSleepData = async () => {
        try {
          const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/sleep');
          setSleepData(res.data);
        } catch (err) { console.error(err); }
      };

      // User-Daten für Onboarding laden
      const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const res = await axios.get(`https://vigor-backend-iznu.onrender.com/api/user/${userId}`);
            if (res.data && res.data.onboardingData) {
              setExistingOnboardingData(res.data.onboardingData);
            }
          } catch (err) {
            console.error("Fehler beim Laden der Profildaten", err);
          }
        }
      };

      fetchWeights();
      fetchSleepData();
      fetchUserData();
    }
  }, [token]); // HIER WURDE 'isLoggedIn' DURCH 'token' ERSETZT

  // --- ONBOARDING ABSCHLUSS ---
  const handleOnboardingComplete = async (data) => {
  try {
    const userId = localStorage.getItem('userId');
    // Sende die Daten an dein Backend
    const response = await axios.post('https://vigor-backend-iznu.onrender.com/api/user/onboarding', {
      userId,
      onboardingData: { ...data, isCompleted: true } // Markiere es als abgeschlossen
    });

    if (response.status === 200) {
      toast.success("Profil erfolgreich aktualisiert!");
      console.log("Daten in MongoDB gespeichert:", response.data.user.onboardingData);
      
      // Optional: Update den lokalen State, damit die App sofort die neuen Daten kennt
      // setUser(response.data.user); 
    }
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    toast.error("Fehler beim Speichern der Daten.");
  }
};

// Diese Funktion wird aufgerufen, wenn Login.js (Google oder Normal) Erfolg meldet
  // ✅ NEU (funktioniert):
const handleLogin = (userData) => {
  // Token setzen — das ist die "Einloggen"-Logik in deiner App
  const newToken = localStorage.getItem('token'); 
  setToken(newToken);
  
  // UserId für spätere API-Calls speichern
 if (userData?.id || userData?._id) {
  localStorage.setItem('userId', userData.id || userData._id);
}

  // Weiche: Onboarding oder direkt rein?
  if (userData?.isOnboardingCompleted) {
    setViewMode('body');
  } else {
    setShowOnboarding(true);
    toast.info("Willkommen! Bitte richte dein Profil ein.");
  }
};

  const handleLogout = () => {
    setToken(null);
    setWeights([]);
    setSleepData([]);
    localStorage.removeItem('token');
    setShowLandingPage(true); // WICHTIG: Zurück zur Landingpage beim Logout
  };
  

  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // --- EFFEKT FÜR DARK MODE ---
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f4f7f6';
  }, [isDarkMode]);

  // --- TOGGLE FUNKTION ---
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Styles abrufen
  const currentStyles = getStyles(isDarkMode);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Daten laden
  const fetchWeights = async () => {
    if (!token) return;
    try {
      const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/weight', {
        headers: { 'x-auth-token': token }
      });
      setWeights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSleepData = async () => {
    if (!token) return;
    try {
      const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/sleep', {
        headers: { 'x-auth-token': token }
      });
      setSleepData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWeights();
      fetchSleepData();
    }
  }, [token]);
  

  // Helper für Sprachbuttons (wird im Login und in Settings verwendet)
  const renderLangButtons = () => (
    <>
      {['de', 'en', 'es', 'fr', 'it'].map((lang) => (
        <button 
          key={lang}
          onClick={() => changeLanguage(lang)} 
          style={i18n.language === lang ? currentStyles.langBtnActive : currentStyles.langBtn}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </>
  );

  // --- SETTINGS MODAL KOMPONENTE (Inline) ---
  const SettingsModal = () => (
    <div style={currentStyles.modalOverlay}>
      <div style={currentStyles.modalCard}>
        <div style={currentStyles.modalHeader}>
          <h2 style={{margin: 0}}>Einstellungen</h2>
          <button onClick={() => setShowSettings(false)} style={currentStyles.closeBtn}>
            <X size={24} />
          </button>
        </div>

     
<div style={currentStyles.settingSection}>
  <h3 style={currentStyles.settingTitle}>Hilfe & Support</h3>
  <button 
    onClick={() => {
      setShowSettings(false); // Schließt die Einstellungen
      setShowOnboarding(true); // Startet Onboarding
    }} 
    style={currentStyles.themeSwitchBtn}
  >
    <Info size={20} style={{marginRight: '8px'}} />
    Tutorial erneut starten
  </button>
</div>
        


        <div style={currentStyles.settingSection}>
          <h3 style={currentStyles.settingTitle}>Sprache / Language</h3>
          <div style={currentStyles.langGroupSettings}>
            {renderLangButtons()}
          </div>
        </div>

        <div style={currentStyles.settingSection}>
          <h3 style={currentStyles.settingTitle}>Erscheinungsbild</h3>
          <div style={currentStyles.themeToggleRow}>
            <span>{isDarkMode ? "Dunkelmodus aktiv" : "Hellmodus aktiv"}</span>
            <button onClick={toggleTheme} style={currentStyles.themeSwitchBtn}>
              {isDarkMode ? <Sun size={20} style={{marginRight: '8px'}} /> : <Moon size={20} style={{marginRight: '8px'}} />}
              {isDarkMode ? "Zu Hell wechseln" : "Zu Dunkel wechseln"}
            </button>
          </div>
        </div>
        
        <div style={{marginTop: '20px', fontSize: '0.8rem', color: currentStyles.textMuted}}>
           Version 1.0.0
        </div>
      </div>
    </div>
  );

// --- CASE 1: Landing Page anzeigen ---
  if (showLandingPage && !token) {
    return (
      <LandingPage 
        isDarkMode={isDarkMode} 
        onStartApp={() => setShowLandingPage(false)} // Schaltet zum Login um
      />
    );
  }

  // --- CASE 2: Login Page anzeigen (Bestehender Code) ---
  if (!token) {
    return (
      <div style={currentStyles.loginPage}>
        {/* Optional: Ein "Zurück zur Startseite" Button im Login-Screen */}
        <button 
          onClick={() => setShowLandingPage(true)}
          style={{position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', zIndex: 10}}
        >
          ← Zur Startseite
        </button>

        <Login onLoginSuccess={handleLogin} />
        
        {/* ... dein restlicher Footer Code ... */}
      </div>
    );
  }

  // --- NICHT EINGELOGGT ---
  if (!token) {
    return (
      <div style={currentStyles.loginPage}>
        {/* Im Login Screen lassen wir die Sprachen direkt sichtbar für schnellen Zugriff */}
        <div style={currentStyles.langSwitchLogin}>
          {renderLangButtons()}
        </div>

        <Login onLoginSuccess={handleLogin} />
        
        <div style={currentStyles.loginFooter}>
          <button onClick={() => setShowAbout(true)} style={currentStyles.footerLink}>
            {t('imprint_privacy')} 
          </button>
          <p style={{ fontSize: '0.8rem', color: isDarkMode ? '#888' : '#999', marginTop: '5px' }}>
            © 2026 {t('app_title')}
          </p>
        </div>

        {showAbout && <About onClose={() => setShowAbout(false)} />}
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  // --- HAUPT APP ---
  return (
    <div style={currentStyles.container}>
      <header style={currentStyles.header}>
        <h1 style={currentStyles.logo}>{t('app_title')}</h1> 
        
        <div style={currentStyles.topActions}>
          {/* Settings Button ersetzt die einzelnen Buttons */}
          <button onClick={() => setShowSettings(true)} style={currentStyles.iconBtn} title="Einstellungen">
            <Settings size={24} />
          </button>

          <button onClick={() => setShowAbout(true)} style={currentStyles.infoBtn} title={t('info_tooltip')}>
            <Info size={24} />
          </button>
          <button onClick={() => setShowGallery(true)} style={currentStyles.galleryBtn} title={t('gallery_tooltip')}>
            <ImageIcon size={24} />
          </button>
          <button onClick={handleLogout} style={currentStyles.logoutBtn} title={t('logout_btn')}>
            <LogOut size={24} />
          </button>
        </div>

        <nav style={currentStyles.nav}>
          <button 
            style={viewMode === 'body' ? currentStyles.navBtnActive : currentStyles.navBtn} 
            onClick={() => setViewMode('body')}
          >
            <User size={20} /> {t('nav_body')}
          </button>
          <button 
            style={viewMode === 'training' ? currentStyles.navBtnActive : currentStyles.navBtn} 
            onClick={() => setViewMode('training')}
          >
            <Dumbbell size={20} /> {t('nav_training')}
          </button>
          <button 
            style={viewMode === 'nutrition' ? currentStyles.navBtnActive : currentStyles.navBtn} 
            onClick={() => setViewMode('nutrition')}
          >
            <Utensils size={20} /> {t('nav_food')}
          </button>
          <button 
            style={viewMode === 'sleep' ? currentStyles.navBtnActive : currentStyles.navBtn} 
            onClick={() => setViewMode('sleep')}
          >
            <Moon size={20} /> {t('nav_sleep')}
          </button>
        </nav>
      </header>

      <main style={currentStyles.main}>
        {showAbout ? (
          <About onClose={() => setShowAbout(false)} />
        ) : (
          <>
            {viewMode === 'body' && (
              <>
                <Dashboard 
                  weights={weights} 
                  sleepData={sleepData} 
                  mode="weight" 
                  isDarkMode={isDarkMode} 
                />
                <div style={currentStyles.contentGrid}>
                  <WeightForm onWeightAdded={fetchWeights} editData={editData} setEditData={setEditData} mode="body" />
                  <WeightList weights={weights} onEdit={setEditData} onDelete={fetchWeights} viewMode="body" />
                </div>
              </>
            )}

            {viewMode === 'training' && (
              <>
                <TrainingDashboard token={token} />
                <div style={{ marginTop: '30px' }}>
                  <AddWorkout onWorkoutAdded={() => {}} />
                </div>
              </>
            )}

            {viewMode === 'nutrition' && (
              <div style={currentStyles.nutritionContainer}>
                <div style={currentStyles.nutritionGrid}>
                  <div style={currentStyles.nutritionMain}>
                    <MealTracker />
                  </div>
                  <div style={currentStyles.nutritionSidebar}>
                    <CaloriesCalculator />
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'sleep' && (
              <div style={currentStyles.sleepPlaceholder}>
                <Dashboard 
                  weights={weights} 
                  sleepData={sleepData} 
                  mode="sleep" 
                  isDarkMode={isDarkMode} 
                />
                <div style={currentStyles.contentGrid}>
                  <WeightForm onWeightAdded={fetchSleepData} editData={editData} setEditData={setEditData} mode="sleep" />
                  <WeightList weights={sleepData} onEdit={setEditData} onDelete={fetchSleepData} viewMode="sleep" />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODALS */}
      {showGallery && <Gallery weights={weights} onClose={() => setShowGallery(false)} />}
      {showSettings && <SettingsModal />}
      {showOnboarding && (
  <Onboarding 
    onComplete={(data) => {
      handleOnboardingComplete(data); // Daten an die Speicher-Funktion übergeben
      setShowOnboarding(false);       // Danach Fenster schließen
    }} 
  />
)}
    </div>
  );
}

// --- DYNAMISCHE STYLES ---
const getStyles = (isDark) => {
  const colors = {
    bg: isDark ? '#121212' : '#f4f7f6',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#e0e0e0' : '#1a1a1a',
    textMuted: isDark ? '#a0a0a0' : '#666',
    border: isDark ? '#333' : '#ddd',
    navActiveBg: isDark ? '#ffffff' : '#1a1a1a',
    navActiveText: isDark ? '#000000' : '#ffffff',
    navBtnBg: isDark ? '#1e1e1e' : '#fff',
    shadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
    modalBg: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)'
  };

  return {
    // --- LOGIN ---
    loginPage: {
      minHeight: '100vh',
      backgroundColor: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative',
      color: colors.text
    },
    langSwitchLogin: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '5px'
    },
    loginFooter: {
      marginTop: '30px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    },
    footerLink: {
      background: 'none',
      border: 'none',
      color: colors.textMuted,
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500'
    },

    // --- BUTTONS ---
    langBtn: {
      background: 'none',
      border: '1px solid transparent',
      color: colors.textMuted,
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.8rem',
      padding: '6px 10px',
      borderRadius: '5px',
      transition: 'all 0.2s'
    },
    langBtnActive: {
      background: isDark ? '#333' : '#e0e0e0',
      border: `1px solid ${colors.border}`,
      color: colors.text,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      padding: '6px 10px',
      borderRadius: '5px',
      transition: 'all 0.2s'
    },

    // --- SETTINGS MODAL ---
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: colors.modalBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(3px)'
    },
    modalCard: {
      backgroundColor: colors.card,
      padding: '30px',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      color: colors.text,
      position: 'relative'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: '15px'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: colors.textMuted,
      cursor: 'pointer'
    },
    settingSection: {
      marginBottom: '25px'
    },
    settingTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '15px',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    langGroupSettings: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    themeToggleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa',
      padding: '15px',
      borderRadius: '10px'
    },
    themeSwitchBtn: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isDark ? '#444' : '#fff',
      border: `1px solid ${colors.border}`,
      padding: '8px 15px',
      borderRadius: '20px',
      cursor: 'pointer',
      color: colors.text,
      fontWeight: '500',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },

    // --- MAIN LAYOUT ---
    container: {
      minHeight: '100vh',
      backgroundColor: colors.bg,
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: colors.text
    },
    header: {
      backgroundColor: colors.card,
      padding: '20px',
      boxShadow: colors.shadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    },
    logo: {
      fontSize: '2.5rem',
      fontWeight: '900',
      color: colors.text,
      margin: 0,
      letterSpacing: '4px'
    },
    topActions: {
      position: 'absolute',
      right: '20px',
      top: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    // Icons im Header
    logoutBtn: { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' },
    galleryBtn: { background: 'none', border: 'none', color: colors.text, cursor: 'pointer' },
    infoBtn: { background: 'none', border: 'none', color: '#17a2b8', cursor: 'pointer' },
    iconBtn: { // Settings Icon
        background: 'none', 
        border: 'none', 
        color: colors.text, 
        cursor: 'pointer',
        display: 'flex', 
        alignItems: 'center'
    },
    nav: { 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '15px',
      padding: '0 10px',
      flexWrap: 'wrap'
    },
    navBtn: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      padding: '10px 20px', 
      borderRadius: '25px', 
      border: `1px solid ${colors.border}`, 
      backgroundColor: colors.navBtnBg, 
      cursor: 'pointer', 
      transition: 'all 0.3s',
      fontWeight: '600',
      color: colors.textMuted
    },
    navBtnActive: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      padding: '10px 20px', 
      borderRadius: '25px', 
      border: `1px solid ${colors.navActiveBg}`, 
      backgroundColor: colors.navActiveBg, 
      color: colors.navActiveText, 
      cursor: 'pointer', 
      transition: 'all 0.3s',
      fontWeight: '600'
    },
    main: { 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px' 
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '30px',
      marginTop: '30px'
    },
    nutritionContainer: { marginTop: '20px' },
    nutritionGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' },
    nutritionSidebar: { display: 'flex', flexDirection: 'column', gap: '30px' },
    nutritionMain: { },
    sleepPlaceholder: { 
      padding: '40px', 
      backgroundColor: colors.card, 
      borderRadius: '15px', 
      boxShadow: isDark ? '0 4px 6px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.05)'
    }
  };
};

export default App;
