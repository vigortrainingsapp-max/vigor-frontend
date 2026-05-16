import React from 'react';
import { Edit2, Trash2, FileText, Table } from 'lucide-react';
import api from '../api';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next'; // <--- NEU

const WeightList = ({ weights, onRefresh, onEdit, viewMode }) => {
  const { t } = useTranslation(); // <--- NEU

  // --- EXPORT LOGIK ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`VIGOR: ${t('report_title')}`, 14, 20); // <--- ÜBERSETZT
    doc.setFontSize(10);
    doc.text(`${t('created_at')}: ${new Date().toLocaleDateString()} | ${t('mode')}: ${viewMode === 'body' ? t('nav_body') : t('nav_sleep')}`, 14, 30);

    let tableColumn, tableRows;

    if (viewMode === 'body') {
      tableColumn = [t('date'), t('weight_kg'), t('waist_cm'), t('chest_cm'), t('arms_cm'), t('kfa_percent')]; // <--- ÜBERSETZT
      tableRows = weights.map(w => [
        new Date(w.date).toLocaleDateString(),
        w.weight,
        w.waist || '-',
        w.chest || '-',
        w.arms || '-',
        w.kfa || '-'
      ]);
    } else {
      tableColumn = [t('date'), t('sleep_duration'), t('quality'), t('bedtime'), t('wakeup_time')];
      tableRows = weights.map(s => [
        new Date(s.date).toLocaleDateString(),
        s.duration,
        s.quality,
        s.sleepStart,
        s.sleepEnd
      ]);
    }

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`vigor_report_${viewMode}.pdf`);
  };

  const deleteEntry = async (id) => {
    if (window.confirm(t('confirm_delete'))) { // <--- ÜBERSETZT
      try {
        const endpoint = viewMode === 'sleep' ? '/sleep' : '/weight';
        await api.delete(`${endpoint}/${id}`);
        toast.success(t('delete_success'));
        onRefresh();
      } catch (err) {
        toast.error(t('error_general'));
      }
    }
  };

  // CSV Daten vorbereiten
  const csvData = weights.map(item => {
    if (viewMode === 'body') {
      return {
        [t('date')]: new Date(item.date).toLocaleDateString(),
        [t('weight_kg')]: item.weight,
        [t('waist_cm')]: item.waist,
        [t('chest_cm')]: item.chest,
        [t('arms_cm')]: item.arms,
        [t('kfa_percent')]: item.kfa
      };
    } else {
      return {
        [t('date')]: new Date(item.date).toLocaleDateString(),
        [t('sleep_duration')]: item.duration,
        [t('quality')]: item.quality,
        [t('bedtime')]: item.sleepStart,
        [t('wakeup_time')]: item.sleepEnd
      };
    }
  });

  return (
    <div style={styles.container}>
      <div style={styles.actions}>
        <button onClick={exportPDF} style={styles.btnPdf}>
          <FileText size={16} /> {t('export_pdf')}
        </button>
        <CSVLink 
          data={csvData} 
          filename={`vigor_data_${viewMode}.csv`} 
          style={{ textDecoration: 'none' }}
        >
          <button style={styles.btnCsv}>
            <Table size={16} /> {t('export_csv')}
          </button>
        </CSVLink>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{t('date')}</th>
              {viewMode === 'body' ? (
                <>
                  <th style={styles.th}>{t('weight_kg')}</th>
                  <th style={styles.th}>{t('waist')}</th>
                  <th style={styles.th}>{t('chest')}</th>
                  <th style={styles.th}>{t('arms')}</th>
                  <th style={styles.th}>KFA</th>
                </>
              ) : (
                <>
                  <th style={styles.th}>{t('sleep_duration')}</th>
                  <th style={styles.th}>{t('quality')}</th>
                  <th style={styles.th}>{t('bedtime')}</th>
                  <th style={styles.th}>{t('wakeup_time')}</th>
                </>
              )}
              <th style={styles.th}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {weights.length > 0 ? (
              weights.map((item) => (
                <tr key={item._id} style={styles.tr}>
                  <td style={styles.td}>{new Date(item.date).toLocaleDateString()}</td>
                  {viewMode === 'body' ? (
                    <>
                      <td style={styles.td}><strong>{item.weight} kg</strong></td>
                      <td style={styles.td}>{item.waist || '-'}</td>
                      <td style={styles.td}>{item.chest || '-'}</td>
                      <td style={styles.td}>{item.arms || '-'}</td>
                      <td style={styles.td}>{item.kfa ? `${item.kfa}%` : '-'}</td>
                    </>
                  ) : (
                    <>
                      <td style={styles.td}><strong>{item.duration} h</strong></td>
                      <td style={styles.td}>{item.quality}/5</td>
                      <td style={styles.td}>{item.sleepStart}</td>
                      <td style={styles.td}>{item.sleepEnd}</td>
                    </>
                  )}
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => onEdit(item)} style={styles.iconBtn} title={t('edit')}>
                        <Edit2 size={18} color="#007bff" />
                      </button>
                      <button onClick={() => deleteEntry(item._id)} style={styles.iconBtn} title={t('delete')}>
                        <Trash2 size={18} color="#dc3545" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  {t('no_entries')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { marginTop: '20px' },
  actions: { display: 'flex', gap: '10px', marginBottom: '15px' },
  btnPdf: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  btnCsv: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', marginTop: '15px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  th: { backgroundColor: '#f8f9fa', padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', color: '#495057', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '15px', borderBottom: '1px solid #dee2e6', color: '#212529', fontSize: '0.95rem' },
  tr: { transition: 'background-color 0.2s' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '50%', transition: 'background-color 0.2s' }
};

export default WeightList;