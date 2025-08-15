/***** CONFIG *****/
const SHEET_ID = '17_1Ap02dmX8uN3JSyUJQSL1Wb-V_40f3r3zZUrKJTQA';
const SHEET_NAME = 'DATA';
const HEADERS = ['Timestamp','Unit/Blok','Nama','Telefon','No Plat','Jenis Kenderaan'];

/***** BOOTSTRAP *****/
function ensureSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  const firstRow = sh.getRange(1,1,1,HEADERS.length).getValues()[0];
  const needHeaders = HEADERS.some((h,i)=> firstRow[i] !== h);
  if (needHeaders) {
    sh.clear();
    sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, HEADERS.length);
  }
  return sh;
}

function normalizePlate_(plate){
  return (plate || '').toString().toUpperCase().replace(/\s+/g,'').replace(/-/g,'');
}

/***** API: SUBMIT FORM *****/
function submitForm(form){
  const sh = ensureSheet_();
  const now = new Date();
  const unit = (form.unit||'').toString().trim();
  const nama = (form.nama||'').toString().trim();
  const telefon = (form.telefon||'').toString().trim();
  const noPlatRaw = (form.noPlat||'').toString().trim();
  const jenis = (form.jenis||'').toString().trim();

  if(!unit || !nama || !telefon || !noPlatRaw){
    throw new Error('Sila lengkapkan Unit, Nama, Telefon dan No Plat.');
  }

  const noPlat = noPlatRaw.toUpperCase();
  sh.appendRow([now, unit, nama, telefon, noPlat, jenis]);

  return { ok:true, message:'Rekod berjaya disimpan', data:{ unit,nama,telefon,noPlat,jenis } };
}

/***** API: SEARCH BY PLATE *****/
function searchByPlate(query){
  const sh = ensureSheet_();
  const q = normalizePlate_(query);
  if(!q) return [];
  const last = sh.getLastRow();
  if(last < 2) return [];
  const values = sh.getRange(2,1,last-1,HEADERS.length).getValues();
  const idxNoPlat = HEADERS.indexOf('No Plat');
  const idxUnit = HEADERS.indexOf('Unit/Blok');
  const idxNama = HEADERS.indexOf('Nama');
  const idxTel  = HEADERS.indexOf('Telefon');
  const idxJenis= HEADERS.indexOf('Jenis Kenderaan');

  const results = [];
  for (const row of values){
    const noPlat = (row[idxNoPlat]||'').toString();
    const key = normalizePlate_(noPlat);
    if(key.includes(q)){
      results.push({
        noPlat: noPlat,
        unit: row[idxUnit]||'',
        nama: row[idxNama]||'',
        telefon: row[idxTel]||'',
        jenis: row[idxJenis]||''
      });
    }
  }
  return results;
}

/***** UI / API ROUTER *****/
function doGet(e) {
  ensureSheet_();
  if (e && e.parameter.action === 'search') {
    const plate = e.parameter.plate || '';
    const results = searchByPlate(plate);
    return ContentService
      .createTextOutput(JSON.stringify(results))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const tpl = HtmlService.createTemplateFromFile('Index');
  return tpl.evaluate()
            .setTitle('Pendaftaran & Carian Kenderaan')
            .addMetaTag('viewport','width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    const result = submitForm(data);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok:false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
