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
export declare class AgentPanel {
    private panel;
    private readonly extensionUri;
    private readonly agents;
    private disposables;
    constructor(extensionUri: vscode.Uri);
    private initializeAgents;
    show(): void;
    private setupEventHandlers;
    private handleMessage;
    private sendAgentConfig;
    updateContent(agent: string, content: string, type?: 'success' | 'error' | 'warning' | 'info'): void;
    updateProgress(agent: string, progress: number, status: string): void;
    updateBadge(agent: string, count: number, type?: 'success' | 'error' | 'warning' | 'info'): void;
    private exportContent;
    private cleanup;
    dispose(): void;
    private getWebviewContent;
    private getStyles;
    private getScript;
}
//# sourceMappingURL=agentPanel.d.ts.map