document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const statusDiv = document.getElementById('status');
    const maxConnectsInput = document.getElementById('maxConnects');
    const connectDelayInput = document.getElementById('connectDelay');
    const sendWithoutNoteCheckbox = document.getElementById('sendWithoutNote');

    // Load saved settings
    chrome.storage.sync.get({
        maxConnects: 50,
        connectDelay: 3000,
        sendWithoutNote: true
    }, function (items) {
        maxConnectsInput.value = items.maxConnects;
        connectDelayInput.value = items.connectDelay;
        sendWithoutNoteCheckbox.checked = items.sendWithoutNote;
    });

    // Check if script is already running
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getStatus" }, function (response) {
            if (response && response.isRunning) {
                updateUIForRunning();
            }
        });
    });

    // Start button click handler
    startButton.addEventListener('click', function () {
        // Save settings
        const settings = {
            maxConnects: parseInt(maxConnectsInput.value) || 50,
            connectDelay: parseInt(connectDelayInput.value) || 3000,
            sendWithoutNote: sendWithoutNoteCheckbox.checked
        };

        chrome.storage.sync.set(settings);

        // Send message to content script to start
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "start",
                settings: settings
            });

            updateUIForRunning();

            // Show status
            statusDiv.textContent = "Auto connect is running...";
            statusDiv.className = "status running";
            statusDiv.style.display = "block";
        });
    });

    // Stop button click handler
    stopButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stop" });

            updateUIForStopped();

            // Show status
            statusDiv.textContent = "Auto connect stopped.";
            statusDiv.className = "status";
            statusDiv.style.display = "block";
        });
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === "updateStatus") {
            statusDiv.textContent = request.message;
            statusDiv.className = "status " + request.type;
            statusDiv.style.display = "block";

            if (request.isComplete) {
                updateUIForStopped();
            }
        }
    });

    function updateUIForRunning() {
        startButton.disabled = true;
        stopButton.disabled = false;
    }

    function updateUIForStopped() {
        startButton.disabled = false;
        stopButton.disabled = true;
    }
});