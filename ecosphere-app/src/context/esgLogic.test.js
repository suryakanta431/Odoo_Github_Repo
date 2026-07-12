import { describe, expect, it } from 'vitest';
import { calculateOverallScore, getChallengeOutcome, updateComplianceIssueStatus, validateEvidenceFile } from './esgLogic';

describe('esgLogic', () => {
  it('calculates weighted ESG score from department metrics', () => {
    const departments = [
      { env: 90, soc: 80, gov: 85 },
      { env: 70, soc: 75, gov: 80 },
    ];

    expect(calculateOverallScore(departments)).toBe(80);
  });

  it('requires evidence when enabled', () => {
    expect(getChallengeOutcome({ evidenceRequired: true }, 'idle')).toBe('evidence-required');
    expect(getChallengeOutcome({ evidenceRequired: false }, 'idle')).toBe('ready');
  });

  it('validates evidence files and rejects unsupported files', () => {
    const validFile = new File(['ok'], 'proof.pdf', { type: 'application/pdf' });
    const invalidFile = new File(['bad'], 'proof.txt', { type: 'text/plain' });

    expect(validateEvidenceFile(validFile).isValid).toBe(true);
    expect(validateEvidenceFile(invalidFile).isValid).toBe(false);
  });

  it('updates issue status in place for the selected compliance item', () => {
    const issues = [
      { id: 1, desc: 'Audit pending', status: 'Open' },
      { id: 2, desc: 'Mismatch', status: 'Overdue' },
    ];

    const updated = updateComplianceIssueStatus(issues, 2, 'Resolved');

    expect(updated[1].status).toBe('Resolved');
    expect(updated[0].status).toBe('Open');
  });
});
