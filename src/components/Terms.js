import React from 'react';
import { X, FileText } from 'lucide-react';

const Terms = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={24} color="#333" />
        </button>
        
        <div style={styles.header}>
          <FileText size={40} color="#007bff" />
          <h2 style={styles.title}>Allgemeine Geschäftsbedingungen (AGB)</h2>
        </div>

        <div style={styles.content}>
          <h3>1. Geltungsbereich</h3>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Web-Anwendung "Vigor" (nachfolgend "Dienst"). 
            Mit der Registrierung erklärst du dich mit diesen Bedingungen einverstanden.
          </p>

          <h3>2. Leistungsbeschreibung</h3>
          <p>
            Vigor stellt einen Dienst zur Erfassung und Analyse von Fitnessdaten (Training, Ernährung, Körperwerte) bereit. 
            Der Basisdienst ist derzeit kostenlos. Wir garantieren keine Verfügbarkeit zu 100% (z.B. bei Wartungsarbeiten).
          </p>

          <h3>3. Nutzerpflichten</h3>
          <p>
            Du verpflichtest dich, wahrheitsgemäße Angaben in deinem Profil zu machen und deine Zugangsdaten geheim zu halten. 
            Missbräuchliche Nutzung (z.B. Automatisierung, Angriffe auf die Infrastruktur) ist untersagt.
          </p>

          <h3>4. Haftungsausschluss</h3>
          <p>
            Vigor dient nur zu Informationszwecken und ersetzt keine medizinische Beratung. Wir haften nicht für gesundheitliche Schäden, 
            die aus unsachgemäßem Training resultieren. Die Nutzung erfolgt auf eigene Gefahr.
          </p>
          
          <h3>5. Beendigung</h3>
          <p>
            Du kannst dein Konto jederzeit löschen. Wir behalten uns das Recht vor, Konten bei Verstößen gegen diese AGB zu sperren.
          </p>

          <h3>6. Änderungen</h3>
          <p>
            Wir können diese AGB jederzeit anpassen. Über wesentliche Änderungen wirst du informiert.
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles (Identisch zu PrivacyPolicy und Legal für einheitlichen Look)
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
    padding: '20px',
    backdropFilter: 'blur(5px)'
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

export default Terms;