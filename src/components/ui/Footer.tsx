export const Footer: React.FC<{ className?: string }> = ({ className }) => (
  <footer
    className={["flex items-center justify-center px-6 py-4 text-xs text-[#A9A9A9]", className].filter(Boolean).join(" ")}
  >
    J-One Worship &copy; {new Date().getFullYear()}
  </footer>
);
