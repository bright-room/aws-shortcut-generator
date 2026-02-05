(function() {
  function getAWSInfo() {
    // AWSコンソールのグローバル変数やDOMから取得を試みる
    // console.aws.amazon.com では多くの場合、Cookieや特定の要素から情報を取得できる
    
    let accountId = '';
    let roleName = '';
    
    // アカウントIDの取得（ナビゲーションバーなどから）
    const accountIdElement = document.querySelector('meta[name="hostname"]'); // 例
    // 実際にはもっと確実な方法が必要な場合が多い
    // ログイン中のユーザー情報を取得するAPIなどは認証が必要なため、DOMから取得するのが一般的
    
    // 一般的なAWSコンソールの構造から取得を試みる
    try {
      // ナビゲーションバーのデータ属性などから取得できる場合がある
      const consoleNavData = document.querySelector('#awsc-nav-header');
      if (consoleNavData) {
        // ここに情報が含まれていることがあるが、環境により異なる
      }
      
      // Cookieから取得を試みる（一部の情報はCookieに含まれる）
      // ただし、JSからアクセスできないHttpOnlyの場合もある
      
      // 最も確実なのは、AWSコンソールの特定の要素（アカウント表示部分）をパースすること
      const displayName = document.querySelector('span[data-testid="awsc-nav-account-menu-button"] span[title]')?.getAttribute('title');
      if (displayName) {
        // "RoleName/UserName @ 123456789012" のような形式を想定
        const parts = displayName.split(' @ ');
        if (parts.length === 2) {
          accountId = parts[1];
          const roleParts = parts[0].split('/');
          if (roleParts.length >= 2) {
            roleName = roleParts[0];
          }
        }
      }

      // 別のセレクタを試す
      if (!accountId) {
          const accountIdElement = document.querySelector('span[data-testid="account-detail-menu-item"]');
          if (accountIdElement) {
              const match = accountIdElement.innerText.match(/\d{12}/);
              if (match) accountId = match[0];
          }
      }
    } catch (e) {
      console.error('Failed to get AWS info:', e);
    }

    return {
      accountId,
      roleName,
      url: window.location.href
    };
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAWSInfo') {
      sendResponse(getAWSInfo());
    }
    return true;
  });
})();
