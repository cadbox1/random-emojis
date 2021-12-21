export const onRequestGet = () => {
  return new Response(new Date().toISOString());
};
