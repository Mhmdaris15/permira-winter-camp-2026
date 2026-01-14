/**
 * Google Apps Script - Form Registration & File Upload Handler
 * 
 * This script handles:
 * 1. Registration form submissions → Google Sheets
 * 2. File uploads (KBRI proof) → Google Drive
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Replace this code in the Code.gs file
 * 3. Update SPREADSHEET_ID with your Google Sheet ID
 * 4. Update DRIVE_FOLDER_ID with your Google Drive folder ID
 * 5. Deploy as Web App:
 *    - Click Deploy > New deployment
 *    - Select "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy and copy the URL
 * 6. Update the GOOGLE_SCRIPT_URL in your Cloudflare Worker
 */

// Configuration - UPDATE THESE VALUES
const SPREADSHEET_ID = '14neWGafc3UH60hTtpp2lCy_IEUGLXGVkyGy1E6U9-M4'; // Get from the sheet URL
const SHEET_NAME = 'Registrations'; // Name of the sheet tab
const DRIVE_FOLDER_ID = '1SRL471siA_pnKlBwUyZRznHZwcA66TDo'; // Folder for KBRI proofs

/**
 * Handle POST requests from Cloudflare Worker
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'register') {
      return handleRegistration(payload.data);
    } else if (action === 'upload') {
      return handleFileUpload(payload);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle registration form submission to Google Sheets
 */
function handleRegistration(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEET_NAME);
      const headers = [
        'Timestamp',
        'Citizenship',
        'Full Name',
        'University',
        'Gender',
        'Age',
        'Phone Number',
        'Email',
        'VK',
        'Telegram',
        'How Did You Hear',
        'Allergies',
        'KBRI Proof Provided',
        'KBRI Proof URL',
        'Want to Perform',
        'Performance Details',
        'Willing to Participate',
        'Reason for Joining'
      ];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      newSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // Prepare row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.citizenship || '',
      data.fullName || '',
      data.university || '',
      data.gender || '',
      data.age || '',
      data.phoneNumber || '',
      data.email || '',
      data.vk || '-',
      data.telegram || '-',
      data.hearAboutUs || '',
      data.allergies || '-',
      data.kbriProofProvided || 'N/A',
      data.kbriProofUrl || '-',
      data.wantToPerform || 'No',
      data.performanceDetails || '-',
      data.willingToParticipate || '',
      data.reasonForJoining || ''
    ];

    // Append to sheet
    const targetSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    targetSheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle file upload to Google Drive
 */
function handleFileUpload(payload) {
  try {
    const { fileName, mimeType, base64Data } = payload;

    // Decode base64 to blob
    const decodedData = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedData, mimeType, fileName);

    // Get or create folder
    let folder;
    try {
      folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    } catch (e) {
      // If folder doesn't exist, create one in root
      folder = DriveApp.createFolder('Winter Camp 2026 - KBRI Proofs');
    }

    // Save file to Drive
    const file = folder.createFile(blob);
    
    // Make file publicly viewable (optional, for linking in sheets)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileUrl = file.getUrl();

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileUrl: fileUrl,
      fileId: file.getId(),
      fileName: file.getName()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - run this to verify setup
 */
function testSetup() {
  // Test Sheets access
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✅ Spreadsheet access OK: ' + sheet.getName());
  } catch (e) {
    Logger.log('❌ Spreadsheet error: ' + e.toString());
  }

  // Test Drive access
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    Logger.log('✅ Drive folder access OK: ' + folder.getName());
  } catch (e) {
    Logger.log('❌ Drive folder error: ' + e.toString());
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Winter Camp 2026 Registration API is running',
    endpoints: {
      register: 'POST with action: "register"',
      upload: 'POST with action: "upload"'
    }
  })).setMimeType(ContentService.MimeType.JSON);
}
