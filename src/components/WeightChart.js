import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell
} from 'recharts';
import { useTranslation } from 'react-i18next'; // <--- NEU

const WeightChart = ({ data, mode, goals }) => {
  const { t, i18n } = useTranslation(); // <--- NEU

  // Daten chronologisch sortieren
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  // State für die sichtbaren Linien (NUR für Body-Modus)
  const [visibleLines, setVisibleLines] = useState({
    weight: true, waist: false, chest: false, arms: false, kfa: false
  });

  // Konfiguration jetzt INNERHALB der Komponente, damit t() funktioniert
  const lineConfigs = {
    weight: { color: '#007bff', name: t('weight_kg'), unit: ' kg' },
    waist: { color: '#28a745', name: t('waist_cm'), unit: ' cm' },
    chest: { color: '#ffc107', name: t('chest_cm'), unit: ' cm' },
    arms: { color: '#dc3545', name: t('arms_cm'), unit: ' cm' },
    kfa: { color: '#6f42c1', name: t('kfa_percent'), unit: ' %' }
  };

  const handleLegendChange = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- ANSICHT FÜR SCHLAF-TRACKING ---
  if (mode === 'sleep') {
    const sleepChartData = sortedData.map(d => ({
      ...d,
      dateStr: new Date(d.date).toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric', month: 'numeric' }), // <--- Sprache dynamisch
      duration: d.duration || 0,
      quality: d.quality || 0
    }));

    return (
      <div style={styles.sleepChartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sleepChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dateStr" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 5]} hide />
            <Tooltip 
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="duration" 
              name={t('sleep_duration')} // <--- ÜBERSETZT ("Dauer")
              fill="#8884d8" 
              radius={[10, 10, 0, 0]} 
              barSize={20}
            >
              {sleepChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.duration >= 7 ? '#4ade80' : '#f87171'} />
              ))}
            </Bar>
            <Bar 
              yAxisId="right" 
              dataKey="quality" 
              name={t('quality')} // <--- ÜBERSETZT ("Qualität")
              fill="#82ca9d" 
              radius={[10, 10, 0, 0]} 
              barSize={20} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // --- ANSICHT FÜR KÖRPER-TRACKING ---
  const chartData = sortedData.map(d => ({
    ...d,
    dateStr: new Date(d.date).toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' }), // <--- Sprache dynamisch
    weight: d.weight ? parseFloat(d.weight) : null,
    waist: d.waist ? parseFloat(d.waist) : null,
    chest: d.chest ? parseFloat(d.chest) : null,
    arms: d.arms ? parseFloat(d.arms) : null,
    kfa: d.kfa ? parseFloat(d.kfa) : null,
  }));

  return (
    <div style={styles.bodyChartContainer}>
      {/* Checkboxen zur Auswahl der Linien */}
      <div style={styles.checkboxContainer}>
        {Object.keys(lineConfigs).map(key => (
          <label key={key} style={{ 
            ...styles.checkboxLabel, 
            opacity: visibleLines[key] ? 1 : 0.5,
            borderBottom: visibleLines[key] ? `3px solid ${lineConfigs[key].color}` : '3px solid transparent'
          }}>
            <input 
              type="checkbox" 
              checked={visibleLines[key]} 
              onChange={() => handleLegendChange(key)}
              style={{ display: 'none' }} 
            />
            {lineConfigs[key].name}
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="dateStr" 
            tick={{ fontSize: 12, fill: '#999' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12, fill: '#999' }} 
            axisLine={false} 
            tickLine={false} 
            width={40}
          />
          
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            itemStyle={{ fontSize: '0.9rem', fontWeight: 600 }}
          />

          {/* Ziel-Linien (werden nur angezeigt, wenn die entsprechende Daten-Linie aktiv ist) */}
          {Object.keys(goals).map(key => (
            // Mapping von Goal-Keys zu LineConfig-Keys prüfen (z.B. goals.weight -> weight)
            visibleLines[key] && goals[key] > 0 && (
              <ReferenceLine 
                key={`ref-${key}`} 
                y={goals[key]} 
                stroke={lineConfigs[key]?.color || '#ccc'} 
                strokeDasharray="3 3" 
                label={{ 
                  value: t('goal_label'), // <--- ÜBERSETZT ("Ziel")
                  position: 'right', 
                  fill: lineConfigs[key]?.color || '#ccc', 
                  fontSize: 10 
                }} 
              />
            )
          ))}

          {/* Daten-Linien */}
          {Object.keys(lineConfigs).map(key => (
            visibleLines[key] && (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={lineConfigs[key].color} 
                strokeWidth={3}
                name={lineConfigs[key].name} // <--- Hier kommt der übersetzte Name rein
                connectNulls={true}
                dot={{ r: 4, fill: lineConfigs[key].color, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  bodyChartContainer: { 
    height: 'auto', 
    minHeight: '450px', 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  sleepChartContainer: { 
    height: 'auto', 
    minHeight: '400px', 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  checkboxContainer: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: '15px', 
    marginBottom: '20px' 
  },
  checkboxLabel: { 
    cursor: 'pointer', 
    fontSize: '0.9rem', 
    fontWeight: '600', 
    color: '#333',
    padding: '5px 10px',
    transition: 'all 0.2s'
  }
};

export default WeightChart;