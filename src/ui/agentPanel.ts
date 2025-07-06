import * as vscode from 'vscode';

export class AgentPanel {
  private panel: vscode.WebviewPanel | undefined;
  private readonly extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
  }

  public show() {
    if (this.panel) {
      this.panel.reveal();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'multiAgentAI',
      'Multi-Agent AI',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    this.panel.webview.html = this.getWebviewContent();
    
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  public updateContent(agent: string, content: string) {
    if (this.panel) {
      this.panel.webview.postMessage({
        command: 'updateContent',
        agent,
        content
      });
    }
  }

  private getWebviewContent(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Multi-Agent AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
          .agent-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
          .tab { padding: 10px 20px; cursor: pointer; border: none; background: none; }
          .tab.active { border-bottom: 2px solid #007acc; }
          .content { padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 400px; }
          .agent-content { display: none; }
          .agent-content.active { display: block; }
          pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
          .issue { margin: 10px 0; padding: 10px; border-left: 4px solid #007acc; background: #f9f9f9; }
          .issue.high { border-left-color: #e74c3c; }
          .issue.medium { border-left-color: #f39c12; }
          .issue.low { border-left-color: #27ae60; }
        </style>
      </head>
      <body>
        <h1>Multi-Agent AI Assistant</h1>
        
        <div class="agent-tabs">
          <button class="tab active" onclick="switchTab('coding')">Coding Agent</button>
          <button class="tab" onclick="switchTab('security')">Security Agent</button>
          <button class="tab" onclick="switchTab('documentation')">Documentation Agent</button>
        </div>
        
        <div class="content">
          <div id="coding-content" class="agent-content active">
            <h2>Coding Assistant</h2>
            <p>AI-powered code completion and suggestions</p>
            <div id="coding-output"></div>
          </div>
          
          <div id="security-content" class="agent-content">
            <h2>Security Analysis</h2>
            <p>Static code analysis and security recommendations</p>
            <div id="security-output"></div>
          </div>
          
          <div id="documentation-content" class="agent-content">
            <h2>Documentation Generator</h2>
            <p>Automated documentation and error resolution guides</p>
            <div id="documentation-output"></div>
          </div>
        </div>
        
        <script>
          function switchTab(agent) {
            // Hide all content
            document.querySelectorAll('.agent-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
            // Show selected content
            document.getElementById(agent + '-content').classList.add('active');
            event.target.classList.add('active');
          }
          
          window.addEventListener('message', event => {
            const { command, agent, content } = event.data;
            
            if (command === 'updateContent') {
              const outputEl = document.getElementById(agent + '-output');
              if (outputEl) {
                outputEl.innerHTML = '<pre>' + content + '</pre>';
              }
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}

export function deactivate() {}