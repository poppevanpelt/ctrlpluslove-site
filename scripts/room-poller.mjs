const target = process.env.ROOM_REFRESH_URL || "http://app:3000/api/room-refresh";
const intervalMs = Number(process.env.ROOM_POLL_INTERVAL_MS || 300000);
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error("room-poller: CRON_SECRET is missing");
  process.exit(1);
}

async function run() {
  try {
    const response = await fetch(target, {
      method: "GET",
      headers: { Authorization: `Bearer ${secret}` },
    });

    if (!response.ok) {
      console.error(`room-poller: ${response.status} ${await response.text()}`);
      return;
    }

    console.log(`room-poller: ${new Date().toISOString()} ok`);
  } catch (error) {
    console.error("room-poller:", error);
  }
}

await new Promise((resolve) => setTimeout(resolve, 15000));
await run();
setInterval(run, intervalMs);
