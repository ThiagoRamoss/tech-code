import { Queue, Worker, Job } from 'bullmq';
import { redis } from './redis';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

export const sandboxQueue = new Queue('sandbox-queue', {
    connection: redis as any,
});
export const sandboxWorker = new Worker('sandbox-queue', async (job: Job) => {
    const { codigoDoAluno, linguagem } = job.data;

    if (linguagem !== 'javascript') {
        throw new Error("Linguagem não suportada ainda pela TechCode Sandbox.");
    }

    console.log(`\n👷 Worker: Recebi um código para avaliar (Job ID: ${job.id})`);

    const tempDir = path.resolve(__dirname, '../../tmp_sandbox');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const fileName = `script_${job.id}.js`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, codigoDoAluno);

    try {
        const tempoInicio = Date.now();
        console.log(`⏱️ Worker: Subindo Container Docker para o arquivo ${fileName}...`);

        const dockerCmd = `docker run --rm --network none -v ${filePath}:/app/script.js node:20-alpine node /app/script.js`;

        const { stdout, stderr } = await execPromise(dockerCmd, { timeout: 5000 });
        const tempoFim = Date.now();

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        console.log(`✅ Worker: Resolução feita em ${tempoFim - tempoInicio}ms. Status: Seguro.`);

        return {
            sucesso: true,
            saida: stdout || stderr,
            tempoExecucaoMs: tempoFim - tempoInicio
        };

    } catch (error: any) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        const errorMsg = error.killed
            ? "❌ Erro Crítico: O seu código demorou mais de 5 segundos e foi exterminado pelo servidor (Possível Loop Infinito)."
            : error.stderr || error.message;

        console.log(`🧨 Worker: Código do aluno gerou falha/erro técnico.`);

        return {
            sucesso: false,
            saida: errorMsg,
            tempoExecucaoMs: null
        };
    }

}, {
    connection: redis as any,
    concurrency: 5
});

sandboxWorker.on('completed', (job) => {
    console.log(`📊 Job ${job.id} retornou resultado com sucesso!`);
});

sandboxWorker.on('failed', (job, err) => {
    console.log(`🧨 Fail no Job ${job?.id}: ${err.message}`);
});
