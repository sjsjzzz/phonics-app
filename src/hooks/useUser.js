import { useState, useCallback, useEffect } from 'react';
import { loadUsers, saveUsers } from '../utils/storage';
import { LEVELS } from '../utils/constants';

const createUser = (name) => ({
  name,
  stars: 0,
  completedLessons: {},
  createdAt: Date.now(),
});

export function useUser() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = loadUsers();
    if (saved.length > 0) setUsers(saved);
  }, []);

  useEffect(() => {
    if (users.length > 0) saveUsers(users);
  }, [users]);

  const addUser = useCallback((name) => {
    const user = createUser(name);
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    return user;
  }, []);

  const deleteUser = useCallback((name) => {
    setUsers((prev) => prev.filter((u) => u.name !== name));
    if (currentUser?.name === name) setCurrentUser(null);
  }, [currentUser]);

  const selectUser = useCallback((name) => {
    setUsers((prev) => {
      const user = prev.find((u) => u.name === name);
      if (user) setCurrentUser(user);
      return prev;
    });
  }, []);

  const updateCurrentUser = useCallback((updater) => {
    setUsers((prev) => {
      if (!currentUser) return prev;
      const updated = prev.map((u) => {
        if (u.name === currentUser.name) {
          const newUser = typeof updater === 'function' ? updater(u) : { ...u, ...updater };
          setCurrentUser(newUser);
          return newUser;
        }
        return u;
      });
      return updated;
    });
  }, [currentUser]);

  const addStars = useCallback((amount) => {
    updateCurrentUser((u) => ({ ...u, stars: u.stars + amount }));
  }, [updateCurrentUser]);

  const markLessonComplete = useCallback((stage, lesson) => {
    const key = `${stage}-${lesson}`;
    updateCurrentUser((u) => ({
      ...u,
      completedLessons: { ...u.completedLessons, [key]: true },
    }));
  }, [updateCurrentUser]);

  const isLessonComplete = useCallback((stage, lesson) => {
    return !!currentUser?.completedLessons[`${stage}-${lesson}`];
  }, [currentUser]);

  const getLevel = useCallback(() => {
    const count = Object.keys(currentUser?.completedLessons || {}).length;
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (count >= l.min) level = l;
    }
    return level;
  }, [currentUser]);

  const getStageProgress = useCallback((stageNum, totalLessons) => {
    if (!currentUser) return { completed: 0, total: totalLessons };
    let completed = 0;
    for (let i = 0; i < totalLessons; i++) {
      if (currentUser.completedLessons[`${stageNum}-${i}`]) completed++;
    }
    return { completed, total: totalLessons };
  }, [currentUser]);

  return {
    users,
    currentUser,
    addUser,
    deleteUser,
    selectUser,
    addStars,
    markLessonComplete,
    isLessonComplete,
    getLevel,
    getStageProgress,
  };
}
