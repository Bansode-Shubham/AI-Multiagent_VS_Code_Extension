// import { AIService } from '../services/aiService';
// import { ChatMessage, SecurityIssue } from '../types';

// export class SecurityAgent {
//   private aiService: AIService;

//   constructor(aiService: AIService) {
//     this.aiService = aiService;
//   }

//   async analyzeSecurityIssues(code: string, language: string): Promise<SecurityIssue[]> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a security expert specializing in static code analysis. Identify security vulnerabilities including:
//         - SQL injection
//         - XSS vulnerabilities
//         - Authentication issues
//         - Data validation problems
//         - Insecure dependencies
//         - Hardcoded secrets
        
//         Return findings in JSON format with: type, severity, line, message, suggestion`
//       },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nCode to analyze:\n${code}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     try {
//       const issues = JSON.parse(response);
//       return Array.isArray(issues) ? issues : [issues];
//     } catch {
//       // Fallback if JSON parsing fails
//       return [{
//         type: 'general',
//         severity: 'medium',
//         line: 1,
//         message: 'Security analysis completed',
//         suggestion: response
//       }];
//     }
//   }

//   async scanDependencies(packageJson: string): Promise<SecurityIssue[]> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a dependency security scanner. Analyze package.json for known vulnerabilities and suggest fixes.`
//       },
//       {
//         role: 'user',
//         content: `Package.json content:\n${packageJson}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return [{
//       type: 'dependency',
//       severity: 'medium',
//       line: 1,
//       message: 'Dependency security scan completed',
//       suggestion: response
//     }];
//   }

//   async generateSecurityFix(issue: SecurityIssue, code: string): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a security remediation expert. Provide specific code fixes for security issues.`
//       },
//       {
//         role: 'user',
//         content: `Security issue: ${issue.message}\nSeverity: ${issue.severity}\nCode:\n${code}\n\nProvide a secure fix.`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }
// }


// import { AIService } from '../services/aiService';
// import { ChatMessage, SecurityIssue, SecurityScanResult, SecurityConfig } from '../types';

// export interface SecurityMetrics {
//   totalIssues: number;
//   criticalCount: number;
//   highCount: number;
//   mediumCount: number;
//   lowCount: number;
//   coverageScore: number;
// }

// export interface SecurityContext {
//   framework?: string;
//   environment?: 'development' | 'staging' | 'production';
//   complianceStandards?: string[];
//   customRules?: SecurityRule[];
// }

// export interface SecurityRule {
//   id: string;
//   pattern: RegExp;
//   severity: 'critical' | 'high' | 'medium' | 'low';
//   message: string;
//   cweId?: string;
// }

// export class SecurityAgent {
//   private aiService: AIService;
//   private config: SecurityConfig;
//   private customRules: SecurityRule[] = [];

//   constructor(aiService: AIService, config: SecurityConfig = {}) {
//     this.aiService = aiService;
//     this.config = {
//       enableStaticAnalysis: true,
//       enableDependencyScanning: true,
//       enableSecretsDetection: true,
//       enableComplianceChecks: false,
//       maxSeverityLevel: 'medium',
//       ...config
//     };
//   }

//   async performComprehensiveScan(
//     code: string,
//     language: string,
//     context: SecurityContext = {}
//   ): Promise<SecurityScanResult> {
//     const results: SecurityIssue[] = [];
//     const startTime = Date.now();

//     // Static code analysis
//     if (this.config.enableStaticAnalysis) {
//       const staticIssues = await this.analyzeSecurityIssues(code, language, context);
//       results.push(...staticIssues);
//     }

//     // Custom rules validation
//     const customIssues = await this.validateCustomRules(code, context.customRules || []);
//     results.push(...customIssues);

//     // Secrets detection
//     if (this.config.enableSecretsDetection) {
//       const secretIssues = await this.detectHardcodedSecrets(code);
//       results.push(...secretIssues);
//     }

//     // Compliance checks
//     if (this.config.enableComplianceChecks && context.complianceStandards) {
//       const complianceIssues = await this.checkCompliance(code, context.complianceStandards);
//       results.push(...complianceIssues);
//     }

//     const scanTime = Date.now() - startTime;
//     const metrics = this.calculateMetrics(results);

//     return {
//       issues: results,
//       metrics,
//       scanTime,
//       timestamp: new Date().toISOString(),
//       context
//     };
//   }

//   async analyzeSecurityIssues(
//     code: string,
//     language: string,
//     context: SecurityContext = {}
//   ): Promise<SecurityIssue[]> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are an expert security analyst. Analyze code for vulnerabilities:

//         SECURITY CHECKS:
//         - SQL injection (CWE-89)
//         - XSS vulnerabilities (CWE-79)
//         - Authentication bypass (CWE-287)
//         - Authorization flaws (CWE-285)
//         - Data validation issues (CWE-20)
//         - Insecure cryptography (CWE-327)
//         - Path traversal (CWE-22)
//         - Command injection (CWE-78)
//         - Deserialization attacks (CWE-502)
//         - Race conditions (CWE-362)
//         - Buffer overflows (CWE-120)
//         - Information disclosure (CWE-200)

//         ${context.framework ? `Framework: ${context.framework}` : ''}
//         ${context.environment ? `Environment: ${context.environment}` : ''}
        
//         Return JSON array with: type, severity, line, column, message, suggestion, cweId, confidence`
//       },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nCode:\n${code}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     try {
//       const issues = JSON.parse(response);
//       return (Array.isArray(issues) ? issues : [issues]).map(issue => ({
//         ...issue,
//         id: this.generateIssueId(),
//         timestamp: new Date().toISOString()
//       }));
//     } catch {
//       return [{
//         id: this.generateIssueId(),
//         type: 'analysis_error',
//         severity: 'medium',
//         line: 1,
//         column: 1,
//         message: 'Security analysis completed with parsing issues',
//         suggestion: response,
//         confidence: 0.5,
//         timestamp: new Date().toISOString()
//       }];
//     }
//   }

//   async scanDependencies(packageJson: string): Promise<SecurityIssue[]> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `Analyze package.json for security vulnerabilities:
//         - Known CVEs in dependencies
//         - Outdated packages with security patches
//         - Malicious packages
//         - License compliance issues
//         - Dependency confusion risks
        
//         Return JSON array with vulnerability details, CVE IDs, and update recommendations.`
//       },
//       {
//         role: 'user',
//         content: `Package.json:\n${packageJson}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     try {
//       const issues = JSON.parse(response);
//       return (Array.isArray(issues) ? issues : [issues]).map(issue => ({
//         ...issue,
//         id: this.generateIssueId(),
//         type: 'dependency',
//         timestamp: new Date().toISOString()
//       }));
//     } catch {
//       return [{
//         id: this.generateIssueId(),
//         type: 'dependency',
//         severity: 'medium',
//         line: 1,
//         message: 'Dependency scan completed',
//         suggestion: response,
//         timestamp: new Date().toISOString()
//       }];
//     }
//   }

//   async detectHardcodedSecrets(code: string): Promise<SecurityIssue[]> {
//     const secretPatterns = [
//       { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['""][^'""\s]{20,}['""]/gi, type: 'api_key' },
//       { pattern: /(?:password|pwd|pass)\s*[:=]\s*['""][^'""\s]{8,}['""]/gi, type: 'password' },
//       { pattern: /(?:token|jwt|auth)\s*[:=]\s*['""][^'""\s]{20,}['""]/gi, type: 'token' },
//       { pattern: /(?:secret|private[_-]?key)\s*[:=]\s*['""][^'""\s]{20,}['""]/gi, type: 'secret' },
//       { pattern: /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*['""][^'""\s]+['""]/gi, type: 'database_url' },
//       { pattern: /(?:aws[_-]?access[_-]?key|aws[_-]?secret)\s*[:=]\s*['""][^'""\s]+['""]/gi, type: 'aws_credential' }
//     ];

//     const issues: SecurityIssue[] = [];
//     const lines = code.split('\n');

//     secretPatterns.forEach(({ pattern, type }) => {
//       lines.forEach((line, index) => {
//         const matches = line.matchAll(pattern);
//         for (const match of matches) {
//           issues.push({
//             id: this.generateIssueId(),
//             type: 'hardcoded_secret',
//             severity: 'high',
//             line: index + 1,
//             column: match.index || 0,
//             message: `Potential hardcoded ${type} detected`,
//             suggestion: `Use environment variables or secure secret management`,
//             cweId: 'CWE-798',
//             confidence: 0.8,
//             timestamp: new Date().toISOString()
//           });
//         }
//       });
//     });

//     return issues;
//   }

//   async validateCustomRules(code: string, rules: SecurityRule[]): Promise<SecurityIssue[]> {
//     const issues: SecurityIssue[] = [];
//     const lines = code.split('\n');

//     rules.forEach(rule => {
//       lines.forEach((line, index) => {
//         if (rule.pattern.test(line)) {
//           issues.push({
//             id: this.generateIssueId(),
//             type: 'custom_rule',
//             severity: rule.severity,
//             line: index + 1,
//             message: rule.message,
//             suggestion: `Custom rule violation: ${rule.id}`,
//             cweId: rule.cweId,
//             confidence: 0.9,
//             timestamp: new Date().toISOString()
//           });
//         }
//       });
//     });

//     return issues;
//   }

//   async checkCompliance(code: string, standards: string[]): Promise<SecurityIssue[]> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `Check code compliance against security standards: ${standards.join(', ')}.
//         Focus on OWASP Top 10, PCI DSS, SOC 2, and other relevant compliance requirements.
//         Return JSON array with compliance violations.`
//       },
//       {
//         role: 'user',
//         content: `Code to check:\n${code}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     try {
//       const issues = JSON.parse(response);
//       return (Array.isArray(issues) ? issues : [issues]).map(issue => ({
//         ...issue,
//         id: this.generateIssueId(),
//         type: 'compliance',
//         timestamp: new Date().toISOString()
//       }));
//     } catch {
//       return [];
//     }
//   }

//   async generateSecurityFix(issue: SecurityIssue, code: string): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `Generate secure code fixes. Provide:
//         1. Root cause analysis
//         2. Secure implementation
//         3. Best practices explanation
//         4. Testing recommendations`
//       },
//       {
//         role: 'user',
//         content: `Issue: ${issue.message}
//         Type: ${issue.type}
//         Severity: ${issue.severity}
//         Line: ${issue.line}
//         ${issue.cweId ? `CWE: ${issue.cweId}` : ''}
        
//         Code:\n${code}`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }

//   async generateSecurityReport(results: SecurityScanResult): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `Generate a comprehensive security report with:
//         - Executive summary
//         - Risk assessment
//         - Detailed findings
//         - Remediation priorities
//         - Compliance status`
//       },
//       {
//         role: 'user',
//         content: `Security scan results:\n${JSON.stringify(results, null, 2)}`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }

//   addCustomRule(rule: SecurityRule): void {
//     this.customRules.push(rule);
//   }

//   removeCustomRule(ruleId: string): void {
//     this.customRules = this.customRules.filter(rule => rule.id !== ruleId);
//   }

//   private calculateMetrics(issues: SecurityIssue[]): SecurityMetrics {
//     const severityCounts = issues.reduce((acc, issue) => {
//       acc[issue.severity] = (acc[issue.severity] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     const totalIssues = issues.length;
//     const criticalCount = severityCounts.critical || 0;
//     const highCount = severityCounts.high || 0;
//     const mediumCount = severityCounts.medium || 0;
//     const lowCount = severityCounts.low || 0;

//     // Calculate coverage score (simplified metric)
//     const coverageScore = Math.max(0, 100 - (criticalCount * 25 + highCount * 10 + mediumCount * 5 + lowCount * 1));

//     return {
//       totalIssues,
//       criticalCount,
//       highCount,
//       mediumCount,
//       lowCount,
//       coverageScore
//     };
//   }

//   private generateIssueId(): string {
//     return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }
// }
import { AIService } from '../services/aiService';
import { ChatMessage, SecurityIssue } from '../types';

export interface SecurityMetrics {
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  coverageScore: number;
}

export interface SecurityScanResult {
  issues: SecurityIssue[];
  metrics: SecurityMetrics;
  scanTime: number;
  timestamp: string;
  context: SecurityContext;
}

export interface SecurityConfig {
  enableStaticAnalysis?: boolean;
  enableDependencyScanning?: boolean;
  enableSecretsDetection?: boolean;
  enableComplianceChecks?: boolean;
  maxSeverityLevel?: 'high' | 'medium' | 'low';
}

export interface SecurityContext {
  framework?: string;
  environment?: 'development' | 'staging' | 'production';
  complianceStandards?: string[];
  customRules?: SecurityRule[];
}

export interface SecurityRule {
  id: string;
  pattern: RegExp;
  severity: 'high' | 'medium' | 'low';
  message: string;
  cweId?: string;
}

export interface EnhancedSecurityIssue extends SecurityIssue {
  id: string;
  column?: number;
  cweId?: string;
  confidence?: number;
  timestamp: string;
}

export class SecurityAgent {
  private aiService: AIService;
  private config: SecurityConfig;
  private customRules: SecurityRule[] = [];

  constructor(aiService: AIService, config: SecurityConfig = {}) {
    this.aiService = aiService;
    this.config = {
      enableStaticAnalysis: true,
      enableDependencyScanning: true,
      enableSecretsDetection: true,
      enableComplianceChecks: false,
      maxSeverityLevel: 'medium',
      ...config
    };
  }

  async performComprehensiveScan(
    code: string,
    language: string,
    context: SecurityContext = {}
  ): Promise<SecurityScanResult> {
    const results: EnhancedSecurityIssue[] = [];
    const startTime = Date.now();

    // Static code analysis
    if (this.config.enableStaticAnalysis) {
      const staticIssues = await this.analyzeSecurityIssues(code, language, context);
      results.push(...staticIssues);
    }

    // Custom rules validation
    const customIssues = await this.validateCustomRules(code, context.customRules || []);
    results.push(...customIssues);

    // Secrets detection
    if (this.config.enableSecretsDetection) {
      const secretIssues = await this.detectHardcodedSecrets(code);
      results.push(...secretIssues);
    }

    // Compliance checks
    if (this.config.enableComplianceChecks && context.complianceStandards) {
      const complianceIssues = await this.checkCompliance(code, context.complianceStandards);
      results.push(...complianceIssues);
    }

    const scanTime = Date.now() - startTime;
    const metrics = this.calculateMetrics(results);

    return {
      issues: results,
      metrics,
      scanTime,
      timestamp: new Date().toISOString(),
      context
    };
  }

  async analyzeSecurityIssues(
    code: string,
    language: string,
    context: SecurityContext = {}
  ): Promise<EnhancedSecurityIssue[]> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert security analyst. Analyze code for vulnerabilities:

        SECURITY CHECKS:
        - SQL injection (CWE-89)
        - XSS vulnerabilities (CWE-79)
        - Authentication bypass (CWE-287)
        - Authorization flaws (CWE-285)
        - Data validation issues (CWE-20)
        - Insecure cryptography (CWE-327)
        - Path traversal (CWE-22)
        - Command injection (CWE-78)
        - Deserialization attacks (CWE-502)
        - Race conditions (CWE-362)
        - Buffer overflows (CWE-120)
        - Information disclosure (CWE-200)

        ${context.framework ? `Framework: ${context.framework}` : ''}
        ${context.environment ? `Environment: ${context.environment}` : ''}
        
        Return JSON array with: type, severity, line, column, message, suggestion, cweId, confidence`
      },
      {
        role: 'user',
        content: `Language: ${language}\n\nCode:\n${code}`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    try {
      const issues = JSON.parse(response);
      return (Array.isArray(issues) ? issues : [issues]).map(issue => ({
        type: issue.type,
        severity: issue.severity,
        line: issue.line,
        message: issue.message,
        suggestion: issue.suggestion,
        id: this.generateIssueId(),
        column: issue.column,
        cweId: issue.cweId,
        confidence: issue.confidence,
        timestamp: new Date().toISOString()
      }));
    } catch {
      return [{
        type: 'analysis_error',
        severity: 'medium',
        line: 1,
        message: 'Security analysis completed with parsing issues',
        suggestion: response,
        id: this.generateIssueId(),
        column: 1,
        confidence: 0.5,
        timestamp: new Date().toISOString()
      }];
    }
  }

  async scanDependencies(packageJson: string): Promise<EnhancedSecurityIssue[]> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Analyze package.json for security vulnerabilities:
        - Known CVEs in dependencies
        - Outdated packages with security patches
        - Malicious packages
        - License compliance issues
        - Dependency confusion risks
        
        Return JSON array with vulnerability details, CVE IDs, and update recommendations.`
      },
      {
        role: 'user',
        content: `Package.json:\n${packageJson}`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    try {
      const issues = JSON.parse(response);
      return (Array.isArray(issues) ? issues : [issues]).map(issue => ({
        type: 'dependency',
        severity: issue.severity,
        line: issue.line || 1,
        message: issue.message,
        suggestion: issue.suggestion,
        id: this.generateIssueId(),
        column: issue.column,
        cweId: issue.cweId,
        confidence: issue.confidence,
        timestamp: new Date().toISOString()
      }));
    } catch {
      return [{
        type: 'dependency',
        severity: 'medium',
        line: 1,
        message: 'Dependency scan completed',
        suggestion: response,
        id: this.generateIssueId(),
        timestamp: new Date().toISOString()
      }];
    }
  }

  async detectHardcodedSecrets(code: string): Promise<EnhancedSecurityIssue[]> {
    const secretPatterns = [
      { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['""][^'""\s]{20,}['""]/gi, type: 'api_key' },
      { pattern: /(?:password|pwd|pass)\s*[:=]\s*['""][^'""\s]{8,}['""]/gi, type: 'password' },
      { pattern: /(?:token|jwt|auth)\s*[:=]\s*['""][^'""\s]{20,}['""]/gi, type: 'token' },
      { pattern: /(?:secret|private[_-]?key)\s*[:=]\s*['""][^'""\s]{20,}['""]/gi, type: 'secret' },
      { pattern: /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*['""][^'""\s]+['""]/gi, type: 'database_url' },
      { pattern: /(?:aws[_-]?access[_-]?key|aws[_-]?secret)\s*[:=]\s*['""][^'""\s]+['""]/gi, type: 'aws_credential' }
    ];

    const issues: EnhancedSecurityIssue[] = [];
    const lines = code.split('\n');

    secretPatterns.forEach(({ pattern, type }) => {
      lines.forEach((line, index) => {
        const matches = line.matchAll(pattern);
        for (const match of matches) {
          issues.push({
            type: 'hardcoded_secret',
            severity: 'high',
            line: index + 1,
            message: `Potential hardcoded ${type} detected`,
            suggestion: `Use environment variables or secure secret management`,
            id: this.generateIssueId(),
            column: match.index || 0,
            cweId: 'CWE-798',
            confidence: 0.8,
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    return issues;
  }

  async validateCustomRules(code: string, rules: SecurityRule[]): Promise<EnhancedSecurityIssue[]> {
    const issues: EnhancedSecurityIssue[] = [];
    const lines = code.split('\n');

    rules.forEach(rule => {
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          issues.push({
            type: 'custom_rule',
            severity: rule.severity,
            line: index + 1,
            message: rule.message,
            suggestion: `Custom rule violation: ${rule.id}`,
            id: this.generateIssueId(),
            cweId: rule.cweId,
            confidence: 0.9,
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    return issues;
  }

  async checkCompliance(code: string, standards: string[]): Promise<EnhancedSecurityIssue[]> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Check code compliance against security standards: ${standards.join(', ')}.
        Focus on OWASP Top 10, PCI DSS, SOC 2, and other relevant compliance requirements.
        Return JSON array with compliance violations.`
      },
      {
        role: 'user',
        content: `Code to check:\n${code}`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    try {
      const issues = JSON.parse(response);
      return (Array.isArray(issues) ? issues : [issues]).map(issue => ({
        type: 'compliance',
        severity: issue.severity,
        line: issue.line || 1,
        message: issue.message,
        suggestion: issue.suggestion,
        id: this.generateIssueId(),
        column: issue.column,
        cweId: issue.cweId,
        confidence: issue.confidence,
        timestamp: new Date().toISOString()
      }));
    } catch {
      return [];
    }
  }

  async generateSecurityFix(issue: EnhancedSecurityIssue, code: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Generate secure code fixes. Provide:
        1. Root cause analysis
        2. Secure implementation
        3. Best practices explanation
        4. Testing recommendations`
      },
      {
        role: 'user',
        content: `Issue: ${issue.message}
        Type: ${issue.type}
        Severity: ${issue.severity}
        Line: ${issue.line}
        ${issue.cweId ? `CWE: ${issue.cweId}` : ''}
        
        Code:\n${code}`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }

  async generateSecurityReport(results: SecurityScanResult): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Generate a comprehensive security report with:
        - Executive summary
        - Risk assessment
        - Detailed findings
        - Remediation priorities
        - Compliance status`
      },
      {
        role: 'user',
        content: `Security scan results:\n${JSON.stringify(results, null, 2)}`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }

  addCustomRule(rule: SecurityRule): void {
    this.customRules.push(rule);
  }

  removeCustomRule(ruleId: string): void {
    this.customRules = this.customRules.filter(rule => rule.id !== ruleId);
  }

  private calculateMetrics(issues: EnhancedSecurityIssue[]): SecurityMetrics {
    const severityCounts = issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalIssues = issues.length;
    const criticalCount = severityCounts.critical || 0;
    const highCount = severityCounts.high || 0;
    const mediumCount = severityCounts.medium || 0;
    const lowCount = severityCounts.low || 0;

    // Calculate coverage score (simplified metric)
    const coverageScore = Math.max(0, 100 - (criticalCount * 25 + highCount * 10 + mediumCount * 5 + lowCount * 1));

    return {
      totalIssues,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      coverageScore
    };
  }

  private generateIssueId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}