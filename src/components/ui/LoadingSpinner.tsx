export const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="w-8 h-8 border-[3px] border-[#E8E8E8] border-t-[#2977DC] rounded-full animate-spin"
      role="status"
      aria-label="로딩중"
    />
  );
};
