Package.describe({
  summary: "Support for a Demo Account"
});

Package.on_use(function(api) {
  api.use('accounts-base', ['client', 'server']);
  api.use('check', ['server']);
  api.use('livedata', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  
  api.add_files('demo_server.js', 'server');
  api.add_files('demo_client.js', 'client');
});