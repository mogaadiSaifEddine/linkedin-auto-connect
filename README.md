# LinkedIn Auto Connect

A Chrome extension that automates the LinkedIn connection process by automatically clicking connect buttons, handling connection prompts, and navigating through pages.

![LinkedIn Auto Connect Logo](images/icon.png)

## Features

- **Automatic Connection Requests**: Automatically clicks "Connect" buttons on LinkedIn pages
- **Smart Handling**: Manages connection prompts and "Send without note" options
- **Page Navigation**: Scrolls to the bottom and finds the next page button when needed
- **Customizable Settings**:
  - Set maximum number of connection requests
  - Adjust delay between connections
  - Choose whether to send with or without notes
- **User-Friendly Interface**: Simple popup with intuitive controls
- **Status Updates**: Real-time feedback on the connection process

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" and select the downloaded folder
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to a LinkedIn page with connection suggestions (like "My Network" page or search results)
2. Click the LinkedIn Auto Connect extension icon in your toolbar
3. Configure your settings:
   - **Maximum Connections**: How many connections to send before stopping
   - **Delay Between Connections**: How long to wait between clicks (in milliseconds)
   - **Send Without Note**: Check this to automatically click "Send without note" when prompted
4. Click "Start Auto Connect" to begin
5. Watch as the extension:
   - Finds and clicks "Connect" buttons
   - Handles any connection prompts
   - Scrolls to find more connections
   - Navigates to the next page when needed
6. Click "Stop" at any time to pause the process

## Important Notes

- **Use Responsibly**: LinkedIn has limits on how many connection requests you can send in a day (typically around 100 per week). Excessive connection requests may lead to account restrictions.
- **Network Appropriately**: This tool is designed to help you network more efficiently, but always ensure you're connecting with relevant professionals.
- **Terms of Service**: Be aware that automation tools may violate LinkedIn's Terms of Service. Use at your own discretion.

## Files Structure

```
LinkedIn Auto Connect/
├── manifest.json       # Extension configuration
├── popup.html          # User interface
├── popup.js            # UI interaction handling
├── content.js          # Main automation script
└── images/             # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Privacy Policy

This extension does not collect, store, or transmit any user data outside of your browser. It only interacts with LinkedIn pages to automate the connection process based on your settings.

## Support & Contribution

For support, feature requests, or contributions:
- Open an issue on our GitHub repository
- Submit a pull request with improvements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension is not affiliated with, authorized by, endorsed by, or in any way officially connected with LinkedIn or any of its subsidiaries or affiliates. The official LinkedIn website can be found at https://www.linkedin.com.

---

Made with ❤️ for networking professionals
