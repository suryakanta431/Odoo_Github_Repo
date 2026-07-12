import { useEffect, useState } from 'react';
import { ESGContext } from './ESGContextValue';

export const ESGProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    autoEmissionCalc: true,
    evidenceRequired: true,
    badgeAutoAward: true,
  });

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', env: 88, soc: 75, gov: 90 },
    { id: 2, name: 'Operations', env: 62, soc: 68, gov: 72 },
    { id: 3, name: 'Marketing', env: 92, soc: 85, gov: 80 },
  ]);

  const [userXP, setUserXP] = useState(1450);
  const [unlockedBadges, setUnlockedBadges] = useState(['Eco Pioneer']);
  const [recentNotification, setRecentNotification] = useState(null);

  const [complianceIssues, setComplianceIssues] = useState([
    { id: 1, desc: 'Renewable energy audit pending', owner: 'Sarah J.', dueDate: '2026-07-20', status: 'Open' },
    { id: 2, desc: 'Supply chain footprint mismatch', owner: 'Raj P.', dueDate: '2026-07-01', status: 'Overdue' },
  ]);

  const calculateOverallScore = () => {
    if (departments.length === 0) return 0;
    const totals = departments.reduce(
      (acc, d) => ({ env: acc.env + d.env, soc: acc.soc + d.soc, gov: acc.gov + d.gov }),
      { env: 0, soc: 0, gov: 0 }
    );
    const count = departments.length;
    const avgEnv = totals.env / count;
    const avgSoc = totals.soc / count;
    const avgGov = totals.gov / count;

    return Math.round(avgEnv * 0.4 + avgSoc * 0.3 + avgGov * 0.3);
  };

  const redeemReward = (rewardName, cost) => {
    if (userXP >= cost) {
      setUserXP((prev) => prev - cost);
      setRecentNotification({
        type: 'reward',
        message: `Successfully redeemed: ${rewardName}!`,
      });
      return true;
    }
    return false;
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
      overallScore: calculateOverallScore(),
      redeemReward,
      recentNotification,
      setRecentNotification,
    }}>
      {children}
    </ESGContext.Provider>
  );
};