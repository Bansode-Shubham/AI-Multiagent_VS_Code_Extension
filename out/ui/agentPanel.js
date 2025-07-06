"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.AgentPanel = void 0;
const vscode = __importStar(require("vscode"));
class AgentPanel {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    show() {
        if (this.panel) {
            this.panel.reveal();
            return;
        }
        this.panel = vscode.window.createWebviewPanel('multiAgentAI', 'Multi-Agent AI', vscode.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this.panel.webview.html = this.getWebviewContent();
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }
    updateContent(agent, content) {
        if (this.panel) {
            this.panel.webview.postMessage({
                command: 'updateContent',
                agent,
                content
            });
        }
    }
    getWebviewContent() {
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
exports.AgentPanel = AgentPanel;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=agentPanel.js.map