import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck } from 'lucide-react';

// Prop 'embedded' steuert, ob es als Modal (Standalone) oder als Teil von About.js angezeigt wird
const Legal = ({ onClose, embedded = false }) => {
  const { t } = useTranslation();

  const Content = () => (
    <div style={embedded ? styles.embeddedContent : styles.content}>
      {!embedded && (
        <div style={styles.header}>
          <ShieldCheck size={40} color="#007bff" />
          <h2 style={styles.title}>{t('imprint_title')}</h2>
        </div>
      )}

      {/* --- HIER DEINE ECHTEN DATEN EINFÜGEN --- */}
      
      <p><strong>{t('tmg_info')}</strong></p>
      <p>
        Maurice Angel Baugan<br />
        15745 Wildau
      </p>

      <p><strong>{t('contact')}</strong></p>
      <p>
        {t('email')}: vigortrainingsapp@gmail.com
<br />
      </p>

      <p><strong>{t('responsible_content')}</strong></p>
      <p>
        Maurice Angel Baugan<br />
       15745 Wildau
      </p>
      
      {/* ---------------------------------------- */}

      <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '20px' }}>
        {t('disclaimer_text')}
      </p>
    </div>
  );

  if (embedded) {
    return <Content />;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={24} />
        </button>
        <Content />
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' },
  header: { textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  title: { margin: 0, fontSize: '1.5rem', color: '#1a1a1a' },
  content: { lineHeight: '1.6', color: '#444', fontSize: '0.95rem' },
  embeddedContent: { lineHeight: '1.6', color: '#444', fontSize: '0.95rem', padding: '10px 0' }
};

export default Legal;