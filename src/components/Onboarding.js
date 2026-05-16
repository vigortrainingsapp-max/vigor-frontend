import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Target, 
  Activity, 
  Moon, 
  User, 
  Users, 
  Ruler, 
  Percent, 
  Dumbbell, 
  Calendar,
  ClipboardList,
  MapPin,
  Footprints
} from 'lucide-react';

const Onboarding = ({ onComplete, initialData }) => {
  const [step, setStep] = useState(1);

  // --- ANPASSUNG START ---
  // Wir prüfen, ob initialData vorhanden ist, und nutzen diese Werte als Startzustand.
  // Falls nicht (z.B. erster Login), fallen wir auf die Standardwerte zurück.

  const [age, setAge] = useState(initialData?.age || '');
  const [gender, setGender] = useState(initialData?.gender || null);
  const [height, setHeight] = useState(initialData?.height || 175);
  const [kfa, setKfa] = useState(initialData?.kfa || 20);
  const [experience, setExperience] = useState(initialData?.experience || null);
  const [frequency, setFrequency] = useState(initialData?.frequency || null);
  const [trainingPlan, setTrainingPlan] = useState(initialData?.trainingPlan || null);
  const [trainingLocation, setTrainingLocation] = useState(initialData?.trainingLocation || null);
  const [activityLevel, setActivityLevel] = useState(initialData?.activityLevel || null);
  // --- ANPASSUNG ENDE ---

  const steps = [
    {
      title: "Willkommen bei VIGOR",
      text: "Dein persönlicher Begleiter für Fitness, Körperdaten und Schlaf-Tracking. Lass uns kurz die Bereiche zeigen.",
      icon: <CheckCircle size={48} color="#007bff" />
    },
    {
      title: "Körperdaten & Tracking",
      text: "Verfolge dein Gewicht, Körperfettanteil und Muskelmasse. Visualisiere deinen Fortschritt mit interaktiven Charts.",
      icon: <Activity size={48} color="#28a745" />
    },
    {
      title: "Schlaf & Erholung",
      text: "Tracke deinen Schlaf, analysiere deine Schlafphasen und finde heraus, was deine Erholung beeinflusst.",
      icon: <Moon size={48} color="#6f42c1" />
    },
    {
      title: "Persönliche Daten",
      text: "Damit wir alles besser auf dich zuschneiden können, benötigen wir ein paar Angaben zu dir.",
      icon: <User size={48} color="#e67e22" />
    },
    {
      title: "Dein Geschlecht",
      text: "Bitte wähle dein biologisches Geschlecht für präzisere Berechnungen.",
      icon: <Users size={48} color="#e84393" />
    },
    {
      title: "Deine Größe",
      text: "Wie groß bist du? (in cm)",
      icon: <Ruler size={48} color="#00cec9" />
    },
    {
      title: "Körperfettanteil (KFA)",
      text: "Schätze deinen aktuellen Körperfettanteil ein.",
      icon: <Percent size={48} color="#fab1a0" />
    },
    {
      title: "Trainingserfahrung",
      text: "Wie lange trainierst du schon aktiv?",
      icon: <Dumbbell size={48} color="#d63031" />
    },
    {
      title: "Trainingshäufigkeit",
      text: "Wie oft möchtest du pro Woche trainieren?",
      icon: <Calendar size={48} color="#0984e3" />
    },
    {
      title: "Trainingsplan",
      text: "Welche Art von Trainingsplan bevorzugst du?",
      icon: <ClipboardList size={48} color="#6c5ce7" />
    },
    {
      title: "Trainingsort",
      text: "Wo trainierst du hauptsächlich?",
      icon: <MapPin size={48} color="#00b894" />
    },
    {
      title: "Aktivitätslevel", // Neuer Schritt
      text: "Wie aktiv bist du in deinem Alltag (Beruf & Freizeit)?",
      icon: <Footprints size={48} color="#fdcb6e" />
    },
    {
      title: "Bereit!",
      text: "Alles eingestellt. Viel Erfolg auf deiner Reise mit VIGOR!",
      icon: <Target size={48} color="#e17055" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Beim Abschluss übergeben wir alle gesammelten Daten
      onComplete({
        age,
        gender,
        height,
        kfa,
        experience,
        frequency,
        trainingPlan,
        trainingLocation,
        activityLevel
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // --- RENDER FUNCTIONS FOR INPUTS ---

  const renderInputs = () => {
    switch(step) {
      case 4: // Persönliche Daten (Alter)
        return (
          <div style={styles.inputContainer}>
            <label style={styles.label}>Dein Alter</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              placeholder="z.B. 25"
              style={styles.input}
            />
          </div>
        );
      case 5: // Geschlecht
        return (
          <div style={styles.selectionContainer}>
             <button 
                style={gender === 'male' ? styles.selectionBtnActive : styles.selectionBtn}
                onClick={() => setGender('male')}
             >
               Männlich
             </button>
             <button 
                style={gender === 'female' ? styles.selectionBtnActive : styles.selectionBtn}
                onClick={() => setGender('female')}
             >
               Weiblich
             </button>
          </div>
        );
      case 6: // Größe
        return (
          <div style={styles.sliderContainer}>
            <div style={styles.valueDisplay}>{height} cm</div>
            <input 
              type="range" 
              min="140" 
              max="220" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)}
              style={styles.slider}
            />
          </div>
        );
      case 7: // KFA
        return (
           <div style={styles.sliderContainer}>
            <div style={styles.valueDisplay}>{kfa} %</div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={kfa} 
              onChange={(e) => setKfa(e.target.value)}
              style={styles.slider}
            />
            <p style={styles.hint}>Keine Sorge, eine Schätzung reicht aus.</p>
          </div>
        );
      case 8: // Erfahrung
        const expOptions = [
          { id: 'beginner', title: 'Anfänger', desc: '0 - 1 Jahre Erfahrung. Du lernst gerade die Grundlagen.', duration: '< 1 Jahr' },
          { id: 'intermediate', title: 'Fortgeschritten', desc: '1 - 3 Jahre. Du kennst die Übungen und hast Routine.', duration: '1-3 Jahre' },
          { id: 'advanced', title: 'Profi', desc: '3+ Jahre. Training ist ein fester Bestandteil deines Lebens.', duration: '> 3 Jahre' }
        ];
        return (
          <div style={styles.expContainer}>
            {expOptions.map(opt => (
              <div 
                key={opt.id} 
                style={{
                  ...styles.expCard, 
                  borderColor: experience === opt.id ? '#007bff' : '#eee',
                  backgroundColor: experience === opt.id ? '#f0f7ff' : '#fff'
                }}
                onClick={() => setExperience(opt.id)}
              >
                <div style={styles.expHeader}>
                  <span style={styles.expTitle}>{opt.title}</span>
                  <span style={styles.expDuration}>{opt.duration}</span>
                </div>
                <p style={styles.expDesc}>{opt.desc}</p>
              </div>
            ))}
          </div>
        );
      case 9: // Häufigkeit
        const freqs = [2, 3, 4, 5, 6];
        return (
          <div style={styles.freqContainer}>
            <p style={styles.label}>Trainingstage pro Woche:</p>
            <div style={styles.freqGrid}>
              {freqs.map(num => (
                <div 
                  key={num}
                  style={{
                    ...styles.freqCard,
                     borderColor: frequency === num ? '#007bff' : '#eee',
                     backgroundColor: frequency === num ? '#007bff' : '#fff',
                     color: frequency === num ? '#fff' : '#333'
                  }}
                  onClick={() => setFrequency(num)}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold'}}>{num}x</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 10: // Trainingsplan
        const plans = [
          { id: 'GK', label: 'Ganzkörper (GK)', desc: 'Jedes Training den ganzen Körper.' },
          { id: 'OKUK', label: 'Ober-/Unterkörper', desc: 'Split in Ober- und Unterkörper.' },
          { id: 'PPL', label: 'Push / Pull / Legs', desc: 'Druck-, Zugübungen und Beine getrennt.' },
          { id: 'BRO', label: 'Bro-Split', desc: 'Jeden Tag eine andere Muskelgruppe.' }
        ];
        return (
           <div style={styles.expContainer}>
            {plans.map(p => (
               <div 
                key={p.id}
                style={{
                  ...styles.expCard,
                  borderColor: trainingPlan === p.id ? '#6c5ce7' : '#eee',
                  backgroundColor: trainingPlan === p.id ? '#f3f0ff' : '#fff'
                }}
                onClick={() => setTrainingPlan(p.id)}
               >
                 <span style={styles.expTitle}>{p.label}</span>
                 <p style={styles.expDesc}>{p.desc}</p>
               </div>
            ))}
           </div>
        );
      case 11: // Trainingsort
        return (
          <div style={styles.selectionContainer}>
             <button 
                style={trainingLocation === 'gym' ? {...styles.selectionBtnActive, backgroundColor: '#00b894', borderColor: '#00b894'} : styles.selectionBtn}
                onClick={() => setTrainingLocation('gym')}
             >
               Fitnessstudio
             </button>
             <button 
                style={trainingLocation === 'home' ? {...styles.selectionBtnActive, backgroundColor: '#00b894', borderColor: '#00b894'} : styles.selectionBtn}
                onClick={() => setTrainingLocation('home')}
             >
               Zuhause / Home Gym
             </button>
          </div>
        );
      case 12: // Aktivitätslevel (NEU)
        const activityOptions = [
          { id: 'sedentary', title: 'Sitzend', desc: 'Bürojob, wenig Bewegung im Alltag.' },
          { id: 'light', title: 'Leicht Aktiv', desc: 'Stehende Tätigkeit oder viel Spazieren.' },
          { id: 'moderate', title: 'Moderat', desc: 'Körperliche Arbeit oder sehr aktiver Alltag.' },
          { id: 'heavy', title: 'Sehr Aktiv', desc: 'Harte körperliche Arbeit (Bau, Handwerk).' }
        ];
        return (
           <div style={styles.expContainer}>
            {activityOptions.map(act => (
               <div 
                key={act.id}
                style={{
                  ...styles.expCard,
                  borderColor: activityLevel === act.id ? '#fdcb6e' : '#eee',
                  backgroundColor: activityLevel === act.id ? '#fff7e6' : '#fff'
                }}
                onClick={() => setActivityLevel(act.id)}
               >
                 <span style={styles.expTitle}>{act.title}</span>
                 <p style={styles.expDesc}>{act.desc}</p>
               </div>
            ))}
           </div>
        );
      default:
        return null;
    }
  };

  const currentStepData = steps[step - 1];

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${(step / steps.length) * 100}%` }}></div>
        </div>

        <div style={styles.iconContainer}>
          {currentStepData.icon}
        </div>

        <h2 style={styles.title}>{currentStepData.title}</h2>
        <p style={styles.text}>{currentStepData.text}</p>

        {/* Dynamic Inputs */}
        <div style={styles.contentArea}>
          {renderInputs()}
        </div>

        <div style={styles.footer}>
          {step > 1 && (
             <button onClick={handleBack} style={styles.backBtn}>
               <ChevronLeft size={20} /> Zurück
             </button>
          )}

          <button onClick={handleNext} style={styles.nextBtn}>
            {step === steps.length ? "Abschließen" : "Weiter"} <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '30px',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'hidden'
  },
  progressContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: '#f0f0f0'
  },
  progressBar: {
    height: '100%', backgroundColor: '#007bff', transition: 'width 0.3s ease'
  },
  iconContainer: {
    marginBottom: '20px',
    display: 'inline-flex',
    padding: '15px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa'
  },
  title: { fontSize: '1.5rem', marginBottom: '10px', color: '#333' },
  text: { fontSize: '1rem', color: '#666', marginBottom: '25px', lineHeight: '1.5' },
  contentArea: { marginBottom: '25px', minHeight: '50px' }, // Platzhalter für Inputs
  
  // Input Styles
  inputContainer: { textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  
  selectionContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  selectionBtn: { padding: '12px', borderRadius: '8px', border: '2px solid #eee', backgroundColor: '#fff', fontSize: '1rem', cursor: 'pointer', fontWeight: '600', color: '#555' },
  selectionBtnActive: { padding: '12px', borderRadius: '8px', border: '2px solid #007bff', backgroundColor: '#007bff', fontSize: '1rem', cursor: 'pointer', fontWeight: '600', color: '#fff' },

  sliderContainer: { padding: '10px 0' },
  valueDisplay: { fontSize: '2rem', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' },
  hint: { fontSize: '0.8rem', color: '#999', marginTop: '10px' },

  expContainer: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px', textAlign: 'left' },
  expCard: { padding: '12px 15px', border: '2px solid', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease' },
  expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  expTitle: { fontWeight: 'bold', fontSize: '0.95rem', color: '#333' },
  expDuration: { fontSize: '0.8rem', color: '#e74c3c', fontWeight: '600' },
  expDesc: { fontSize: '0.8rem', color: '#666', margin: 0, lineHeight: '1.3' },

  freqContainer: { marginBottom: '25px' },
  freqGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  freqCard: { padding: '10px 5px', border: '2px solid', borderRadius: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.2s ease' },

  slider: { width: '100%', cursor: 'pointer', accentColor: '#007bff' },

  footer: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' },
  nextBtn: { padding: '12px 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', flex: 1, justifyContent: 'center' },
  backBtn: { padding: '12px 25px', backgroundColor: '#f1f3f5', color: '#333', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }
};

export default Onboarding;