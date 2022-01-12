export class Message {
    constructor(state) {
      // @ts-ignore
      this.state = state;
      // @ts-ignore
      this.state.blockConcurrencyWhile(async () => {
        // @ts-ignore
        let stored = await this.state.storage.get("value");
        // @ts-ignore
        this.value = stored || 0;
      });
    }
  
    async fetch(request) {
      const url = new URL(request.url);
      // @ts-ignore
      let currentValue = this.value;
  
      if (url.pathname === "/increment") {
        // @ts-ignore
        currentValue = ++this.value;
        // @ts-ignore
        await this.state.storage.put("value", currentValue);
      }
  
      // @ts-ignore
      return jsonResponse(currentValue);
    }
  }