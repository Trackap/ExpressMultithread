import { cpus } from 'os';


export const THREAD_COUNT = process.env.THREAD_COUNT === undefined ? cpus().length : parseInt(process.env.THREAD_COUNT);