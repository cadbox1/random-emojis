# My Document Durable Object

## Scripts
- `yarn` - Install dependencies.
- `yarn run deploy` - Builds and deploys the Durable Object.
- `yarn wrangler login` - Login to Cloudflare with Wrangler

## Getting Started
1. Sign up for the Workers Paid plan. It's required for Durable Objects.
    1. Login to the Cloudflare Dashboard.
    1. Click on Workers then Plans on the left menu.
    1. Click on the paid plan and enter your card details.
1. Install dependencies.
    ```
    yarn
    ```
1. Login to Cloudflare with Wrangler.
    ```
    yarn wrangler login
    ```
1. Try and Deploy the Durable Object and accept the agreement when prompted.
    ```
    yarn run deploy
    ```
1. Actually deploy the Durable Object.
    ```
    yarn run deploy
    ```
1. Bind the the Durable Object as an environment variable in Pages.
    1. Login to the Cloudflare Dashboard.
    1. Go to Pages then select your Pages project.
    1. Go to Settings then Functions.
    1. Bind your Durable Object to an environment variable for both Production and Preview.
