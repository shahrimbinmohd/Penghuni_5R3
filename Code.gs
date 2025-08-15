/**
 * Google Apps Script - Web App API untuk menerima pendaftaran.
 * Deploy: Deploy > New deployment > Web app
 * Execute as: Me
 * Who has access: Anyone
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.nama || "",
      data.telefon || "",
      data.blok || "",
      data.unit || "",
      data.kenderaan || "",
      new Date()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
