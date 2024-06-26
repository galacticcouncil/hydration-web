type Props = {
  className?: string;
};

export default function DocumentIcon({ className }: Props) {
  return (
    <svg
      width="29"
      height="32"
      viewBox="0 0 29 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M28.75 11.2501V30.2382C28.75 31.1227 28.0457 31.8334 27.1771 31.8334H1.82288C0.954504 31.8334 0.25 31.1304 0.25 30.2631V1.7371C0.25 0.887656 0.957655 0.166748 1.83058 0.166748H17.6667V9.66675C17.6667 10.5412 18.3755 11.2501 19.25 11.2501H28.75ZM28.75 8.08341H20.8333V0.171783L28.75 8.08341Z"
        fill="currentColor"
      />
    </svg>
  );
}
