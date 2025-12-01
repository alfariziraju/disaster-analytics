from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app) 

# --- 1. LOAD MODEL & AKURASI ---
print("Sedang memuat model Big Data...")
with open('model_bencana_bigdata.pkl', 'rb') as f:
    paket = pickle.load(f)

models = paket['models']
le = paket['encoder']
scores = paket.get('scores', {}) # Ambil skor akurasi (Default kosong jika tidak ada)

# Hitung Akurasi Rata-rata Sistem
rata_akurasi = 0
if scores:
    rata_akurasi = np.mean(list(scores.values())) * 100 # Dalam Persen

# --- 2. FUNGSI FUZZY LOGIC ---
def fuzzy_logic(prediksi_fisik, populasi):
    # [A] Kerusakan
    if prediksi_fisik <= 2000: score_k = 1
    elif 2000 < prediksi_fisik <= 10000: score_k = 2
    else: score_k = 3
    
    # [B] Populasi
    if populasi <= 50_000_000: score_p = 1
    elif 50_000_000 < populasi <= 150_000_000: score_p = 2
    else: score_p = 3
    
    # Inference
    final_score = (score_k * 0.6) + (score_p * 0.4)
    
    if final_score >= 2.4: return "TANGGAP DARURAT (NASIONAL)", "Merah"
    elif final_score >= 1.6: return "SIAGA DARURAT (PROVINSI)", "Oranye"
    else: return "NORMAL / WASPADA", "Hijau"

# --- 3. ENDPOINT API ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        bencana = data['jenis_bencana'] 
        kejadian = float(data['jumlah_kejadian'])
        penduduk = float(data['jumlah_penduduk'])
        
        # Preprocessing
        try:
            kode_bencana = le.transform([bencana])[0]
        except:
            return jsonify({'error': 'Jenis bencana tidak dikenali'}), 400

        input_log_kejadian = np.log1p(kejadian)
        input_log_penduduk = np.log1p(penduduk)
        inputs = [[kode_bencana, input_log_kejadian, input_log_penduduk]]
        
        # Loop Prediksi
        hasil_prediksi = {}
        total_kerusakan_bangunan = 0
        
        for sektor, model in models.items():
            pred_log = model.predict(inputs)[0]
            pred_real = np.expm1(pred_log)
            
            nama_bersih = sektor.replace('Rusak_', '')
            hasil_prediksi[nama_bersih] = int(pred_real)
            
            if "Lahan" not in sektor:
                total_kerusakan_bangunan += pred_real
                
        status, warna = fuzzy_logic(total_kerusakan_bangunan, penduduk)
        
        response = {
            'status': 'success',
            'prediksi': hasil_prediksi,
            'total_kerusakan': int(total_kerusakan_bangunan),
            'status_bencana': status,
            'warna_status': warna,
            'akurasi_model': round(rata_akurasi, 1) # Kirim Akurasi ke Web
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)