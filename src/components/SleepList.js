import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Moon, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // NEU: Import für Übersetzungen

const SleepList = ({ sleepData, onDelete }) => {
  const { t, i18n } = useTranslation(); // NEU: Hook initialisieren
  
  // Hilfsfunktion zur Berechnung der Schlafdauer
  const calculateDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = e - s;
    const diffHrs = diffMs / (1000 * 60 * 60);
    // NEU: 'Std.' durch übersetzbares Suffix ersetzen (z.B. "hrs" im Englischen)
    return diffHrs.toFixed(1) + ' ' + t('duration_suffix'); 
  };

  // Hilfsfunktion zum Formatieren des Datums
  const formatDate = (dateString) => {
    // NEU: Nutzt die aktuelle Sprache (i18n.language) statt fest 'de-DE'
    return new Date(dateString).toLocaleDateString(i18n.language, {
      weekday: 'short', day: '2-digit', month: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    // NEU: Text übersetzt
    if (!window.confirm(t('confirm_delete') || "Möchtest du diesen Eintrag wirklich löschen?")) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/sleep/${id}`, {
        headers: { 'x-auth-token': token }
      });
      toast.info(t('delete_success')); // NEU: Text übersetzt
      if (onDelete) onDelete(); // Aktualisiere Daten in App.js
    } catch (err) {
      toast.error(t('error_general') || 'Löschen fehlgeschlagen'); // NEU: Fallback/Übersetzung
    }
  };

  const styles = {
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: {
      backgroundColor: '#fff', padding: '20px', borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center', position: 'relative'
    },
    dateBadge: {
      backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '8px',
      fontWeight: 'bold', fontSize: '0.9rem', color: '#555', marginBottom: '5px',
      display: 'inline-block'
    },
    infoMain: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333' },
    infoSub: { fontSize: '0.9rem', color: '#777', marginTop: '5px' },
    quality: (q) => ({
      width: '30px', height: '30px', borderRadius: '50%',
      backgroundColor: q >= 4 ? '#d4edda' : q <= 2 ? '#f8d7da' : '#fff3cd',
      color: q >= 4 ? '#155724' : q <= 2 ? '#721c24' : '#856404',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 'bold', fontSize: '0.9rem'
    }),
    deleteBtn: {
      background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545',
      padding: '5px', marginLeft: '10px'
    }
  };

  if (!sleepData || sleepData.length === 0) {
    // NEU: Text übersetzt
    return <div style={{textAlign: 'center', color: '#999', marginTop: '20px'}}>{t('no_sleep_data')}</div>;
  }

  return (
    <div style={styles.listContainer}>
      {sleepData.map((entry) => (
        <div key={entry._id} style={styles.card}>
          <div>
            <div style={styles.dateBadge}>{formatDate(entry.date)}</div>
            <div style={styles.infoMain}>
              <Moon size={18} style={{marginRight:'8px', verticalAlign:'text-bottom'}} />
              {calculateDuration(entry.sleepStart, entry.sleepEnd)}
            </div>
            <div style={styles.infoSub}>
              <Clock size={14} style={{marginRight:'5px', verticalAlign:'middle'}}/>
              {new Date(entry.sleepStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
              {new Date(entry.sleepEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            {entry.notes && <div style={{fontSize:'0.85rem', color:'#666', marginTop:'5px', fontStyle:'italic'}}>"{entry.notes}"</div>}
          </div>
          
          <div style={{display:'flex', alignItems:'center'}}>
            {/* NEU: Tooltip übersetzt */}
            <div title={t('quality') || "Qualität"} style={styles.quality(entry.quality)}>
              {entry.quality}
            </div>
            {/* NEU: Tooltip übersetzt */}
            <button onClick={() => handleDelete(entry._id)} style={styles.deleteBtn} title={t('delete') || "Löschen"}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SleepList;