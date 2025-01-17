
## Alur Kerja Aplikasi Ini

1. **Pilih File JSON**: Pilih file JSON yang berisi daftar aplikasi.
2. **Pilih Google JSON**: Pilih file JSON Google yang digunakan untuk konfigurasi Firebase.
3. **Pilih Aplikasi**: Berdasarkan file JSON dari langkah 1, tampilkan beberapa checkbox untuk memilih aplikasi yang ingin dibuat customApp-nya.
4. **Tentukan Path Project**: Tentukan folder dari project Android Studio.
5. **Tentukan Folder Hasil**: Tentukan folder tempat naruh hasil yang diinginkan (berupa signed AAB atau APK).
6. **Tentukan Kenaikan Versi**: Versi dari tiap aplikasi mau dinaikin ngga? jika iya bakal hit endpoint 1 by 1 buat ngecek dan naikin versi.
7. **Eksekusi**: Klik eksekusi, pastikan semua langkah telah terpenuhi, lalu buat file script berdasarkan daftar yang dipilih dari langkah 3.
8. **Jalankan Script**: Jalankan script yang telah dibuat.



#### Alur mendetailnya
1. Check isKenaikanVersi, jika iya loop daftar aplikasi itu buat di hit endpoint version checker, lalu tambahin satu versi
2. Setelah masing2 versi dari tiap aplikasi didapat, baru mulai bikin generate file build.gradle
3. Copy existing file gradle dari path android studio terpilih, replace section android, tepatnya bagian signingConfig dan productFlavors dengan aplikasi2 yang telah terpilih
```
android {
    signingConfigs {
        namaConfigRelease {
            storeFile file("jks/nama.keystore")
            storePassword "password"
            keyAlias "password"
            keyPassword "password"
        }
    }
    productFlavors {
        applicationId "package.name"
        resValue "string", "app_name", "Nama Aplikasi"
        signingConfig signingConfigs.namaConfigRelease
        versionCode 2
        versionName "0.0.2"
        resValue "string", "bank_partner", "BNI"
        resValue "color", "primary", "#029443"
        resValue "color", "secondary", "#f7d300"
        buildConfigField("String", "SERVER_KEY_ID", secretProperties['ID_SERVER_KEY'])
    }
}
```
4. simpan file gradle di folderHasil/temp/build.gradle
5. buat script .sh nya seperti berikut
    copy google json nya, copy file gradle nya, sync gradle, start nge build
```
#define PROJECT_PATH & RESULT_PATH
PROJECT_PATH=/home/tki/mobile/kotlin/kotlin-psp-mobile
RESULT_PATH=/home/tki/Documents/hasil-update-2025
# ini opsional, mau aab tok/ apk tok/ both
mkdir -p $RESULT_PATH/apk
mkdir -p $RESULT_PATH/aab

RESULT_PATH_APK=$RESULT_PATH/apk
RESULT_PATH_AAB=$RESULT_PATH/aab

# Copy google-services.json
cp app/google-services1.json app/google-services.json
# copy build1.gradle to build.gradle
cp app/build1.gradle app/build.gradle
# sync gradle
./gradlew build

# perintah buat ngebuild aab
./gradlew bundleNamaRelease

# perintah buat ngebuild apk
./gradlew assembleNamaDebug

# mkdir result path/nama/apk & result path/nama/aab
#mkdir -p $RESULT_PATH_APK/nama
#mkdir -p $RESULT_PATH_AAB/nama

# copy hasil dari project folder ke folder result
cp app/build/outputs/apk/nama/debug/app-nama-debug.apk $RESULT_PATH_APK/nama
cp app/build/outputs/bundle/namaRelease/app-nama-release.aab $RESULT_PATH_AAB/nama

```
6. jika sudah selesai, check kembali dari daftar aplikasi di atas, file apk dan aab apakah sudah tergenerate apa belum
7. tampilin datar yang udah tergenerate atau belum
