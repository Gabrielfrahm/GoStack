import Bee from 'bee-queue'; // import da Bee gerenciador de filas
import CancellationMail from '../app/jobs/CancellationMail'; //
import redisConfig from '../config/redis';

const jobs = [CancellationMail]; // jobs

// criando a fila
class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // metodo que vai rodar  noss job
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig, // config de connect com banco
        }),
        handle, // processa job
      };
    });
  }

  // add o job na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  //  processa os jobs
  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }

  // pega todos os erros do job
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
