import React, { useState } from 'react';
import { Utensils, Info, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // IMPORT HINZUGEFÜGT

const CaloriesCalculator = () => {
  const { t } = useTranslation(); // HOOK HINZUGEFÜGT
  const [data, setData] = useState({ weight: '', height: '', age: '', gender: 'male', activity: '1.2' });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const { weight, height, age, gender, activity } = data;
    if (!weight || !height || !age) return;

    // Mifflin-St. Jeor Formel
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    
    const tdee = bmr * parseFloat(activity);
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <Utensils size={24} color="#f39c12" /> {t('cal_calculator')}
        </h2>
        <p style={styles.subtitle}>{t('cal_intro')}</p>
        
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('weight_kg') || 'Gewicht (kg)'}</label>
            <input 
              type="number" 
              style={styles.input} 
              placeholder={t('placeholder_weight') || "z.B. 80"}
              value={data.weight} 
              onChange={(e) => setData({...data, weight: e.target.value})}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('height_cm') || 'Größe (cm)'}</label>
            <input 
              type="number" 
              style={styles.input} 
              placeholder={t('placeholder_height') || "z.B. 180"}
              value={data.height} 
              onChange={(e) => setData({...data, height: e.target.value})}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('age') || 'Alter'}</label>
            <input 
              type="number" 
              style={styles.input} 
              placeholder={t('placeholder_age') || "z.B. 25"}
              value={data.age} 
              onChange={(e) => setData({...data, age: e.target.value})}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('gender')}</label>
            <select 
              style={styles.input} 
              value={data.gender} 
              onChange={(e) => setData({...data, gender: e.target.value})}
            >
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
            </select>
          </div>
        </div>

        <div style={styles.inputGroupFull}>
          <label style={styles.label}>{t('activity_level')}</label>
          <select 
            style={styles.input}
            value={data.activity} 
            onChange={(e) => setData({...data, activity: e.target.value})}
          >
            {/* Hier nutzen wir spezifische Keys für die Aktivitätslevel */}
            <option value="1.2">{t('act_sedentary') || 'Sitzend (wenig Bewegung)'}</option>
            <option value="1.375">{t('act_light') || 'Leicht aktiv (1-3 Tage Sport)'}</option>
            <option value="1.55">{t('act_moderate') || 'Moderat aktiv (3-5 Tage Sport)'}</option>
            <option value="1.725">{t('act_very') || 'Sehr aktiv (6-7 Tage Sport)'}</option>
            <option value="1.9">{t('act_extra') || 'Extrem aktiv (Job & Sport)'}</option>
          </select>
        </div>

        <button onClick={calculate} style={styles.calcBtn}>
          <Calculator size={18} /> {t('calculate_btn')}
        </button>

        {result && (
          <div style={styles.resultArea}>
            <div style={styles.resultRow}>
              <span>{t('bmr_label')}:</span>
              <strong>{result.bmr} kcal</strong>
            </div>
            <div style={styles.resultRowTotal}>
              <span>{t('tdee_label')}:</span>
              <strong>{result.tdee} kcal</strong>
            </div>
            <p style={styles.infoText}>
              <Info size={14} /> {t('maintain_weight_info') || 'Dies ist der Wert, um dein Gewicht zu halten.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    width: '100%',
    height: 'auto'
  },
  card: { 
    backgroundColor: '#fff', 
    padding: '30px', 
    borderRadius: '15px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Nimmt die volle Höhe des Containers ein
    boxSizing: 'border-box'
  },
  title: { display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 10px 0', fontSize: '1.4rem' },
  subtitle: { color: '#666', fontSize: '0.9rem', marginBottom: '25px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '15px' 
  },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  inputGroupFull: { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', color: '#444' },
  input: { 
    padding: '10px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box' // Wichtig, damit Padding den Hintergrund nicht sprengt
  },
  calcBtn: { 
    marginTop: '20px', 
    width: '100%', 
    padding: '12px', 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '10px' 
  },
  resultArea: { 
    marginTop: '25px', 
    padding: '20px', 
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    borderLeft: '4px solid #f39c12'
  },
  resultRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' },
  resultRowTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#1a1a1a' },
  infoText: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#888', marginTop: '15px' }
};

export default CaloriesCalculator;