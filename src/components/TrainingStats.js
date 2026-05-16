import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, TrendingUp, Activity, Calendar, List } from 'lucide-react';

const TrainingStats = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');

  // Simulation der Datenberechnung für die Rangliste
  const calculateProgressRank = () => {
    // Hier würde die Logik hinkommen, die Gewichte vergleicht
    return [
      { name: "Bankdrücken", increase: "15kg", percent: 20 },
      { name: "Kniebeugen", increase: "10kg", percent: 12 },
      { name: "Kreuzheben", increase: "20kg", percent: 10 }
    ];
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}><Dumbbell size={32} /> Trainings-Dokumentation</h1>

      {/* RANG LISTE DER STEIGERUNG */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}><TrendingUp color="#28a745" /> Top Steigerungen (letzte Wochen)</h2>
        <div style={styles.rankGrid}>
          {calculateProgressRank().map((item, index) => (
            <div key={index} style={styles.rankCard}>
              <span style={styles.rankNumber}>#{index + 1}</span>
              <div style={styles.rankInfo}>
                <strong>{item.name}</strong>
                <span>+{item.increase} ({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GRAPH FÜR ÜBUNGEN */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}><Activity color="#007bff" /> Übungsverlauf</h2>
        <select 
          onChange={(e) => setSelectedExercise(e.target.value)} 
          style={styles.select}
        >
          <option value="">Übung wählen...</option>
          <option value="Bankdrücken">Bankdrücken</option>
          <option value="Kniebeugen">Kniebeugen</option>
        </select>
        
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={/* Hier die Workout-Daten filtern */ []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#007bff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARDIO SECTION */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}><Activity color="#ff8800" /> Cardio & Ausdauer</h2>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>Was</th>
              <th>Dauer</th>
              <th>Distanz</th>
              <th>Intensität</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Laufen</td>
              <td>45 Min</td>
              <td>7.5 km</td>
              <td>Hoch</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', color: '#333', marginBottom: '30px' },
  section: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '25px' },
  subHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '20px' },
  rankGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  rankCard: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px', borderLeft: '5px solid #28a745' },
  rankNumber: { fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' },
  rankInfo: { display: 'flex', flexDirection: 'column' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', width: '200px' },
  chartContainer: { height: '300px', width: '100%' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f4f4f4', textAlign: 'left' }
};

export default TrainingStats;