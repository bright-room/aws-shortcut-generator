document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url.includes('console.aws.amazon.com')) {
    chrome.tabs.sendMessage(tab.id, { action: 'getAWSInfo' }, (response) => {
      if (response) {
        document.getElementById('accountId').value = response.accountId || '';
        document.getElementById('roleName').value = response.roleName || '';
        document.getElementById('destinationUrl').value = response.url || '';
      }
    });
  } else {
    showError('AWSコンソール画面で実行してください。');
  }

  document.getElementById('generateBtn').addEventListener('click', generateLink);
  document.getElementById('copyBtn').addEventListener('click', copyLink);
  document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});

async function generateLink() {
  const accountId = document.getElementById('accountId').value;
  const roleName = document.getElementById('roleName').value;
  const destinationUrl = document.getElementById('destinationUrl').value;
  
  if (!accountId || !roleName || !destinationUrl) {
    showError('すべての項目を入力してください。');
    return;
  }

  const settings = await chrome.storage.sync.get({ portalUrl: '' });
  if (!settings.portalUrl) {
    showError('設定画面でAWSアクセスポータルURLを設定してください。');
    return;
  }

  // ポータルURLの整形
  let baseUrl = settings.portalUrl.trim();
  if (baseUrl.endsWith('/start') || baseUrl.endsWith('/start/')) {
    baseUrl = baseUrl.replace(/\/start\/?$/, '');
  }

  // ショートカットリンクの構築
  // 形式: {portalUrl}/#/console?account_id={accountId}&role_name={roleName}&destination={encodedUrl}
  const encodedUrl = encodeURIComponent(destinationUrl);
  const shortcutLink = `${baseUrl}/#/console?account_id=${accountId}&role_name=${roleName}&destination=${encodedUrl}`;

  const linkDiv = document.getElementById('shortcutLink');
  linkDiv.textContent = shortcutLink;
  document.getElementById('result').style.display = 'block';
  document.getElementById('statusMsg').style.display = 'none';
}

function copyLink() {
  const linkText = document.getElementById('shortcutLink').textContent;
  navigator.clipboard.writeText(linkText).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'コピーしました！';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
}

function showError(msg) {
  const statusMsg = document.getElementById('statusMsg');
  statusMsg.textContent = msg;
  statusMsg.style.display = 'block';
}
