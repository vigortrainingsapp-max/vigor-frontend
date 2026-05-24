import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, Users, ShieldQuestion, ChevronDown, ChevronUp, 
  ArrowRight, CheckCircle, BarChart2, Calendar, Mail, Zap, X, GitBranch, Map, Clock, CheckSquare
} from 'lucide-react';
import aboutImage from '../images/team.jpg';
import Legal from './Legal';          
import PrivacyPolicy from './PrivacyPolicy'; 
import Terms from './Terms';
import dashboardMockup from '../images/Handy.png';
import { useTranslation } from 'react-i18next';

const LandingPage = ({ onStartApp, isDarkMode }) => {
  const { t, i18n } = useTranslation();
  const [userCount, setUserCount] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

const testimonials = [
  {
    name: "Jonas M.",
    role: "Hobbyathlet",
    text: "Endlich eine App, die alles in einem hat! Ich tracke mein Gewicht, meine Mahlzeiten und meinen Schlaf – alles kostenlos. Absolut empfehlenswert!",
    stars: 5
  },
  {
    name: "Laura K.",
    role: "Fitness-Anfängerin",
    text: "Super übersichtlich und einfach zu bedienen. Ich habe viele Apps ausprobiert, aber VIGOR ist die erste, bei der ich wirklich drangeblieben bin.",
    stars: 5
  },
  {
    name: "Markus T.",
    role: "Kraftsportler",
    text: "Die Körpermaß-Tracking Funktion ist genau was ich gesucht habe. Man sieht seinen Fortschritt über Zeit – das motiviert enorm!",
    stars: 5
  }
];

useEffect(() => {
  const interval = setInterval(() => {
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
  }, 4000);
  return () => clearInterval(interval);
}, []);
  
  const [overlayView, setOverlayView] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  // Styles abrufen
  const styles = getLandingStyles(isDarkMode);

  // --- CSS für Animationen und Hover-Effekte ---
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }

    /* Feature Cards: Hochfahren & Leuchten */
    .feature-card {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 123, 255, 0.2) !important; 
      border-color: #007bff !important;
    }

    /* Buttons: Leichtes Pulsieren beim Drüberfahren */
    .interactive-btn {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .interactive-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
    }
    .interactive-btn:active {
      transform: scale(0.95);
    }

    /* FAQ Items: Heller werden */
    .faq-item {
      transition: background-color 0.3s ease;
    }
    .faq-item:hover {
      background-color: ${isDarkMode ? '#252525' : '#f0f4f8'} !important;
    }
    
    /* Links im Footer */
    .footer-link:hover {
      color: #007bff !important;
    }
  `;
  document.head.appendChild(styleSheet);
  
  // Nutzerzahlen laden (Echt vom Backend)
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/stats/count');
        setUserCount(res.data.count);
      } catch (err) {
        console.error("Konnte Nutzerzahlen nicht laden", err);
        setUserCount(124); 
      }
    };
    fetchUserCount();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

// In LandingPage.js, nach der toggleFaq-Funktion (ca. Zeile 89), vor dem return:

const features = [
  {
    icon: <BarChart2 />,
    title: t('landing.feat_analysis_title'),
    desc: t('landing.feat_analysis_desc'),
  },
  {
    icon: <Activity />,
    title: t('landing.feat_food_title'),
    desc: t('landing.feat_food_desc'),
  },
  {
    icon: <Calendar />,
    title: t('landing.feat_training_title'),
    desc: t('landing.feat_training_desc'),
  },
  {
    icon: <Zap />,
    title: t('landing.feat_sleep_title'),
    desc: t('landing.feat_sleep_desc'),
  },
];

  return (
    <div style={styles.container}>

        
      
      {/* --- HEADER / NAV --- */}
      <header style={styles.header}>
        <div style={styles.logo}>VIGOR<span style={{color: '#007bff'}}>.APP</span></div>

        {/* NEU: Sprachwahl */}
  <div style={{ display: 'flex', gap: '15px', marginRight: 'auto', marginLeft: '40px' }}>
      <button onClick={() => changeLanguage('de')} style={styles.langBtn}>DE</button>
      <button onClick={() => changeLanguage('en')} style={styles.langBtn}>EN</button>
      <button onClick={() => changeLanguage('es')} style={styles.langBtn}>ES</button>
      <button onClick={() => changeLanguage('fr')} style={styles.langBtn}>FR</button>
      <button onClick={() => changeLanguage('it')} style={styles.langBtn}>IT</button>
  </div>
  <button onClick={onStartApp} style={styles.loginBtn}>
    {/* TEXT ERSETZEN: */}
    {t('landing.login_btn')} <ArrowRight size={16} style={{marginLeft: 5}}/>
  </button>
</header>

    {/* --- HERO SECTION --- */}
      <header style={styles.heroSection}>
        {/* Linke Seite: Text */}
        <div style={styles.heroContent}>
          
          <h1 style={styles.heroTitle}>
            {t('landing.hero_title')} <br />
            <span style={styles.heroTitleAccent}>{t('landing.hero_title_accent')}</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            {t('landing.hero_subtitle')}
          </p>
          
          <div style={styles.buttonGroup}>
            <button onClick={onStartApp} style={styles.secondaryBtn}>
               {t('landing.start_btn')}
            </button>
          </div>

          <div style={styles.userCountBadge}>
            <Users size={16} color="#28a745" />
            <span>{t('landing.active_users', { count: userCount })}</span>
          </div>
        </div>
        
        {/* Rechte Seite: Handy Bild (Wieder eingefügt) */}
        <div style={styles.heroImageWrapper}>
           {/* Optionaler Hintergrund-Schein/Kreis */}
           <div style={styles.heroBackgroundCircle}></div>
           <img 
             src={dashboardMockup} 
             alt="App Dashboard" 
             style={styles.heroImage} 
           />
        </div>
      </header>


      {/* --- FEATURES SECTION --- */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t('landing.features_title')}</h2>
          <p style={styles.sectionSubtitle}>{t('')}</p>
        </div>

        <div style={styles.featuresGrid}>
          {features.map((feature, index) => {
            // Prüfen, ob DIESE Karte gerade gehovert wird
            const isHovered = hoveredFeature === index;

            return (
              <div 
                key={index}
                style={{
                  ...styles.featureCard,
                  // Dynamische Styles bei Hover:
                  transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
                  boxShadow: isHovered 
                    ? (isDarkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0, 123, 255, 0.15)') 
                    : 'none',
                  borderColor: isHovered ? '#007bff' : (isDarkMode ? '#333' : '#eaeaea')
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Icon mit Hintergrundfarbe */}
                <div style={{
                  ...styles.featureIconBox,
                  backgroundColor: isDarkMode ? 'rgba(0, 123, 255, 0.1)' : '#eef7ff',
                  transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)', // Icon wackelt leicht
                }}>
                  {/* Wir klonen das Icon, um Farbe/Größe zu erzwingen, falls nötig */}
                  {React.cloneElement(feature.icon, { 
                    size: 30, 
                    color: '#007bff' 
                  })}
                </div>

                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
      {/* --- ABOUT SECTION --- */}
      <section style={{...styles.section, backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa'}}>
        <div style={styles.aboutContainer}>
          <div style={styles.aboutImageWrapper}>
            <img src={aboutImage} alt="Founder" style={styles.aboutImage} />
           <div style={{
  marginTop: '15px',
  textAlign: 'center'
}}>
  <div style={{
    fontSize: '1.1rem',
    fontWeight: '700',
    color: isDarkMode ? '#fff' : '#1a1a1a'
  }}>
    Maurice Angel Baugan
  </div>
  <div style={{
    fontSize: '0.85rem',
    color: isDarkMode ? '#aaa' : '#666',
    marginTop: '4px',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  }}>
    {t('landing.founder_role')}
  </div>
</div>
          </div>
          
          <div style={styles.aboutContent}>
            <h2 style={{...styles.sectionTitle, textAlign: 'left', marginBottom: '20px'}}>{t('landing.about_title')}</h2>
            <p style={styles.aboutText}>
              {t('landing.about_text')}
            </p>

            {/* HIER KOMMT DANN DEINE BEREITS EINGEFÜGTE CHECKLISTE */}
            {/* ... <div style={styles.checkList}> ... */} 
          </div>
        </div>
      </section>


      {/* --- PRICING SECTION --- */}
      <section style={styles.section}>
        <div style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px auto'}}>
          <h2 style={styles.sectionTitle}>{t('landing.pricing_title')}</h2>
          <p style={styles.heroSubtitle}>
            {t('landing.pricing_subtitle')}
          </p>
        </div>

        <div style={styles.pricingGrid}>
          {/* Card 1: Der "Vergleich" */}
          <div style={{...styles.pricingCard, opacity: 0.7, transform: 'scale(0.95)'}}>
            <h3 style={styles.pricingTitle}>{t('landing.pricing_other_apps')}</h3>
            <div style={styles.priceTag}>9,99€ <span style={{fontSize: '1rem', fontWeight: 'normal'}}>{t('landing.pricing_per_month')}</span></div>
            <ul style={styles.pricingList}>
              <li style={styles.pricingItem}><CheckCircle size={18} color="#28a745" /> {t('landing.pricing_feat_standard')}</li>
              <li style={styles.pricingItem}><X size={18} color="#dc3545" /> {t('landing.pricing_feat_paywall')}</li>
              <li style={styles.pricingItem}><X size={18} color="#dc3545" /> {t('landing.pricing_feat_ads')}</li>
              <li style={styles.pricingItem}><X size={18} color="#dc3545" /> {t('landing.pricing_feat_data')}</li>
            </ul>
          </div>

          {/* Card 2: Dein Angebot */}
          <div style={{...styles.pricingCard, border: '2px solid #007bff', position: 'relative', overflow: 'hidden'}}>
            <div style={styles.pricingBadge}>{t('landing.pricing_badge')}</div>
            
            <div style={{marginBottom: '20px'}}>
               <Zap size={40} color="#007bff" style={{marginBottom: '10px'}}/>
               <h3 style={styles.pricingTitle}>{t('landing.pricing_vigor_full')}</h3>
            </div>
            
            <div style={{...styles.priceTag, color: '#007bff'}}>{t('landing.pricing_free')} <span style={{fontSize: '1rem', fontWeight: 'normal', color: isDarkMode ? '#ccc' : '#555'}}>{t('landing.pricing_forever')}</span></div>
            <p style={{marginBottom: '20px', fontSize: '0.9rem', color: isDarkMode ? '#aaa' : '#666'}}>{t('landing.pricing_all_in_one')}</p>

            <ul style={styles.pricingList}>
              <li style={styles.pricingItem}><CheckCircle size={18} color="#007bff" /> <strong>{t('landing.pricing_vigor_feat_1')}</strong></li>
              <li style={styles.pricingItem}><CheckCircle size={18} color="#007bff" /> {t('landing.pricing_vigor_feat_2')}</li>
              <li style={styles.pricingItem}><CheckCircle size={18} color="#007bff" /> {t('landing.pricing_vigor_feat_3')}</li>
              <li style={styles.pricingItem}><CheckCircle size={18} color="#007bff" /> {t('landing.pricing_vigor_feat_4')}</li>
            </ul>

            <button onClick={onStartApp} style={{...styles.ctaBtn, width: '100%', marginTop: '20px', padding: '12px'}}>
              {t('landing.pricing_cta_btn')}
            </button>
          </div>
        </div>
      </section>


      {/* --- ROADMAP & CHANGELOG --- */}
      <section style={{...styles.section, backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa'}}>
        <div style={{textAlign: 'center', marginBottom: '50px'}}>
          <h2 style={styles.sectionTitle}>{t('landing.roadmap_title')}</h2>
          <p style={styles.heroSubtitle}>
            {t('landing.roadmap_subtitle')}
          </p>
        </div>

        <div style={styles.roadmapGrid}>
          
          {/* Linke Spalte: Roadmap */}
          <div style={styles.updateCard}>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px'}}>
              <div style={styles.iconCircle}><Map size={24} color="#007bff"/></div>
              <h3 style={styles.updateTitle}>{t('landing.roadmap_col_title')}</h3>
            </div>
            
            <div style={styles.timelineItem}>
              <div style={{...styles.statusBadge, backgroundColor: '#eefcf2', color: '#28a745', border: '1px solid #c3e6cb'}}>{t('landing.status_wip')}</div>
              <h4 style={styles.timelineTitle}>{t('landing.roadmap_item_1_title')}</h4>
              <p style={styles.timelineText}>{t('landing.roadmap_item_1_desc')}</p>
            </div>

            <div style={styles.timelineItem}>
               <div style={{...styles.statusBadge, backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba'}}>{t('landing.status_planned')}</div>
              <h4 style={styles.timelineTitle}>{t('landing.roadmap_item_2_title')}</h4>
              <p style={styles.timelineText}>{t('landing.roadmap_item_2_desc')}</p>
            </div>

            <div style={styles.timelineItem}>
               <div style={{...styles.statusBadge, backgroundColor: isDarkMode ? '#333' : '#e2e3e5', color: isDarkMode ? '#ccc' : '#383d41'}}>{t('landing.status_idea')}</div>
              <h4 style={styles.timelineTitle}>{t('landing.roadmap_item_3_title')}</h4>
              <p style={styles.timelineText}>{t('landing.roadmap_item_3_desc')}</p>
            </div>
          </div>

          {/* Rechte Spalte: Changelog */}
          <div style={styles.updateCard}>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px'}}>
              <div style={{...styles.iconCircle, backgroundColor: isDarkMode ? '#2d2d2d' : '#fff0f0'}}><GitBranch size={24} color="#dc3545"/></div>
              <h3 style={styles.updateTitle}>{t('landing.changelog_col_title')}</h3>
            </div>

            <div style={styles.logEntry}>
              <span style={styles.versionNumber}>v1.0.2</span>
              <ul style={styles.logList}>
                <li><CheckSquare size={14} style={{marginTop: 3}}/> Dark Mode Optimierungen</li>
                <li><CheckSquare size={14} style={{marginTop: 3}}/> Schnellere Ladezeiten</li>
              </ul>
            </div>

            <div style={{...styles.logEntry, borderLeft: '2px solid #ddd'}}>
              <span style={{...styles.versionNumber, backgroundColor: '#6c757d'}}>v1.0.1</span>
              <ul style={styles.logList}>
                <li><CheckSquare size={14} style={{marginTop: 3}}/> Mobile Fixes</li>
                <li><CheckSquare size={14} style={{marginTop: 3}}/> Passwort Reset</li>
              </ul>
            </div>

            <div style={{...styles.logEntry, borderLeft: '2px dashed #ddd', paddingBottom: 0}}>
              <span style={{...styles.versionNumber, backgroundColor: '#28a745'}}>v1.0.0</span>
              <p style={{fontSize: '0.9rem', color: isDarkMode ? '#aaa' : '#666', marginTop: '5px'}}>
                {t('landing.log_launch')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- Q&A / FAQ --- */}
    {/* --- Q&A / FAQ --- */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{t('landing.faq_title')}</h2>
        <div style={styles.faqContainer}>
          <FaqItem 
            question={t('landing.faq_q1')}
            answer={t('landing.faq_a1')}
            isOpen={openFaqIndex === 0}
            onClick={() => toggleFaq(0)}
            styles={styles}
          />
          <FaqItem 
            question={t('landing.faq_q2')}
            answer={t('landing.faq_a2')}

            {/* --- TESTIMONIALS --- */}
<section style={{...styles.section, backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa', overflow: 'hidden'}}>
  <h2 style={styles.sectionTitle}>Was unsere Nutzer sagen</h2>
  <p style={{textAlign: 'center', color: isDarkMode ? '#aaa' : '#666', marginBottom: '40px'}}>
    Echte Erfahrungen aus der Beta
  </p>

  <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
    
    {testimonials.map((t, index) => (
      <div key={index} style={{
        display: index === activeTestimonial ? 'block' : 'none',
        backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
        borderRadius: '20px',
        padding: '35px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease'
      }}>
        <div style={{ fontSize: '1.4rem', color: '#f39c12', marginBottom: '15px' }}>
          {'★'.repeat(t.stars)}
        </div>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.7',
          color: isDarkMode ? '#ddd' : '#444',
          fontStyle: 'italic',
          marginBottom: '25px'
        }}>
          "{t.text}"
        </p>
        <div style={{ fontWeight: '700', color: isDarkMode ? '#fff' : '#1a1a1a' }}>
          {t.name}
        </div>
        <div style={{ fontSize: '0.85rem', color: isDarkMode ? '#aaa' : '#888', marginTop: '4px' }}>
          {t.role}
        </div>
      </div>
    ))}

    {/* Dots */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px' }}>
      {testimonials.map((_, index) => (
        <div
          key={index}
          onClick={() => setActiveTestimonial(index)}
          style={{
            width: index === activeTestimonial ? '24px' : '10px',
            height: '10px',
            borderRadius: '5px',
            backgroundColor: index === activeTestimonial ? '#007bff' : (isDarkMode ? '#555' : '#ccc'),
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        />
      ))}
    </div>
  </div>
</section>

            isOpen={openFaqIndex === 1}
            onClick={() => toggleFaq(1)}
            styles={styles}
          />
          <FaqItem 
            question={t('landing.faq_q3')}
            answer={t('landing.faq_a3')}
            isOpen={openFaqIndex === 2}
            onClick={() => toggleFaq(2)}
            styles={styles}
          />
          <FaqItem 
            question={t('landing.faq_q4')}
            answer={t('landing.faq_a4')}
            isOpen={openFaqIndex === 3}
            onClick={() => toggleFaq(3)}
            styles={styles}
          />
          <FaqItem 
            question={t('landing.faq_q5')}
            answer={
              <span>
                {t('landing.faq_a5_intro')} <a href="mailto:vigortrainingsapp@gmail.com" style={{color: '#007bff', textDecoration: 'none'}}>vigortrainingsapp@gmail.com</a>. {t('landing.faq_a5_outro')}
              </span>
            }
            isOpen={openFaqIndex === 4}
            onClick={() => toggleFaq(4)}
            styles={styles}
          />
        </div>
      </section>

     <footer style={styles.footer}>
  <p>&copy; {new Date().getFullYear()} Vigor. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <button style={styles.linkBtn} onClick={() => setOverlayView('imprint')}>{t('landing.footer_imprint')}</button>
          <button style={styles.linkBtn} onClick={() => setOverlayView('privacy')}>{t('landing.footer_privacy')}</button>
          <button style={styles.linkBtn} onClick={() => setOverlayView('terms')}>{t('landing.footer_terms')}</button>
        </div>
      </footer>
      

      {/* --- OVERLAYS ANZEIGEN --- */}
      {overlayView === 'imprint' && (
        <Legal onClose={() => setOverlayView(null)} />
      )}

      {overlayView === 'privacy' && (
        <PrivacyPolicy onClose={() => setOverlayView(null)} />
      )}
       {/* Terms fehlte hier im Original-Snippet, aber ich lasse es mal so wie in deinem Code */}
    </div>
  );
};

// Hilfskomponenten
const FeatureCard = ({ icon, title, desc, styles }) => (
  // Hier wurde className hinzugefügt
  <div style={styles.featureCard} className="feature-card">
    <div style={styles.featureIcon}>{icon}</div>
    <h3 style={styles.featureTitle}>{title}</h3>
    <p style={styles.featureDesc}>{desc}</p>
  </div>
);

const FaqItem = ({ question, answer, isOpen, onClick, styles }) => (
  // Hier wurde className hinzugefügt
  <div style={styles.faqItem} className="faq-item">
    <button onClick={onClick} style={styles.faqQuestion}>
      {question}
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && <div style={styles.faqAnswer}>{answer}</div>}
  </div>
);

// Styles
const getLandingStyles = (isDark) => {
  const bg = isDark ? '#121212' : '#ffffff';
  const text = isDark ? '#f0f0f0' : '#1a1a1a';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const border = isDark ? '#333' : '#eee';

  return {
    container: {
      fontFamily: '"Segoe UI", sans-serif',
      backgroundColor: bg,
      color: text,
      minHeight: '100vh',
      lineHeight: '1.6',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      position: 'sticky',
      top: 0,
      backgroundColor: bg,
      zIndex: 100,
      borderBottom: `1px solid ${border}`
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      letterSpacing: '1px'
    },
    loginBtn: {
      backgroundColor: 'transparent',
      border: `2px solid #007bff`,
      color: isDark ? '#fff' : '#007bff',
      padding: '8px 20px',
      borderRadius: '30px',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.2s'
    },

    // Innerhalb von getLandingStyles return object:

langBtn: {
  background: 'transparent',
  border: '1px solid ' + (isDark ? '#444' : '#ddd'), // Dezenter Rahmen
  borderRadius: '4px',
  color: isDark ? '#ccc' : '#555',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.8rem',
  padding: '5px 10px',
  marginLeft: '5px',
  transition: 'all 0.2s ease',
},

buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '35px',
      alignItems: 'center',
      flexWrap: 'wrap', // Falls der Bildschirm sehr klein ist
    },

    // Der "Login" Button (Dezent, Outline)
    primaryBtn: { // Achtung: In deinem HTML war das der Login-Button
      padding: '12px 28px',
      borderRadius: '50px', // Pill-Shape
      background: 'transparent',
      border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #ccc',
      color: text,
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)' // Leichter Glaseffekt
    },

    // Der "Jetzt starten" Button (Auffällig, Gradient, Schatten)
    secondaryBtn: { // Das war der "Start"-Button
      padding: '12px 32px',
      borderRadius: '50px',
      border: 'none',
      // Schöner blauer Verlauf
      background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', 
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      // Glow-Effekt
      boxShadow: '0 8px 20px rgba(0, 123, 255, 0.4)', 
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },

    // Der "Aktive Nutzer" Badge
    userCountBadge: {
      marginTop: '30px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      // Sanftes Grün transparent
      background: isDark ? 'rgba(46, 204, 113, 0.15)' : 'rgba(46, 204, 113, 0.1)', 
      border: isDark ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(46, 204, 113, 0.2)',
      borderRadius: '20px',
      color: isDark ? '#4ade80' : '#155724',
      fontSize: '0.9rem',
      fontWeight: '600',
      letterSpacing: '0.5px'
    },


// Optional: Hover-Effekte müssten via CSS-Klasse oder MouseEnter gelöst werden, 
// aber das hier reicht für den Anfang völlig.
    heroSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
      flexWrap: 'wrap',
      gap: '40px',
      minHeight: '600px' // Damit es auf großen Screens gut wirkt
    },
    heroContent: {
      flex: '1',
      minWidth: '300px',
      zIndex: 3 // Text über dem Hintergrundkreis
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '900',
      lineHeight: '1.1',
      marginBottom: '20px'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      color: isDark ? '#aaa' : '#555',
      marginBottom: '30px',
      maxWidth: '500px'
    },
    heroStats: {
      marginBottom: '30px'
    },
    statBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: isDark ? '#2d2d2d' : '#e6f0ff',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem'
    },
    ctaBtn: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '15px 40px',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,123,255,0.4)'
    },

featuresSection: {
      padding: '80px 20px',
      background: isDark ? '#121212' : '#f8f9fa',
      position: 'relative',
    },
    featuresGrid: {
      display: 'grid',
      // Automatische Spalten: Mindestens 300px breit, füllen den Rest auf
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '50px'
    },
    // Grundstyle der Karte (ohne Hover)
    featureCard: {
      background: isDark ? '#1e1e1e' : '#ffffff',
      padding: '40px 30px',
      borderRadius: '24px',
      border: isDark ? '1px solid #333' : '1px solid #eaeaea',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Federt leicht nach
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%' // Damit alle gleich hoch sind
    },
    // Box um das Icon herum
    featureIconBox: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '25px',
      transition: 'transform 0.3s ease',
    },
    featureTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '15px',
      color: text,
    },
    featureDesc: {
      fontSize: '1rem',
      color: isDark ? '#aaa' : '#666',
      lineHeight: '1.6',
    },
    

    // ... innerhalb von getLandingStyles ...

    pricingGrid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '30px',
      flexWrap: 'wrap',
      marginTop: '40px'
    },
    pricingCard: {
      backgroundColor: cardBg,
      padding: '40px 30px',
      borderRadius: '20px',
      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.08)',
      border: `1px solid ${border}`,
      textAlign: 'center',
      flex: '1',
      minWidth: '280px',
      maxWidth: '380px',
      position: 'relative',
      transition: 'transform 0.3s ease',
    },
    pricingTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '10px'
    },
    priceTag: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: '5px'
    },
    pricingList: {
      listStyle: 'none',
      padding: 0,
      margin: '0 auto',
      textAlign: 'left',
      maxWidth: '260px' // Damit die Checkmarks untereinander stehen
    },
    pricingItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      fontSize: '1rem',
      color: isDark ? '#ddd' : '#444'
    },
    pricingBadge: {
      position: 'absolute',
      top: '20px',
      right: '-30px',
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '5px 40px',
      transform: 'rotate(45deg)',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,123,255,0.3)'
    },

    // ... innerhalb von getLandingStyles ...

    roadmapGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      alignItems: 'start'
    },
    updateCard: {
      backgroundColor: cardBg, // Nutzt den existierenden cardBg (weiß/dunkel)
      padding: '30px',
      borderRadius: '20px',
      boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
      border: `1px solid ${border}`
    },
    updateTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0
    },
    iconCircle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: isDark ? '#2d2d2d' : '#e6f0ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    // Roadmap spezifisch
    timelineItem: {
      marginBottom: '25px',
      paddingLeft: '15px',
      borderLeft: `2px solid ${isDark ? '#333' : '#eee'}`
    },
    statusBadge: {
      display: 'inline-block',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      padding: '4px 10px',
      borderRadius: '12px',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    timelineTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '5px',
      marginTop: 0
    },
    timelineText: {
      fontSize: '0.9rem',
      color: isDark ? '#aaa' : '#666',
      margin: 0,
      lineHeight: '1.5'
    },

    // Changelog spezifisch
    logEntry: {
      paddingLeft: '20px',
      borderLeft: '2px solid #007bff', // Die Linie der Timeline
      paddingBottom: '30px',
      position: 'relative'
    },
    versionNumber: {
      position: 'absolute',
      left: '-32px', // Schiebt das Badge auf die Linie
      top: '0',
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    },
    logDate: {
      display: 'block',
      fontSize: '0.85rem',
      color: isDark ? '#888' : '#999',
      marginBottom: '10px',
      fontStyle: 'italic'
    },
    logList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    // Styles für die List-Items im Changelog (inline definiert, aber hier falls globaler gewünscht)
    logListItem: {
       display: 'flex', 
       gap: '10px', 
       fontSize: '0.95rem', 
       marginBottom: '5px',
       color: isDark ? '#ddd' : '#444'
    },
    
    // --- NEUE IMAGE STYLES ---
    heroImageWrapper: {
      flex: '1',
      minWidth: '350px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', 
    },

    heroImage: {
      width: '100%',
      maxWidth: '4000px', // DEUTLICH GRÖSSER (war 320px)
      height: 'auto',
      filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', 
      zIndex: 2, 
      animation: 'float 6s ease-in-out infinite' 
    },

    heroBackgroundCircle: {
      position: 'absolute',
      width: '550px', // Auch größer (war 350px)
      height: '550px',
      backgroundColor: isDark ? 'rgba(0, 123, 255, 0.15)' : 'rgba(0, 123, 255, 0.1)',
      borderRadius: '50%',
      zIndex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      filter: 'blur(60px)'
    },


    // --------------------------

    section: {
      padding: '80px 40px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      textAlign: 'center',
      marginBottom: '60px',
      fontWeight: '800'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px'
    },
    featureCard: {
      backgroundColor: cardBg,
      padding: '30px',
      borderRadius: '15px',
      boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
      border: `1px solid ${border}`,
      textAlign: 'center'
    },
    featureIcon: {
      marginBottom: '20px',
      display: 'inline-block',
      padding: '15px',
      borderRadius: '50%',
      backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa'
    },
    featureTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px'
    },
    featureDesc: {
      color: isDark ? '#aaa' : '#666',
      fontSize: '0.95rem'
    },
    aboutContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      textAlign: 'center'
    },
    aboutSplit: {
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '40px',
      flexWrap: 'wrap', 
      marginBottom: '40px',
      textAlign: 'left'
    },
   imageWrapper: {
      flex: '1', 
      minWidth: '300px', 
      display: 'flex',
      justifyContent: 'center'
    },
   aboutImage: {
      width: '100%',
      maxWidth: '400px',
      height: 'auto',
      borderRadius: '20px',
      boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
      objectFit: 'cover'
    },
   aboutText: {
      flex: '1', 
      minWidth: '300px',
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: isDark ? '#ccc' : '#444'
    },
    checkList: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap'
    },
    checkItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    },
    faqContainer: {
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    faqItem: {
      backgroundColor: cardBg,
      borderRadius: '10px',
      border: `1px solid ${border}`,
      overflow: 'hidden'
    },
    faqQuestion: {
      width: '100%',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      color: text,
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: 'left'
    },
    faqAnswer: {
      padding: '0 20px 20px 20px',
      color: isDark ? '#aaa' : '#555',
      lineHeight: '1.6'
    },
    footer: {
      textAlign: 'center',
      padding: '40px',
      borderTop: `1px solid ${border}`,
      color: isDark ? '#666' : '#999',
      fontSize: '0.9rem'
    },
    footerLinks: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
      gap: '20px'
    },
    linkBtn: {
      background: 'none',
      border: 'none',
      color: isDark ? '#aaa' : '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '0.9rem',
      padding: 0,
      fontFamily: 'inherit'
    },

     founderName: {
      display: 'block',
      fontWeight: '700',
      fontSize: '1.15rem',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: '4px'
    },
    founderTitle: {
      display: 'block',
      fontSize: '0.95rem',
      color: '#007bff', // Dein Vigor-Blau
      fontWeight: '600',
      textTransform: 'uppercase', // Optional: sieht oft professioneller aus bei Titeln
      letterSpacing: '1px'
    },
  };
};

export default LandingPage;
