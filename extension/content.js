// LinkedIn Auto Connect Extension - Content Script

// Global variables
let isRunning = false;
let connectCount = 0;
let config = {
    maxConnects: 50,
    connectDelay: 3000,
    scrollDelay: 2000,
    pageChangeDelay: 5000,
    sendWithoutNote: true
};

// Function to wait for a specified time
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to log messages and send updates to popup
function log(message, type = '') {
    console.log(`LinkedIn Auto Connect: ${message}`);
    chrome.runtime.sendMessage({
        action: "updateStatus",
        message: message,
        type: type,
        isComplete: false
    });
}

// Function to find and click connect buttons
async function clickConnectButtons() {
    // Look for connect buttons that are visible
    const connectButtons = Array.from(document.querySelectorAll('button'))
        .filter(button => {
            // Look for buttons with "Connect" text
            const buttonText = button.textContent.trim().toLowerCase();
            return buttonText === 'connect' && button.offsetParent !== null;
        });

    log(`Found ${connectButtons.length} connect buttons`);

    // If no connect buttons are found, return false to indicate we should scroll or move to next page
    if (connectButtons.length === 0) {
        return false;
    }

    // Click each connect button with a delay between clicks
    for (const button of connectButtons) {
        if (!isRunning) {
            return 'stopped';
        }

        // Check if we've reached the maximum number of connections
        if (connectCount >= config.maxConnects) {
            log(`Reached maximum connection limit of ${config.maxConnects}`, 'success');
            chrome.runtime.sendMessage({
                action: "updateStatus",
                message: `Completed! Sent ${connectCount} connection requests.`,
                type: "success",
                isComplete: true
            });
            return 'max-reached';
        }

        // Scroll the button into view
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(500);

        // Click the button
        log(`Clicking connect button (${connectCount + 1} of ${config.maxConnects})`);
        button.click();
        connectCount++;

        // Look for and click the "Send" button in the modal (if it appears)
        await wait(1000);
        const sendButtons = Array.from(document.querySelectorAll('button'))
            .filter(button => {
                const buttonText = button.textContent.trim().toLowerCase();
                return buttonText === 'send' && button.offsetParent !== null;
            });

        if (sendButtons.length > 0) {
            log('Clicking send button in modal');
            sendButtons[0].click();
        }

        // Handle "Send without a note" option if enabled
        if (config.sendWithoutNote) {
            await wait(1000);

            // First, try to find and click "Send without a note" button specifically
            const sendWithoutNoteButtons = Array.from(document.querySelectorAll('button'))
                .filter(button => {
                    const buttonText = button.textContent.trim().toLowerCase();
                    return (buttonText.includes('send without') ||
                        buttonText === 'send' ||
                        (buttonText.includes('send') && buttonText.includes('note') && !buttonText.includes('add'))) &&
                        button.offsetParent !== null;
                });

            if (sendWithoutNoteButtons.length > 0) {
                log('Clicking "Send without a note" button: ' + sendWithoutNoteButtons[0].textContent.trim());
                sendWithoutNoteButtons[0].click();
                await wait(1000);
            }
        }

        // Handle any other prompt messages or additional confirmation dialogs
        const promptButtons = Array.from(document.querySelectorAll('button'))
            .filter(button => {
                const buttonText = button.textContent.trim().toLowerCase();
                // Look for common prompt buttons like "Connect", "Done", etc.
                return (buttonText.includes('connect') ||
                    buttonText.includes('send') ||
                    buttonText.includes('done') ||
                    buttonText.includes('confirm') ||
                    buttonText.includes('yes')) &&
                    button.offsetParent !== null;
            });

        if (promptButtons.length > 0) {
            log('Clicking prompt button: ' + promptButtons[0].textContent.trim());
            promptButtons[0].click();
        }

        // Wait before the next connection
        await wait(config.connectDelay);
    }

    return true;
}

// Function to scroll directly to bottom of page
async function scrollToBottom() {
    log('Scrolling directly to bottom of page');
    window.scrollTo(0, document.body.scrollHeight);
    await wait(config.scrollDelay);
    return true;
}

// Function to go to the next page
async function goToNextPage() {
    log('Looking for next page button');

    // Look for pagination buttons with "Next" or an arrow icon
    const nextButtons = Array.from(document.querySelectorAll('button, a'))
        .filter(el => {
            const text = el.textContent.trim().toLowerCase();
            return (text.includes('next') || text.includes('›') || text.includes('>')) &&
                el.offsetParent !== null;
        });

    if (nextButtons.length > 0) {
        log('Clicking next page button');
        nextButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
        nextButtons[0].click();
        await wait(config.pageChangeDelay);
        return true;
    }

    log('No next page button found');
    return false;
}

// Main function to run the bot
async function runConnectBot() {
    log('Starting LinkedIn Auto Connect', 'running');
    isRunning = true;
    connectCount = 0;

    try {
        while (isRunning) {
            // Look for connect buttons
            const connectButtons = Array.from(document.querySelectorAll('button'))
                .filter(button => {
                    const buttonText = button.textContent.trim().toLowerCase();
                    return buttonText === 'connect' && button.offsetParent !== null;
                });

            // If no connect buttons found initially, scroll directly to bottom and go to next page
            if (connectButtons.length === 0) {
                log('No connect buttons found initially - scrolling to bottom');
                await scrollToBottom();

                // Try going to the next page immediately
                const nextPageSuccess = await goToNextPage();

                // If we couldn't find a next page button, we're done
                if (!nextPageSuccess) {
                    log('No more pages to process', 'success');
                    chrome.runtime.sendMessage({
                        action: "updateStatus",
                        message: `Completed! Sent ${connectCount} connection requests.`,
                        type: "success",
                        isComplete: true
                    });
                    isRunning = false;
                }
            } else {
                // Try to click connect buttons
                const result = await clickConnectButtons();

                // Check the result
                if (result === 'stopped') {
                    log('Auto connect stopped by user');
                    break;
                }

                // If we've reached max connections, stop
                if (result === 'max-reached') {
                    isRunning = false;
                    break;
                }

                // If all buttons were clicked but there might be more
                if (result === true) {
                    // Scroll to bottom directly
                    await scrollToBottom();

                    // Try going to the next page
                    const nextPageSuccess = await goToNextPage();

                    // If we couldn't find a next page button, we're done
                    if (!nextPageSuccess) {
                        log('No more pages to process', 'success');
                        chrome.runtime.sendMessage({
                            action: "updateStatus",
                            message: `Completed! Sent ${connectCount} connection requests.`,
                            type: "success",
                            isComplete: true
                        });
                        isRunning = false;
                    }
                }
            }

            // Small pause between iterations
            await wait(1000);
        }
    } catch (error) {
        console.error('Error:', error);
        log(`Error: ${error.message}`, 'error');
        chrome.runtime.sendMessage({
            action: "updateStatus",
            message: `Error: ${error.message}`,
            type: "error",
            isComplete: true
        });
        isRunning = false;
    }

    if (!isRunning) {
        log(`LinkedIn Auto Connect finished. Sent ${connectCount} connection requests.`, 'success');
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "start") {
        if (!isRunning) {
            // Update configuration with settings from popup
            config = {
                ...config,
                ...request.settings
            };

            // Start the bot
            runConnectBot();
        }
        sendResponse({ success: true });
    }
    else if (request.action === "stop") {
        isRunning = false;
        sendResponse({ success: true });
    }
    else if (request.action === "getStatus") {
        sendResponse({ isRunning: isRunning, connectCount: connectCount });
    }
    return true;
});

// Check if we're on a LinkedIn page
if (window.location.hostname.includes('linkedin.com')) {
    console.log('LinkedIn Auto Connect Extension loaded');
}