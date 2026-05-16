import React from 'react';
import { Calendar, Scale, Ruler, X, Image as ImageIcon } from 'lucide-react';

const Gallery = ({ weights = [], onClose }) => {
  // Nur Einträge mit Bildern filtern
  const photoEntries = weights.filter(w => w.image).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImageIcon size={24} color="#007bff" />
            <h2 style={{ margin: 0 }}>Fortschritts-Galerie</h2>
          </div>
          <X onClick={onClose} style={styles.closeIcon} size={28} />
        </div>
        
        <div style={styles.grid}>
          {photoEntries.length > 0 ? photoEntries.map(entry => (
            <div key={entry._id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img src={entry.image} alt="Progress" style={styles.image} />
              </div>
              <div style={styles.info}>
                <div style={styles.dateRow}>
                  <Calendar size={14} />
                  <span>{new Date(entry.date).toLocaleDateString('de-DE')}</span>
                </div>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}><Scale size={14} /> {entry.weight}kg</div>
                  {entry.waist && <div style={styles.statItem}><Ruler size={14} /> B: {entry.waist}cm</div>}
                  {entry.chest && <div style={styles.statItem}><Ruler size={14} /> Br: {entry.chest}cm</div>}
                  {entry.kfa && <div style={{...styles.statItem, color: '#28a745'}}>KFA: {entry.kfa}%</div>}
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#999' }}>
              <ImageIcon size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Noch keine Fotos hochgeladen. Füge beim Loggen eines Gewichts ein Foto hinzu!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modal: { backgroundColor: '#fff', width: '100%', maxWidth: '1000px', maxHeight: '90vh', borderRadius: '20px', padding: '25px', overflowY: 'auto', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  closeIcon: { cursor: 'pointer', color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff', border: '1px solid #eee' },
  imageWrapper: { width: '100%', height: '250px', backgroundColor: '#000' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { padding: '12px' },
  dateRow: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', color: '#333' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.75rem', color: '#666' },
  statItem: { display: 'flex', alignItems: 'center', gap: '4px' }
};

export default Gallery;