import * as vscode from 'vscode';
import { AIService } from './services/aiService';
import { CodingAgent } from './agents/codingAgent';
import { SecurityAgent } from './agents/securityAgent';
import { DocumentationAgent } from './agents/documentationAgent';
import { AgentPanel } from './ui/agentPanel';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('multiAgentAI');
  const groqApiKey = config.get<string>('groqApiKey') || '';
  const blackboxApiKey = config.get<string>('blackboxApiKey') || '';

  if (!groqApiKey || !blackboxApiKey) {
    vscode.window.showWarningMessage('Please configure API keys in settings for Multi-Agent AI extension');
    return;
  }

  const aiService = new AIService(groqApiKey, blackboxApiKey);
  const codingAgent = new CodingAgent(aiService);
  const securityAgent = new SecurityAgent(aiService);
  const documentationAgent = new DocumentationAgent(aiService);
  const agentPanel = new AgentPanel(context.extensionUri);

  // Generate Code Command
  const generateCodeCommand = vscode.commands.registerCommand('multiAgentAI.generateCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const language = editor.document.languageId;
    const context = editor.document.getText();

    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating code...",
        cancellable: false
      }, async () => {
        const suggestion = await codingAgent.generateCodeCompletion(selectedText, language, context);
        
        const action = await vscode.window.showInformationMessage(
          'Code suggestion generated',
          'Apply', 'View', 'Improve'
        );

        if (action === 'Apply') {
          editor.edit(editBuilder => {
            editBuilder.replace(selection, suggestion.content);
          });
        } else if (action === 'View') {
          agentPanel.show();
          agentPanel.updateContent('coding', suggestion.content);
        } else if (action === 'Improve') {
          const improvement = await codingAgent.suggestCodeImprovement(selectedText, language);
          agentPanel.show();
          agentPanel.updateContent('coding', improvement.content);
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error generating code: ${error}`);
    }
  });

  // Security Analysis Command
  const analyzeSecurityCommand = vscode.commands.registerCommand('multiAgentAI.analyzeSecurity', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const code = editor.document.getText();
    const language = editor.document.languageId;

    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Analyzing security...",
        cancellable: false
      }, async () => {
        const issues = await securityAgent.analyzeSecurityIssues(code, language);
        
        if (issues.length === 0) {
          vscode.window.showInformationMessage('No security issues found');
          return;
        }

        agentPanel.show();
        const issuesText = issues.map(issue => 
          `**${issue.type.toUpperCase()}** (${issue.severity})\nLine ${issue.line}: ${issue.message}\n\nSuggestion: ${issue.suggestion}\n\n---\n`
        ).join('');
        
        agentPanel.updateContent('security', issuesText);
        
        // Show diagnostics
        const diagnostics = issues.map(issue => {
          const range = new vscode.Range(issue.line - 1, 0, issue.line - 1, 100);
          const severity = issue.severity === 'high' ? vscode.DiagnosticSeverity.Error :
                          issue.severity === 'medium' ? vscode.DiagnosticSeverity.Warning :
                          vscode.DiagnosticSeverity.Information;
          
          return new vscode.Diagnostic(range, issue.message, severity);
        });

        const collection = vscode.languages.createDiagnosticCollection('multiAgentAI');
        collection.set(editor.document.uri, diagnostics);
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error analyzing security: ${error}`);
    }
  });

  // Generate Documentation Command
  const generateDocsCommand = vscode.commands.registerCommand('multiAgentAI.generateDocs', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection) || editor.document.getText();
    const language = editor.document.languageId;

    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating documentation...",
        cancellable: false
      }, async () => {
        const docs = await documentationAgent.generateCodeDocumentation(selectedText, language);
        
        agentPanel.show();
        agentPanel.updateContent('documentation', docs);
        
        const action = await vscode.window.showInformationMessage(
          'Documentation generated',
          'Insert Above', 'Insert Below', 'Copy'
        );

        if (action === 'Insert Above') {
          editor.edit(editBuilder => {
            editBuilder.insert(selection.start, `/*\n${docs}\n*/\n`);
          });
        } else if (action === 'Insert Below') {
          editor.edit(editBuilder => {
            editBuilder.insert(selection.end, `\n/*\n${docs}\n*/`);
          });
        } else if (action === 'Copy') {
          vscode.env.clipboard.writeText(docs);
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error generating documentation: ${error}`);
    }
  });

  // Open Panel Command
  const openPanelCommand = vscode.commands.registerCommand('multiAgentAI.openPanel', () => {
    agentPanel.show();
  });

  context.subscriptions.push(
    generateCodeCommand,
    analyzeSecurityCommand,
    generateDocsCommand,
    openPanelCommand
  );

  // Auto-completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file' },
    {
      async provideCompletionItems(document, position) {
        const lineText = document.lineAt(position).text;
        const range = new vscode.Range(position.line, 0, position.line, position.character);
        
        try {
          const suggestion = await codingAgent.generateCodeCompletion(
            lineText,
            document.languageId,
            document.getText()
          );
          
          const completionItem = new vscode.CompletionItem(
            suggestion.content,
            vscode.CompletionItemKind.Text
          );
          completionItem.insertText = suggestion.content;
          completionItem.range = range;
          completionItem.detail = 'AI Generated';
          
          return [completionItem];
        } catch {
          return [];
        }
      }
    },
    '.' // Trigger on dot
  );

  context.subscriptions.push(completionProvider);
}
