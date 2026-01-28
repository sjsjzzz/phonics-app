import React, { useState } from 'react';

export default function LoginScreen({ users, onLogin, onAddUser, onDeleteUser }) {
  const [inputName, setInputName] = useState('');
  const [showNewUser, setShowNewUser] = useState(users.length === 0);

  const handleAdd = () => {
    const name = inputName.trim();
    if (!name) return;
    if (users.some((u) => u.name === name)) return;
    onAddUser(name);
    setInputName('');
  };

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
        <div className="text-6xl mb-4 animate-bounce">📚</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">파닉스 마스터</h1>
        <p className="text-gray-500 mb-6">재미있게 영어 읽기를 배워요!</p>

        {/* Existing users */}
        {users.length > 0 && !showNewUser && (
          <div className="space-y-3 mb-4">
            {users.map((user) => (
              <div key={user.name} className="flex items-center gap-2">
                <button
                  onClick={() => onLogin(user.name)}
                  className="flex-1 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl text-left active:scale-95 transition-transform min-h-[44px]"
                >
                  <div className="font-bold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">⭐ {user.stars} | 레슨 {Object.keys(user.completedLessons).length}개 완료</div>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`${user.name}의 데이터를 삭제할까요?`)) onDeleteUser(user.name);
                  }}
                  className="bg-red-100 text-red-500 p-3 rounded-xl min-w-[44px] min-h-[44px] active:scale-95 transition-transform"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowNewUser(true)}
              className="w-full bg-green-100 text-green-600 p-3 rounded-xl font-medium min-h-[44px] active:scale-95 transition-transform"
            >
              + 새 사용자 추가
            </button>
          </div>
        )}

        {/* New user form */}
        {(showNewUser || users.length === 0) && (
          <div>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="이름을 입력하세요"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl mb-4 text-center focus:border-blue-400 focus:outline-none transition-colors"
              maxLength={10}
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={!inputName.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl text-xl font-bold disabled:opacity-50 active:scale-95 transition-transform shadow-lg min-h-[44px]"
            >
              🚀 시작하기!
            </button>
            {users.length > 0 && (
              <button
                onClick={() => setShowNewUser(false)}
                className="w-full mt-2 text-gray-500 p-2"
              >
                ← 사용자 목록으로
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
