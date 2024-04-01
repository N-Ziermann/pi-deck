# Contributing

If you want to contribute to this project then feel free to create issues, file feature requests or create Pull Requests

## Start developing

To start developing first install python3 and the pip module pynput for all non-node features to work.

Then install all node dependencies using **npm install**

After that open up 2 terminals.

- one for the vite dev server **npm run react:dev** (start this first)
- one for the electron app **npm run dev**

Make sure not to use the webView instance on port 5123 for development.
Use the one on port 3000 that is hosted through the electron app to ensure full feature functionality.

Once that's done you're ready to start coding!
