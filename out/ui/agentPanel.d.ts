import * as vscode from 'vscode';
export declare class AgentPanel {
    private panel;
    private readonly extensionUri;
    constructor(extensionUri: vscode.Uri);
    show(): void;
    updateContent(agent: string, content: string): void;
    private getWebviewContent;
}
export declare function deactivate(): void;
//# sourceMappingURL=agentPanel.d.ts.map