export { Document } from './document'

export default {
  fetch() {
    return new Response("This Worker creates the Document Durable Object.");
  },
};
