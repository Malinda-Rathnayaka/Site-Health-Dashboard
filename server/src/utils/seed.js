// One-off script to create the first admin account, since public
// registration only ever creates `viewer` accounts (see authController.js).
// Usage: node src/utils/seed.js
//   optionally set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log(`[seed] Existing user ${email} promoted to admin.`);
  } else {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`[seed] Admin user created: ${email} / ${password}`);
    console.log('[seed] Log in and consider changing the password (no reset flow exists yet).');
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[seed] Failed:', err.message);
  process.exit(1);
});
