import { google } from 'googleapis'

export type FormType =
  | 'contact_us'
  | 'appointments'
  | 'repairs'
  | 'returns'
  | 'jade_consultation'
  | 'mailing_list'

type SheetColumn = { key: string; label: string }

const DASHBOARD_SHEET_NAME = 'MAIN'

export const FORM_SHEETS: Record<FormType, { sheetName: string; columns: SheetColumn[] }> = {
  contact_us: {
    sheetName: 'ContactUs',
    columns: [
      { key: 'submittedAt', label: 'Submitted At' },
      { key: 'formType', label: 'Form Type' },
      { key: 'sourcePath', label: 'Source Page' },
      { key: 'sourceFlow', label: 'Source Flow' },
      { key: 'utmSource', label: 'UTM Source' },
      { key: 'utmMedium', label: 'UTM Medium' },
      { key: 'utmCampaign', label: 'UTM Campaign' },
      { key: 'utmTerm', label: 'UTM Term' },
      { key: 'utmContent', label: 'UTM Content' },
      { key: 'fullName', label: 'Name' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'contactReason', label: 'Topic' },
      { key: 'orderNumber', label: 'Order Number' },
      { key: 'notesOrMessage', label: 'Message' },
      { key: 'rawPayloadJson', label: 'Raw Payload (JSON)' },
    ],
  },
  appointments: {
    sheetName: 'Appointments',
    columns: [
      { key: 'submittedAt', label: 'Submitted At' },
      { key: 'formType', label: 'Form Type' },
      { key: 'sourcePath', label: 'Source Page' },
      { key: 'sourceFlow', label: 'Source Flow' },
      { key: 'utmSource', label: 'UTM Source' },
      { key: 'utmMedium', label: 'UTM Medium' },
      { key: 'utmCampaign', label: 'UTM Campaign' },
      { key: 'utmTerm', label: 'UTM Term' },
      { key: 'utmContent', label: 'UTM Content' },
      { key: 'fullName', label: 'Name' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'appointmentFor', label: 'Appointment For' },
      { key: 'preferredDate1', label: 'Preferred Date' },
      { key: 'preferredTime1', label: 'Preferred Time' },
      { key: 'preferredDate2', label: 'Backup Date' },
      { key: 'preferredTime2', label: 'Backup Time' },
      { key: 'inPersonOrVirtual', label: 'In-Person or Virtual' },
      { key: 'notesOrMessage', label: 'Notes' },
      { key: 'rawPayloadJson', label: 'Raw Payload (JSON)' },
    ],
  },
  repairs: {
    sheetName: 'Repairs',
    columns: [
      { key: 'submittedAt', label: 'Submitted At' },
      { key: 'formType', label: 'Form Type' },
      { key: 'sourcePath', label: 'Source Page' },
      { key: 'sourceFlow', label: 'Source Flow' },
      { key: 'utmSource', label: 'UTM Source' },
      { key: 'utmMedium', label: 'UTM Medium' },
      { key: 'utmCampaign', label: 'UTM Campaign' },
      { key: 'utmTerm', label: 'UTM Term' },
      { key: 'utmContent', label: 'UTM Content' },
      { key: 'fullName', label: 'Name' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'itemType', label: 'Item Type' },
      { key: 'issueDescription', label: 'Issue Description' },
      { key: 'purchaseOrOrderNumber', label: 'Purchase / Order Number' },
      { key: 'desiredOutcome', label: 'Desired Outcome' },
      { key: 'notesOrMessage', label: 'Notes' },
      { key: 'rawPayloadJson', label: 'Raw Payload (JSON)' },
    ],
  },
  returns: {
    sheetName: 'Returns',
    columns: [
      { key: 'submittedAt', label: 'Submitted At' },
      { key: 'formType', label: 'Form Type' },
      { key: 'sourcePath', label: 'Source Page' },
      { key: 'sourceFlow', label: 'Source Flow' },
      { key: 'utmSource', label: 'UTM Source' },
      { key: 'utmMedium', label: 'UTM Medium' },
      { key: 'utmCampaign', label: 'UTM Campaign' },
      { key: 'utmTerm', label: 'UTM Term' },
      { key: 'utmContent', label: 'UTM Content' },
      { key: 'fullName', label: 'Name' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'orderNumber', label: 'Order Number' },
      { key: 'returnOrExchange', label: 'Return or Exchange' },
      { key: 'reason', label: 'Reason' },
      { key: 'items', label: 'Items' },
      { key: 'notesOrMessage', label: 'Notes' },
      { key: 'rawPayloadJson', label: 'Raw Payload (JSON)' },
    ],
  },
  jade_consultation: {
    sheetName: 'JadeConsultation',
    columns: [
      { key: 'submittedAt', label: 'Submitted At' },
      { key: 'formType', label: 'Form Type' },
      { key: 'sourcePath', label: 'Source Page' },
      { key: 'sourceFlow', label: 'Source Flow' },
      { key: 'utmSource', label: 'UTM Source' },
      { key: 'utmMedium', label: 'UTM Medium' },
      { key: 'utmCampaign', label: 'UTM Campaign' },
      { key: 'utmTerm', label: 'UTM Term' },
      { key: 'utmContent', label: 'UTM Content' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'consultationProfile', label: 'Profile' },
      { key: 'desiredDate', label: 'Desired Date' },
      { key: 'jewelryType', label: 'Jewelry Type' },
      { key: 'chainStyle', label: 'Chain Style' },
      { key: 'chainColor', label: 'Chain Color' },
      { key: 'bailShape', label: 'Bail Shape' },
      { key: 'bailColor', label: 'Bail Color' },
      { key: 'byoChain', label: 'BYO Chain' },
      { key: 'notesOrMessage', label: 'Notes' },
      { key: 'rawPayloadJson', label: 'Raw Payload (JSON)' },
    ],
  },
  mailing_list: {
    sheetName: 'MailingList',
    columns: [
      { key: 'submittedAt', label: 'Submitted At' },
      { key: 'formType', label: 'Form Type' },
      { key: 'sourcePath', label: 'Source Page' },
      { key: 'sourceFlow', label: 'Source Flow' },
      { key: 'utmSource', label: 'UTM Source' },
      { key: 'utmMedium', label: 'UTM Medium' },
      { key: 'utmCampaign', label: 'UTM Campaign' },
      { key: 'utmTerm', label: 'UTM Term' },
      { key: 'utmContent', label: 'UTM Content' },
      { key: 'email', label: 'Email' },
      { key: 'optIn', label: 'Opt In' },
      { key: 'sourcePlacement', label: 'Placement' },
      { key: 'rawPayloadJson', label: 'Raw Payload (JSON)' },
    ],
  },
}

function ensureEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function stripWrappingQuotes(value: string) {
  const v = value.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

function normalizeServiceAccountPrivateKey(input: string) {
  // Handle common `.env` + Windows copy/paste issues:
  // - surrounding quotes included in the value
  // - literal "\\n" sequences
  // - CRLF line endings
  const stripped = stripWrappingQuotes(input)
  const withNewlines = stripped.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim()

  // quick sanity check to help users debug
  if (!withNewlines.includes('BEGIN') || !withNewlines.includes('PRIVATE KEY')) {
    throw new Error(
      `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY doesn't look like a PEM private key. ` +
        `It should start with "-----BEGIN PRIVATE KEY-----".`,
    )
  }
  return withNewlines
}

type ServiceAccountJson = {
  client_email?: unknown
  private_key?: unknown
}

function tryParseServiceAccountJson(value: string): { email: string; privateKey: string } | null {
  const trimmed = stripWrappingQuotes(value).trim()
  if (!trimmed.startsWith('{')) return null
  try {
    const parsed = JSON.parse(trimmed) as ServiceAccountJson
    const email = typeof parsed.client_email === 'string' ? parsed.client_email.trim() : ''
    const privateKey = typeof parsed.private_key === 'string' ? parsed.private_key : ''
    if (!email || !privateKey) return null
    return { email, privateKey }
  } catch {
    return null
  }
}

function getSheetsAuth() {
  const emailEnv = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKeyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64
  const serviceAccountJsonEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const privateKeyRaw =
    typeof privateKeyBase64 === 'string' && privateKeyBase64.trim()
      ? Buffer.from(stripWrappingQuotes(privateKeyBase64), 'base64').toString('utf8')
      : ensureEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY', process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)

  // Preferred: GOOGLE_SERVICE_ACCOUNT_JSON (full service account JSON)
  const fromJson = (typeof serviceAccountJsonEnv === 'string' && serviceAccountJsonEnv.trim()
    ? tryParseServiceAccountJson(serviceAccountJsonEnv)
    : null) || tryParseServiceAccountJson(privateKeyRaw)

  const email = fromJson?.email || ensureEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL', emailEnv)
  const privateKey = normalizeServiceAccountPrivateKey(fromJson?.privateKey || privateKeyRaw)

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

async function getOrCreateSheetId(spreadsheetId: string, sheetName: string): Promise<number> {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const existing = meta.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties
  if (existing?.sheetId !== undefined && existing?.sheetId !== null) return existing.sheetId

  const addRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
  })

  const addedSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId
  if (addedSheetId === undefined || addedSheetId === null) {
    throw new Error(`Failed to create sheet tab: ${sheetName}`)
  }
  return addedSheetId
}

function asA1(sheetName: string, col: string, row: number) {
  return `${sheetName}!${col}${row}`
}

function findSingleMissingIndex(existing: string[], expected: string[]) {
  // Returns the index in `expected` that is missing from `existing` if and only if:
  // - expected has exactly 1 more item than existing
  // - existing matches expected in order, excluding the missing item
  if (expected.length !== existing.length + 1) return null
  let i = 0
  let j = 0
  let missingIndex: number | null = null
  while (i < expected.length && j < existing.length) {
    if (expected[i] === existing[j]) {
      i++
      j++
      continue
    }
    if (missingIndex !== null) return null
    missingIndex = i
    i++
  }
  if (j !== existing.length) return null
  if (missingIndex === null) missingIndex = expected.length - 1
  return missingIndex
}

async function insertSheetColumn(spreadsheetId: string, sheetId: number, index: number) {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId,
              dimension: 'COLUMNS',
              startIndex: index,
              endIndex: index + 1,
            },
            inheritFromBefore: true,
          },
        },
      ],
    },
  })
}

function tabCountFormula(sheetName: string) {
  // Uses Submitted At column (A). -1 removes header row.
  return `=MAX(0,COUNTA(${sheetName}!A:A)-1)`
}

function tabTodayFormula(sheetName: string) {
  // Our timestamp begins with yyyy-mm-dd, so string prefix match works.
  return `=COUNTIF(${sheetName}!A:A, TEXT(TODAY(),"yyyy-mm-dd")&"*")`
}

function tabLast7DaysFormula(sheetName: string) {
  return `=SUM(ARRAYFORMULA(COUNTIF(${sheetName}!A:A, TEXT(TODAY()-SEQUENCE(7,1,0),"yyyy-mm-dd")&"*")))`
}

async function ensureDashboardReady(spreadsheetId: string) {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const sheetId = await getOrCreateSheetId(spreadsheetId, DASHBOARD_SHEET_NAME)

  // If MAIN already has content we don't recognize, don't overwrite it.
  const head = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${DASHBOARD_SHEET_NAME}!A1:B1`,
  })
  const a1 = `${head.data.values?.[0]?.[0] ?? ''}`.trim()
  const recognized = a1 === '' || a1 === 'Tomi Forms Dashboard'
  if (!recognized) return

  const rows: Array<Array<string>> = []
  rows.push(['Tomi Forms Dashboard', ''])
  rows.push(['', ''])
  rows.push(['Form', 'Total', 'Last 7 Days', 'Today'])

  const formRows: Array<{ label: string; tab: string }> = [
    { label: 'Contact Us', tab: FORM_SHEETS.contact_us.sheetName },
    { label: 'Appointments', tab: FORM_SHEETS.appointments.sheetName },
    { label: 'Repairs', tab: FORM_SHEETS.repairs.sheetName },
    { label: 'Returns', tab: FORM_SHEETS.returns.sheetName },
    { label: 'Jade Consultation', tab: FORM_SHEETS.jade_consultation.sheetName },
    { label: 'Mailing List', tab: FORM_SHEETS.mailing_list.sheetName },
  ]

  for (const r of formRows) {
    rows.push([r.label, tabCountFormula(r.tab), tabLast7DaysFormula(r.tab), tabTodayFormula(r.tab)])
  }

  rows.push(['', '', '', ''])
  rows.push([
    'All Forms',
    `=SUM(B4:B9)`,
    `=SUM(C4:C9)`,
    `=SUM(D4:D9)`,
  ])

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: asA1(DASHBOARD_SHEET_NAME, 'A', 1),
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  })

  // Formatting: title, header, freeze
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: {
                frozenRowCount: 3,
              },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true, fontSize: 14 },
              },
            },
            fields: 'userEnteredFormat.textFormat',
          },
        },
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 4 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
                textFormat: { bold: true },
                horizontalAlignment: 'LEFT',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        {
          setBasicFilter: {
            filter: {
              range: { sheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 4 },
            },
          },
        },
        {
          autoResizeDimensions: {
            dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 4 },
          },
        },
      ],
    },
  })
}

async function clearSheetData(spreadsheetId: string, sheetName: string) {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  // Clear everything except row 1 (header) for data sheets.
  // Use a generous range to cover current columns.
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  })
}

async function clearDashboard(spreadsheetId: string) {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${DASHBOARD_SHEET_NAME}!A1:ZZ`,
  })
}

export async function resetFormsWorkbook() {
  const spreadsheetId = ensureEnv('GOOGLE_SHEETS_SPREADSHEET_ID', process.env.GOOGLE_SHEETS_SPREADSHEET_ID)

  // Ensure all tabs exist + have the right headers/formatting
  for (const key of Object.keys(FORM_SHEETS) as FormType[]) {
    const cfg = FORM_SHEETS[key]
    const sheetId = await getOrCreateSheetId(spreadsheetId, cfg.sheetName)
    // rewrite header row with labels and formatting
    await ensureHeaderRow(spreadsheetId, sheetId, cfg.sheetName, cfg.columns)
    // wipe data
    await clearSheetData(spreadsheetId, cfg.sheetName)
  }

  // Wipe and rebuild dashboard
  await clearDashboard(spreadsheetId)
  await ensureDashboardReady(spreadsheetId)
}

async function applyNiceFormatting(
  spreadsheetId: string,
  sheetId: number,
  sheetName: string,
  columns: SheetColumn[],
) {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const rawIdx = columns.findIndex((c) => c.key === 'rawPayloadJson')
  const notesIdx = columns.findIndex((c) => c.key === 'notesOrMessage')

  const requests: any[] = []

  // Freeze header row + enable filter
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId,
        gridProperties: {
          frozenRowCount: 1,
        },
      },
      fields: 'gridProperties.frozenRowCount',
    },
  })

  requests.push({
    setBasicFilter: {
      filter: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: columns.length,
        },
      },
    },
  })

  // Header styling
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
        startColumnIndex: 0,
        endColumnIndex: columns.length,
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
          textFormat: { bold: true },
          horizontalAlignment: 'LEFT',
          verticalAlignment: 'MIDDLE',
          wrapStrategy: 'WRAP',
        },
      },
      fields:
        'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
    },
  })

  // Auto-resize all columns (good default)
  requests.push({
    autoResizeDimensions: {
      dimensions: {
        sheetId,
        dimension: 'COLUMNS',
        startIndex: 0,
        endIndex: columns.length,
      },
    },
  })

  // Make Notes/Message column wider + wrapped
  if (notesIdx >= 0) {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: notesIdx,
          endIndex: notesIdx + 1,
        },
        properties: { pixelSize: 420 },
        fields: 'pixelSize',
      },
    })
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          startColumnIndex: notesIdx,
          endColumnIndex: notesIdx + 1,
        },
        cell: {
          userEnteredFormat: { wrapStrategy: 'WRAP', verticalAlignment: 'TOP' },
        },
        fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)',
      },
    })
  }

  // Hide raw JSON column (still stored, but not scary to non-technical folks)
  if (rawIdx >= 0) {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: rawIdx,
          endIndex: rawIdx + 1,
        },
        properties: { hiddenByUser: true },
        fields: 'hiddenByUser',
      },
    })
  }

  if (requests.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    })
  }
}

async function ensureHeaderRow(
  spreadsheetId: string,
  sheetId: number,
  sheetName: string,
  columns: SheetColumn[],
) {
  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const range = `${sheetName}!1:1`
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range })
  const existing = (res.data.values?.[0] ?? []).map((v) => (typeof v === 'string' ? v : String(v)))

  const existingNonEmpty = existing.some((v) => `${v}`.trim() !== '')
  if (!existingNonEmpty) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [columns.map((c) => c.label)] },
    })
    await applyNiceFormatting(spreadsheetId, sheetId, sheetName, columns)
    return
  }

  const normalizedExisting = existing.map((h) => h.trim())
  const expectedLabels = columns.map((c) => c.label.trim())
  const expectedKeys = columns.map((c) => c.key.trim())

  const matchesLabels =
    normalizedExisting.length === expectedLabels.length && normalizedExisting.every((h, i) => h === expectedLabels[i])
  const matchesKeys =
    normalizedExisting.length === expectedKeys.length && normalizedExisting.every((h, i) => h === expectedKeys[i])

  // Safe one-time schema migration: JadeConsultation missing just the new "Profile" column.
  // This avoids hard failures when we add a column in code while the live sheet still has the old header.
  if (sheetName === FORM_SHEETS.jade_consultation.sheetName && !matchesLabels) {
    const missingLabelIdx = findSingleMissingIndex(normalizedExisting, expectedLabels)
    if (missingLabelIdx !== null && expectedLabels[missingLabelIdx] === 'Profile') {
      await insertSheetColumn(spreadsheetId, sheetId, missingLabelIdx)
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [columns.map((c) => c.label)] },
      })
      await applyNiceFormatting(spreadsheetId, sheetId, sheetName, columns)
      return
    }

    // Also handle legacy "keys as headers" variant missing the new key.
    const missingKeyIdx = findSingleMissingIndex(normalizedExisting, expectedKeys)
    if (missingKeyIdx !== null && expectedKeys[missingKeyIdx] === 'consultationProfile') {
      await insertSheetColumn(spreadsheetId, sheetId, missingKeyIdx)
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [columns.map((c) => c.label)] },
      })
      await applyNiceFormatting(spreadsheetId, sheetId, sheetName, columns)
      return
    }
  }

  if (matchesKeys && !matchesLabels) {
    // Migrate legacy header row (internal keys) -> nice labels
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [columns.map((c) => c.label)] },
    })
    await applyNiceFormatting(spreadsheetId, sheetId, sheetName, columns)
    return
  }

  if (matchesLabels) {
    // Ensure formatting is applied even if header already exists
    await applyNiceFormatting(spreadsheetId, sheetId, sheetName, columns)
    return
  }

  if (!matchesLabels) {
    throw new Error(
      `Sheet tab '${sheetName}' already has a non-empty header row that doesn't match the expected schema. ` +
        `To avoid corrupting your data, please clear row 1 in '${sheetName}' or make it match the expected headers.`,
    )
  }
}

export async function ensureFormSheetReady(formType: FormType) {
  const spreadsheetId = ensureEnv('GOOGLE_SHEETS_SPREADSHEET_ID', process.env.GOOGLE_SHEETS_SPREADSHEET_ID)
  const cfg = FORM_SHEETS[formType]
  const sheetId = await getOrCreateSheetId(spreadsheetId, cfg.sheetName)
  await ensureHeaderRow(spreadsheetId, sheetId, cfg.sheetName, cfg.columns)
  await ensureDashboardReady(spreadsheetId)
}

export async function appendFormRow(formType: FormType, row: Record<string, unknown>) {
  const spreadsheetId = ensureEnv('GOOGLE_SHEETS_SPREADSHEET_ID', process.env.GOOGLE_SHEETS_SPREADSHEET_ID)
  const cfg = FORM_SHEETS[formType]

  await ensureFormSheetReady(formType)

  const auth = getSheetsAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const values = cfg.columns.map((c) => normalizeCellValue(row[c.key]))

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${cfg.sheetName}!A:Z`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] },
  })
}


