console.log("NEXT_PUBLIC_VERCEL_ENV", process.env.NEXT_PUBLIC_VERCEL_ENV);
console.log(
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL
);
console.log(
  "FIREBASE_ADMIN_PRIVATE_KEY",
  process.env.FIREBASE_ADMIN_PRIVATE_KEY
);
console.log(
  "FIREBASE_ADMIN_PRIVATE_KEY2",
  process.env.FIREBASE_ADMIN_PRIVATE_KEY2
);

console.log("WEBSITE_ADDRESS", process.env.WEBSITE_ADDRESS);
console.log(
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

const value = process.env.FIREBASE_ADMIN_CLIENT_EMAIL + "in script";
console.log("XXXXXXXXXXXXXX", value);

console.log(process.env);
