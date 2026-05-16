import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Dumbbell, TrendingUp, Activity, Timer, MapPin, Gauge 
} from 'lucide-react';

// --- MAPPING: Alte deutsche Namen -> Neue Keys (KRAFTTRAINING) ---
const legacyMapping = {
  // BRUST
  "Bankdrücken mit der LH (Flachbank)": "bench_press_flat",
  "Bankdrücken mit der LH (Schrägbank)": "bench_press_incline",
  "Butterfly an der Maschine": "butterfly_machine",
  "Brustpresse": "chest_press",
  "Schräge Brustpresse": "chest_press_incline",
  "Negative Brustpresse": "chest_press_negative",
  "Butterfly mit KH": "butterfly_dumbbell",
  "Liegestütze": "pushups",
  "Butterfly am Kabelzug": "cable_crossover",

  // RÜCKEN
  "Klimmzüge": "pullups",
  "Latzug": "lat_pulldown",
  "Rudern (LH)": "rowing_barbell",
  "Rudern Einarmig (KH)": "rowing_dumbbell_single",
  "Rudern (Eng) (Kabelzug)": "rowing_cable_close",
  "Rudern (Breit) (Kabelzug)": "rowing_cable_wide",
  "Kreuzheben": "deadlift",
  "Rudern für den oberen Rücken (Maschine)": "rowing_machine_upper",
  "Latzug an der Maschine": "lat_pulldown_machine",
  "Einarmiges Rudern (Maschine)": "rowing_machine_single",
  "T - Bar Rudern": "t_bar_row",
  "Rückenstrecker (Maschine)": "back_extension",
  "Low Row (Maschine)": "low_row_machine",

  // BEINE
  "Kniebeugen mit der KH": "squat_dumbbell",
  "Kniebeugen mit der LH": "squat_barbell",
  "Beinpresse (Beidbeinig)": "leg_press",
  "Beinstrecker": "leg_extension",
  "Beinbeuger (Sitzend)": "leg_curl_seated",
  "Beinbeuger (Liegend)": "leg_curl_lying",
  "Ausfallschritte (KH)": "lunges_dumbbell",
  "Ausfallschritte (LH)": "lunges_barbell",
  "Wadenheben (Stehend)": "calf_raises_standing",
  "Wadenheben (Sitzend)": "calf_raises_seated",
  "Hackenschmidt Kniebeuge": "hack_squat",
  "Rumänisches Kreuzheben": "romanian_deadlift",
  "Adduktoren Maschine": "adductor_machine",
  "Abduktoren Maschine": "abductor_machine",

  // SCHULTERN
  "Schulterdrücken mit der LH (Stehend)": "shoulder_press_barbell",
  "Schulterdrücken mit der KH (Stehend)": "shoulder_press_dumbbell_standing",
  "Schulterdrücken mit der KH (Sitzend)": "shoulder_press_dumbbell_seated",
  "Seitheben mit KH": "lateral_raise_dumbbell",
  "Seitheben am Kabelzug": "lateral_raise_cable",
  "Frontheben": "front_raise",
  "Reverse Flys mit KH": "reverse_fly_dumbbell",
  "Reverse Flys an der Maschine": "reverse_fly_machine",
  "Face Pulls am Kabelzug": "face_pulls",

  // ARME
  "Bizeps-Curls (KH)": "bicep_curls_dumbbell",
  "Bizeps-Curls mit der KH (Sitzend)": "bicep_curls_seated",
  "Bizeps-Curls mit der KH (Stehend)": "bicep_curls_standing",
  "Bizeps-Curls mit der LH (Stehend)": "bicep_curls_barbell",
  "Hammer-Curls mit der KH (Sitzend)": "hammer_curls_seated",
  "Hammer-Curls mit der KH (Stehend)": "hammer_curls_standing",
  "Preacher Curl mit der KH": "preacher_curls_dumbbell",
  "Preacher Curl mit der ß - Stange": "preacher_curls_sz",
  "Trizeps-Drücken (Kabel)": "tricep_pushdown",
  "Trizepspushdowns am Kabel (Einarmig)": "tricep_pushdown_single",
  "Dips": "dips",
  "Enges Bankdrücken": "close_grip_bench_press",
  "Skull Crushers (SZ-Stange)": "skull_crushers",
  "Trizepsdrücken (Maschine)": "tricep_press_machine",

  // BAUCH
  "Crunches": "crunches",
  "Plank": "plank",
  "Beinheben (Liegend)": "leg_raises_lying",
  "Beinheben (Hängend)": "leg_raises_hanging",
  "Russian Twist": "russian_twist",
  "Ab Roller": "ab_roller",
  "Woodchopper": "woodchopper",
  "Sit Ups": "sit_ups",
  "Bicycle Crunches": "bicycle_crunches"
};

// --- MAPPING: Alte Cardio Namen -> Neue Keys (CARDIO) ---
const cardioLegacyMapping = {
  "Laufen": "cardio_running",
  "Radfahren": "cardio_cycling",
  "Schwimmen": "cardio_swimming",
  "Gehen": "cardio_walking",
  "Spazieren": "cardio_walking",
  "Rudern": "cardio_rowing",
  "Crosstrainer": "cardio_elliptical",
  "HIIT": "cardio_hiit",
  "Sonstiges": "cardio_other"
};

const TrainingDashboard = ({ token }) => {
  const { t } = useTranslation();
  
  const [workouts, setWorkouts] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [token]);

  // Funktion zum Bereinigen der Daten (Alt -> Neu)
  const normalizeWorkoutNames = (data) => {
    return data.map(workout => {
      // 1. Krafttraining Normalisierung
      if (workout.exercises) {
        const normalizedExercises = workout.exercises.map(ex => ({
          ...ex,
          name: legacyMapping[ex.name] || ex.name
        }));
        workout.exercises = normalizedExercises;
      }
      
      // 2. Cardio Normalisierung (Alte Texte -> Keys)
      if (workout.type === 'Cardio' && workout.cardio && workout.cardio.activity) {
        const oldName = workout.cardio.activity;
        // Wenn es im Mapping ist (z.B. "Laufen"), nimm den Key "cardio_running"
        if (cardioLegacyMapping[oldName]) {
          workout.cardio.activity = cardioLegacyMapping[oldName];
        }
      }
      
      return workout;
    });
  };

  const normalizeRankingNames = (data) => {
    return data.map(item => ({
      ...item,
      exercise: legacyMapping[item.exercise] || item.exercise
    }));
  };

  const fetchData = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const [resWorkouts, resRanking] = await Promise.all([
        axios.get('http://localhost:5000/api/workouts', config),
        axios.get('http://localhost:5000/api/workouts/progress-ranking', config)
      ]);

      const cleanWorkouts = normalizeWorkoutNames(resWorkouts.data || []);
      const cleanRanking = normalizeRankingNames(resRanking.data || []);

      setWorkouts(cleanWorkouts);
      setRanking(cleanRanking);
      
      if (cleanWorkouts.length > 0) {
        const firstStrength = cleanWorkouts.find(w => w.type === 'Krafttraining');
        if (firstStrength && firstStrength.exercises.length > 0) {
          setSelectedExercise(firstStrength.exercises[0].name);
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden der Trainingsdaten:", err);
    }
  };

  useEffect(() => {
    if (!selectedExercise || !workouts.length) return;

    const data = [];
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedWorkouts.forEach(workout => {
      if (workout.type === 'Krafttraining' && workout.exercises) {
        const ex = workout.exercises.find(e => e.name === selectedExercise);
        if (ex && ex.sets && ex.sets.length > 0) {
          const maxWeight = Math.max(...ex.sets.map(s => Number(s.weight) || 0));
          data.push({
            date: new Date(workout.date).toLocaleDateString(), 
            weight: maxWeight
          });
        }
      }
    });

    setChartData(data);
  }, [selectedExercise, workouts]);

  const getUniqueExerciseNames = () => {
    const names = new Set();
    workouts.forEach(w => {
      if (w.exercises) {
        w.exercises.forEach(e => names.add(e.name));
      }
    });
    return Array.from(names);
  };

  // Helper für die Intensitäts-Übersetzung
  const getIntensityLabel = (val) => {
    if (val === 'Niedrig') return t('intensity_low');
    if (val === 'Mittel') return t('intensity_medium');
    if (val === 'Hoch') return t('intensity_high');
    return val;
  };

  // Filter Cardio Workouts (neueste zuerst)
  const cardioWorkouts = workouts.filter(w => w.type === 'Cardio');

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <Dumbbell size={28} color="#1a1a1a" />
        <h2 style={{ margin: 0 }}>{t('training_title')}</h2>
      </div>

      {/* CHART SECTION (KRAFTTRAINING) */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <TrendingUp size={20} color="#007bff" />
          <h3 style={styles.cardTitle}>{t('chart_progress')}</h3>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <select 
            style={styles.select} 
            value={selectedExercise} 
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="" disabled>{t('select_exercise_placeholder')}</option>
            {getUniqueExerciseNames().map(name => (
              <option key={name} value={name}>{t(name)}</option>
            ))}
          </select>
        </div>

        <div style={{ width: '100%', height: 300, minHeight: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" stroke="#999" tick={{fontSize: 12}} />
                <YAxis stroke="#999" tick={{fontSize: 12}} unit=" kg" />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} kg`, t('weight_kg')]}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#1a1a1a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1a1a1a' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              {t('no_data')}
            </div>
          )}
        </div>
      </div>

      {/* RANKING SECTION */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <TrendingUp size={20} color="#28a745" />
          <h3 style={styles.cardTitle}>{t('ranking_title')}</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>
          {t('ranking_subtitle')}
        </p>

        <div style={styles.rankingList}>
          {ranking.length > 0 ? (
            ranking.map((item, index) => (
              <div key={index} style={styles.rankItem}>
                <div style={styles.rankBadge}>{index + 1}</div>
                <div style={styles.rankInfo}>
                  <strong>{t(item.exercise)}</strong>
                  <span style={styles.rankSubText}>
                    {item.oldWeight}kg <TrendingUp size={12} /> {item.newWeight}kg
                  </span>
                </div>
                <div style={styles.rankPercent}>
                  +{item.percentage}%
                </div>
              </div>
            ))
          ) : (
             <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
               {t('no_data')}
             </div>
          )}
        </div>
      </div>

      {/* CARDIO LOG SECTION */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Activity size={20} color="#ff4d4d" />
          <h3 style={styles.cardTitle}>{t('cardio_training')} Log</h3>
        </div>

        <div style={styles.rankingList}>
          {cardioWorkouts.length > 0 ? (
            cardioWorkouts.map((workout, index) => (
              <div key={index} style={styles.cardioItem}>
                
                {/* Linker Teil: Datum & Aktivität (Übersetzt) */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                  <strong style={{ fontSize: '1rem', color: '#333' }}>
                    {/* WICHTIG: Hier wird übersetzt */}
                    {t(workout.cardio.activity) || t('cardio_training')}
                  </strong>
                </div>

                {/* Rechter Teil: Stats */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  
                  {/* Dauer */}
                  <div style={styles.statPill}>
                    <Timer size={14} color="#666" />
                    <span>{workout.cardio.duration} min</span>
                  </div>

                  {/* Distanz (nur wenn vorhanden) */}
                  {workout.cardio.distance > 0 && (
                    <div style={styles.statPill}>
                      <MapPin size={14} color="#666" />
                      <span>{workout.cardio.distance} km</span>
                    </div>
                  )}

                  {/* Intensität Badge */}
                  {workout.cardio.intensity && (
                    <div style={{
                      ...styles.intensityBadge,
                      backgroundColor: 
                        workout.cardio.intensity === 'Hoch' ? '#ffebee' : 
                        workout.cardio.intensity === 'Mittel' ? '#fff3e0' : '#e8f5e9',
                      color:
                        workout.cardio.intensity === 'Hoch' ? '#d32f2f' : 
                        workout.cardio.intensity === 'Mittel' ? '#ef6c00' : '#2e7d32',
                    }}>
                      <Gauge size={12} />
                      {getIntensityLabel(workout.cardio.intensity)}
                    </div>
                  )}
                </div>

              </div>
            ))
          ) : (
             <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
               {t('no_data')}
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  card: { backgroundColor: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '25px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  cardTitle: { fontSize: '1.1rem', margin: 0, color: '#555' },
  rankingList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  rankItem: { display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '10px' },
  rankBadge: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#007bff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px' },
  rankInfo: { flex: 1 },
  rankSubText: { display: 'block', fontSize: '0.8rem', color: '#777', marginTop: '2px' },
  rankPercent: { fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' },
  select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', cursor: 'pointer', backgroundColor: '#fff' },
  
  // Cardio Styles
  cardioItem: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '15px', 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    border: '1px solid #eee',
    flexWrap: 'wrap',
    gap: '10px'
  },
  statPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.9rem',
    color: '#555',
    backgroundColor: '#f5f5f5',
    padding: '5px 10px',
    borderRadius: '20px'
  },
  intensityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '6px'
  }
};

export default TrainingDashboard;