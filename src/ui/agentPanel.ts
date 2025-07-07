// import * as vscode from 'vscode';

// export class AgentPanel {
//   private panel: vscode.WebviewPanel | undefined;
//   private readonly extensionUri: vscode.Uri;

//   constructor(extensionUri: vscode.Uri) {
//     this.extensionUri = extensionUri;
//   }

//   public show() {
//     if (this.panel) {
//       this.panel.reveal();
//       return;
//     }

//     this.panel = vscode.window.createWebviewPanel(
//       'multiAgentAI',
//       'Multi-Agent AI',
//       vscode.ViewColumn.Beside,
//       {
//         enableScripts: true,
//         retainContextWhenHidden: true
//       }
//     );

//     this.panel.webview.html = this.getWebviewContent();
    
//     this.panel.onDidDispose(() => {
//       this.panel = undefined;
//     });
//   }

//   public updateContent(agent: string, content: string) {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateContent',
//         agent,
//         content
//       });
//     }
//   }

//   private getWebviewContent(): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Multi-Agent AI</title>
//         <style>
//           body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
//           .agent-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
//           .tab { padding: 10px 20px; cursor: pointer; border: none; background: none; }
//           .tab.active { border-bottom: 2px solid #007acc; }
//           .content { padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 400px; }
//           .agent-content { display: none; }
//           .agent-content.active { display: block; }
//           pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
//           .issue { margin: 10px 0; padding: 10px; border-left: 4px solid #007acc; background: #f9f9f9; }
//           .issue.high { border-left-color: #e74c3c; }
//           .issue.medium { border-left-color: #f39c12; }
//           .issue.low { border-left-color: #27ae60; }
//         </style>
//       </head>
//       <body>
//         <h1>Multi-Agent AI Assistant</h1>
        
//         <div class="agent-tabs">
//           <button class="tab active" onclick="switchTab('coding')">Coding Agent</button>
//           <button class="tab" onclick="switchTab('security')">Security Agent</button>
//           <button class="tab" onclick="switchTab('documentation')">Documentation Agent</button>
//         </div>
        
//         <div class="content">
//           <div id="coding-content" class="agent-content active">
//             <h2>Coding Assistant</h2>
//             <p>AI-powered code completion and suggestions</p>
//             <div id="coding-output"></div>
//           </div>
          
//           <div id="security-content" class="agent-content">
//             <h2>Security Analysis</h2>
//             <p>Static code analysis and security recommendations</p>
//             <div id="security-output"></div>
//           </div>
          
//           <div id="documentation-content" class="agent-content">
//             <h2>Documentation Generator</h2>
//             <p>Automated documentation and error resolution guides</p>
//             <div id="documentation-output"></div>
//           </div>
//         </div>
        
//         <script>
//           function switchTab(agent) {
//             // Hide all content
//             document.querySelectorAll('.agent-content').forEach(el => el.classList.remove('active'));
//             document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
//             // Show selected content
//             document.getElementById(agent + '-content').classList.add('active');
//             event.target.classList.add('active');
//           }
          
//           window.addEventListener('message', event => {
//             const { command, agent, content } = event.data;
            
//             if (command === 'updateContent') {
//               const outputEl = document.getElementById(agent + '-output');
//               if (outputEl) {
//                 outputEl.innerHTML = '<pre>' + content + '</pre>';
//               }
//             }
//           });
//         </script>
//       </body>
//       </html>
//     `;
//   }
// }

// export function deactivate() {}


// import * as vscode from 'vscode';

// export class AgentPanel {
//   private panel: vscode.WebviewPanel | undefined;
//   private readonly extensionUri: vscode.Uri;

//   constructor(extensionUri: vscode.Uri) {
//     this.extensionUri = extensionUri;
//   }

//   public show() {
//     if (this.panel) {
//       this.panel.reveal();
//       return;
//     }

//     this.panel = vscode.window.createWebviewPanel(
//       'multiAgentAI',
//       'Multi-Agent AI',
//       vscode.ViewColumn.Beside,
//       {
//         enableScripts: true,
//         retainContextWhenHidden: true,
//         localResourceRoots: [this.extensionUri]
//       }
//     );

//     this.panel.webview.html = this.getWebviewContent();
    
//     this.panel.onDidDispose(() => {
//       this.panel = undefined;
//     });

//     // Handle messages from webview
//     this.panel.webview.onDidReceiveMessage(
//       message => {
//         switch (message.command) {
//           case 'refresh':
//             this.refreshAgent(message.agent);
//             break;
//           case 'clear':
//             this.clearAgent(message.agent);
//             break;
//           case 'export':
//             this.exportContent(message.agent, message.content);
//             break;
//         }
//       }
//     );
//   }

//   public updateContent(agent: string, content: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateContent',
//         agent,
//         content,
//         type,
//         timestamp: new Date().toISOString()
//       });
//     }
//   }

//   public updateProgress(agent: string, progress: number, status: string) {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateProgress',
//         agent,
//         progress,
//         status
//       });
//     }
//   }

//   private refreshAgent(agent: string) {
//     // Trigger agent refresh logic
//     vscode.commands.executeCommand(`multiAgentAI.refresh.${agent}`);
//   }

//   private clearAgent(agent: string) {
//     this.updateContent(agent, '', 'info');
//   }

//   private async exportContent(agent: string, content: string) {
//     const uri = await vscode.window.showSaveDialog({
//       defaultUri: vscode.Uri.file(`${agent}-output.txt`),
//       filters: {
//         'Text files': ['txt'],
//         'Markdown files': ['md'],
//         'JSON files': ['json']
//       }
//     });

//     if (uri) {
//       await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
//       vscode.window.showInformationMessage(`Content exported to ${uri.fsPath}`);
//     }
//   }

//   private getWebviewContent(): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Multi-Agent AI</title>
//         <style>
//           :root {
//             --bg-primary: var(--vscode-editor-background);
//             --bg-secondary: var(--vscode-sideBar-background);
//             --text-primary: var(--vscode-editor-foreground);
//             --text-secondary: var(--vscode-descriptionForeground);
//             --border-color: var(--vscode-panel-border);
//             --accent-color: var(--vscode-focusBorder);
//             --success-color: var(--vscode-gitDecoration-addedResourceForeground);
//             --error-color: var(--vscode-gitDecoration-deletedResourceForeground);
//             --warning-color: var(--vscode-gitDecoration-modifiedResourceForeground);
//             --info-color: var(--vscode-gitDecoration-untrackedResourceForeground);
//           }

//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           body {
//             font-family: var(--vscode-font-family);
//             background: var(--bg-primary);
//             color: var(--text-primary);
//             font-size: var(--vscode-font-size);
//             line-height: 1.6;
//             height: 100vh;
//             display: flex;
//             flex-direction: column;
//           }

//           .header {
//             background: var(--bg-secondary);
//             padding: 16px 20px;
//             border-bottom: 1px solid var(--border-color);
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             flex-shrink: 0;
//           }

//           .header h1 {
//             font-size: 18px;
//             font-weight: 600;
//             color: var(--text-primary);
//           }

//           .header-controls {
//             display: flex;
//             gap: 8px;
//           }

//           .btn {
//             padding: 6px 12px;
//             border: 1px solid var(--border-color);
//             background: var(--bg-primary);
//             color: var(--text-primary);
//             border-radius: 4px;
//             cursor: pointer;
//             font-size: 12px;
//             transition: all 0.2s;
//           }

//           .btn:hover {
//             background: var(--bg-secondary);
//             border-color: var(--accent-color);
//           }

//           .btn.primary {
//             background: var(--accent-color);
//             border-color: var(--accent-color);
//             color: white;
//           }

//           .agent-tabs {
//             display: flex;
//             background: var(--bg-secondary);
//             border-bottom: 1px solid var(--border-color);
//             flex-shrink: 0;
//           }

//           .tab {
//             padding: 12px 20px;
//             cursor: pointer;
//             border: none;
//             background: none;
//             color: var(--text-secondary);
//             font-size: 13px;
//             font-weight: 500;
//             border-bottom: 2px solid transparent;
//             transition: all 0.2s;
//             position: relative;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }

//           .tab:hover {
//             background: var(--bg-primary);
//             color: var(--text-primary);
//           }

//           .tab.active {
//             color: var(--text-primary);
//             border-bottom-color: var(--accent-color);
//             background: var(--bg-primary);
//           }

//           .tab-badge {
//             background: var(--error-color);
//             color: white;
//             border-radius: 10px;
//             padding: 2px 6px;
//             font-size: 10px;
//             font-weight: 600;
//             min-width: 16px;
//             text-align: center;
//           }

//           .tab-badge.success { background: var(--success-color); }
//           .tab-badge.warning { background: var(--warning-color); }
//           .tab-badge.info { background: var(--info-color); }

//           .content-container {
//             flex: 1;
//             overflow: hidden;
//             display: flex;
//             flex-direction: column;
//           }

//           .agent-content {
//             display: none;
//             flex: 1;
//             overflow: hidden;
//             flex-direction: column;
//           }

//           .agent-content.active {
//             display: flex;
//           }

//           .agent-header {
//             padding: 16px 20px;
//             background: var(--bg-secondary);
//             border-bottom: 1px solid var(--border-color);
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             flex-shrink: 0;
//           }

//           .agent-info {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//           }

//           .agent-icon {
//             width: 24px;
//             height: 24px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: 600;
//             color: white;
//           }

//           .coding-icon { background: #007acc; }
//           .security-icon { background: #e74c3c; }
//           .documentation-icon { background: #27ae60; }

//           .agent-title {
//             font-size: 16px;
//             font-weight: 600;
//           }

//           .agent-description {
//             color: var(--text-secondary);
//             font-size: 12px;
//             margin-top: 2px;
//           }

//           .agent-controls {
//             display: flex;
//             gap: 8px;
//           }

//           .progress-bar {
//             height: 3px;
//             background: var(--border-color);
//             overflow: hidden;
//             margin-top: 8px;
//           }

//           .progress-fill {
//             height: 100%;
//             background: var(--accent-color);
//             transition: width 0.3s ease;
//             width: 0%;
//           }

//           .progress-text {
//             font-size: 11px;
//             color: var(--text-secondary);
//             margin-top: 4px;
//           }

//           .content-area {
//             flex: 1;
//             overflow: auto;
//             padding: 20px;
//           }

//           .output-container {
//             background: var(--bg-secondary);
//             border: 1px solid var(--border-color);
//             border-radius: 6px;
//             min-height: 200px;
//             position: relative;
//           }

//           .output-content {
//             padding: 16px;
//             font-family: var(--vscode-editor-font-family);
//             font-size: var(--vscode-editor-font-size);
//             line-height: 1.5;
//             white-space: pre-wrap;
//             word-wrap: break-word;
//           }

//           .output-empty {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             height: 200px;
//             color: var(--text-secondary);
//             font-style: italic;
//           }

//           .timestamp {
//             position: absolute;
//             top: 8px;
//             right: 12px;
//             font-size: 10px;
//             color: var(--text-secondary);
//           }

//           .status-indicator {
//             position: absolute;
//             top: 12px;
//             left: 12px;
//             width: 8px;
//             height: 8px;
//             border-radius: 50%;
//             background: var(--info-color);
//           }

//           .status-indicator.success { background: var(--success-color); }
//           .status-indicator.error { background: var(--error-color); }
//           .status-indicator.warning { background: var(--warning-color); }

//           .issue-item {
//             margin: 12px 0;
//             padding: 12px;
//             border-left: 4px solid var(--info-color);
//             background: var(--bg-primary);
//             border-radius: 4px;
//           }

//           .issue-item.high { border-left-color: var(--error-color); }
//           .issue-item.medium { border-left-color: var(--warning-color); }
//           .issue-item.low { border-left-color: var(--success-color); }

//           .issue-header {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             margin-bottom: 8px;
//           }

//           .issue-title {
//             font-weight: 600;
//             font-size: 14px;
//           }

//           .issue-severity {
//             padding: 2px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//             font-weight: 600;
//             text-transform: uppercase;
//           }

//           .issue-severity.high {
//             background: var(--error-color);
//             color: white;
//           }

//           .issue-severity.medium {
//             background: var(--warning-color);
//             color: white;
//           }

//           .issue-severity.low {
//             background: var(--success-color);
//             color: white;
//           }

//           .loading-spinner {
//             border: 2px solid var(--border-color);
//             border-top: 2px solid var(--accent-color);
//             border-radius: 50%;
//             width: 16px;
//             height: 16px;
//             animation: spin 1s linear infinite;
//           }

//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }

//           .fade-in {
//             animation: fadeIn 0.3s ease-in;
//           }

//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }

//           .scrollbar-custom {
//             scrollbar-width: thin;
//             scrollbar-color: var(--border-color) transparent;
//           }

//           .scrollbar-custom::-webkit-scrollbar {
//             width: 8px;
//           }

//           .scrollbar-custom::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .scrollbar-custom::-webkit-scrollbar-thumb {
//             background: var(--border-color);
//             border-radius: 4px;
//           }

//           .scrollbar-custom::-webkit-scrollbar-thumb:hover {
//             background: var(--text-secondary);
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Multi-Agent AI Assistant</h1>
//           <div class="header-controls">
//             <button class="btn" onclick="clearAll()">Clear All</button>
//             <button class="btn primary" onclick="refreshAll()">Refresh All</button>
//           </div>
//         </div>
        
//         <div class="agent-tabs">
//           <button class="tab active" onclick="switchTab('coding')">
//             <div class="agent-icon coding-icon">C</div>
//             Coding Agent
//             <span class="tab-badge info" id="coding-badge" style="display: none;">0</span>
//           </button>
//           <button class="tab" onclick="switchTab('security')">
//             <div class="agent-icon security-icon">S</div>
//             Security Agent
//             <span class="tab-badge error" id="security-badge" style="display: none;">0</span>
//           </button>
//           <button class="tab" onclick="switchTab('documentation')">
//             <div class="agent-icon documentation-icon">D</div>
//             Documentation Agent
//             <span class="tab-badge success" id="documentation-badge" style="display: none;">0</span>
//           </button>
//         </div>
        
//         <div class="content-container">
//           <div id="coding-content" class="agent-content active">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div>
//                   <div class="agent-title">Coding Assistant</div>
//                   <div class="agent-description">AI-powered code completion and suggestions</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('coding')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('coding')">Refresh</button>
//                 <button class="btn" onclick="exportContent('coding')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="coding-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="coding-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="coding-progress-text">Initializing...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="coding-status"></div>
//                 <div class="timestamp" id="coding-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="coding-output">
//                   <div class="output-empty">No output yet. Run analysis to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div id="security-content" class="agent-content">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div>
//                   <div class="agent-title">Security Analysis</div>
//                   <div class="agent-description">Static code analysis and security recommendations</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('security')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('security')">Refresh</button>
//                 <button class="btn" onclick="exportContent('security')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="security-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="security-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="security-progress-text">Scanning for vulnerabilities...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="security-status"></div>
//                 <div class="timestamp" id="security-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="security-output">
//                   <div class="output-empty">No security analysis yet. Run scan to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div id="documentation-content" class="agent-content">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div>
//                   <div class="agent-title">Documentation Generator</div>
//                   <div class="agent-description">Automated documentation and error resolution guides</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('documentation')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('documentation')">Refresh</button>
//                 <button class="btn" onclick="exportContent('documentation')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="documentation-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="documentation-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="documentation-progress-text">Generating documentation...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="documentation-status"></div>
//                 <div class="timestamp" id="documentation-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="documentation-output">
//                   <div class="output-empty">No documentation generated yet. Run generator to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <script>
//           const vscode = acquireVsCodeApi();
//           let currentTab = 'coding';

//           function switchTab(agent) {
//             // Update current tab
//             currentTab = agent;
            
//             // Hide all content
//             document.querySelectorAll('.agent-content').forEach(el => el.classList.remove('active'));
//             document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
//             // Show selected content
//             document.getElementById(agent + '-content').classList.add('active');
//             document.querySelector(\`[onclick="switchTab('\${agent}')"]\`).classList.add('active');
//           }

//           function refreshAgent(agent) {
//             showProgress(agent, 0, 'Starting...');
//             vscode.postMessage({ command: 'refresh', agent });
//           }

//           function clearAgent(agent) {
//             const outputEl = document.getElementById(agent + '-output');
//             if (outputEl) {
//               outputEl.innerHTML = '<div class="output-empty">No output yet. Run analysis to see results.</div>';
//             }
//             updateBadge(agent, 0);
//             hideProgress(agent);
//             vscode.postMessage({ command: 'clear', agent });
//           }

//           function exportContent(agent) {
//             const outputEl = document.getElementById(agent + '-output');
//             if (outputEl) {
//               const content = outputEl.textContent || outputEl.innerText;
//               vscode.postMessage({ command: 'export', agent, content });
//             }
//           }

//           function clearAll() {
//             ['coding', 'security', 'documentation'].forEach(agent => {
//               clearAgent(agent);
//             });
//           }

//           function refreshAll() {
//             ['coding', 'security', 'documentation'].forEach(agent => {
//               refreshAgent(agent);
//             });
//           }

//           function showProgress(agent, progress, status) {
//             const progressContainer = document.getElementById(agent + '-progress');
//             const progressFill = document.getElementById(agent + '-progress-fill');
//             const progressText = document.getElementById(agent + '-progress-text');
            
//             if (progressContainer && progressFill && progressText) {
//               progressContainer.style.display = 'block';
//               progressFill.style.width = progress + '%';
//               progressText.textContent = status;
//             }
//           }

//           function hideProgress(agent) {
//             const progressContainer = document.getElementById(agent + '-progress');
//             if (progressContainer) {
//               progressContainer.style.display = 'none';
//             }
//           }

//           function updateBadge(agent, count) {
//             const badge = document.getElementById(agent + '-badge');
//             if (badge) {
//               if (count > 0) {
//                 badge.textContent = count;
//                 badge.style.display = 'inline-block';
//               } else {
//                 badge.style.display = 'none';
//               }
//             }
//           }

//           function updateTimestamp(agent) {
//             const timestampEl = document.getElementById(agent + '-timestamp');
//             if (timestampEl) {
//               const now = new Date();
//               timestampEl.textContent = now.toLocaleTimeString();
//             }
//           }

//           function updateStatus(agent, type) {
//             const statusEl = document.getElementById(agent + '-status');
//             if (statusEl) {
//               statusEl.className = 'status-indicator ' + type;
//             }
//           }

//           function formatContent(content, type) {
//             if (type === 'security') {
//               // Try to parse as security issues
//               try {
//                 const issues = JSON.parse(content);
//                 if (Array.isArray(issues)) {
//                   return issues.map(issue => \`
//                     <div class="issue-item \${issue.severity}">
//                       <div class="issue-header">
//                         <div class="issue-title">\${issue.title}</div>
//                         <div class="issue-severity \${issue.severity}">\${issue.severity}</div>
//                       </div>
//                       <div class="issue-description">\${issue.description}</div>
//                     </div>
//                   \`).join('');
//                 }
//               } catch (e) {
//                 // Fall back to plain text
//               }
//             }
//             return '<pre>' + content + '</pre>';
//           }

//           window.addEventListener('message', event => {
//             const { command, agent, content, type, timestamp, progress, status } = event.data;
            
//             if (command === 'updateContent') {
//               const outputEl = document.getElementById(agent + '-output');
//               if (outputEl && content) {
//                 outputEl.innerHTML = formatContent(content, agent);
//                 outputEl.classList.add('fade-in');
                
//                 // Update timestamp
//                 updateTimestamp(agent);
                
//                 // Update status indicator
//                 updateStatus(agent, type);
                
//                 // Update badge for security issues
//                 if (agent === 'security') {
//                   try {
//                     const issues = JSON.parse(content);
//                     if (Array.isArray(issues)) {
//                       updateBadge(agent, issues.length);
//                     }
//                   } catch (e) {
//                     updateBadge(agent, 1);
//                   }
//                 } else {
//                   updateBadge(agent, content ? 1 : 0);
//                 }
                
//                 hideProgress(agent);
//               }
//             } else if (command === 'updateProgress') {
//               showProgress(agent, progress, status);
//             }
//           });

//           // Initialize
//           updateTimestamp('coding');
//           updateTimestamp('security');
//           updateTimestamp('documentation');
//         </script>
//       </body>
//       </html>
//     `;
//   }
// }

// export function deactivate() {}


// import * as vscode from 'vscode';

// export class AgentPanel {
//   private panel: vscode.WebviewPanel | undefined;
//   private readonly extensionUri: vscode.Uri;

//   constructor(extensionUri: vscode.Uri) {
//     this.extensionUri = extensionUri;
//   }

//   public show() {
//     if (this.panel) {
//       this.panel.reveal();
//       return;
//     }

//     this.panel = vscode.window.createWebviewPanel(
//       'multiAgentAI',
//       'Multi-Agent AI',
//       vscode.ViewColumn.Beside,
//       {
//         enableScripts: true,
//         retainContextWhenHidden: true,
//         localResourceRoots: [this.extensionUri]
//       }
//     );

//     this.panel.webview.html = this.getWebviewContent();
    
//     this.panel.onDidDispose(() => {
//       this.panel = undefined;
//     });

//     // Handle messages from webview
//     this.panel.webview.onDidReceiveMessage(
//       message => {
//         switch (message.command) {
//           case 'refresh':
//             this.refreshAgent(message.agent);
//             break;
//           case 'clear':
//             this.clearAgent(message.agent);
//             break;
//           case 'export':
//             this.exportContent(message.agent, message.content);
//             break;
//         }
//       }
//     );
//   }

//   public updateContent(agent: string, content: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateContent',
//         agent,
//         content,
//         type,
//         timestamp: new Date().toISOString()
//       });
//     }
//   }

//   public updateProgress(agent: string, progress: number, status: string) {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateProgress',
//         agent,
//         progress,
//         status
//       });
//     }
//   }

//   private refreshAgent(agent: string) {
//     // Trigger agent refresh logic
//     vscode.commands.executeCommand(`multiAgentAI.refresh.${agent}`);
//   }

//   private clearAgent(agent: string) {
//     this.updateContent(agent, '', 'info');
//   }

//   private async exportContent(agent: string, content: string) {
//     const uri = await vscode.window.showSaveDialog({
//       defaultUri: vscode.Uri.file(`${agent}-output.txt`),
//       filters: {
//         'Text files': ['txt'],
//         'Markdown files': ['md'],
//         'JSON files': ['json']
//       }
//     });

//     if (uri) {
//       await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
//       vscode.window.showInformationMessage(`Content exported to ${uri.fsPath}`);
//     }
//   }

//   private getWebviewContent(): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Multi-Agent AI</title>
//         <style>
//           :root {
//             --bg-primary: var(--vscode-editor-background);
//             --bg-secondary: var(--vscode-sideBar-background);
//             --text-primary: var(--vscode-editor-foreground);
//             --text-secondary: var(--vscode-descriptionForeground);
//             --border-color: var(--vscode-panel-border);
//             --accent-color: var(--vscode-focusBorder);
//             --success-color: var(--vscode-gitDecoration-addedResourceForeground);
//             --error-color: var(--vscode-gitDecoration-deletedResourceForeground);
//             --warning-color: var(--vscode-gitDecoration-modifiedResourceForeground);
//             --info-color: var(--vscode-gitDecoration-untrackedResourceForeground);
//           }

//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           body {
//             font-family: var(--vscode-font-family);
//             background: var(--bg-primary);
//             color: var(--text-primary);
//             font-size: var(--vscode-font-size);
//             line-height: 1.6;
//             height: 100vh;
//             display: flex;
//             flex-direction: column;
//           }

//           .header {
//             background: var(--bg-secondary);
//             padding: 16px 20px;
//             border-bottom: 1px solid var(--border-color);
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             flex-shrink: 0;
//           }

//           .header h1 {
//             font-size: 18px;
//             font-weight: 600;
//             color: var(--text-primary);
//           }

//           .header-controls {
//             display: flex;
//             gap: 8px;
//           }

//           .btn {
//             padding: 6px 12px;
//             border: 1px solid var(--border-color);
//             background: var(--bg-primary);
//             color: var(--text-primary);
//             border-radius: 4px;
//             cursor: pointer;
//             font-size: 12px;
//             transition: all 0.2s;
//           }

//           .btn:hover {
//             background: var(--bg-secondary);
//             border-color: var(--accent-color);
//           }

//           .btn.primary {
//             background: var(--accent-color);
//             border-color: var(--accent-color);
//             color: white;
//           }

//           .agent-tabs {
//             display: flex;
//             background: var(--bg-secondary);
//             border-bottom: 1px solid var(--border-color);
//             flex-shrink: 0;
//           }

//           .tab {
//             padding: 12px 20px;
//             cursor: pointer;
//             border: none;
//             background: none;
//             color: var(--text-secondary);
//             font-size: 13px;
//             font-weight: 500;
//             border-bottom: 2px solid transparent;
//             transition: all 0.2s;
//             position: relative;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }

//           .tab:hover {
//             background: var(--bg-primary);
//             color: var(--text-primary);
//           }

//           .tab.active {
//             color: var(--text-primary);
//             border-bottom-color: var(--accent-color);
//             background: var(--bg-primary);
//           }

//           .tab-badge {
//             background: var(--error-color);
//             color: white;
//             border-radius: 10px;
//             padding: 2px 6px;
//             font-size: 10px;
//             font-weight: 600;
//             min-width: 16px;
//             text-align: center;
//           }

//           .tab-badge.success { background: var(--success-color); }
//           .tab-badge.warning { background: var(--warning-color); }
//           .tab-badge.info { background: var(--info-color); }

//           .content-container {
//             flex: 1;
//             overflow: hidden;
//             display: flex;
//             flex-direction: column;
//           }

//           .agent-content {
//             display: none;
//             flex: 1;
//             overflow: hidden;
//             flex-direction: column;
//           }

//           .agent-content.active {
//             display: flex;
//           }

//           .agent-header {
//             padding: 16px 20px;
//             background: var(--bg-secondary);
//             border-bottom: 1px solid var(--border-color);
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             flex-shrink: 0;
//           }

//           .agent-info {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//           }

//           .agent-icon {
//             width: 24px;
//             height: 24px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: 600;
//             color: white;
//           }

//           .coding-icon { background: #007acc; }
//           .security-icon { background: #e74c3c; }
//           .documentation-icon { background: #27ae60; }

//           .agent-title {
//             font-size: 16px;
//             font-weight: 600;
//           }

//           .agent-description {
//             color: var(--text-secondary);
//             font-size: 12px;
//             margin-top: 2px;
//           }

//           .agent-controls {
//             display: flex;
//             gap: 8px;
//           }

//           .progress-bar {
//             height: 3px;
//             background: var(--border-color);
//             overflow: hidden;
//             margin-top: 8px;
//           }

//           .progress-fill {
//             height: 100%;
//             background: var(--accent-color);
//             transition: width 0.3s ease;
//             width: 0%;
//           }

//           .progress-text {
//             font-size: 11px;
//             color: var(--text-secondary);
//             margin-top: 4px;
//           }

//           .content-area {
//             flex: 1;
//             overflow: auto;
//             padding: 20px;
//           }

//           .output-container {
//             background: var(--bg-secondary);
//             border: 1px solid var(--border-color);
//             border-radius: 6px;
//             min-height: 200px;
//             position: relative;
//           }

//           .output-content {
//             padding: 16px;
//             font-family: var(--vscode-editor-font-family);
//             font-size: var(--vscode-editor-font-size);
//             line-height: 1.5;
//             white-space: pre-wrap;
//             word-wrap: break-word;
//             overflow-wrap: break-word;
//             word-break: break-word;
//           }

//           .output-empty {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             height: 200px;
//             color: var(--text-secondary);
//             font-style: italic;
//           }

//           .timestamp {
//             position: absolute;
//             top: 8px;
//             right: 12px;
//             font-size: 10px;
//             color: var(--text-secondary);
//           }

//           .status-indicator {
//             position: absolute;
//             top: 12px;
//             left: 12px;
//             width: 8px;
//             height: 8px;
//             border-radius: 50%;
//             background: var(--info-color);
//           }

//           .status-indicator.success { background: var(--success-color); }
//           .status-indicator.error { background: var(--error-color); }
//           .status-indicator.warning { background: var(--warning-color); }

//           .issue-item {
//             margin: 12px 0;
//             padding: 12px;
//             border-left: 4px solid var(--info-color);
//             background: var(--bg-primary);
//             border-radius: 4px;
//           }

//           .issue-item.high { border-left-color: var(--error-color); }
//           .issue-item.medium { border-left-color: var(--warning-color); }
//           .issue-item.low { border-left-color: var(--success-color); }

//           .issue-header {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             margin-bottom: 8px;
//           }

//           .issue-title {
//             font-weight: 600;
//             font-size: 14px;
//           }

//           .issue-severity {
//             padding: 2px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//             font-weight: 600;
//             text-transform: uppercase;
//           }

//           .issue-severity.high {
//             background: var(--error-color);
//             color: white;
//           }

//           .issue-severity.medium {
//             background: var(--warning-color);
//             color: white;
//           }

//           .issue-severity.low {
//             background: var(--success-color);
//             color: white;
//           }

//           .loading-spinner {
//             border: 2px solid var(--border-color);
//             border-top: 2px solid var(--accent-color);
//             border-radius: 50%;
//             width: 16px;
//             height: 16px;
//             animation: spin 1s linear infinite;
//           }

//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }

//           .fade-in {
//             animation: fadeIn 0.3s ease-in;
//           }

//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }

//           .scrollbar-custom {
//             scrollbar-width: thin;
//             scrollbar-color: var(--border-color) transparent;
//           }

//           .scrollbar-custom::-webkit-scrollbar {
//             width: 8px;
//           }

//           .scrollbar-custom::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .scrollbar-custom::-webkit-scrollbar-thumb {
//             background: var(--border-color);
//             border-radius: 4px;
//           }

//           .scrollbar-custom::-webkit-scrollbar-thumb:hover {
//             background: var(--text-secondary);
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Multi-Agent AI Assistant</h1>
//           <div class="header-controls">
//             <button class="btn" onclick="clearAll()">Clear All</button>
//             <button class="btn primary" onclick="refreshAll()">Refresh All</button>
//           </div>
//         </div>
        
//         <div class="agent-tabs">
//           <button class="tab active" onclick="switchTab('coding')">
//             <div class="agent-icon coding-icon">C</div>
//             Coding Agent
//             <span class="tab-badge info" id="coding-badge" style="display: none;">0</span>
//           </button>
//           <button class="tab" onclick="switchTab('security')">
//             <div class="agent-icon security-icon">S</div>
//             Security Agent
//             <span class="tab-badge error" id="security-badge" style="display: none;">0</span>
//           </button>
//           <button class="tab" onclick="switchTab('documentation')">
//             <div class="agent-icon documentation-icon">D</div>
//             Documentation Agent
//             <span class="tab-badge success" id="documentation-badge" style="display: none;">0</span>
//           </button>
//         </div>
        
//         <div class="content-container">
//           <div id="coding-content" class="agent-content active">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div>
//                   <div class="agent-title">Coding Assistant</div>
//                   <div class="agent-description">AI-powered code completion and suggestions</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('coding')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('coding')">Refresh</button>
//                 <button class="btn" onclick="exportContent('coding')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="coding-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="coding-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="coding-progress-text">Initializing...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="coding-status"></div>
//                 <div class="timestamp" id="coding-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="coding-output">
//                   <div class="output-empty">No output yet. Run analysis to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div id="security-content" class="agent-content">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div>
//                   <div class="agent-title">Security Analysis</div>
//                   <div class="agent-description">Static code analysis and security recommendations</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('security')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('security')">Refresh</button>
//                 <button class="btn" onclick="exportContent('security')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="security-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="security-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="security-progress-text">Scanning for vulnerabilities...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="security-status"></div>
//                 <div class="timestamp" id="security-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="security-output">
//                   <div class="output-empty">No security analysis yet. Run scan to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div id="documentation-content" class="agent-content">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div>
//                   <div class="agent-title">Documentation Generator</div>
//                   <div class="agent-description">Automated documentation and error resolution guides</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('documentation')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('documentation')">Refresh</button>
//                 <button class="btn" onclick="exportContent('documentation')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="documentation-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="documentation-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="documentation-progress-text">Generating documentation...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="documentation-status"></div>
//                 <div class="timestamp" id="documentation-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="documentation-output">
//                   <div class="output-empty">No documentation generated yet. Run generator to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <script>
//           const vscode = acquireVsCodeApi();
//           let currentTab = 'coding';

//           function switchTab(agent) {
//             // Update current tab
//             currentTab = agent;
            
//             // Hide all content
//             document.querySelectorAll('.agent-content').forEach(el => el.classList.remove('active'));
//             document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
//             // Show selected content
//             document.getElementById(agent + '-content').classList.add('active');
//             document.querySelector(\`[onclick="switchTab('\${agent}')"]\`).classList.add('active');
//           }

//           function refreshAgent(agent) {
//             showProgress(agent, 0, 'Starting...');
//             vscode.postMessage({ command: 'refresh', agent });
//           }

//           function clearAgent(agent) {
//             const outputEl = document.getElementById(agent + '-output');
//             if (outputEl) {
//               outputEl.innerHTML = '<div class="output-empty">No output yet. Run analysis to see results.</div>';
//             }
//             updateBadge(agent, 0);
//             hideProgress(agent);
//             vscode.postMessage({ command: 'clear', agent });
//           }

//           function exportContent(agent) {
//             const outputEl = document.getElementById(agent + '-output');
//             if (outputEl) {
//               const content = outputEl.textContent || outputEl.innerText;
//               vscode.postMessage({ command: 'export', agent, content });
//             }
//           }

//           function clearAll() {
//             ['coding', 'security', 'documentation'].forEach(agent => {
//               clearAgent(agent);
//             });
//           }

//           function refreshAll() {
//             ['coding', 'security', 'documentation'].forEach(agent => {
//               refreshAgent(agent);
//             });
//           }

//           function showProgress(agent, progress, status) {
//             const progressContainer = document.getElementById(agent + '-progress');
//             const progressFill = document.getElementById(agent + '-progress-fill');
//             const progressText = document.getElementById(agent + '-progress-text');
            
//             if (progressContainer && progressFill && progressText) {
//               progressContainer.style.display = 'block';
//               progressFill.style.width = progress + '%';
//               progressText.textContent = status;
//             }
//           }

//           function hideProgress(agent) {
//             const progressContainer = document.getElementById(agent + '-progress');
//             if (progressContainer) {
//               progressContainer.style.display = 'none';
//             }
//           }

//           function updateBadge(agent, count) {
//             const badge = document.getElementById(agent + '-badge');
//             if (badge) {
//               if (count > 0) {
//                 badge.textContent = count;
//                 badge.style.display = 'inline-block';
//               } else {
//                 badge.style.display = 'none';
//               }
//             }
//           }

//           function updateTimestamp(agent) {
//             const timestampEl = document.getElementById(agent + '-timestamp');
//             if (timestampEl) {
//               const now = new Date();
//               timestampEl.textContent = now.toLocaleTimeString();
//             }
//           }

//           function updateStatus(agent, type) {
//             const statusEl = document.getElementById(agent + '-status');
//             if (statusEl) {
//               statusEl.className = 'status-indicator ' + type;
//             }
//           }

//           function formatContent(content, type) {
//             if (type === 'security') {
//               // Try to parse as security issues
//               try {
//                 const issues = JSON.parse(content);
//                 if (Array.isArray(issues)) {
//                   return issues.map(issue => \`
//                     <div class="issue-item \${issue.severity}">
//                       <div class="issue-header">
//                         <div class="issue-title">\${issue.title}</div>
//                         <div class="issue-severity \${issue.severity}">\${issue.severity}</div>
//                       </div>
//                       <div class="issue-description">\${issue.description}</div>
//                     </div>
//                   \`).join('');
//                 }
//               } catch (e) {
//                 // Fall back to plain text
//               }
//             }
//             return '<pre>' + content + '</pre>';
//           }

//           window.addEventListener('message', event => {
//             const { command, agent, content, type, timestamp, progress, status } = event.data;
            
//             if (command === 'updateContent') {
//               const outputEl = document.getElementById(agent + '-output');
//               if (outputEl && content) {
//                 outputEl.innerHTML = formatContent(content, agent);
//                 outputEl.classList.add('fade-in');
                
//                 // Update timestamp
//                 updateTimestamp(agent);
                
//                 // Update status indicator
//                 updateStatus(agent, type);
                
//                 // Update badge for security issues
//                 if (agent === 'security') {
//                   try {
//                     const issues = JSON.parse(content);
//                     if (Array.isArray(issues)) {
//                       updateBadge(agent, issues.length);
//                     }
//                   } catch (e) {
//                     updateBadge(agent, 1);
//                   }
//                 } else {
//                   updateBadge(agent, content ? 1 : 0);
//                 }
                
//                 hideProgress(agent);
//               }
//             } else if (command === 'updateProgress') {
//               showProgress(agent, progress, status);
//             }
//           });

//           // Initialize
//           updateTimestamp('coding');
//           updateTimestamp('security');
//           updateTimestamp('documentation');
//         </script>
//       </body>
//       </html>
//     `;
//   }
// }

// export function deactivate() {}


// import * as vscode from 'vscode';

// export class AgentPanel {
//   private panel: vscode.WebviewPanel | undefined;
//   private readonly extensionUri: vscode.Uri;

//   constructor(extensionUri: vscode.Uri) {
//     this.extensionUri = extensionUri;
//   }

//   public show() {
//     if (this.panel) {
//       this.panel.reveal();
//       return;
//     }

//     this.panel = vscode.window.createWebviewPanel(
//       'multiAgentAI',
//       'Multi-Agent AI',
//       vscode.ViewColumn.Beside,
//       {
//         enableScripts: true,
//         retainContextWhenHidden: true,
//         localResourceRoots: [this.extensionUri]
//       }
//     );

//     this.panel.webview.html = this.getWebviewContent();
    
//     this.panel.onDidDispose(() => {
//       this.panel = undefined;
//     });

//     // Handle messages from webview
//     this.panel.webview.onDidReceiveMessage(
//       message => {
//         switch (message.command) {
//           case 'refresh':
//             this.refreshAgent(message.agent);
//             break;
//           case 'clear':
//             this.clearAgent(message.agent);
//             break;
//           case 'export':
//             this.exportContent(message.agent, message.content);
//             break;
//         }
//       }
//     );
//   }

//   public updateContent(agent: string, content: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateContent',
//         agent,
//         content,
//         type,
//         timestamp: new Date().toISOString()
//       });
//     }
//   }

//   public updateProgress(agent: string, progress: number, status: string) {
//     if (this.panel) {
//       this.panel.webview.postMessage({
//         command: 'updateProgress',
//         agent,
//         progress,
//         status
//       });
//     }
//   }

//   private refreshAgent(agent: string) {
//     // Trigger agent refresh logic
//     vscode.commands.executeCommand(`multiAgentAI.refresh.${agent}`);
//   }

//   private clearAgent(agent: string) {
//     this.updateContent(agent, '', 'info');
//   }

//   private async exportContent(agent: string, content: string) {
//     const uri = await vscode.window.showSaveDialog({
//       defaultUri: vscode.Uri.file(`${agent}-output.txt`),
//       filters: {
//         'Text files': ['txt'],
//         'Markdown files': ['md'],
//         'JSON files': ['json']
//       }
//     });

//     if (uri) {
//       await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
//       vscode.window.showInformationMessage(`Content exported to ${uri.fsPath}`);
//     }
//   }

  

//   private getWebviewContent(): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Multi-Agent AI</title>
//         <style>
//           :root {
//             --bg-primary: var(--vscode-editor-background);
//             --bg-secondary: var(--vscode-sideBar-background);
//             --text-primary: var(--vscode-editor-foreground);
//             --text-secondary: var(--vscode-descriptionForeground);
//             --border-color: var(--vscode-panel-border);
//             --accent-color: var(--vscode-focusBorder);
//             --success-color: var(--vscode-gitDecoration-addedResourceForeground);
//             --error-color: var(--vscode-gitDecoration-deletedResourceForeground);
//             --warning-color: var(--vscode-gitDecoration-modifiedResourceForeground);
//             --info-color: var(--vscode-gitDecoration-untrackedResourceForeground);
//           }

//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           body {
//             font-family: var(--vscode-font-family);
//             background: var(--bg-primary);
//             color: var(--text-primary);
//             font-size: var(--vscode-font-size);
//             line-height: 1.6;
//             height: 100vh;
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//           }

//           .header {
//             background: var(--bg-secondary);
//             padding: 16px 20px;
//             border-bottom: 1px solid var(--border-color);
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             flex-shrink: 0;
//           }

//           .header h1 {
//             font-size: 18px;
//             font-weight: 600;
//             color: var(--text-primary);
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             min-width: 0;
//           }

//           .header-controls {
//             display: flex;
//             gap: 8px;
//             flex-shrink: 0;
//           }

//           .btn {
//             padding: 6px 12px;
//             border: 1px solid var(--border-color);
//             background: var(--bg-primary);
//             color: var(--text-primary);
//             border-radius: 4px;
//             cursor: pointer;
//             font-size: 12px;
//             transition: all 0.2s;
//             white-space: nowrap;
//             flex-shrink: 0;
//           }

//           .btn:hover {
//             background: var(--bg-secondary);
//             border-color: var(--accent-color);
//           }

//           .btn.primary {
//             background: var(--accent-color);
//             border-color: var(--accent-color);
//             color: white;
//           }

//           .agent-tabs {
//             display: flex;
//             background: var(--bg-secondary);
//             border-bottom: 1px solid var(--border-color);
//             flex-shrink: 0;
//             overflow-x: auto;
//             scrollbar-width: none;
//             -ms-overflow-style: none;
//           }

//           .agent-tabs::-webkit-scrollbar {
//             display: none;
//           }

//           .tab {
//             padding: 12px 20px;
//             cursor: pointer;
//             border: none;
//             background: none;
//             color: var(--text-secondary);
//             font-size: 13px;
//             font-weight: 500;
//             border-bottom: 2px solid transparent;
//             transition: all 0.2s;
//             position: relative;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             white-space: nowrap;
//             flex-shrink: 0;
//             min-width: 0;
//           }

//           .tab:hover {
//             background: var(--bg-primary);
//             color: var(--text-primary);
//           }

//           .tab.active {
//             color: var(--text-primary);
//             border-bottom-color: var(--accent-color);
//             background: var(--bg-primary);
//           }

//           .tab-badge {
//             background: var(--error-color);
//             color: white;
//             border-radius: 10px;
//             padding: 2px 6px;
//             font-size: 10px;
//             font-weight: 600;
//             min-width: 16px;
//             text-align: center;
//             flex-shrink: 0;
//           }

//           .tab-badge.success { background: var(--success-color); }
//           .tab-badge.warning { background: var(--warning-color); }
//           .tab-badge.info { background: var(--info-color); }

//           .content-container {
//             flex: 1;
//             overflow: hidden;
//             display: flex;
//             flex-direction: column;
//             min-height: 0;
//           }

//           .agent-content {
//             display: none;
//             flex: 1;
//             overflow: hidden;
//             flex-direction: column;
//             min-height: 0;
//           }

//           .agent-content.active {
//             display: flex;
//           }

//           .agent-header {
//             padding: 16px 20px;
//             background: var(--bg-secondary);
//             border-bottom: 1px solid var(--border-color);
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             flex-shrink: 0;
//             min-height: 0;
//             gap: 12px;
//           }

//           .agent-info {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             min-width: 0;
//             flex: 1;
//           }

//           .agent-icon {
//             width: 24px;
//             height: 24px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: 600;
//             color: white;
//             flex-shrink: 0;
//           }

//           .coding-icon { background: #007acc; }
//           .security-icon { background: #e74c3c; }
//           .documentation-icon { background: #27ae60; }

//           .agent-title {
//             font-size: 16px;
//             font-weight: 600;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             min-width: 0;
//           }

//           .agent-description {
//             color: var(--text-secondary);
//             font-size: 12px;
//             margin-top: 2px;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             min-width: 0;
//           }

//           .agent-controls {
//             display: flex;
//             gap: 8px;
//             flex-shrink: 0;
//           }

//           .progress-bar {
//             height: 3px;
//             background: var(--border-color);
//             overflow: hidden;
//             margin-top: 8px;
//           }

//           .progress-fill {
//             height: 100%;
//             background: var(--accent-color);
//             transition: width 0.3s ease;
//             width: 0%;
//           }

//           .progress-text {
//             font-size: 11px;
//             color: var(--text-secondary);
//             margin-top: 4px;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//           }

//           .content-area {
//             flex: 1;
//             overflow: hidden;
//             padding: 20px;
//             min-height: 0;
//           }

//           .output-container {
//             background: var(--bg-secondary);
//             border: 1px solid var(--border-color);
//             border-radius: 6px;
//             min-height: 200px;
//             position: relative;
//             height: 100%;
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//           }

//           .output-content {
//             padding: 16px;
//             font-family: var(--vscode-editor-font-family);
//             font-size: var(--vscode-editor-font-size);
//             line-height: 1.5;
//             white-space: pre-wrap;
//             word-wrap: break-word;
//             overflow-wrap: break-word;
//             word-break: break-word;
//             hyphens: auto;
//             overflow: auto;
//             flex: 1;
//             min-height: 0;
//           }

//           .output-empty {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             height: 200px;
//             color: var(--text-secondary);
//             font-style: italic;
//             text-align: center;
//             padding: 20px;
//             box-sizing: border-box;
//           }

//           .timestamp {
//             position: absolute;
//             top: 8px;
//             right: 12px;
//             font-size: 10px;
//             color: var(--text-secondary);
//             z-index: 1;
//             background: var(--bg-secondary);
//             padding: 2px 4px;
//             border-radius: 2px;
//             white-space: nowrap;
//           }

//           .status-indicator {
//             position: absolute;
//             top: 12px;
//             left: 12px;
//             width: 8px;
//             height: 8px;
//             border-radius: 50%;
//             background: var(--info-color);
//             z-index: 1;
//             flex-shrink: 0;
//           }

//           .status-indicator.success { background: var(--success-color); }
//           .status-indicator.error { background: var(--error-color); }
//           .status-indicator.warning { background: var(--warning-color); }

//           .issue-item {
//             margin: 12px 0;
//             padding: 12px;
//             border-left: 4px solid var(--info-color);
//             background: var(--bg-primary);
//             border-radius: 4px;
//             overflow: hidden;
//           }

//           .issue-item.high { border-left-color: var(--error-color); }
//           .issue-item.medium { border-left-color: var(--warning-color); }
//           .issue-item.low { border-left-color: var(--success-color); }

//           .issue-header {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             margin-bottom: 8px;
//             gap: 8px;
//             min-width: 0;
//           }

//           .issue-title {
//             font-weight: 600;
//             font-size: 14px;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             min-width: 0;
//             flex: 1;
//           }

//           .issue-severity {
//             padding: 2px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//             font-weight: 600;
//             text-transform: uppercase;
//             white-space: nowrap;
//             flex-shrink: 0;
//           }

//           .issue-severity.high {
//             background: var(--error-color);
//             color: white;
//           }

//           .issue-severity.medium {
//             background: var(--warning-color);
//             color: white;
//           }

//           .issue-severity.low {
//             background: var(--success-color);
//             color: white;
//           }

//           .issue-description {
//             word-wrap: break-word;
//             overflow-wrap: break-word;
//             word-break: break-word;
//             hyphens: auto;
//             line-height: 1.4;
//           }

//           .loading-spinner {
//             border: 2px solid var(--border-color);
//             border-top: 2px solid var(--accent-color);
//             border-radius: 50%;
//             width: 16px;
//             height: 16px;
//             animation: spin 1s linear infinite;
//             flex-shrink: 0;
//           }

//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }

//           .fade-in {
//             animation: fadeIn 0.3s ease-in;
//           }

//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }

//           .scrollbar-custom {
//             scrollbar-width: thin;
//             scrollbar-color: var(--border-color) transparent;
//           }

//           .scrollbar-custom::-webkit-scrollbar {
//             width: 8px;
//           }

//           .scrollbar-custom::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .scrollbar-custom::-webkit-scrollbar-thumb {
//             background: var(--border-color);
//             border-radius: 4px;
//           }

//           .scrollbar-custom::-webkit-scrollbar-thumb:hover {
//             background: var(--text-secondary);
//           }

//           /* Responsive design for smaller screens */
//           @media (max-width: 768px) {
//             .header {
//               padding: 12px 16px;
//             }
            
//             .header h1 {
//               font-size: 16px;
//             }
            
//             .agent-header {
//               padding: 12px 16px;
//               flex-direction: column;
//               align-items: flex-start;
//               gap: 8px;
//             }
            
//             .agent-info {
//               width: 100%;
//             }
            
//             .agent-controls {
//               width: 100%;
//               justify-content: flex-end;
//             }
            
//             .content-area {
//               padding: 16px;
//             }
            
//             .tab {
//               padding: 8px 12px;
//               font-size: 12px;
//             }
            
//             .btn {
//               padding: 4px 8px;
//               font-size: 11px;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Multi-Agent AI Assistant</h1>
//           <div class="header-controls">
//             <button class="btn" onclick="clearAll()">Clear All</button>
//             <button class="btn primary" onclick="refreshAll()">Refresh All</button>
//           </div>
//         </div>
        
//         <div class="agent-tabs">
//           <button class="tab active" onclick="switchTab('coding')">
//             <div class="agent-icon coding-icon">C</div>
//             Coding Agent
//             <span class="tab-badge info" id="coding-badge" style="display: none;">0</span>
//           </button>
//           <button class="tab" onclick="switchTab('security')">
//             <div class="agent-icon security-icon">S</div>
//             Security Agent
//             <span class="tab-badge error" id="security-badge" style="display: none;">0</span>
//           </button>
//           <button class="tab" onclick="switchTab('documentation')">
//             <div class="agent-icon documentation-icon">D</div>
//             Documentation Agent
//             <span class="tab-badge success" id="documentation-badge" style="display: none;">0</span>
//           </button>
//         </div>
        
//         <div class="content-container">
//           <div id="coding-content" class="agent-content active">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div class="agent-icon coding-icon">C</div>
//                 <div>
//                   <div class="agent-title">Coding Assistant</div>
//                   <div class="agent-description">AI-powered code completion and suggestions</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('coding')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('coding')">Refresh</button>
//                 <button class="btn" onclick="exportContent('coding')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="coding-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="coding-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="coding-progress-text">Initializing...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="coding-status"></div>
//                 <div class="timestamp" id="coding-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="coding-output">
//                   <div class="output-empty">No output yet. Run analysis to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div id="security-content" class="agent-content">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div class="agent-icon security-icon">S</div>
//                 <div>
//                   <div class="agent-title">Security Analysis</div>
//                   <div class="agent-description">Static code analysis and security recommendations</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('security')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('security')">Refresh</button>
//                 <button class="btn" onclick="exportContent('security')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="security-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="security-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="security-progress-text">Scanning for vulnerabilities...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="security-status"></div>
//                 <div class="timestamp" id="security-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="security-output">
//                   <div class="output-empty">No security analysis yet. Run scan to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div id="documentation-content" class="agent-content">
//             <div class="agent-header">
//               <div class="agent-info">
//                 <div class="agent-icon documentation-icon">D</div>
//                 <div>
//                   <div class="agent-title">Documentation Generator</div>
//                   <div class="agent-description">Automated documentation and error resolution guides</div>
//                 </div>
//               </div>
//               <div class="agent-controls">
//                 <button class="btn" onclick="clearAgent('documentation')">Clear</button>
//                 <button class="btn" onclick="refreshAgent('documentation')">Refresh</button>
//                 <button class="btn" onclick="exportContent('documentation')">Export</button>
//               </div>
//             </div>
//             <div class="progress-container" id="documentation-progress" style="display: none;">
//               <div class="progress-bar">
//                 <div class="progress-fill" id="documentation-progress-fill"></div>
//               </div>
//               <div class="progress-text" id="documentation-progress-text">Generating documentation...</div>
//             </div>
//             <div class="content-area">
//               <div class="output-container">
//                 <div class="status-indicator" id="documentation-status"></div>
//                 <div class="timestamp" id="documentation-timestamp"></div>
//                 <div class="output-content scrollbar-custom" id="documentation-output">
//                   <div class="output-empty">No documentation generated yet. Run generator to see results.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <script>
//           const vscode = acquireVsCodeApi();
//           let currentTab = 'coding';

//           function switchTab(agent) {
//             // Update current tab
//             currentTab = agent;
            
//             // Hide all content
//             document.querySelectorAll('.agent-content').forEach(el => el.classList.remove('active'));
//             document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
//             // Show selected content
//             document.getElementById(agent + '-content').classList.add('active');
//             document.querySelector(\`[onclick="switchTab('\${agent}')"]\`).classList.add('active');
//           }

//           function refreshAgent(agent) {
//             showProgress(agent, 0, 'Starting...');
//             vscode.postMessage({ command: 'refresh', agent });
//           }

//           function clearAgent(agent) {
//             const outputEl = document.getElementById(agent + '-output');
//             if (outputEl) {
//               outputEl.innerHTML = '<div class="output-empty">No output yet. Run analysis to see results.</div>';
//             }
//             updateBadge(agent, 0);
//             hideProgress(agent);
//             vscode.postMessage({ command: 'clear', agent });
//           }

//           function exportContent(agent) {
//             const outputEl = document.getElementById(agent + '-output');
//             if (outputEl) {
//               const content = outputEl.textContent || outputEl.innerText;
//               vscode.postMessage({ command: 'export', agent, content });
//             }
//           }

//           function clearAll() {
//             ['coding', 'security', 'documentation'].forEach(agent => {
//               clearAgent(agent);
//             });
//           }

//           function refreshAll() {
//             ['coding', 'security', 'documentation'].forEach(agent => {
//               refreshAgent(agent);
//             });
//           }

//           function showProgress(agent, progress, status) {
//             const progressContainer = document.getElementById(agent + '-progress');
//             const progressFill = document.getElementById(agent + '-progress-fill');
//             const progressText = document.getElementById(agent + '-progress-text');
            
//             if (progressContainer && progressFill && progressText) {
//               progressContainer.style.display = 'block';
//               progressFill.style.width = progress + '%';
//               progressText.textContent = status;
//             }
//           }

//           function hideProgress(agent) {
//             const progressContainer = document.getElementById(agent + '-progress');
//             if (progressContainer) {
//               progressContainer.style.display = 'none';
//             }
//           }

//           function updateBadge(agent, count) {
//             const badge = document.getElementById(agent + '-badge');
//             if (badge) {
//               if (count > 0) {
//                 badge.textContent = count;
//                 badge.style.display = 'inline-block';
//               } else {
//                 badge.style.display = 'none';
//               }
//             }
//           }

//           function updateTimestamp(agent) {
//             const timestampEl = document.getElementById(agent + '-timestamp');
//             if (timestampEl) {
//               const now = new Date();
//               timestampEl.textContent = now.toLocaleTimeString();
//             }
//           }

//           function updateStatus(agent, type) {
//             const statusEl = document.getElementById(agent + '-status');
//             if (statusEl) {
//               statusEl.className = 'status-indicator ' + type;
//             }
//           }

//           function formatContent(content, type) {
//             if (type === 'security') {
//               // Try to parse as security issues
//               try {
//                 const issues = JSON.parse(content);
//                 if (Array.isArray(issues)) {
//                   return issues.map(issue => \`
//                     <div class="issue-item \${issue.severity}">
//                       <div class="issue-header">
//                         <div class="issue-title">\${issue.title}</div>
//                         <div class="issue-severity \${issue.severity}">\${issue.severity}</div>
//                       </div>
//                       <div class="issue-description">\${issue.description}</div>
//                     </div>
//                   \`).join('');
//                 }
//               } catch (e) {
//                 // Fall back to plain text
//               }
//             }
//             return '<pre>' + content + '</pre>';
//           }

//           window.addEventListener('message', event => {
//             const { command, agent, content, type, timestamp, progress, status } = event.data;
            
//             if (command === 'updateContent') {
//               const outputEl = document.getElementById(agent + '-output');
//               if (outputEl && content) {
//                 outputEl.innerHTML = formatContent(content, agent);
//                 outputEl.classList.add('fade-in');
                
//                 // Update timestamp
//                 updateTimestamp(agent);
                
//                 // Update status indicator
//                 updateStatus(agent, type);
                
//                 // Update badge for security issues
//                 if (agent === 'security') {
//                   try {
//                     const issues = JSON.parse(content);
//                     if (Array.isArray(issues)) {
//                       updateBadge(agent, issues.length);
//                     }
//                   } catch (e) {
//                     updateBadge(agent, 1);
//                   }
//                 } else {
//                   updateBadge(agent, content ? 1 : 0);
//                 }
                
//                 hideProgress(agent);
//               }
//             } else if (command === 'updateProgress') {
//               showProgress(agent, progress, status);
//             }
//           });

//           // Initialize
//           updateTimestamp('coding');
//           updateTimestamp('security');
//           updateTimestamp('documentation');
//         </script>
//       </body>
//       </html>
//     `;
//   }
// }

// export function deactivate() {}



import * as vscode from 'vscode';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  emptyMessage: string;
}

export interface AgentMessage {
  command: string;
  agent: string;
  content?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  progress?: number;
  status?: string;
  timestamp?: string;
}

export class AgentPanel {
  private panel: vscode.WebviewPanel | undefined;
  private readonly extensionUri: vscode.Uri;
  private readonly agents: Map<string, AgentConfig> = new Map();
  private disposables: vscode.Disposable[] = [];

  constructor(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
    this.initializeAgents();
  }

  private initializeAgents() {
    const agentConfigs: AgentConfig[] = [
      {
        id: 'coding',
        name: 'Coding Assistant',
        description: 'AI-powered code completion and suggestions',
        icon: 'C',
        iconBg: '#007acc',
        emptyMessage: 'No output yet. Run analysis to see results.'
      },
      {
        id: 'security',
        name: 'Security Analysis',
        description: 'Static code analysis and security recommendations',
        icon: 'S',
        iconBg: '#e74c3c',
        emptyMessage: 'No security analysis yet. Run scan to see results.'
      },
      {
        id: 'documentation',
        name: 'Documentation Generator',
        description: 'Automated documentation and error resolution guides',
        icon: 'D',
        iconBg: '#27ae60',
        emptyMessage: 'No documentation generated yet. Run generator to see results.'
      }
    ];

    agentConfigs.forEach(config => {
      this.agents.set(config.id, config);
    });
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
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri]
      }
    );

    this.panel.webview.html = this.getWebviewContent();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.panel) return;

    // Panel disposal
    this.disposables.push(
      this.panel.onDidDispose(() => {
        this.cleanup();
      })
    );

    // Message handling
    this.disposables.push(
      this.panel.webview.onDidReceiveMessage(
        (message: AgentMessage) => this.handleMessage(message)
      )
    );
  }

  private async handleMessage(message: AgentMessage) {
    const { command, agent } = message;
    
    try {
      switch (command) {
        case 'export':
          await this.exportContent(agent, message.content || '');
          break;
        case 'getAgent':
          this.sendAgentConfig(agent);
          break;
      }
    } catch (error) {
      this.updateContent(agent, `Error: ${error}`, 'error');
    }
  }

  private sendAgentConfig(agentId: string) {
    const config = this.agents.get(agentId);
    if (config && this.panel) {
      this.panel.webview.postMessage({
        command: 'agentConfig',
        agent: agentId,
        config
      });
    }
  }

  public updateContent(agent: string, content: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    if (this.panel) {
      this.panel.webview.postMessage({
        command: 'updateContent',
        agent,
        content,
        type,
        timestamp: new Date().toISOString()
      });
    }
  }

  public updateProgress(agent: string, progress: number, status: string) {
    if (this.panel) {
      this.panel.webview.postMessage({
        command: 'updateProgress',
        agent,
        progress,
        status
      });
    }
  }

  public updateBadge(agent: string, count: number, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    if (this.panel) {
      this.panel.webview.postMessage({
        command: 'updateBadge',
        agent,
        count,
        type
      });
    }
  }

  

  private async exportContent(agent: string, content: string) {
    if (!content.trim()) {
      vscode.window.showWarningMessage('No content to export');
      return;
    }

    const agentConfig = this.agents.get(agent);
    const defaultName = agentConfig ? `${agentConfig.name}-output` : `${agent}-output`;

    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(`${defaultName}.txt`),
      filters: {
        'Text files': ['txt'],
        'Markdown files': ['md'],
        'JSON files': ['json']
      }
    });

    if (uri) {
      try {
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
        vscode.window.showInformationMessage(`Content exported to ${uri.fsPath}`);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to export: ${error}`);
      }
    }
  }

  private cleanup() {
    this.panel = undefined;
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }

  public dispose() {
    this.cleanup();
  }

  private getWebviewContent(): string {
    const agentTabs = Array.from(this.agents.entries())
      .map(([id, config], index) => `
        <button class="tab ${index === 0 ? 'active' : ''}" onclick="switchTab('${id}')">
          <div class="agent-icon" style="background: ${config.iconBg}">${config.icon}</div>
          ${config.name}
          <span class="tab-badge info" id="${id}-badge" style="display: none;">0</span>
        </button>
      `).join('');

    const agentContents = Array.from(this.agents.entries())
      .map(([id, config], index) => `
        <div id="${id}-content" class="agent-content ${index === 0 ? 'active' : ''}">
          <div class="agent-header">
            <div class="agent-info">
              <div class="agent-icon" style="background: ${config.iconBg}">${config.icon}</div>
              <div>
                <div class="agent-title">${config.name}</div>
                <div class="agent-description">${config.description}</div>
              </div>
            </div>
            <div class="agent-controls">
              <button class="btn" onclick="exportContent('${id}')">Export</button>
            </div>
          </div>
          <div class="progress-container" id="${id}-progress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill" id="${id}-progress-fill"></div>
            </div>
            <div class="progress-text" id="${id}-progress-text">Initializing...</div>
          </div>
          <div class="content-area">
            <div class="output-container">
              <div class="status-indicator" id="${id}-status"></div>
              <div class="timestamp" id="${id}-timestamp"></div>
              <div class="output-content scrollbar-custom" id="${id}-output">
                <div class="output-empty">${config.emptyMessage}</div>
              </div>
            </div>
          </div>
        </div>
      `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Multi-Agent AI</title>
        <style>
          ${this.getStyles()}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Multi-Agent AI Assistant</h1>

        </div>
        
        <div class="agent-tabs">
          ${agentTabs}
        </div>
        
        <div class="content-container">
          ${agentContents}
        </div>
        
        <script>
          ${this.getScript()}
        </script>
      </body>
      </html>
    `;
  }

  private getStyles(): string {
    return `
      :root {
        --bg-primary: var(--vscode-editor-background);
        --bg-secondary: var(--vscode-sideBar-background);
        --text-primary: var(--vscode-editor-foreground);
        --text-secondary: var(--vscode-descriptionForeground);
        --border-color: var(--vscode-panel-border);
        --accent-color: var(--vscode-focusBorder);
        --success-color: var(--vscode-gitDecoration-addedResourceForeground);
        --error-color: var(--vscode-gitDecoration-deletedResourceForeground);
        --warning-color: var(--vscode-gitDecoration-modifiedResourceForeground);
        --info-color: var(--vscode-gitDecoration-untrackedResourceForeground);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: var(--vscode-font-family);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: var(--vscode-font-size);
        line-height: 1.6;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .header {
        background: var(--bg-secondary);
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .header h1 {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .header-controls {
        display: flex;
        gap: 8px;
      }

      .btn {
        padding: 6px 12px;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .btn:hover {
        background: var(--bg-secondary);
        border-color: var(--accent-color);
      }

      .btn.primary {
        background: var(--accent-color);
        border-color: var(--accent-color);
        color: white;
      }

      .agent-tabs {
        display: flex;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
        overflow-x: auto;
      }

      .tab {
        padding: 12px 20px;
        cursor: pointer;
        border: none;
        background: none;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
      }

      .tab:hover {
        background: var(--bg-primary);
        color: var(--text-primary);
      }

      .tab.active {
        color: var(--text-primary);
        border-bottom-color: var(--accent-color);
        background: var(--bg-primary);
      }

      .agent-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: white;
      }

      .tab-badge {
        background: var(--info-color);
        color: white;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 10px;
        font-weight: 600;
        min-width: 16px;
        text-align: center;
      }

      .tab-badge.success { background: var(--success-color); }
      .tab-badge.error { background: var(--error-color); }
      .tab-badge.warning { background: var(--warning-color); }

      .content-container {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .agent-content {
        display: none;
        flex: 1;
        overflow: hidden;
        flex-direction: column;
      }

      .agent-content.active {
        display: flex;
      }

      .agent-header {
        padding: 16px 20px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .agent-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .agent-title {
        font-size: 16px;
        font-weight: 600;
      }

      .agent-description {
        color: var(--text-secondary);
        font-size: 12px;
        margin-top: 2px;
      }

      .agent-controls {
        display: flex;
        gap: 8px;
      }

      .progress-container {
        padding: 8px 20px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
      }

      .progress-bar {
        height: 3px;
        background: var(--border-color);
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: var(--accent-color);
        transition: width 0.3s ease;
        width: 0%;
      }

      .progress-text {
        font-size: 11px;
        color: var(--text-secondary);
        margin-top: 4px;
      }

      .content-area {
        flex: 1;
        overflow: hidden;
        padding: 20px;
      }

      .output-container {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .status-indicator {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--info-color);
        z-index: 1;
      }

      .status-indicator.success { background: var(--success-color); }
      .status-indicator.error { background: var(--error-color); }
      .status-indicator.warning { background: var(--warning-color); }

      .timestamp {
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 10px;
        color: var(--text-secondary);
        z-index: 1;
        background: var(--bg-secondary);
        padding: 2px 4px;
        border-radius: 2px;
      }

      .output-content {
        flex: 1;
        overflow: auto;
        padding: 40px 16px 16px;
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .output-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--text-secondary);
        font-style: italic;
        text-align: center;
      }

      .scrollbar-custom {
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) transparent;
      }

      .scrollbar-custom::-webkit-scrollbar {
        width: 8px;
      }

      .scrollbar-custom::-webkit-scrollbar-track {
        background: transparent;
      }

      .scrollbar-custom::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 4px;
      }

      .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: var(--text-secondary);
      }

      .fade-in {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 768px) {
        .header {
          padding: 12px 16px;
        }
        
        .agent-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .content-area {
          padding: 16px;
        }
      }
    `;
  }

  private getScript(): string {
    return `
      const vscode = acquireVsCodeApi();
      let currentTab = 'coding';

      function switchTab(agent) {
        currentTab = agent;
        
        document.querySelectorAll('.agent-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
        
        document.getElementById(agent + '-content').classList.add('active');
        document.querySelector(\`[onclick="switchTab('\${agent}')"]\`).classList.add('active');
      }

     

     

      function exportContent(agent) {
        const outputEl = document.getElementById(agent + '-output');
        const content = outputEl ? (outputEl.textContent || outputEl.innerText) : '';
        vscode.postMessage({ command: 'export', agent, content });
      }

      

      function showProgress(agent, progress, status) {
        const progressContainer = document.getElementById(agent + '-progress');
        const progressFill = document.getElementById(agent + '-progress-fill');
        const progressText = document.getElementById(agent + '-progress-text');
        
        if (progressContainer && progressFill && progressText) {
          progressContainer.style.display = 'block';
          progressFill.style.width = progress + '%';
          progressText.textContent = status;
        }
      }

      function hideProgress(agent) {
        const progressContainer = document.getElementById(agent + '-progress');
        if (progressContainer) {
          progressContainer.style.display = 'none';
        }
      }

      function updateBadge(agent, count, type = 'info') {
        const badge = document.getElementById(agent + '-badge');
        if (badge) {
          badge.className = 'tab-badge ' + type;
          if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
          } else {
            badge.style.display = 'none';
          }
        }
      }

      function updateTimestamp(agent) {
        const timestampEl = document.getElementById(agent + '-timestamp');
        if (timestampEl) {
          const now = new Date();
          timestampEl.textContent = now.toLocaleTimeString();
        }
      }

      function updateStatus(agent, type) {
        const statusEl = document.getElementById(agent + '-status');
        if (statusEl) {
          statusEl.className = 'status-indicator ' + type;
        }
      }

      function formatContent(content, agent) {
        if (agent === 'security') {
          try {
            const issues = JSON.parse(content);
            if (Array.isArray(issues)) {
              return issues.map(issue => \`
                <div class="issue-item \${issue.severity}">
                  <div class="issue-header">
                    <div class="issue-title">\${issue.message}</div>
                    <div class="issue-severity \${issue.severity}">\${issue.severity}</div>
                  </div>
                  <div class="issue-description">\${issue.suggestion}</div>
                </div>
              \`).join('');
            }
          } catch (e) {
            // Fall back to plain text
          }
        }
        return '<pre>' + content + '</pre>';
      }

      window.addEventListener('message', event => {
        const { command, agent, content, type, progress, status, count } = event.data;
        
        switch (command) {
          case 'updateContent':
            const outputEl = document.getElementById(agent + '-output');
            if (outputEl && content) {
              outputEl.innerHTML = formatContent(content, agent);
              outputEl.classList.add('fade-in');
              updateTimestamp(agent);
              updateStatus(agent, type);
              hideProgress(agent);
            }
            break;
            
          case 'updateProgress':
            showProgress(agent, progress, status);
            break;
            
          case 'updateBadge':
            updateBadge(agent, count, type);
            break;
        }
      });

      // Initialize timestamps
      ['coding', 'security', 'documentation'].forEach(agent => {
        updateTimestamp(agent);
      });
    `;
  }
}