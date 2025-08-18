function doGet(e) {
  var sheet = SpreadsheetApp.openById("17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA").getActiveSheet();

  if (e.parameter.action === "search") {
    var query = e.parameter.query.toLowerCase();
    var data = sheet.getDataRange().getValues();
    var result = [];

    for (var i = 1; i < data.length; i++) {
      var nama = data[i][0].toString().toLowerCase();
      var noRumah = data[i][1].toString().toLowerCase();
      var noPlat = data[i][2].toString().toLowerCase();
      var jenis = data[i][3].toString().toLowerCase();

      if (nama.includes(query) || noPlat.includes(query) || jenis.includes(query)) {
        result.push({
          nama: data[i][0],
          noRumah: data[i][1],
          noPlat: data[i][2],
          jenis: data[i][3]
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput("Hello! Sistem aktif.");
}

function doPost(e){
  var sheet = SpreadsheetApp.openById("17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA").getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.nama, data.noRumah, data.noPlat, data.jenis]);
  return ContentService.createTextOutput("Data berjaya disimpan!");
}
