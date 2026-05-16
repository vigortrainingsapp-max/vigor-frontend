import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SleepForm = ({ onSleepAdded }) => {
  const { t } = useTranslation();

  // 1. SAUBERER START: Nur Felder für Schlaf, keine Gewichts-Felder mehr
  const initialState = {
    date: new Date().toISOString().split('T')[0],
    sleepStart: '', // Wird als "HH:mm" gespeichert
    sleepEnd: '',   // Wird als "HH:mm" gespeichert
    quality: 3,
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!formData.sleepStart || !formData.sleepEnd) {
      toast.warning(t('warning_missing_times') || 'Bitte Start- und Endzeit angeben.');
      return;
    }

    try {
      // 2. DATUMS-LOGIK: Zeit ("11:00") mit Datum ("2026-01-28") kombinieren
      // Wir erstellen daraus einen validen ISO-String für die Datenbank
      const startDateTime = new Date(`${formData.date}T${formData.sleepStart}`);
      let endDateTime = new Date(`${formData.date}T${formData.sleepEnd}`);

      // Wenn die Endzeit vor der Startzeit liegt (z.B. 22:00 bis 06:00),
      // muss das Ende am nächsten Kalendertag liegen.
      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      // 3. MINIMALER PAYLOAD: Nur das senden, was das Schlaf-Model braucht
      const dataToSend = {
        date: formData.date,
        sleepStart: startDateTime.toISOString(),
        sleepEnd: endDateTime.toISOString(),
        quality: formData.quality,
        notes: formData.notes
      };

      await axios.post('http://localhost:5000/api/sleep/add', dataToSend, {
        headers: { 'x-auth-token': token }
      });
      
      toast.success(t('save_success') || 'Schlafdaten gespeichert!');
      setFormData(initialState); // Formular leeren
      if (onSleepAdded) onSleepAdded();
      
    } catch (err) {
      console.error("Speicher-Fehler:", err.response?.data);
      const serverMsg = err.response?.data?.message || err.message;
      toast.error(`${t('error_general')}: ${serverMsg}`);
    }
  };

  const styles = {
    formCard: {
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      marginBottom: '20px'
    },
    header: { margin: '0 0 20px 0', fontSize: '1.2rem', color: '#333' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' },
    input: {
      width: '100%', padding: '10px', borderRadius: '8px',
      border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box'
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    button: {
      width: '100%', padding: '12px', backgroundColor: '#6f42c1',
      color: '#fff', border: 'none', borderRadius: '8px',
      fontSize: '1rem', cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '10px',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.formCard}>
      <h3 style={styles.header}>{t('sleep_form_title')}</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>{t('date_of_night')}</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('sleep_start')}</label>
            <input 
              type="time" 
              name="sleepStart" 
              value={formData.sleepStart} 
              onChange={handleChange} 
              style={styles.input} 
              required 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('sleep_end')}</label>
            <input 
              type="time" 
              name="sleepEnd" 
              value={formData.sleepEnd} 
              onChange={handleChange} 
              style={styles.input} 
              required 
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('sleep_quality_scale')}</label>
          <input 
            type="range" 
            name="quality" 
            min="1" max="5" 
            value={formData.quality} 
            onChange={handleChange} 
            style={{ width: '100%' }} 
          />
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#777'}}>
            <span>{t('quality_bad')}</span><span>{t('quality_very_good')}</span>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('notes')}</label>
          <textarea 
            name="notes" 
            placeholder={t('sleep_placeholder_notes')} 
            value={formData.notes} 
            onChange={handleChange} 
            style={{...styles.input, minHeight: '80px'}} 
          />
        </div>

        <button type="submit" style={styles.button}>
          <Save size={20} /> {t('save')}
        </button>
      </form>
    </div>
  );
};

export default SleepForm;