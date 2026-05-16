import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 
import { User, Moon, TrendingDown, TrendingUp, BedDouble, Clock, Utensils } from 'lucide-react';
import WeightChart from './WeightChart';
import api from '../api';

const Dashboard = ({ weights = [], sleepData = [], mode = 'body', onOpenGallery }) => {
  const { t } = useTranslation(); 
  
  const [goals, setGoals] = useState({ weight: 75, waist: 85, chest: 100, arms: 40, kfa: 15 });
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState({ ...goals });
  
  const [meals, setMeals] = useState([]);

  // Bestehende Ziele beim Start laden
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get('/weight/goals');
        if (res.data && res.data.length > 0) {
          const goalMap = {};
          res.data.forEach(g => {
            goalMap[g.type] = g.value;
          });
          setGoals(prev => ({ ...prev, ...goalMap }));
          setTempGoals(prev => ({ ...prev, ...goalMap }));
        }
      } catch (err) {
        console.log("Nutze Standard-Ziele oder Fehler beim Laden:", err);
      }
    };
    fetchGoals();
  }, []);

  // Mahlzeiten für "Heute" laden (für die Übersichtskarte)
  useEffect(() => {
    const fetchTodayMeals = async () => {
      if (mode === 'sleep') return; 
      try {
        const res = await api.get('/meals');
        // Filter auf heute (Frontend-seitig zur Sicherheit)
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysMeals = res.data.filter(m => m.date.startsWith(todayStr));
        setMeals(todaysMeals);
      } catch (err) {
        console.error("Fehler beim Laden der Mahlzeiten für Dashboard", err);
      }
    };
    fetchTodayMeals();
  }, [mode]);

  // Berechnungen für Mahlzeiten-Karte
  const totalKcal = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);

  // Hilfsfunktionen für Stats
  const getLatest = (data) => data && data.length > 0 ? data[0] : null;
  const latestWeight = getLatest(weights);
  const latestSleep = getLatest(sleepData);

  const currentWeightVal = latestWeight ? latestWeight.weight : 0;
  const currentKfaVal = latestWeight ? latestWeight.kfa : 0; 

  // Berechnung Durchschnittsschlaf (letzte 7 Einträge)
  const avgSleep = () => {
    if (!sleepData || sleepData.length === 0) return "0.0";
    const last7 = sleepData.slice(0, 7);
    // FIX: parseFloat hinzufügen, da duration ein String sein kann
    // Das verhindert NaN Fehler und falsche Summen ("7.5" + "8.0" != "7.58.0")
    const sum = last7.reduce((acc, curr) => acc + (parseFloat(curr.duration) || 0), 0);
    return (sum / last7.length).toFixed(1);
  };

  const saveGoals = async () => {
    try {
      const promises = Object.keys(tempGoals).map(type => 
        api.post('/weight/goals', { type, value: Number(tempGoals[type]) })
      );
      await Promise.all(promises);
      setGoals(tempGoals);
      setIsEditingGoals(false);
    } catch (err) {
      console.error("Fehler beim Speichern der Ziele:", err);
      alert(t('error_saving_goals')); 
    }
  };

  // Hilfsvariable um "Nicht-Schlaf-Modus" zu erkennen (deckt 'body' und 'weight' ab)
  const isBodyMode = mode !== 'sleep';

  return (
    <div style={styles.dashboard}>
      
      {/* OBERE REIHE: KARTEN */}
      <div style={styles.statsGrid}>
        
        {/* KARTE 1: Gewicht & KFA (oder Schlaf Durchschnitt) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconBoxPurple}>
              {mode === 'sleep' ? <Moon size={24} color="#fff" /> : <TrendingUp size={24} color="#fff" />}
            </div>
            {isBodyMode && (
               <div style={styles.trendBadge}>
                 <TrendingDown size={16} />
                 <span>-0.5 kg</span>
               </div>
            )}
          </div>
          
          <div style={styles.cardContent}>
            {mode === 'sleep' ? (
               <>
                 <span style={styles.label}>{t('avg_7_days')}</span> 
                 <h3 style={styles.value}>{avgSleep()} <span style={styles.unit}>{t('hours_short')}</span></h3> 
                 <p style={styles.subtext}>{t('sleep_quality_good')}</p> 
               </>
            ) : (
               <>
                 <span style={styles.label}>{t('current_weight')}</span> 
                 <h3 style={styles.value}>{currentWeightVal} <span style={styles.unit}>kg</span></h3>
                 <p style={styles.subtext}>{t('goal_label')}: {goals.weight} kg</p> 
                 
                 <div style={{ marginTop: '15px' }}>
                    <span style={styles.label}>{t('current_kfa')}</span> 
                    <h3 style={styles.valueSmall}>{currentKfaVal} <span style={styles.unit}>%</span></h3>
                    <p style={styles.subtext}>{t('goal_label')}: {goals.kfa}%</p> 
                 </div>
               </>
            )}
          </div>
        </div>

        {/* KARTE 2: Körpermaße (oder Letzte Nacht) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconBoxBlue}>
              {mode === 'sleep' ? <BedDouble size={24} color="#fff" /> : <User size={24} color="#fff" />}
            </div>
            {isBodyMode && (
              <button onClick={() => setIsEditingGoals(true)} style={styles.editBtn}>{t('edit_goals')}</button>
            )}
          </div>

          <div style={styles.cardContent}>
            {mode === 'sleep' ? (
              <>
                 <span style={styles.label}>{t('last_night')}</span> 
                 <h3 style={styles.value}>{latestSleep ? latestSleep.duration : '-'} <span style={styles.unit}>{t('hours_short')}</span></h3>
                 <div style={styles.sleepDetails}>
                   <div style={styles.sleepDetailItem}>
                      <Clock size={16} color="#888" />
                      <span>{t('bedtime')}: {latestSleep ? new Date(latestSleep.sleepStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span> 
                   </div>
                   <div style={styles.sleepDetailItem}>
                      <SunIcon />
                      <span>{t('wakeup_time')}: {latestSleep ? new Date(latestSleep.sleepEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span> 
                   </div>
                 </div>
              </>
            ) : (
              <>
                <span style={styles.label}>{t('body_stats')}</span> 
                <div style={styles.statGrid}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>{t('chest')}</span> 
                    <span style={styles.statValue}>{goals.chest} <small>cm</small></span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>{t('waist')}</span> 
                    <span style={styles.statValue}>{goals.waist} <small>cm</small></span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>{t('arms')}</span> 
                    <span style={styles.statValue}>{goals.arms} <small>cm</small></span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* KARTE 3: Ernährung (Nur sichtbar wenn nicht Schlaf-Modus) */}
        {isBodyMode && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconBoxGreen}>
                <Utensils size={24} color="#fff" />
              </div>
            </div>
            <div style={styles.cardContent}>
              <span style={styles.label}>{t('meals_today')}</span> 
              
              {meals.length > 0 ? (
                <>
                  <h3 style={styles.value}>{totalKcal} <span style={styles.unit}>{t('kcal')}</span></h3> 
                  <div style={styles.categoryList}>
                    <div style={styles.catMiniItem}><span>{t('protein')}:</span> <strong>{totalProtein}g</strong></div> 
                    <div style={styles.catMiniItem}><span>{t('carbs')}:</span> <strong>{totalCarbs}g</strong></div> 
                    <div style={styles.catMiniItem}><span>{t('fat')}:</span> <strong>{totalFat}g</strong></div> 
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '10px', color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {t('no_meals_today')} 
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MITTLERE REIHE: CHART */}
      <div style={styles.chartSection}>
        {/* KORRIGIERT: data-Prop statt weights und Übergabe von goals/mode */}
        {/* WICHTIG: goals={} wenn sleep mode, damit Skalierung korrekt ist */}
        <WeightChart 
          data={mode === 'sleep' ? sleepData : weights} 
          mode={mode} 
          goals={mode === 'sleep' ? {} : goals}
        />
      </div>

      {/* MODAL: ZIELE BEARBEITEN */}
      {isEditingGoals && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{t('edit_goals_title')}</h2> 
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('weight_kg')}</label> 
              <input 
                type="number" 
                value={tempGoals.weight} 
                onChange={(e) => setTempGoals({...tempGoals, weight: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('kfa_percent')}</label> 
              <input 
                type="number" 
                value={tempGoals.kfa} 
                onChange={(e) => setTempGoals({...tempGoals, kfa: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('chest_cm')}</label> 
              <input 
                type="number" 
                value={tempGoals.chest} 
                onChange={(e) => setTempGoals({...tempGoals, chest: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('waist_cm')}</label> 
              <input 
                type="number" 
                value={tempGoals.waist} 
                onChange={(e) => setTempGoals({...tempGoals, waist: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t('arms_cm')}</label> 
              <input 
                type="number" 
                value={tempGoals.arms} 
                onChange={(e) => setTempGoals({...tempGoals, arms: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setIsEditingGoals(false)} style={styles.cancelBtn}>{t('cancel')}</button> 
              <button onClick={saveGoals} style={styles.saveBtn}>{t('save')}</button> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Kleiner Helfer für das Sonnen-Icon
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
  </svg>
);

const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.2s',
    cursor: 'default'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  iconBoxPurple: {
    backgroundColor: '#f3e8ff',
    padding: '12px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%)'
  },
  iconBoxBlue: {
    backgroundColor: '#e0f2fe',
    padding: '12px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)'
  },
  iconBoxGreen: {
    backgroundColor: '#dcfce7',
    padding: '12px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #22c55e 0%, #86efac 100%)'
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  value: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0',
    lineHeight: '1.1'
  },
  valueSmall: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0',
    lineHeight: '1.1'
  },
  unit: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '600',
    marginLeft: '2px'
  },
  subtext: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '5px',
    fontWeight: '500'
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginTop: '15px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '10px',
    borderRadius: '12px'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#334155'
  },
  sleepDetails: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sleepDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#64748b'
  },
  categoryList: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  catMiniItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#555'
  },
  editBtn: {
    position: 'absolute',
    right: '25px',
    top: '25px',
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '400px'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '1rem'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default Dashboard;