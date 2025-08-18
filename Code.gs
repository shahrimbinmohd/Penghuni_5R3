function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function simpanData(formData) {
  try {
    var ss = SpreadsheetApp.openById("17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA"); // 👈 ganti dengan ID Google Sheet anda
    var sheet = ss.getSheetByName("Sheet1"); // 👈 pastikan nama sheet betul

    // Simpan data ke Google Sheet
    sheet.appendRow([
      new Date(), // Tarikh & masa pendaftaran
      formData.nama,
      formData.telefon,
      formData.blok,
      formData.unit,
      formData.kenderaan
    ]);

    return { status: "ok", message: "Pendaftaran berjaya disimpan!" };

  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}
