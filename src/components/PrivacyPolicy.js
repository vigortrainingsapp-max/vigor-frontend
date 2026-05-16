import React from 'react';
import { X, Lock } from 'lucide-react';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={24} color="#333" />
        </button>
        
        <div style={styles.header}>
          <Lock size={40} color="#28a745" />
          <h2 style={styles.title}>Datenschutzerklärung</h2>
        </div>

        <div style={styles.content}>
          <h3>1. Datenschutz auf einen Blick</h3>
          <p>
            Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Wir behandeln deine personenbezogenen Daten vertraulich 
            und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>

          <h3>2. Datenerfassung in unserer App</h3>
          <p><strong>Wer ist verantwortlich für die Datenerfassung?</strong></p>
          <p>
            Die Datenverarbeitung auf dieser Website/App erfolgt durch den Betreiber (siehe Impressum).
          </p>

          <p><strong>Wie erfassen wir deine Daten?</strong></p>
          <p>
            Deine Daten werden zum einen dadurch erhoben, dass du uns diese mitteilst (z.B. bei der Registrierung, 
            Eingabe von Gewicht oder Workouts). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
          </p>

          <h3>3. Deine Rechte</h3>
          <p>
            Du hast jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten 
            personenbezogenen Daten zu erhalten. Du hast außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen.
          </p>

          <h3>4. Hosting & Backend</h3>
          <p>
            Diese App wird auf Servern gehostet, die den DSGVO-Richtlinien entsprechen. Deine Passwörter werden gehasht (verschlüsselt) gespeichert 
            und sind für uns nicht lesbar.
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles (identisch zu Legal.js für konsistentes Design)
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', // Dunkler Hintergrund
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
    padding: '20px',
    backdropFilter: 'blur(5px)' // Schöner Unschärfe-Effekt
  },
  modal: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '600px',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    color: '#333'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'background 0.2s'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #eee',
    paddingBottom: '20px'
  },
  title: {
    margin: '15px 0 0 0',
    fontSize: '1.8rem',
    fontWeight: '700'
  },
  content: {
    lineHeight: '1.6',
    fontSize: '1rem'
  }
};

export default PrivacyPolicy;