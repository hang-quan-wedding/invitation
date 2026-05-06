const SPREADSHEET_ID = '1ZTE-_Tr6P8YuwNuTx0x-9YJyGApDJkhAlp8VWASObTI';
const SHEET_NAME = 'RSVP';

const HEADERS = [
  'Thời gian',
  'Tên khách',
  'Lời nhắn',
  'Bạn sẽ đến chứ?',
  'Bạn tham dự cùng ai?',
  'Thực đơn',
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = getSheet_();

    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      payload.guest_name || '',
      payload.message || '',
      payload.attendance || '',
      payload.guest_count || 0,
      payload.menu || '',
    ]);

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'RSVP Apps Script is deployed.',
    sheetName: SHEET_NAME,
  });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  return JSON.parse(e.postData.contents);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), HEADERS.length);
  const firstRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const hasHeaders = HEADERS.every(function (header, index) {
    return firstRow[index] === header;
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
