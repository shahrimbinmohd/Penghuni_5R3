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
    });

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
