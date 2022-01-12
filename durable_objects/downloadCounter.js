export class DownloadCounter {
    constructor(state) {
      this.state = state;
      // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
      this.state.blockConcurrencyWhile(async () => {
        let stored = await this.state.storage.get("value");
        this.value = stored || 0;
      });
    }
  
    async fetch(request) {
      const url = new URL(request.url);
      let currentValue = this.value;
  
      if (url.pathname === "/increment") {
        currentValue = ++this.value;
        await this.state.storage.put("value", currentValue);
      }
  
      return jsonResponse(currentValue);
    }
  }