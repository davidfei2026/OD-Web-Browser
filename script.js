const urlInput = document.getElementById('url');
const goButton = document.getElementById('go');
const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');
const reloadButton = document.getElementById('reload');
const browserFrame = document.getElementById('browser');

goButton.addEventListener('click', () => {
    const url = urlInput.value;
    browserFrame.src = url;
});

backButton.addEventListener('click', () => {
    browserFrame.contentWindow.history.back();
});

forwardButton.addEventListener('click', () => {
    browserFrame.contentWindow.history.forward();
});

reloadButton.addEventListener('click', () => {
    browserFrame.contentWindow.location.reload();
});
