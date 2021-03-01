export const apps = [
  {
    name: 'app',
    script: './src/index.js',
    instances: 0,
    exec_mode: 'cluster',
    wait_ready: true,
    listen_timeout: 50000,
    kill_timeout: 5000,
    env: {
      'NODE_ENV': 'develop',
    },
    env_production: {
      'NODE_ENV': 'production',
    },
  },
];
