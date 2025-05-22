module.exports = {
  apps : [{
    name        : "sophie-bluel-api",
    script      : "./server.js",
    watch       : false,
    exec_mode   : "fork",
    instances   : 1,
    max_memory_restart : "100M",
    env: {
      "NODE_ENV": "development",
      "PORT": 5678
    },
    env_production : {
       "NODE_ENV": "production",
       "PORT": 5678
    },
    // Ne pas redémarrer si le script quitte avec le code 1 (EADDRINUSE)
    stop_exit_codes: [1],
    // Attendre 5 secondes avant de redémarrer après un crash
    restart_delay: 5000,
    // Nombre maximum de redémarrages instables
    max_restarts: 5
  }]
}; 