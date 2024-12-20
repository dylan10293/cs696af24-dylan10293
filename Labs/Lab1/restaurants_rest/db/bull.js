import Queue from 'bull';
const messageQueue = new Queue('messageQueue');
export default messageQueue;