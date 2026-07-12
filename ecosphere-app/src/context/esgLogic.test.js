import { describe, expect, it } from 'vitest';
import {
  addComplianceIssue,
  calculateOverallScore,
  formatDateForExport,
  getChallengeOutcome,
  updateComplianceIssueStatus,
  validateEvidenceFile,
} from './esgLogic';

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

  it('formats due dates into compact export-friendly values', () => {
    expect(formatDateForExport('2026-07-20')).toBe('7/20/2026');
    expect(formatDateForExport('')).toBe('');
    expect(formatDateForExport('not-a-date')).toBe('not-a-date');
  });

  it('adds new compliance issues with a default open status', () => {
    const issues = [{ id: 1, desc: 'Existing item', owner: 'Ana', dueDate: '2026-07-19', status: 'Open' }];

    const updated = addComplianceIssue(issues, { desc: 'New item', owner: 'Mina', dueDate: '2026-07-25' });

    expect(updated[0].desc).toBe('New item');
    expect(updated[0].owner).toBe('Mina');
    expect(updated[0].status).toBe('Open');
    expect(updated).toHaveLength(2);
  });
});
