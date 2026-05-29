/**
 * @file qris-api.helper.ts
 * @description Helper for QRIS Payment API calls.
 *
 * Signature logic is ported 1-to-1 from the Postman pre-request script:
 *  1. Build UTC timestamp in "YYYY-MM-DD HH:mm:ss.mmmZ" format
 *  2. Generate RRN  (ALTO-API-NMS-<12 hex chars>)
 *  3. Compact-stringify the request body
 *  4. SHA-256 hash the compact body
 *  5. Plaintext = METHOD:CANONICAL_URL:API_KEY:hash:timestamp
 *  6. HMAC-SHA256(plainText, VALIDATION_KEY) → hex signature
 */

import crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

// ─── Constants (mirror the Postman CONFIG block) ──────────────────────────────

const HTTP_METHOD   = 'POST';
const CANONICAL_URL = '/altopay/qr-payment/payment';
const API_BASE_URL  = process.env.API_BASE_URL ?? 'https://mmsapi-test.manjo.co.id';
const API_KEY       = process.env.API_KEY       ?? 'akey_NjwW73gz90xmtDtpbgAj';
const VALIDATION_KEY = process.env.VALIDATION_KEY ?? 'vkey_TLLbu9qp3Uj94j4ks2DU';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Shape of the Alto API success response body.
 *
 * Example:
 * {
 *   "command": "qr-payment-credit",
 *   "response_code": "001",
 *   "response_text": "Success",
 *   "data": {
 *     "customer_reference_number": "ALTO-API-NMS-3f80adb10d0f",
 *     "invoice_no": "20308182082030818208",
 *     "currency_code": "IDR",
 *     "amount": 12000,
 *     "fee": 0
 *   }
 * }
 *
 * response_code "001" = Success. Any other value = failure.
 */
export interface QrisApiBody {
  command: string;
  response_code: string;
  response_text: string;
  data?: {
    customer_reference_number?: string;
    invoice_no?: string;
    currency_code?: string;
    amount?: number;
    fee?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface QrisPaymentResponse {
  /** Raw HTTP status code */
  status: number;
  /** Parsed and typed JSON body */
  body: QrisApiBody;
}

export interface PaymentStatusResponse {
  /** Whether the API reports the payment as successfully completed */
  isPaid: boolean;
  /** Raw HTTP status */
  status: number;
  body: unknown;
}

/**
 * Type-guard: returns true when the body is a well-formed Alto success response.
 * Success is defined as response_code === "001".
 */
export function isQrisSuccess(body: unknown): body is QrisApiBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return b['response_code'] === '001';
}

// ─── Timestamp helper (exact format from Postman script) ─────────────────────

/**
 * Returns a UTC timestamp in the format required by the Alto API:
 * "YYYY-MM-DD HH:mm:ss.mmmZ"  (note the space, not T, between date and time)
 */
function getUTCTimestamp(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const MM   = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd   = String(now.getUTCDate()).padStart(2, '0');
  const HH   = String(now.getUTCHours()).padStart(2, '0');
  const mm   = String(now.getUTCMinutes()).padStart(2, '0');
  const ss   = String(now.getUTCSeconds()).padStart(2, '0');
  const ms   = String(now.getUTCMilliseconds()).padStart(3, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${ms}Z`;
}

// ─── RRN helpers ─────────────────────────────────────────────────────────────

/**
 * Generates a customer reference number in the same pattern as Postman:
 * "ALTO-API-NMS-" + 12 hex chars (from a random UUID, dashes stripped).
 */
function generateRRN(): string {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  return `ALTO-API-NMS-${uuid.substring(0, 12)}`;
}

/**
 * Generates a forwarding RRN: 12 hex chars from a random UUID.
 */
function generateForwardRRN(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 12);
}

// ─── Signature builder ────────────────────────────────────────────────────────

/**
 * Builds the HMAC-SHA256 signature for the Alto API, replicating the Postman
 * pre-request script step by step.
 *
 * @param compactBody - The JSON.stringify() of the request body object
 * @param timestamp   - The UTC timestamp string produced by getUTCTimestamp()
 * @returns Hex-encoded HMAC-SHA256 signature
 */
function buildSignature(compactBody: string, timestamp: string): string {
  const payloadHash = crypto
    .createHash('sha256')
    .update(compactBody)
    .digest('hex');

  const plainText = [
    HTTP_METHOD,
    CANONICAL_URL,
    API_KEY,
    payloadHash,
    timestamp,
  ].join(':');

  return crypto
    .createHmac('sha256', VALIDATION_KEY)
    .update(plainText)
    .digest('hex');
}

// ─── Main API helper ──────────────────────────────────────────────────────────

/**
 * Calls the QRIS payment API with the given transaction ID embedded into
 * the `additional_data` field via template-literal interpolation:
 *
 *   additional_data: `0524${transactionId}07034270817Auto Loan Account`
 *
 * Signature & timestamp are computed fresh on every call, matching the
 * Postman pre-request script logic exactly.
 *
 * **Throws immediately** if the API returns a non-success response
 * (i.e. `response_code !== "001"`). This causes the calling test step
 * to fail and stops the iteration — no further steps are executed.
 *
 * @param transactionId - The dynamic transaction ID extracted from the popup
 * @returns Promise resolving to { status, body: QrisApiBody } on success
 * @throws Error with full response details on API failure
 */
export async function payQrisTransaction(
  transactionId: string,
  amount: string | number,
): Promise<QrisPaymentResponse> {
  const timestamp  = getUTCTimestamp();
  const rrn        = generateRRN();
  const forwardRrn = generateForwardRRN();

  // ── Build body object ──────────────────────────────────────────────────────
  const bodyObject = {
    command: 'qr-payment-credit',
    data: {
      date_time: timestamp,
      customer_reference_number: rrn,
      authorization_id: 'FCC7B6',
      currency_code: 'IDR',
      amount: Number(amount),
      fee: 0,
      issuer_nns: '93600821',
      acquirer_nns: '93600858',
      national_mid: 'MT60169117',
      // ⚠️  Transaction ID is embedded DIRECTLY inside additional_data —
      //     no separator, no extra space — prefix + id + suffix.
      additional_data: `0524${transactionId}07034270817Auto Loan Account`,
      terminal_label: '427',
      forwarding_customer_reference_number: forwardRrn,
      merchant: {
        pan: '9360085801764127112',
        id: 'MT60169117',
        criteria: 'UKE',
        name: 'Ayoborong',
        city: 'JAKARTA PUSAT',
        mcc: '5251',
        postal_code: '10110',
        country_code: 'ID',
      },
      customer: {
        pan: '9360085801764127112',
        name: 'Tes',
        account_type: 'UNSPECIFIED',
      },
      // TODO: add more fields from Postman here if needed
    },
  };

  // ── Compact JSON (mirrors Postman's JSON.stringify step) ───────────────────
  const compactBody = JSON.stringify(bodyObject);

  // ── Compute signature ──────────────────────────────────────────────────────
  const signature = buildSignature(compactBody, timestamp);

  // ── Debug logging (mirrors Postman console.log block) ─────────────────────
  console.log('[QRIS-API] === REQUEST DEBUG ===');
  console.log('[QRIS-API] TIMESTAMP  :', timestamp);
  console.log('[QRIS-API] RRN        :', rrn);
  console.log('[QRIS-API] FORWARD_RRN:', forwardRrn);
  console.log('[QRIS-API] TXN_ID     :', transactionId);
  console.log('[QRIS-API] COMPACT    :', compactBody);
  console.log('[QRIS-API] SIGNATURE  :', signature);

  // ── Fire the request ───────────────────────────────────────────────────────
  const url = `${API_BASE_URL}${CANONICAL_URL}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':     'application/json',
      'X-Alto-Key':       API_KEY,
      'X-Alto-Timestamp': timestamp,
      'X-Alto-Signature': signature,
    },
    body: compactBody,
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = await response.text();
  }

  console.log('[QRIS-API] HTTP Status :', response.status);
  console.log('[QRIS-API] Response    :', JSON.stringify(body));

  // ── Guard: hard-stop if API does not return response_code "001" ────────────
  //
  // Success shape:
  //   { command, response_code: "001", response_text: "Success", data: { ... } }
  //
  // Any other response_code (or unparseable body) means the payment was
  // rejected. We throw so the test step fails immediately and the loop stops.
  if (!isQrisSuccess(body)) {
    const code = (
      typeof body === 'object' && body !== null
        ? (body as Record<string, unknown>)['response_code']
        : undefined
    );
    const text = (
      typeof body === 'object' && body !== null
        ? (body as Record<string, unknown>)['response_text']
        : body
    );
    throw new Error(
      `[QRIS-API] Payment FAILED — ` +
      `HTTP ${response.status} | ` +
      `response_code: "${code ?? 'N/A'}" | ` +
      `response_text: "${text ?? 'N/A'}" | ` +
      `txn_id: ${transactionId}`,
    );
  }

  // ── Log success details ────────────────────────────────────────────────────
  console.log('[QRIS-API] ✅ Payment SUCCESS');
  console.log('[QRIS-API] response_code :', body.response_code);
  console.log('[QRIS-API] response_text :', body.response_text);
  console.log('[QRIS-API] invoice_no    :', body.data?.invoice_no);
  console.log('[QRIS-API] crn           :', body.data?.customer_reference_number);

  return { status: response.status, body };
}

// ─── Polling helper ───────────────────────────────────────────────────────────

/**
 * Polls the payment status endpoint until the payment is confirmed or the
 * timeout is reached.
 *
 * @param transactionId  - Transaction ID to check
 * @param timeoutMs      - Maximum wait time in milliseconds (default: 30 000)
 * @param intervalMs     - Polling interval in milliseconds (default: 2 000)
 * @returns Promise resolving to { isPaid, status, body }
 *
 * @example
 * const result = await waitUntilPaid('txn-abc123', 30_000);
 * if (!result.isPaid) throw new Error('Payment not confirmed within timeout');
 */
export async function waitUntilPaid(
  transactionId: string,
  timeoutMs  = 30_000,
  intervalMs = 2_000,
): Promise<PaymentStatusResponse> {
  // TODO: Replace this endpoint with the actual status-check endpoint
  //       from your Postman collection.
  const STATUS_ENDPOINT = process.env.API_STATUS_ENDPOINT
    ?? '/altopay/qr-payment/status'; // ← fill in from Postman

  const url      = `${API_BASE_URL}${STATUS_ENDPOINT}`;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const timestamp = getUTCTimestamp();

    const bodyObject = { transaction_id: transactionId };
    const compactBody = JSON.stringify(bodyObject);
    const signature   = buildSignature(compactBody, timestamp);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'X-Alto-Key':      API_KEY,
        'X-Alto-Timestamp': timestamp,
        'X-Alto-Signature': signature,
      },
      body: compactBody,
    });

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    // TODO: adjust the isPaid check to match the actual response shape
    //       e.g.  (body as any)?.data?.status === 'SUCCESS'
    const isPaid =
      response.status === 200 &&
      typeof body === 'object' &&
      body !== null &&
      (body as Record<string, unknown>)?.['status'] === 'SUCCESS';

    if (isPaid) {
      return { isPaid: true, status: response.status, body };
    }

    console.log(
      `[QRIS-API] Payment not yet confirmed (${response.status}). ` +
      `Retrying in ${intervalMs}ms…`,
    );
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  return { isPaid: false, status: 0, body: null };
}
