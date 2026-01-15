import { createAppContainer } from './container.js';
import { bootstrap } from './bootstrap.js';
import { shutdown } from './shutdown.js';

const main = async () => {
  const container = await createAppContainer();
  process.on('SIGTERM', () => void shutdown(container, 'SIGTERM'));
  process.on('SIGINT', () => void shutdown(container, 'SIGINT'));
  await bootstrap(container);
};

main().catch((e) => { console.error('Failed:', e); process.exit(1); });
