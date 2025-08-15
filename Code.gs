function doPost(e) {
  try {
    // Parse JSON dari body request
    var data = JSON.parse(e.postData.contents);

    // ID Google Sheet awak
    var ss = SpreadsheetApp.openById("17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA"); // Tukar kepada ID sebenar
    var sheet = ss.getSheetByName("Sheet1"); // Tukar ikut nama sheet awak

    // Data kenderaan (pecahkan dari string)
    var kenderaanList = data.kenderaan.split(", ").map(function(item) {
      // Contoh item: "ABC123 (Kereta)"
      var plat = item.match(/^(.*?)\s+\(/)[1]; // Ambil nombor plat
      var jenis = item.match(/\((.*?)\)$/)[1]; // Ambil jenis kenderaan
      return { plat: plat, jenis: jenis };
    });function doPost(e) {
  try {
    var data;

    // 1) jika client hantar JSON langsung (rare from browser because of preflight)
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      data = JSON.parse(e.postData.contents);
    }
    // 2) jika client hantar urlencoded dengan field 'data' (seperti URLSearchParams above)
    else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    }
    // 3) fallback: ambil nilai direct dari parameter (jika form fields dihantar terus)
    else {
      data = {
        nama: e.parameter.nama || '',
        telefon: e.parameter.telefon || '',
        blok: e.parameter.blok || '',
        unit: e.parameter.unit || '',
        kenderaan: e.parameter.kenderaan || ''
      };
    }

    // Buka sheet — GANTIKAN ID_SHEET_AWAK dan Sheet1 jika nama sheet lain
    var ss = SpreadsheetApp.openById("17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA");
    var sheet = ss.getSheetByName("Sheet1");

    // Jika tiada kenderaan, simpan satu baris kosong untuk plat
    if (!data.kenderaan || data.kenderaan.toString().trim() === "") {
      sheet.appendRow([ new Date(), data.nama || "", data.telefon || "", data.blok || "", data.unit || "", "", "" ]);
    } else {
      // Pisahkan ikut koma — bersihkan whitespace
      var items = data.kenderaan.toString().split(',').map(function(s){ return s.trim(); }).filter(Boolean);

      // Untuk setiap item cuba parse "PLAT (Jenis)" jika format itu digunaka
      items.forEach(function(item){
        var plat = item;
        var jenis = "";
        var m = item.match(/^(.*?)\s*\((.*?)\)\s*$/);
        if (m) {
          plat = m[1].trim();
          jenis = m[2].trim();
        } else {
          // jika tiada kurungan, cuba pisah dengan ruang terakhir? (jika format sama ada lain)
          // boleh juga letakkan keseluruhan di kolum No Plat dan kosongkan Jenis
        }

        sheet.appendRow([ new Date(), data.nama || "", data.telefon || "", data.blok || "", data.unit || "", plat, jenis ]);
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berjaya disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Log untuk debugging
    Logger.log(err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message || err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


    // Simpan setiap kenderaan dalam baris berasingan
    kenderaanList.forEach(function(k) {
      sheet.appendRow([
        new Date(),     // Tarikh & Masa
        data.nama,      // Nama
        data.telefon,   // Telefon
        data.blok,      // Blok
        data.unit,      // Nombor Unit
        k.plat,         // Nombor Plat
        k.jenis         // Jenis Kenderaan
      ]);
    });

    // Balas kepada client
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berjaya disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
