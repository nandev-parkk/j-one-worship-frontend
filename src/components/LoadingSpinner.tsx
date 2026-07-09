const spinnerStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: '3px solid #E8E8E8',
  borderTop: '3px solid #2977DC',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

export const LoadingSpinner: React.FC = () => {
  if (!document.getElementById('spin-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spin-keyframes';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  return (
    <div
      style={spinnerStyle}
      role="status"
      aria-label="로딩중"
    />
  );
};
