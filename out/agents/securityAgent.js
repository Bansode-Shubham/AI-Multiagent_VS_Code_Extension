"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityAgent = void 0;
class SecurityAgent {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async analyzeSecurityIssues(code, language) {
        const messages = [
            {
                role: 'system',
                content: `You are a security expert specializing in static code analysis. Identify security vulnerabilities including:
        - SQL injection
        - XSS vulnerabilities
        - Authentication issues
        - Data validation problems
        - Insecure dependencies
        - Hardcoded secrets
        
        Return findings in JSON format with: type, severity, line, message, suggestion`
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode to analyze:\n${code}`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        try {
            const issues = JSON.parse(response);
            return Array.isArray(issues) ? issues : [issues];
        }
        catch {
            // Fallback if JSON parsing fails
            return [{
                    type: 'general',
                    severity: 'medium',
                    line: 1,
                    message: 'Security analysis completed',
                    suggestion: response
                }];
        }
    }
    async scanDependencies(packageJson) {
        const messages = [
            {
                role: 'system',
                content: `You are a dependency security scanner. Analyze package.json for known vulnerabilities and suggest fixes.`
            },
            {
                role: 'user',
                content: `Package.json content:\n${packageJson}`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        return [{
                type: 'dependency',
                severity: 'medium',
                line: 1,
                message: 'Dependency security scan completed',
                suggestion: response
            }];
    }
    async generateSecurityFix(issue, code) {
        const messages = [
            {
                role: 'system',
                content: `You are a security remediation expert. Provide specific code fixes for security issues.`
            },
            {
                role: 'user',
                content: `Security issue: ${issue.message}\nSeverity: ${issue.severity}\nCode:\n${code}\n\nProvide a secure fix.`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
}
exports.SecurityAgent = SecurityAgent;
//# sourceMappingURL=securityAgent.js.map