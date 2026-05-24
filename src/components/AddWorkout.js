import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; 
import { toast } from 'react-toastify';
import { 
  Plus, 
  Trash2, 
  Dumbbell, 
  Activity, 
  Save, 
  ChevronRight, 
  X, 
  Target,
  TrendingUp,
  Apple,
  Heart,
  History 
} from 'lucide-react';

// Import der gruppierten Übungsliste
import { exerciseGroups } from '../data/exerciseData';

// Mapping für die Icons aus exerciseData.js
const iconMap = {
  Heart: Heart,
  Activity: Activity,
  TrendingUp: TrendingUp,
  Target: Target,
  Dumbbell: Dumbbell,
  Apple: Apple
};

const AddWorkout = ({ onWorkoutAdded }) => {
  const { t } = useTranslation();
  
  const [type, setType] = useState('Krafttraining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Exercises State mit 'lastPerform' für die History-Anzeige
  const [exercises, setExercises] = useState([
    { name: '', sets: [{ reps: '', weight: '' }], lastPerform: null }
  ]);
  
  const [cardio, setCardio] = useState({ activity: '', duration: '', distance: '', intensity: 'Mittel' });
  const [allWorkouts, setAllWorkouts] = useState([]); 
  
  // States für die Grid-Auswahl (Modal)
  const [showGrid, setShowGrid] = useState(false);
  const [activeExIndex, setActiveExIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- 1. Lade alle Workouts für die History-Funktion ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/workouts', {
          headers: { 'x-auth-token': token }
        });
        setAllWorkouts(res.data || []);
      } catch (err) {
        console.error("Fehler beim Laden der History:", err);
      }
    };
    fetchHistory();
  }, []);

  // --- 2. Helper: Finde das letzte Training dieser Übung ---
  const getLastPerformance = (exerciseName) => {
    if (!allWorkouts.length || !exerciseName) return null;
    
    // Sortiere Workouts chronologisch absteigend (neueste zuerst)
    const sorted = [...allWorkouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (const w of sorted) {
      if (w.exercises && Array.isArray(w.exercises)) {
        // Suche nach Key oder Name (für Rückwärtskompatibilität)
        const match = w.exercises.find(e => e.name === exerciseName);
        if (match) {
          return {
            date: w.date,
            sets: match.sets
          };
        }
      }
    }
    return null;
  };

  // --- LOGIC ---
  const handleAddSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(newExercises);
  };

  const handleSetChange = (exIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ reps: '', weight: '' }], lastPerform: null }]);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleRemoveSet = (exIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets = newExercises[exIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(newExercises);
  };

  const openExerciseSelector = (index) => {
    setActiveExIndex(index);
    setSelectedCategory(null);
    setShowGrid(true);
  };

  const selectExerciseFromGrid = (exerciseName) => {
    const newExercises = [...exercises];
    newExercises[activeExIndex].name = exerciseName;
    
    // History laden und speichern
    const history = getLastPerformance(exerciseName);
    newExercises[activeExIndex].lastPerform = history;

    setExercises(newExercises);
    setShowGrid(false);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      const payload = {
        type,
        date,
        exercises: type === 'Krafttraining' ? exercises : [],
        cardio: type === 'Cardio' ? cardio : {}
      };

      await axios.post('https://vigor-backend-iznu.onrender.com/api/workouts', payload, config);
      toast.success(t('workout_saved'));
      
      // Reset
      setExercises([{ name: '', sets: [{ reps: '', weight: '' }], lastPerform: null }]);
      setCardio({ activity: '', duration: '', distance: '', intensity: 'Mittel' });
      
      // History neu laden
      const res = await axios.get('https://vigor-backend-iznu.onrender.com/api/workouts', config);
      setAllWorkouts(res.data || []);

      if (onWorkoutAdded) onWorkoutAdded();
    } catch (err) {
      console.error(err);
      toast.error(t('error_general'));
    }
  };

  // --- RENDER HELPERS ---
  const renderCategoryGrid = () => (
    <div style={styles.gridBody}>
      {!selectedCategory ? (
        <div style={styles.categoryGrid}>
          {Object.keys(exerciseGroups).map(cat => {
            // Icon dynamisch auswählen
            const IconComponent = iconMap[exerciseGroups[cat].icon] || Dumbbell;
            
            return (
              <div key={cat} style={styles.categoryCard} onClick={() => setSelectedCategory(cat)}>
                <div style={styles.iconCircle}>
                  <IconComponent size={24} />
                </div>
                <span style={styles.categoryName}>{t(cat)}</span>
                <ChevronRight size={16} color="#ccc" style={{ marginTop: 'auto' }} />
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedCategory(null)} style={styles.backBtn}>
             &larr; {t('choose_category')}
          </button>
          
          <h3 style={{ marginBottom: '15px' }}>{t(selectedCategory)}</h3>
          
          <div style={styles.exerciseList}>
            {/* WICHTIG: Zugriff auf .exercises Array */}
            {exerciseGroups[selectedCategory].exercises.map(ex => (
              <div 
                key={ex} 
                style={styles.exerciseItem}
                onClick={() => selectExerciseFromGrid(ex)}
              >
                {t(ex)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Plus size={28} /> {t('add_workout_btn')}
      </h2>

      {/* Type Switcher */}
      <div style={styles.toggleContainer}>
        <button 
          style={type === 'Krafttraining' ? styles.toggleActive : styles.toggle}
          onClick={() => setType('Krafttraining')}
        >
          <Dumbbell size={18} /> {t('strength_training')}
        </button>
        <button 
          style={type === 'Cardio' ? styles.toggleActive : styles.toggle}
          onClick={() => setType('Cardio')}
        >
          <Activity size={18} /> {t('cardio_training')}
        </button>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>{t('date')}</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          style={styles.input} 
        />
      </div>

      {/* KRAFTTRAINING FORM */}
      {type === 'Krafttraining' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {exercises.map((ex, exIndex) => (
            <div key={exIndex} style={styles.exerciseCard}>
              <div style={styles.cardHeader}>
                <span style={{ fontWeight: 'bold', color: '#555' }}>
                   {t('exercises')} #{exIndex + 1}
                </span>
                <button onClick={() => handleRemoveExercise(exIndex)} style={styles.iconBtn}>
                  <Trash2 size={18} color="#ff4d4d" />
                </button>
              </div>

              <div style={styles.formGroup}>
                <input 
                  type="text" 
                  placeholder={t('select_exercise_placeholder')}
                  value={t(ex.name)} 
                  readOnly
                  onClick={() => openExerciseSelector(exIndex)}
                  style={{...styles.input, cursor: 'pointer', backgroundColor: '#f0f8ff', borderColor: '#007bff'}}
                />
              </div>

              {/* HISTORY / LAST PERFORMANCE ANZEIGE */}
              {ex.lastPerform && (
                <div style={styles.historyBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <History size={14} color="#666" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>
                      {t('history_title')}: {new Date(ex.lastPerform.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', paddingLeft: '20px' }}>
                     {ex.lastPerform.sets.map((s, i) => (
                       <span key={i} style={{ marginRight: '10px' }}>
                         {i+1}. {s.weight}kg x {s.reps}
                       </span>
                     ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ex.sets.map((set, setIndex) => (
                  <div key={setIndex} style={styles.setRow}>
                    <span style={styles.setNumber}>{setIndex + 1}.</span>
                    <input 
                      type="number" 
                      placeholder={t('weight_kg')} 
                      value={set.weight}
                      onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                      style={styles.smallInput}
                    />
                    <input 
                      type="number" 
                      placeholder={t('reps')} 
                      value={set.reps}
                      onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                      style={styles.smallInput}
                    />
                    {ex.sets.length > 1 && (
                      <button onClick={() => handleRemoveSet(exIndex, setIndex)} style={styles.iconBtn}>
                        <X size={16} color="#999" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => handleAddSet(exIndex)} style={styles.textBtn}>
                  + {t('add_set_btn')}
                </button>
              </div>
            </div>
          ))}

          <button onClick={handleAddExercise} style={styles.outlineBtn}>
            <Plus size={18} /> {t('add_exercise_btn')}
          </button>
        </div>
      )}

      {/* CARDIO FORM - JETZT MIT DROPDOWN */}
      {type === 'Cardio' && (
        <div style={styles.exerciseCard}>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('workout_type')}</label>
            
            {/* NEU: Select Dropdown für Cardio-Aktivitäten */}
            <select
              value={cardio.activity}
              onChange={(e) => setCardio({...cardio, activity: e.target.value})}
              style={styles.input}
            >
              <option value="" disabled>{t('choose_category')}</option>
              <option value="cardio_running">{t('cardio_running')}</option>
              <option value="cardio_cycling">{t('cardio_cycling')}</option>
              <option value="cardio_swimming">{t('cardio_swimming')}</option>
              <option value="cardio_walking">{t('cardio_walking')}</option>
              <option value="cardio_rowing">{t('cardio_rowing')}</option>
              <option value="cardio_elliptical">{t('cardio_elliptical')}</option>
              <option value="cardio_hiit">{t('cardio_hiit')}</option>
              <option value="cardio_other">{t('cardio_other')}</option>
            </select>
          </div>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('duration_min')}</label>
              <input 
                type="number" 
                value={cardio.duration}
                onChange={(e) => setCardio({...cardio, duration: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('distance_km')}</label>
              <input 
                type="number" 
                value={cardio.distance}
                onChange={(e) => setCardio({...cardio, distance: e.target.value})}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('intensity')}</label>
            <select 
              value={cardio.intensity}
              onChange={(e) => setCardio({...cardio, intensity: e.target.value})}
              style={styles.input}
            >
              <option value="Niedrig">{t('intensity_low')}</option>
              <option value="Mittel">{t('intensity_medium')}</option>
              <option value="Hoch">{t('intensity_high')}</option>
            </select>
          </div>
        </div>
      )}

      <button onClick={handleSubmit} style={styles.saveBtn}>
        <Save size={20} /> {t('save_workout')}
      </button>

      {/* MODAL FOR EXERCISE SELECTION */}
      {showGrid && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>{t('select_exercise_placeholder')}</h3>
              <button onClick={() => setShowGrid(false)} style={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            {renderCategoryGrid()}
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' },
  toggleContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
  toggle: { flex: 1, padding: '12px', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#666' },
  toggleActive: { flex: 1, padding: '12px', border: '1px solid #1a1a1a', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' },
  exerciseCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box' },
  historyBox: { backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid #007bff' },
  row: { display: 'flex', gap: '15px' },
  setRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  setNumber: { width: '20px', fontSize: '0.9rem', color: '#888' },
  smallInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' },
  textBtn: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.9rem', padding: '5px 0', fontWeight: '500' },
  outlineBtn: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px dashed #ccc', backgroundColor: 'transparent', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  saveBtn: { width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)' },
  
  // Modal Styles
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '450px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalHeader: { padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666' },
  gridBody: { padding: '20px', overflowY: 'auto', backgroundColor: '#fcfcfc' },
  categoryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  categoryCard: { padding: '25px 15px', border: '1px solid #eee', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: '#fff', textAlign: 'center' },
  iconCircle: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e7f1ff', color: '#007bff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  categoryName: { fontWeight: 'bold', color: '#333' },
  exerciseList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  exerciseItem: { padding: '12px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' },
  backBtn: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '15px', fontSize: '1rem', display: 'block' }
};

export default AddWorkout;
