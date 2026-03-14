import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('🔗 Conectado ao Redis com sucesso!');
});

redis.on('error', (err) => {
  console.error('❌ Erro na conexão com Redis:', err);
});

export { redis };
