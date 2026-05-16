import React, { useState, useEffect } from 'react';
import api from '../api'; 
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // <--- NEU
import { Scale, Moon, Ruler, Camera, X } from 'lucide-react';

const WeightForm = ({ onSaveSuccess, editData, setEditData, mode }) => {
  const { t } = useTranslation(); // <--- NEU

  const initialState = {
    weight: '', 
    date: new Date().toISOString().split('T')[0], 
    weighTime: '',
    waist: '', 
    chest: '', 
    arms: '', 
    kfa: '',
    image: '',
    sleepStart: '', 
    sleepEnd: '',
    quality: 3,
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editData) {
      setFormData({
        weight: editData.weight || '',
        date: editData.date ? new Date(editData.date).toISOString().split('T')[0] : initialState.date,
        weighTime: editData.weighTime || '',
        waist: editData.waist || '',
        chest: editData.chest || '',
        arms: editData.arms || '',
        kfa: editData.kfa || '',
        image: editData.image || '',
        sleepStart: editData.sleepStart || '',
        sleepEnd: editData.sleepEnd || '',
        quality: editData.quality || 3,
        notes: editData.notes || ''
      });
    } else {
      setFormData(initialState);
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  };

  // In WeightForm.js

const handleSubmit = async (e) => {
  e.preventDefault();
  // Token holen falls nötig, meistens macht das dein 'api' helper aber automatisch
  
  try {
    // --- UNTERSCHEIDUNG JE NACH MODUS ---
    if (mode === 'sleep') {
      // 1. SCHLAF-LOGIK (Hier fehlte die Datums-Umwandlung!)
      
      if (!formData.sleepStart || !formData.sleepEnd) {
        toast.warning(t('warning_missing_times') || 'Bitte Start- und Endzeit angeben.');
        return;
      }

      // Datum und Zeit zu einem echten Date-Objekt kombinieren
      const startDateTime = new Date(`${formData.date}T${formData.sleepStart}`);
      const endDateTime = new Date(`${formData.date}T${formData.sleepEnd}`);

      // Falls die Endzeit VOR der Startzeit liegt (z.B. 23:00 bis 07:00), 
      // muss das Enddatum der nächste Tag sein.
      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      // Nur die relevanten Schlaf-Daten senden
      const sleepPayload = {
        date: formData.date,
        sleepStart: startDateTime.toISOString(), // WICHTIG: Als ISO-String senden
        sleepEnd: endDateTime.toISOString(),     // WICHTIG: Als ISO-String senden
        quality: formData.quality,
        notes: formData.notes
      };

      await api.post('/sleep', sleepPayload);
      toast.success(t('save_success') || 'Schlafdaten gespeichert!');

    } else {
      // 2. GEWICHTS-LOGIK (Bleibt wie vorher)
      // Hier senden wir formData direkt, da das Weight-Backend das so erwartet
      await api.post('/weight/add', formData);
      toast.success(t('save_success') || 'Gewicht gespeichert!');
    }

    // Formular zurücksetzen oder schließen
    if (onSaveSuccess) onSaveSuccess();
    
    // Optional: Reset der Daten
    // setFormData(initialState); 

  } catch (error) {
    console.error("Save Error:", error);
    toast.error(error.response?.data?.message || 'Fehler beim Speichern');
  }
};

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h3 style={styles.header}>
        {mode === 'sleep' ? (
          <><Moon size={20} /> {t('log_sleep')}</> 
        ) : (
          <><Scale size={20} /> {t('log_body_stats')}</>
        )}
      </h3>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label style={styles.label}>{t('date')}</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required style={styles.input} />
        </div>
        
        {mode === 'sleep' ? (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('bedtime')}</label>
              <input type="time" name="sleepStart" value={formData.sleepStart} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('wakeup_time')}</label>
              <input type="time" name="sleepEnd" value={formData.sleepEnd} onChange={handleChange} required style={styles.input} />
            </div>
          </>
        ) : (
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('weight_kg')}</label>
            <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} required style={styles.input} />
          </div>
        )}
      </div>

      {mode !== 'sleep' && (
        <>
          <div style={styles.separator}>
            <Ruler size={16} style={{ marginRight: '5px' }}/> {t('body_measurements_optional')}
          </div>
          <div style={styles.rowTriple}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('waist_cm')}</label>
              <input type="number" name="waist" placeholder="-" value={formData.waist} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('chest_cm')}</label>
              <input type="number" name="chest" placeholder="-" value={formData.chest} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('arms_cm')}</label>
              <input type="number" name="arms" placeholder="-" value={formData.arms} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><Camera size={14}/> {t('progress_photo')}</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{fontSize: '0.8rem'}} />
            {formData.image && (
              <div style={styles.previewContainer}>
                <img src={formData.image} alt="Preview" style={styles.preview} />
                <button type="button" onClick={removeImage} style={styles.removeImg}><X size={12}/></button>
              </div>
            )}
          </div>
        </>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>{t('notes')}</label>
        <textarea 
          name="notes" 
          placeholder={t('placeholder_notes')} // <--- ÜBERSETZT
          value={formData.notes} 
          onChange={handleChange} 
          style={styles.textarea} 
        />
      </div>

      <button type="submit" style={styles.btn}>
        {editData ? t('save_changes') : t('save_entry')} 
      </button>
      
      {editData && (
        <button type="button" onClick={() => setEditData(null)} style={{...styles.btn, backgroundColor: '#6c757d', marginTop: '10px'}}>
          {t('cancel')}
        </button>
      )}
    </form>
  );
};

const styles = {
  formContainer: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' },
  header: { margin: '0 0 20px 0', fontSize: '1.2rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
  row: { display: 'flex', gap: '15px' },
  rowTriple: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  formGroup: { marginBottom: '15px', flex: 1 },
  label: { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', minHeight: '80px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.1s' },
  separator: { margin: '20px 0 15px 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  previewContainer: { marginTop: '10px', position: 'relative', width: 'fit-content' },
  preview: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' },
  removeImg: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default WeightForm;