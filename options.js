function saveOptions() {
  const portalUrl = document.getElementById('portalUrl').value;
  chrome.storage.sync.set({
    portalUrl: portalUrl
  }, () => {
    const status = document.getElementById('status');
    status.textContent = '設定を保存しました。';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    portalUrl: ''
  }, (items) => {
    document.getElementById('portalUrl').value = items.portalUrl;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
