const SPREADSHEET_ID = '1ZTE-_Tr6P8YuwNuTx0x-9YJyGApDJkhAlp8VWASObTI';
const SHEET_NAME = 'RSVP';
const GUESTS_SHEET_NAME = 'GUESTS';

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

function doGet(e) {
  try {
    const ref = e && e.parameter && e.parameter.ref
      ? String(e.parameter.ref).trim()
      : '';

    if (!ref) {
      return guestLookupResponse_(e, {
        ok: false,
        error: 'Missing ref',
      });
    }

    const guest = findGuestByRef_(ref);

    if (!guest) {
      return guestLookupResponse_(e, {
        ok: false,
        error: 'Guest not found',
      });
    }

    return guestLookupResponse_(e, {
      ok: true,
      ref: ref,
      pronoun: guest.pronoun,
      guest: guest.guest,
      wish: guest.wish,
    });
  } catch (error) {
    return guestLookupResponse_(e, {
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  return JSON.parse(e.postData.contents);
}

function getSheet_() {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function findGuestByRef_(ref) {
  const spreadsheet = getSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(GUESTS_SHEET_NAME);

  if (!sheet) {
    throw new Error('GUESTS sheet not found');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return null;
  }

  const headers = values[0].map(function (header) {
    return String(header).trim();
  });
  const idIndex = headers.indexOf('ID');
  const pronounIndex = headers.indexOf('Pronoun');
  const guestIndex = headers.indexOf('Guest');
  const wishIndex = headers.indexOf('Lời chúc');

  if (idIndex === -1 || pronounIndex === -1 || guestIndex === -1) {
    throw new Error('GUESTS sheet must include ID, Pronoun, and Guest headers');
  }

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    const rowRef = String(row[idIndex]).trim();

    if (rowRef === ref) {
      return {
        pronoun: String(row[pronounIndex] || '').replace(/\s+/g, ' ').trim(),
        guest: String(row[guestIndex] || '').replace(/\s+/g, ' ').trim(),
        wish: wishIndex === -1 ? '' : String(row[wishIndex] || '').replace(/\s+/g, ' ').trim(),
      };
    }
  }

  return null;
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

function guestLookupResponse_(e, data) {
  const callback = e && e.parameter && e.parameter.callback
    ? String(e.parameter.callback).trim()
    : '';

  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(data) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return jsonResponse_(data);
}
