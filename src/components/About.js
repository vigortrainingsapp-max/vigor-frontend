import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Info, Heart, Shield, Zap, MessageSquare, Send, Scale } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const About = ({ onClose }) => {
  const { t } = useTranslation();
  
  const [tab, setTab] = useState('info'); // 'info', 'contact', 'legal', 'privacy'
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    category: 'Verbesserung',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://vigor-backend-iznu.onrender.com/api/auth/contact', formData);
      toast.success(t('msg_sent_success'));
      setFormData({ email: '', category: 'Verbesserung', subject: '', message: '' });
      setTab('info');
    } catch (err) {
      console.error(err);
      toast.error(t('msg_sent_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={24} />
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('info_tooltip')}</h2>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button 
            style={tab === 'info' ? styles.activeTab : styles.tab} 
            onClick={() => setTab('info')}
          >
            <Info size={18} /> Info
          </button>
          <button 
            style={tab === 'contact' ? styles.activeTab : styles.tab} 
            onClick={() => setTab('contact')}
          >
            <MessageSquare size={18} /> {t('contact')}
          </button>
          <button 
            style={tab === 'legal' ? styles.activeTab : styles.tab} 
            onClick={() => setTab('legal')}
          >
            <Scale size={18} /> {t('imprint_title')}
          </button>
          <button 
            style={tab === 'privacy' ? styles.activeTab : styles.tab} 
            onClick={() => setTab('privacy')}
          >
            <Shield size={18} /> {t('privacy_title')}
          </button>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          
          {/* TAB 1: INFO - JETZT ANGEPASST */}
          {tab === 'info' && (
            <div style={styles.fade}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>VIGOR</h3>
                <p style={{ color: '#666' }}>Version 1.0.0</p>
              </div>
              
              <div style={styles.featureList}>
                <div style={styles.featureItem}>
                  <Zap color="#FFD700" size={24} />
                  <div>
                    <strong>{t('smart_tracking')}</strong>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>
                      {t('smart_tracking_desc')}
                    </p>
                  </div>
                </div>
                <div style={styles.featureItem}>
                  <Heart color="#FF4D4D" size={24} />
                  <div>
                    <strong>{t('health_focus')}</strong>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>
                      {t('health_focus_desc')}
                    </p>
                  </div>
                </div>
                <div style={styles.featureItem}>
                  <Shield color="#4CAF50" size={24} />
                  <div>
                    <strong>{t('feature_privacy')}</strong>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>
                      {t('feature_privacy_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KONTAKT */}
          {tab === 'contact' && (
            <form onSubmit={handleSubmit} style={styles.fade}>
              <p style={{ marginBottom: '15px', color: '#666' }}>{t('contact_intro')}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder={t('email')} 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="Verbesserung">{t('cat_improvement')}</option>
                  <option value="Bug">{t('cat_bug')}</option>
                  <option value="Frage">{t('cat_question')}</option>
                  <option value="Sonstiges">{t('cat_other')}</option>
                </select>

                <input 
                  type="text" 
                  name="subject"
                  placeholder={t('subject')} 
                  required 
                  value={formData.subject}
                  onChange={handleInputChange}
                  style={styles.input}
                />

                <textarea 
                  name="message"
                  placeholder={t('message')} 
                  rows="4" 
                  required 
                  value={formData.message}
                  onChange={handleInputChange}
                  style={styles.textarea}
                ></textarea>

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? t('sending') : (
                    <>
                      <Send size={18} /> {t('send_msg')}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: IMPRESSUM (Legal) */}
          {tab === 'legal' && (
            <div style={styles.fade}>
              <div style={styles.legalBox}>
                <h4 style={{marginTop: 0}}>{t('imprint_title')}</h4>
                <p><strong>{t('tmg_info')}</strong></p>
                <p>
                  Maurice Angel Baugan<br />
                  15745 Wildau
                </p>

                <p style={{marginTop: '15px'}}><strong>{t('contact')}</strong></p>
                <p>
                  {t('email')}: vigortrainingsapp@gmail.com
                </p>

                <p style={{marginTop: '15px'}}><strong>{t('responsible_content')}</strong></p>
                <p>
                  Maurice Angel Baugan<br />
                  15745 Wildau
                </p>
                
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                  {t('disclaimer_text')}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DATENSCHUTZ (Privacy) */}
          {tab === 'privacy' && (
            <div style={styles.fade}>
              <h3 style={{ marginTop: 0 }}>{t('privacy_title')}</h3>
              
              <div style={styles.legalBox}>
                
                {/* Abschnitt 1 */}
                <div style={styles.privacySection}>
                  <h4 style={styles.privacyHeader}>{t('privacy_sec1_title')}</h4>
                  <h5 style={styles.privacySubHeader}>{t('privacy_gen_notes')}</h5>
                  <p style={styles.privacyText}>
                    {t('privacy_gen_text')}
                  </p>
                  <h5 style={styles.privacySubHeader}>{t('privacy_collection_title')}</h5>
                  <p style={styles.privacyText}>
                    <strong>{t('privacy_who_responsible')}</strong><br/>
                    {t('privacy_who_responsible_text')}
                  </p>
                  <p style={styles.privacyText}>
                    <strong>{t('privacy_how_collect')}</strong><br/>
                    {t('privacy_how_collect_text')}
                  </p>
                  <p style={styles.privacyText}>
                    <strong>{t('privacy_usage')}</strong><br/>
                    {t('privacy_usage_text')}
                  </p>
                </div>

                {/* Abschnitt 2 */}
                <div style={styles.privacySection}>
                  <h4 style={styles.privacyHeader}>{t('privacy_sec2_title')}</h4>
                  <p style={styles.privacyText}>
                    {t('privacy_sec2_text')}
                  </p>
                  <p style={{...styles.privacyText, margin: '10px 0', padding: '10px', backgroundColor: '#fff', borderLeft: '3px solid #333'}}>
                    Maurice Angel Baugan<br/>
                    15745 Wildau<br/><br/>
                    {t('email')}: vigortrainingsapp@gmail.com
                  </p>
                  <p style={styles.privacyText}>
                    {t('privacy_responsible_def')}
                  </p>
                </div>

                {/* Abschnitt 3 */}
                <div style={styles.privacySection}>
                  <h4 style={styles.privacyHeader}>{t('privacy_sec3_title')}</h4>
                  
                  <h5 style={styles.privacySubHeader}>{t('privacy_registration')}</h5>
                  <p style={styles.privacyText}>
                    {t('privacy_registration_text')}
                  </p>

                  <h5 style={styles.privacySubHeader}>{t('privacy_contactform')}</h5>
                  <p style={styles.privacyText}>
                   {t('privacy_contactform_text')}
                  </p>

                  <h5 style={styles.privacySubHeader}>{t('privacy_revocation')}</h5>
                  <p style={styles.privacyText}>
                    {t('privacy_revocation_text')}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { 
    position: 'fixed', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 3000, 
    padding: '20px' 
  },
  modal: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '20px', 
    width: '100%', 
    maxWidth: '600px', 
    position: 'relative', 
    maxHeight: '90vh', 
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  },
  closeBtn: { 
    position: 'absolute', 
    top: '15px', 
    right: '15px', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer',
    color: '#666'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    color: '#888',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.2s'
  },
  activeTab: {
    background: 'none',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    color: '#000',
    fontWeight: 'bold',
    borderBottom: '2px solid #000',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  content: {
    minHeight: '300px'
  },
  fade: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px',
    animation: 'fadeIn 0.3s ease-in-out' 
  },
  input: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box'
  },
  textarea: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    fontSize: '0.95rem', 
    fontFamily: 'inherit', 
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box'
  },
  submitBtn: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: 'none', 
    backgroundColor: '#1a1a1a', 
    color: '#fff', 
    fontWeight: '600', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '10px', 
    marginTop: '10px' 
  },
  legalBox: { 
    backgroundColor: '#f8f9fa', 
    padding: '20px', 
    borderRadius: '10px', 
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: '#333'
  },
  privacySection: {
    marginBottom: '25px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '15px'
  },
  privacyHeader: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#111'
  },
  privacySubHeader: {
    fontSize: '1.0rem',
    marginTop: '15px',
    marginBottom: '5px',
    color: '#444'
  },
  privacyText: {
    marginBottom: '10px',
    color: '#555'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '10px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '12px'
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default About;
