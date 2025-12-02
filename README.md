# Disaster Analytics: Hybrid Machine Learning & Fuzzy Logic DSS
## Sistem Pendukung Keputusan untuk Prediksi Dampak Bencana Multisektor di Indonesia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/Frontend-ReactJS-61DAFB.svg)](https://reactjs.org/)

---

### 🇮🇩 Pendahuluan

Proyek ini mengatasi tantangan **"Data Rich, Information Poor"** dalam manajemen bencana di Indonesia dengan mengembangkan Sistem Pendukung Keputusan (DSS) prediktif berbasis Machine Learning. Alih-alih hanya membuat laporan deskriptif, sistem ini memproyeksikan kerugian infrastruktur di masa depan berdasarkan data historis BNPB dan konteks sosial (demografi penduduk BPS).

Sistem ini adalah implementasi dari **Arsitektur Hybrid Full-Stack Data Science**:
**ReactJS** (Frontend) ↔ **Flask API** (Backend) ↔ **Hybrid ML Model** (Otak Komputasi).

### ✨ Fitur Utama dan Kontribusi Ilmiah

1.  **Hybrid Ensemble Learning:** Model menggunakan kombinasi cerdas dari **Random Forest Regressor** (untuk memprediksi data stabil seperti **Rumah** dan **Jembatan**) dan **Gradient Boosting Regressor** (untuk mengatasi data fluktuatif seperti **Kios** dan **Lahan Pertanian**).
2.  **Data Fusion (Integrasi Big Data):** Menggabungkan 3 dimensi data heterogen: *Fisik* (Kejadian Bencana), *Sosial* (Populasi), dan *Dampak* (7 Sektor Kerugian).
3.  **Fuzzy Logic Decision Support:** Output kuantitatif (angka kerusakan) diterjemahkan ke dalam terminologi kebijakan baku (**Status Tanggap Darurat / Siaga Darurat**) sesuai standar BNPB.
4.  **Multi-Target Prediction:** Model memprediksi kerugian di **7 sektor** sekaligus (Rumah, Kantor, Faskes, Jembatan, Kios, Rumah Ibadah, dan Luas Lahan Hektar).

---

### 🛠️ Arsitektur Data Pipeline

Semua data mentah melewati 6 tahapan pemrosesan untuk memastikan hasil prediksi valid.


[Image of data processing pipeline steps]


| Tahap | Aktivitas Utama | Keterangan Ilmiah |
| :--- | :--- | :--- |
| **1. ETL & Fusion** | Menggabungkan 7 CSV Dampak + 1 CSV Kejadian + Data Demografi (BPS). | Mengatasi *Data Variety*; *Brute Force Header Detection*. |
| **2. Feature Engineering** | **Log-Transform ($\ln(x+1)$)** dan Label Encoding. | Menormalisasi data ekstrem (*Skewness*) agar model tidak *overfit*. |
| **3. Training Hybrid** | Melatih Model RF dan GBM secara terpisah untuk 7 target. | Membuktikan **adaptasi algoritma** terhadap jenis data. |
| **4. DSS Output** | Menjalankan **Fuzzy Logic** (Metode Mamdani). | Menerjemahkan angka prediksi menjadi *Policy Actionable Status*. |

### 🚀 Hasil Utama (Key Performance Indicators)

| Metrik | Nilai | Interpretasi |
| :--- | :--- | :--- |
| **Akurasi Sistem (R²)** | $\approx 69\% - 78\%$ | Akurasi sangat baik untuk data non-linear & fluktuatif. |
| **Total Dampak (Fuzzy Input)** | Total Kerugian Bangunan (Unit) | Berfungsi sebagai input utama penentu status darurat. |
| **Keputusan DSS** | Status Tanggap Darurat | Output Kualitatif yang siap digunakan oleh pemangku kebijakan. |

---

### ⚙️ Setup dan Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

#### A. Backend (Python/Flask)

1.  **Prasyarat:** Pastikan Python 3.9+ terinstall.
2.  **Clone Repo:** Unduh atau clone repositori ini.
3.  **Instalasi:** Masuk ke folder `backend/` dan install dependencies.

    ```bash
    pip install -r requirements.txt 
    # Atau secara manual: flask, flask-cors, scikit-learn, pandas, numpy, joblib
    ```

4.  **Model File (.pkl):** Pastikan file `model_bencana_bigdata.pkl` sudah ada di dalam folder `backend/`. *(File ini dihasilkan dari proses training di Colab).*
5.  **Jalankan Server:**

    ```bash
    python app.py
    # Server berjalan di [http://127.0.0.1:5000](http://127.0.0.1:5000)
    ```

#### B. Frontend (React JS)

1.  **Prasyarat:** Pastikan Node.js dan npm terinstall.
2.  **Instalasi:** Masuk ke folder `frontend/` (atau `dashboard-bencana/` Anda) dan install dependencies.

    ```bash
    npm install
    # Perlu axios, chart.js, react-chartjs-2, lucide-react
    ```

3.  **Jalankan Dashboard:**

    ```bash
    npm start
    # Dashboard berjalan di http://localhost:3000
    ```
