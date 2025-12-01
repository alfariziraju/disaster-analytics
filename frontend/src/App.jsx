import React, { useState } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Activity, AlertTriangle, Target, TrendingUp, Database, Filter, Calculator, BarChart4, BookOpen } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// --- KOMPONEN METRIC CARD ---
const MetricCard = ({ title, value, subtitle, color, icon }) => {
  const themes = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };
  const style = themes[color] || themes.blue;

  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${style} relative overflow-hidden transition hover:shadow-md`}>
      <div className="absolute -right-4 -top-4 opacity-20 transform scale-150">{icon}</div>
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{title}</h3>
      <div className="text-3xl font-extrabold mb-1">{value}</div>
      <p className="text-sm font-medium opacity-80">{subtitle}</p>
    </div>
  );
};

// --- KOMPONEN PIPELINE ---
const DataPipeline = () => {
  const steps = [
    { id: 1, title: "Data Ingestion", desc: "BNPB & BPS (2010-2024)", icon: <Database size={18} />, color: "bg-blue-100 text-blue-600" },
    { id: 2, title: "Fusion & Cleaning", desc: "Log-Transform & Merge", icon: <Filter size={18} />, color: "bg-amber-100 text-amber-600" },
    { id: 3, title: "Hybrid Modeling", desc: "RF & Gradient Boosting", icon: <Calculator size={18} />, color: "bg-purple-100 text-purple-600" },
    { id: 4, title: "Decision Support", desc: "Fuzzy Logic System", icon: <BarChart4 size={18} />, color: "bg-emerald-100 text-emerald-600" }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pipeline Pengolahan Big Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center z-10 bg-white p-2 rounded-xl border border-transparent hover:border-slate-100 transition">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.color} mb-2 shadow-sm`}>
              {step.icon}
            </div>
            <span className="text-sm font-bold text-slate-700">{step.title}</span>
            <span className="text-xs text-slate-400 text-center">{step.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  // State Input
  // PENTING: jumlah_penduduk tetap ada di state, tapi kita set default
  const [inputs, setInputs] = useState({
    jenis_bencana: 'BANJIR',
    jumlah_kejadian: 50,
    jumlah_penduduk: 285000000 // Default: Estimasi Penduduk 2025
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handlePredict = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post('http://127.0.0.1:5000/predict', inputs);
      if(res.data.status === 'success') {
        setResult(res.data);
      } else {
        setError('Gagal memproses data.');
      }
    } catch (err) {
      setError('Gagal koneksi ke Backend Python.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? {
    labels: Object.keys(result.prediksi),
    datasets: [{
      label: 'Estimasi Kerusakan',
      data: Object.values(result.prediksi),
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)', 
        'rgba(239, 68, 68, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(99, 102, 241, 0.6)'
      ],
      borderColor: [
        'rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 
        'rgb(239, 68, 68)', 'rgb(139, 92, 246)', 'rgb(236, 72, 153)', 'rgb(99, 102, 241)'
      ],
      borderWidth: 1,
    }]
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- SIDEBAR INPUT (LEBIH SEDERHANA) --- */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <div className="flex items-center gap-3 mb-6 text-blue-700">
              <Activity size={32} />
              <div>
                <h1 className="font-bold text-xl leading-none">Disaster.AI</h1>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sistem Cerdas Mitigasi</span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Jenis Bencana</label>
                <select name="jenis_bencana" value={inputs.jenis_bencana} onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {['BANJIR', 'GEMPABUMI', 'CUACA EKSTREM', 'KEBAKARAN HUTAN DAN LAHAN', 'ERUPSI GUNUNG API', 'TANAH LONGSOR', 'KEKERINGAN', 'GELOMBANG PASANG DAN ABRASI'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Frekuensi Kejadian</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <input type="number" name="jumlah_kejadian" value={inputs.jumlah_kejadian} onChange={handleChange}
                    className="w-full bg-transparent font-bold text-right outline-none text-lg" 
                  />
                  <span className="text-sm font-bold text-slate-400">Kali</span>
                </div>
              </div>

              {/* INPUT POPULASI DIHILANGKAN DARI SINI UNTUK UI LEBIH BERSIH */}
              
              <button onClick={handlePredict} disabled={loading}
                className={`w-full py-4 mt-2 rounded-xl font-bold text-white shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2
                  ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Sedang Memproses...' : <><Calculator size={20}/> Analisis Risiko</>}
              </button>

              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400">
                  *Analisis menggunakan estimasi penduduk Nasional 2025 (285 Juta Jiwa) sebagai basis penghitungan Big Data.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="lg:col-span-8 space-y-8">
          
          <DataPipeline />

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <AlertTriangle size={24} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in-up space-y-6">
              
              {/* STATUS BAR */}
              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between shadow-sm transition-colors duration-500
                ${result.warna_status === 'Merah' ? 'bg-red-50 border-red-200 text-red-900' : 
                  result.warna_status === 'Oranye' ? 'bg-orange-50 border-orange-200 text-orange-900' : 
                  'bg-emerald-50 border-emerald-200 text-emerald-900'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${result.warna_status === 'Merah' ? 'bg-red-200' : result.warna_status === 'Oranye' ? 'bg-orange-200' : 'bg-emerald-200'}`}>
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase opacity-60 mb-1">Rekomendasi Kebijakan (DSS)</h2>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">{result.status_bencana}</h1>
                  </div>
                </div>
              </div>

              {/* GRID METRIK */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                  title="Akurasi Model AI" 
                  value={result.akurasi_model ? result.akurasi_model + "%" : "N/A"} 
                  subtitle="Validasi R² Score"
                  color={result.akurasi_model > 70 ? "green" : "amber"}
                  icon={<Activity size={40} />}
                />
                
                <MetricCard 
                  title="Total Kerusakan Fisik" 
                  value={result.total_kerusakan.toLocaleString()} 
                  subtitle="Unit Bangunan"
                  color="blue"
                  icon={<Target size={40} />}
                />
                
                {/* POPULASI DITAMPILKAN DI SINI SAJA (READ-ONLY) */}
                <MetricCard 
                  title="Basis Populasi" 
                  value={(inputs.jumlah_penduduk / 1000000).toFixed(1) + " Jt"} 
                  subtitle="Jiwa (Konstanta)"
                  color="purple"
                  icon={<TrendingUp size={40} />}
                />
              </div>

              {/* GRAFIK & TABEL */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <BookOpen size={20} className="text-slate-400" />
                  <h3 className="font-bold text-lg text-slate-700">Detail Estimasi Per Sektor</h3>
                </div>
                
                <div className="h-[350px] w-full mb-8">
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                        x: { grid: { display: false } }
                      }
                    }} 
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(result.prediksi).map(([sektor, nilai]) => (
                    <div key={sektor} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center hover:bg-slate-100 transition">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{sektor}</p>
                      <p className="font-bold text-slate-700 text-lg">
                        {nilai.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{sektor.includes('Lahan') ? 'Ha' : 'Unit'}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {!result && !loading && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
              <Activity size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-sm">Menunggu Input Skenario...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}