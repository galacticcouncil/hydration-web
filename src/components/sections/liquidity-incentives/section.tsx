import LiquidityIncentivesArches from "./arches";

export default function LiquidityIncentivesSection() {
  return (
    <section
      className="~pt-10/[6.625rem] rounded-t-[4rem] bg-[url('/square.svg')] bg-repeat
    bg-[center_calc(20px)]"
      style={{
        // clamp from 70px to 150px
        backgroundSize: "clamp(4.375rem, 0.804rem + 8.929vi, 9.375rem)",
      }}
    >
      <div className="flex flex-col mx-auto container">
        <LiquidityIncentivesArches />
        <div className="~pt-24/36 bg-beige" />
      </div>
    </section>
  );
}
