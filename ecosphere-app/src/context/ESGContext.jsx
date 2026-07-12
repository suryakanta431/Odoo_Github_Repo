import { useEffect, useState } from 'react';
import { ESGContext } from './ESGContextValue';
import { addComplianceIssue as addComplianceIssueToList, calculateOverallScore, clamp, getChallengeOutcome, updateComplianceIssueStatus } from './esgLogic';

const defaultSettings = {
  autoEmissionCalc: true,
  evidenceRequired: true,
  badgeAutoAward: true,
};

const defaultDepartments = [
  { id: 1, name: 'Engineering', env: 88, soc: 75, gov: 90 },
  { id: 2, name: 'Operations', env: 62, soc: 68, gov: 72 },
  { id: 3, name: 'Marketing', env: 92, soc: 85, gov: 80 },
];

const defaultComplianceIssues = [
  { id: 1, desc: 'Renewable energy audit pending', owner: 'Sarah J.', dueDate: '2026-07-20', status: 'Open' },
  { id: 2, desc: 'Supply chain footprint mismatch', owner: 'Raj P.', dueDate: '2026-07-01', status: 'Overdue' },
];

const storageKey = 'ecosphere-state';

const loadStoredState = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Unable to read stored ESG state', error);
    return null;
  }
};

const createInitialState = () => ({
  settings: defaultSettings,
  departments: defaultDepartments,
  userXP: 1450,
  unlockedBadges: ['Eco Pioneer'],
  recentNotification: null,
  redeemedRewards: [],
  challengeStatus: 'idle',
  submissionModalOpen: false,
  pendingSubmission: false,
  evidenceAttached: false,
  complianceIssues: defaultComplianceIssues,
  lastSyncedAt: new Date().toISOString(),
});

export const ESGProvider = ({ children }) => {
  const storedState = loadStoredState();
  const initialState = storedState || createInitialState();

  const [settings, setSettings] = useState(initialState.settings);
  const [departments, setDepartments] = useState(initialState.departments);
  const [userXP, setUserXP] = useState(initialState.userXP);
  const [unlockedBadges, setUnlockedBadges] = useState(initialState.unlockedBadges);
  const [recentNotification, setRecentNotification] = useState(initialState.recentNotification);
  const [redeemedRewards, setRedeemedRewards] = useState(initialState.redeemedRewards);
  const [challengeStatus, setChallengeStatus] = useState(initialState.challengeStatus);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(initialState.submissionModalOpen);
  const [pendingSubmission, setPendingSubmission] = useState(initialState.pendingSubmission);
  const [evidenceAttached, setEvidenceAttached] = useState(initialState.evidenceAttached);
  const [complianceIssues, setComplianceIssues] = useState(initialState.complianceIssues);
  const [lastSyncedAt, setLastSyncedAt] = useState(initialState.lastSyncedAt);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        settings,
        departments,
        userXP,
        unlockedBadges,
        redeemedRewards,
        challengeStatus,
        evidenceAttached,
        complianceIssues,
        lastSyncedAt,
      })
    );
  }, [settings, departments, userXP, unlockedBadges, redeemedRewards, challengeStatus, evidenceAttached, complianceIssues, lastSyncedAt]);

  const overallScore = calculateOverallScore(departments);

  const redeemReward = (rewardName, cost) => {
    if (userXP >= cost && !redeemedRewards.includes(rewardName)) {
      setUserXP((prev) => prev - cost);
      setRedeemedRewards((prev) => [...prev, rewardName]);
      setRecentNotification({
        type: 'reward',
        message: `Successfully redeemed: ${rewardName}!`,
      });
      setLastSyncedAt(new Date().toISOString());
      return true;
    }
    return false;
  };

  const startApprovalFlow = (message) => {
    setChallengeStatus('reviewing');
    setPendingSubmission(false);
    setSubmissionModalOpen(false);
    setRecentNotification({
      type: 'approval',
      message,
    });
  };

  const submitChallenge = () => {
    if (challengeStatus === 'reviewing') return false;

    if (settings.evidenceRequired) {
      setPendingSubmission(true);
      setSubmissionModalOpen(true);
      return 'evidence-required';
    }

    startApprovalFlow('Challenge submitted. Manager review is now in progress.');
    return true;
  };

  const attachEvidenceAndSubmit = (fileName = 'evidence.pdf') => {
    setEvidenceAttached(true);
    setRecentNotification({
      type: 'approval',
      message: `Evidence uploaded: ${fileName}. Challenge is now under review.`,
    });
    startApprovalFlow('Evidence received. Challenge is now under review.');
  };

  const closeSubmissionModal = () => {
    setSubmissionModalOpen(false);
    setPendingSubmission(false);
  };

  const updateIssueStatus = (issueId, nextStatus) => {
    setComplianceIssues((prevIssues) => updateComplianceIssueStatus(prevIssues, issueId, nextStatus));
    setRecentNotification({
      type: 'approval',
      message: `Compliance issue updated to ${nextStatus}.`,
    });
    setLastSyncedAt(new Date().toISOString());
  };

  const addComplianceIssue = (newIssue) => {
    setComplianceIssues((prevIssues) => addComplianceIssueToList(prevIssues, newIssue));
    setRecentNotification({
      type: 'approval',
      message: `New compliance issue added for ${newIssue.owner}.`,
    });
    setLastSyncedAt(new Date().toISOString());
  };

  const refreshLiveMetrics = () => {
    setDepartments((prevDepartments) =>
      prevDepartments.map((department, index) => ({
        ...department,
        env: clamp(department.env + (index % 2 === 0 ? 2 : -1) + (settings.autoEmissionCalc ? 1 : 0), 54, 98),
        soc: clamp(department.soc + (index === 1 ? 1 : 0) + (settings.badgeAutoAward ? 1 : 0), 55, 98),
        gov: clamp(department.gov + (settings.evidenceRequired ? 1 : 0) + (index === 2 ? 1 : 0), 56, 98),
      }))
    );
    setUserXP((prev) => prev + 25);
    setComplianceIssues((prevIssues) =>
      prevIssues.map((issue, index) => ({
        ...issue,
        status: index === 1 && issue.status !== 'Resolved' ? 'Monitoring' : issue.status,
      }))
    );
    setLastSyncedAt(new Date().toISOString());
    setRecentNotification({
      type: 'approval',
      message: 'Live ESG metrics refreshed and synced across all departments.',
    });
  };

  useEffect(() => {
    if (settings.badgeAutoAward && userXP >= 1500 && !unlockedBadges.includes('Carbon Crusader')) {
      const timer = window.setTimeout(() => {
        setUnlockedBadges((prev) => [...prev, 'Carbon Crusader']);
        setRecentNotification({
          type: 'badge',
          message: '🏆 Milestone Achieved: Carbon Crusader unlocked!',
        });
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [settings.badgeAutoAward, userXP, unlockedBadges]);

  useEffect(() => {
    if (challengeStatus !== 'reviewing') return undefined;

    const timer = window.setTimeout(() => {
      setUserXP((prev) => prev + 60);
      setEvidenceAttached(false);
      setChallengeStatus('complete');
      setRecentNotification({
        type: 'badge',
        message: 'Challenge approved! +60 XP credited.',
      });
      setLastSyncedAt(new Date().toISOString());
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [challengeStatus]);

  return (
    <ESGContext.Provider value={{
      settings,
      setSettings,
      departments,
      setDepartments,
      userXP,
      setUserXP,
      unlockedBadges,
      setUnlockedBadges,
      complianceIssues,
      setComplianceIssues,
      redeemedRewards,
      overallScore,
      redeemReward,
      recentNotification,
      setRecentNotification,
      challengeStatus,
      submissionModalOpen,
      pendingSubmission,
      evidenceAttached,
      submitChallenge,
      attachEvidenceAndSubmit,
      closeSubmissionModal,
      updateIssueStatus,
      addComplianceIssue,
      refreshLiveMetrics,
      lastSyncedAt,
      challengeOutcome: getChallengeOutcome(settings, challengeStatus),
    }}>
      {children}
    </ESGContext.Provider>
  );
};