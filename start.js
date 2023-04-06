import express from 'express';
import { handler } from './handler.js';

const app = express();

// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
  res.end('ok');
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(3000, () => {
  console.log('listening on port 3000');
});

const stop = () => {
  console.log();
  process.exit(0);
};

process.on('SIGINT', () => {
  stop();
}); // CTRL+C
process.on('SIGQUIT', () => {
  stop();
}); // Keyboard quit
process.on('SIGTERM', () => {
  stop();
}); // `kill` command
