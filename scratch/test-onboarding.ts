/**
 * test-onboarding.ts
 * Programmatic verification script for the CSV onboarding flow.
 *
 * Run with:  npx ts-node scratch/test-onboarding.ts
 *
 * Prerequisites:
 *  - App is running on http://localhost:3000
 *  - A verified employer account exists (update EMPLOYER_EMAIL / EMPLOYER_PASSWORD below)
 */

const BASE_URL = 'http://localhost:3000';

const EMPLOYER_EMAIL = 'employer@test.com';
const EMPLOYER_PASSWORD = 'password123';

// A fresh email that does NOT yet exist in the DB
const NEW_WORKER_EMAIL = `worker_${Date.now()}@test.com`;

async function request(method: string, path: string, body?: any, token?: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = text; }

  if (!res.ok) {
    console.error(`❌ ${method} ${path} → ${res.status}`, json);
    throw new Error(`Request failed: ${res.status}`);
  }
  return json;
}

async function run() {
  console.log('\n=== XIDE ONBOARDING VERIFICATION SCRIPT ===\n');

  // ─── Step 1: Employer login ───────────────────────────────────────────────
  console.log('1. Logging in as employer...');
  const loginRes = await request('POST', '/auth/login', {
    email: EMPLOYER_EMAIL,
    password: EMPLOYER_PASSWORD,
  });
  const employerToken: string = loginRes.access_token;
  console.log('   ✅ Employer token obtained\n');

  // ─── Step 2: Upload CSV with one new worker ───────────────────────────────
  console.log(`2. Uploading worker CSV (new worker: ${NEW_WORKER_EMAIL})...`);
  const uploadRes = await request('POST', '/employers/workers/upload', {
    rows: [
      {
        email: NEW_WORKER_EMAIL,
        firstName: 'Test',
        lastName: 'Worker',
        employeeNumber: `EMP-${Date.now()}`,
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        monthlySalary: 500000,
        salaryBand: 'L3',
      },
    ],
  }, employerToken);
  console.log('   Upload results:', JSON.stringify(uploadRes, null, 2));
  const created = uploadRes.find((r: any) => r.email === NEW_WORKER_EMAIL && r.status === 'created');
  if (!created) throw new Error('Expected worker to be created');
  console.log('   ✅ New worker created and activation link logged to console\n');

  // ─── Step 3: Upload same worker again (should skip — duplicate) ───────────
  console.log('3. Re-uploading same worker (expect: skipped)...');
  const dupRes = await request('POST', '/employers/workers/upload', {
    rows: [
      {
        email: NEW_WORKER_EMAIL,
        firstName: 'Test',
        lastName: 'Worker',
        employeeNumber: `EMP-${Date.now()}`,
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        monthlySalary: 500000,
        salaryBand: 'L3',
      },
    ],
  }, employerToken);
  const skipped = dupRes.find((r: any) => r.email === NEW_WORKER_EMAIL && r.status === 'skipped');
  if (!skipped) throw new Error('Expected duplicate to be skipped');
  console.log('   ✅ Duplicate correctly skipped:', skipped.reason, '\n');

  // ─── Step 4: Worker activates their account ───────────────────────────────
  console.log('4. Activating worker account...');
  const activateRes = await request('POST', '/workers/activate', {
    email: NEW_WORKER_EMAIL,
    password: 'newPassword123',
    phone: '+2348012345678',
    address: '12 Victoria Island, Lagos',
  });
  console.log('   ✅', activateRes.message, '\n');

  // ─── Step 5: Worker logs in ───────────────────────────────────────────────
  console.log('5. Logging in as newly activated worker...');
  const workerLogin = await request('POST', '/auth/login', {
    email: NEW_WORKER_EMAIL,
    password: 'newPassword123',
  });
  const workerToken: string = workerLogin.access_token;
  console.log('   ✅ Worker token obtained\n');

  // ─── Step 6: Fetch active employment record ───────────────────────────────
  console.log('6. Fetching active employment record...');
  const activeRecord = await request('GET', '/employment-records/active', undefined, workerToken);
  console.log('   Active record:', JSON.stringify(activeRecord, null, 2));
  if (activeRecord.status !== 'ACTIVE') throw new Error('Employment record is not ACTIVE');
  console.log('   ✅ Employment record is ACTIVE\n');

  // ─── Step 7: Fetch worker profile ─────────────────────────────────────────
  console.log('7. Fetching worker profile...');
  const profile = await request('GET', '/workers/profile', undefined, workerToken);
  console.log('   Profile:', JSON.stringify(profile, null, 2));
  console.log('   ✅ Worker profile fetched\n');

  console.log('=== ALL CHECKS PASSED ✅ ===\n');
}

run().catch((err) => {
  console.error('\n❌ Verification failed:', err.message);
  process.exit(1);
});
