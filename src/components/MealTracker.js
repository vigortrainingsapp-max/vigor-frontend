import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, PieChart, Coffee, Sun, Moon, 
  Apple, ShoppingBasket, Edit2, X, Clock, Hourglass, 
  ChevronLeft, ChevronRight, Calendar, Scale 
} from 'lucide-react'; 
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // NEU: Import für Übersetzungen

const MealTracker = () => {
  const { t } = useTranslation(); // NEU: Hook initialisieren
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States für die Produktsuche
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Edit-State: Speichert die ID der Mahlzeit, die gerade bearbeitet wird
  const [editingId, setEditingId] = useState(null);
  
  // Datumsauswahl (Standard: Heute)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mahlzeit-Metadaten
  const [category, setCategory] = useState('Frühstück');
  const [mealTime, setMealTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));

  // State für die Liste der Produkte (Staging Area)
  const [currentProducts, setCurrentProducts] = useState([]);
  
  // State für das aktuelle Eingabefeld eines einzelnen Produkts
  const [tempProduct, setTempProduct] = useState({ 
    name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' 
  });

  // NEU: Referenz-Speicher für 100g-Werte (für die dynamische Umrechnung)
  const [baseValues, setBaseValues] = useState(null);

  // NEU: Hilfsfunktion, um DB-IDs in übersetzte Labels zu wandeln
  const getCategoryLabel = (id) => {
    const map = {
      'Frühstück': 'meal_breakfast',
      'Mittagessen': 'meal_lunch',
      'Abendessen': 'meal_dinner',
      'Snack': 'meal_snack'
    };
    return t(map[id] || 'meal_snack');
  };

  // Kategorien Definition (angepasst für i18n)
  const categories = [
    { id: 'Frühstück', icon: <Coffee size={16} />, label: getCategoryLabel('Frühstück') },
    { id: 'Mittagessen', icon: <Sun size={16} />, label: getCategoryLabel('Mittagessen') },
    { id: 'Abendessen', icon: <Moon size={16} />, label: getCategoryLabel('Abendessen') },
    { id: 'Snack', icon: <Apple size={16} />, label: getCategoryLabel('Snack') }
  ];

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/meals', {
        headers: { 'x-auth-token': token }
      });
      setMeals(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Mahlzeiten");
      // Optional: toast.error(t('loading_meals_error'));
    }
  };

  useEffect(() => { 
    fetchMeals(); 
  }, []);

  // Debounced Suche für OpenFoodFacts API
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/foods/search?query=${query}`, {
        headers: { 'x-auth-token': token }
      });
      setSearchResults(res.data);
      setShowDropdown(res.data.length > 0);
    } catch (err) {
      console.error("Fehler bei der Produktsuche");
      toast.error(t('search_error'));
    }
  };

  // Produkt auswählen und 100g-Werte als Basis speichern
  const selectProduct = (food) => {
    const values100g = {
      name: food.name,
      grams: 100, // Standardmäßig 100g vorschlagen
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    };

    setTempProduct(values100g);
    setBaseValues(values100g); // Basiswerte merken
    setSearchTerm(food.name);
    setShowDropdown(false);
  };

  // Handler für die Änderung der Gramm-Zahl (Dynamische Umrechnung)
  const handleGramsChange = (value) => {
    const g = parseFloat(value) || 0;
    
    if (baseValues) {
      const factor = g / 100;
      setTempProduct({
        ...tempProduct,
        grams: value,
        calories: Math.round(baseValues.calories * factor),
        protein: parseFloat((baseValues.protein * factor).toFixed(1)),
        carbs: parseFloat((baseValues.carbs * factor).toFixed(1)),
        fat: parseFloat((baseValues.fat * factor).toFixed(1))
      });
    } else {
      setTempProduct({ ...tempProduct, grams: value });
    }
  };

  const filteredMeals = meals.filter(meal => {
    const d = new Date(meal.date);
    return d.toDateString() === selectedDate.toDateString();
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const addProduct = () => {
    if (!tempProduct.name || !tempProduct.calories) {
      toast.error(t('error_missing_fields') || "Name und Kalorien sind Pflichtfelder");
      return;
    }
    setCurrentProducts([...currentProducts, { ...tempProduct, id: Date.now() }]);
    setTempProduct({ name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' });
    setBaseValues(null); // Basiswerte nach dem Hinzufügen zurücksetzen
    setSearchTerm('');
  };

  const removeProduct = (id) => {
    setCurrentProducts(currentProducts.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentProducts.length === 0) {
      toast.error(t('error_no_product') || "Füge mindestens ein Produkt hinzu");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [hours, minutes] = mealTime.split(':');
      const finalDate = new Date(selectedDate);
      finalDate.setHours(parseInt(hours), parseInt(minutes), 0);

      // Hinweis: Wir senden weiterhin die deutsche Kategorie-ID ('Frühstück') ans Backend,
      // damit die DB konsistent bleibt. Die Übersetzung passiert nur im Frontend (Anzeige).
      const payload = { category, products: currentProducts, date: finalDate };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/meals/${editingId}`, payload, {
          headers: { 'x-auth-token': token }
        });
        toast.success(t('success_updated') || "Mahlzeit aktualisiert!");
      } else {
        await axios.post('http://localhost:5000/api/meals', payload, {
          headers: { 'x-auth-token': token }
        });
        toast.success(t('success_saved') || "Mahlzeit gespeichert!");
      }

      setEditingId(null);
      setCurrentProducts([]);
      setSearchTerm('');
      setMealTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
      fetchMeals();
    } catch (err) {
      toast.error(t('error_saving') || "Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete') || "Löschen?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/meals/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchMeals();
      toast.info(t('success_removed') || "Mahlzeit entfernt");
    } catch (err) {
      toast.error("Fehler beim Löschen");
    }
  };

  const handleEdit = (meal) => {
    setEditingId(meal._id);
    setCategory(meal.category);
    setCurrentProducts(meal.products.map(p => ({ ...p, id: p._id })));
    const d = new Date(meal.date);
    setMealTime(d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCurrentProducts([]);
    setCategory('Frühstück');
    setSearchTerm('');
  };

  const renderTimeGap = (index) => {
    if (index === 0) return null;
    const current = new Date(filteredMeals[index].date);
    const previous = new Date(filteredMeals[index - 1].date);
    const diffMs = current - previous;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return null;

    return (
      <div style={styles.timeGapContainer}>
        <Hourglass size={12} />
        {/* Hier könnten wir auch i18n nutzen, z.B. mit Interpolation */}
        <span>{t('eaten_ago_prefix') || 'Vor'} {diffHrs} {t('hours_short') || 'Std.'} {diffMins} {t('minutes_short') || 'Min.'} {t('eaten_ago_suffix') || 'gegessen'}</span>
      </div>
    );
  };

  const dayTotals = filteredMeals.reduce((acc, m) => ({
    cal: acc.cal + m.totalCalories,
    pro: acc.pro + m.totalProtein,
    car: acc.car + m.totalCarbs,
    fat: acc.fat + m.totalFat
  }), { cal: 0, pro: 0, car: 0, fat: 0 });

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div style={styles.container}>
      {/* Datumsauswahl */}
      <div style={styles.dateHeader}>
        <button onClick={() => changeDate(-1)} style={styles.dateBtn}><ChevronLeft size={20}/></button>
        <div style={styles.dateDisplay}>
          <Calendar size={18} />
          {/* Datumslokalisierung könnte auch über i18n angepasst werden, hier Standard JS */}
          <span>{selectedDate.toLocaleDateString(t('locale') || 'de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
        </div>
        <button onClick={() => changeDate(1)} style={styles.dateBtn}><ChevronRight size={20}/></button>
      </div>

      {/* Tagesübersicht */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryTitle}><PieChart size={18} /> {t('daily_summary') || 'Tagesbilanz'}</div>
        <div style={styles.totalsGrid}>
          <div style={styles.totalItem}><span style={styles.totalVal}>{dayTotals.cal}</span><span style={styles.totalLab}>kcal</span></div>
          <div style={styles.totalItem}><span style={styles.totalVal}>{dayTotals.pro}g</span><span style={styles.totalLab}>{t('protein') || 'Eiweiß'}</span></div>
          <div style={styles.totalItem}><span style={styles.totalVal}>{dayTotals.car}g</span><span style={styles.totalLab}>Carbs</span></div>
          <div style={styles.totalItem}><span style={styles.totalVal}>{dayTotals.fat}g</span><span style={styles.totalLab}>{t('fat') || 'Fett'}</span></div>
        </div>
      </div>

      {/* Formular-Karte */}
      <div style={styles.formCard}>
        <div style={styles.cardHeader}>
          <h3 style={{ margin: 0 }}>{editingId ? (t('edit_meal') || "Mahlzeit bearbeiten") : (t('track_meal') || "Mahlzeit tracken")}</h3>
          {editingId && <button onClick={cancelEdit} style={styles.cancelBtn}><X size={18} /></button>}
        </div>

        <div style={styles.metaRow}>
          <div style={styles.categoryGrid}>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={category === cat.id ? styles.catBtnActive : styles.catBtn}
              >
                {cat.icon} {cat.label} {/* Benutze hier das übersetzte Label */}
              </button>
            ))}
          </div>
          <div style={styles.timeInputContainer}>
            <Clock size={16} />
            <input 
              type="time" 
              value={mealTime} 
              onChange={(e) => setMealTime(e.target.value)} 
              style={styles.timeInput}
            />
          </div>
        </div>

        <div style={styles.productInputArea}>
          {/* Suche mit Dropdown */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input 
              placeholder={t('search_placeholder')} 
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setTempProduct({...tempProduct, name: e.target.value});
                if(!baseValues) setBaseValues(null); // Reset Basiswerte bei manueller Namensänderung
              }}
              onFocus={() => searchTerm.length > 2 && setShowDropdown(true)}
              style={styles.inputFull}
            />
            {showDropdown && (
              <div style={styles.dropdown}>
                {searchResults.length === 0 && (
                   <div style={{padding: '10px', color: '#999'}}>{t('no_products_found')}</div>
                )}
                {searchResults.map(food => (
                  <div 
                    key={food._id} 
                    onClick={() => selectProduct(food)}
                    style={styles.dropdownItem}
                  >
                    <div style={{fontWeight: 'bold'}}>{food.name}</div>
                    <div style={{fontSize: '0.75rem', color: '#666'}}>
                      {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eingabe-Gitter für Makros */}
          <div style={styles.inputGrid}>
            <div style={styles.inputWithIcon}>
              <Scale size={14} style={styles.innerIcon} />
              <input 
                type="number" 
                placeholder={t('grams_label')} 
                value={tempProduct.grams} 
                onChange={e => handleGramsChange(e.target.value)} 
                style={styles.input} 
              />
            </div>
            <input type="number" placeholder="kcal" value={tempProduct.calories} onChange={e => setTempProduct({...tempProduct, calories: e.target.value})} style={styles.input} />
            <input type="number" placeholder="Protein" value={tempProduct.protein} onChange={e => setTempProduct({...tempProduct, protein: e.target.value})} style={styles.input} />
            <input type="number" placeholder="Carbs" value={tempProduct.carbs} onChange={e => setTempProduct({...tempProduct, carbs: e.target.value})} style={styles.input} />
            <input type="number" placeholder={t('fat') || "Fett"} value={tempProduct.fat} onChange={e => setTempProduct({...tempProduct, fat: e.target.value})} style={styles.input} />
          </div>
          <button onClick={addProduct} style={styles.stagingBtn}>
             <Plus size={18} /> {t('add_product_btn')}
          </button>
        </div>

        {/* Staging Area (Warenkorb der aktuellen Mahlzeit) */}
        {currentProducts.length > 0 && (
          <div style={styles.stagingArea}>
            <div style={styles.stagingTitle}><ShoppingBasket size={14} /> {t('included_products') || "Enthaltene Produkte:"}</div>
            {currentProducts.map(p => (
              <div key={p.id} style={styles.stagingItem}>
                <span>{p.name} {p.grams && `(${p.grams}g)`}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{p.calories} kcal</span>
                  <button onClick={() => removeProduct(p.id)} style={styles.miniRemoveBtn}><X size={14} /></button>
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} disabled={loading} style={styles.addBtn}>
              {loading ? (t('saving') || "Speichert...") : (editingId ? (t('save_changes') || "Änderungen speichern") : (t('save_meal_btn') || "Mahlzeit final buchen"))}
            </button>
          </div>
        )}
      </div>

      {/* Liste der gespeicherten Mahlzeiten */}
      <div style={styles.list}>
        <h4 style={{ marginBottom: '15px' }}>{t('daily_entries') || "Einträge für diesen Tag"}</h4>
        {filteredMeals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>{t('no_entries_yet') || "Noch keine Einträge vorhanden."}</p>
        ) : (
          filteredMeals.map((meal, index) => (
            <div key={meal._id}>
              {renderTimeGap(index)}
              <div style={styles.mealItem}>
                <div style={styles.mealInfo}>
                  <div style={styles.mealHeader}>
                    <span style={styles.categoryBadge}>
                      {/* Hier nutzen wir die Hilfsfunktion, um auch gespeicherte DB-IDs zu übersetzen */}
                      {categories.find(c => c.id === meal.category)?.icon} {getCategoryLabel(meal.category)}
                    </span>
                    <span style={styles.timeBadge}><Clock size={12} /> {new Date(meal.date).toLocaleTimeString(t('locale') || 'de-DE', { hour: '2-digit', minute: '2-digit' })} {t('clock_suffix') || 'Uhr'}</span>
                  </div>
                  <div style={styles.productList}>
                    {meal.products.map(p => p.name).join(', ')}
                  </div>
                  <div style={styles.mealStats}>
                    {meal.totalCalories} kcal | P: {meal.totalProtein}g | C: {meal.totalCarbs}g | F: {meal.totalFat}g
                  </div>
                </div>
                <div style={styles.actionBtns}>
                  <button onClick={() => handleEdit(meal)} style={styles.editBtn}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(meal._id)} style={styles.deleteBtn}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles (bleiben unverändert)
const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px' },
  dateHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  dateBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666' },
  dateDisplay: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '0.9rem' },
  summaryCard: { backgroundColor: '#1a1a1a', color: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px' },
  summaryTitle: { fontSize: '0.85rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 },
  totalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  totalItem: { textAlign: 'center', display: 'flex', flexDirection: 'column' },
  totalVal: { fontSize: '1.2rem', fontWeight: 'bold' },
  totalLab: { fontSize: '0.7rem', opacity: 0.7 },
  formCard: { backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '25px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  cancelBtn: { background: '#f8f9fa', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' },
  categoryGrid: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: { padding: '8px 12px', borderRadius: '20px', border: '1px solid #eee', backgroundColor: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' },
  catBtnActive: { padding: '8px 12px', borderRadius: '20px', border: '1px solid #1a1a1a', backgroundColor: '#1a1a1a', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' },
  timeInputContainer: { display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#f8f9fa', padding: '5px 10px', borderRadius: '10px' },
  timeInput: { border: 'none', background: 'none', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', outline: 'none' },
  productInputArea: { borderTop: '1px solid #eee', paddingTop: '15px' },
  inputFull: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box' },
  inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
  inputWithIcon: { position: 'relative' },
  innerIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' },
  dropdownItem: { padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' },
  stagingBtn: { width: '100%', padding: '10px', border: '2px dashed #ddd', borderRadius: '8px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#666', fontWeight: '600' },
  stagingArea: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginTop: '15px' },
  stagingTitle: { fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' },
  stagingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e9ecef', fontSize: '0.85rem' },
  miniRemoveBtn: { background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', opacity: 0.7 },
  addBtn: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' },
  list: { backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginTop: '20px' },
  mealItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f9f9f9' },
  mealInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  mealHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  categoryBadge: { fontSize: '0.65rem', backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' },
  timeBadge: { fontSize: '0.7rem', color: '#888', display: 'flex', alignItems: 'center', gap: '3px' },
  productList: { fontSize: '0.9rem', fontWeight: '600', color: '#333' },
  mealStats: { fontSize: '0.75rem', color: '#777' },
  actionBtns: { display: 'flex', gap: '10px' },
  editBtn: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' },
  deleteBtn: { background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' },
  timeGapContainer: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#aaa', paddingLeft: '20px', borderLeft: '2px solid #eee', margin: '5px 0 5px 15px' }
};

export default MealTracker;