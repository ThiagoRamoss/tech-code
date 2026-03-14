import express from 'express';
import cors from 'cors';
import { roadmapRoutes } from './routes/roadmap.routes';
import { glossaryRoutes } from './routes/glossary.routes';
import { contentRoutes } from './routes/content.routes';
import { userRoutes } from './routes/user.routes';
import { authRoutes } from './routes/auth.routes';

import { sandboxQueue, sandboxWorker } from './lib/queue';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechCode API está rodando perfeitamente!' });
});

app.use(authRoutes);
app.use(roadmapRoutes);
app.use(glossaryRoutes);
app.use(contentRoutes);
app.use(userRoutes);

app.post('/test-sandbox', async (req, res) => {
  const { code, lang } = req.body;
  const job = await sandboxQueue.add('CodeExecutionTask', {
    codigoDoAluno: code || 'console.log("Teste");',
    linguagem: lang || 'javascript'
  });

  res.json({
    message: "Código enviado para a esteira julgadora. Aguarde...",
    jobId: job.id
  });
});

app.get('/sandbox/:id', async (req, res) => {
  try {
    const job = await sandboxQueue.getJob(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Processamento não encontrado.' });
    }

    const state = await job.getState();
    const result = job.returnvalue; // O que o Worker retornou
    const logs = await sandboxQueue.getJobLogs(job.id!);

    res.json({
      id: job.id,
      state, // 'waiting', 'active', 'completed', 'failed', etc
      result: result || null,
      failedReason: job.failedReason || null,
      logs: logs.logs || []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { app };