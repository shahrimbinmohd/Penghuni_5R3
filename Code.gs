function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function simpanData(data) {
  try {
    var ss = SpreadsheetApp.openById("17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA"); // Ganti dengan ID Sheet kau
    var sh = ss.getSheetByName("Sheet1");
    if (!sh) {
      sh = ss.insertSheet("Data");
      sh.appendRow(["Nama", "Telefon", "Blok", "Unit", "Kenderaan"]);
    }

    sh.appendRow([
      data.nama,
      data.telefon,
      data.blok,
      data.unit,
      data.kenderaan
    ]);

    return { status: "ok", message: "Pendaftaran berjaya!" };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}
