export const ACCEPTED_EVIDENCE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export const MAX_EVIDENCE_SIZE_BYTES = 5 * 1024 * 1024;

export function calculateOverallScore(departments) {
  if (!departments.length) return 0;
  const totals = departments.reduce(
    (acc, department) => ({
      env: acc.env + department.env,
      soc: acc.soc + department.soc,
      gov: acc.gov + department.gov,
    }),
    { env: 0, soc: 0, gov: 0 }
  );

  const count = departments.length;
  const avgEnv = totals.env / count;
  const avgSoc = totals.soc / count;
  const avgGov = totals.gov / count;

  return Math.round(avgEnv * 0.4 + avgSoc * 0.3 + avgGov * 0.3);
}

export function validateEvidenceFile(file) {
  if (!file) {
    return { isValid: false, reason: 'No evidence file was selected.' };
  }

  if (file.size > MAX_EVIDENCE_SIZE_BYTES) {
    return { isValid: false, reason: 'Evidence file exceeds the 5 MB limit.' };
  }

  if (!ACCEPTED_EVIDENCE_TYPES.includes(file.type)) {
    return { isValid: false, reason: 'Please upload a PDF, Word document, or image file.' };
  }

  return { isValid: true, reason: '' };
}

export function getChallengeOutcome(settings, challengeStatus) {
  if (challengeStatus === 'reviewing') return 'reviewing';
  if (settings.evidenceRequired) return 'evidence-required';
  return 'ready';
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function updateComplianceIssueStatus(issues, issueId, nextStatus) {
  return issues.map((issue) => (issue.id === issueId ? { ...issue, status: nextStatus } : issue));
}
