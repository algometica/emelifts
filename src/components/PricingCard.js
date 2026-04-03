const PricingCard = ({ plan }) => {
  return (
    <div className="relative">
      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enroll in ${plan.name}`}
        className="block rounded-[18px] border border-black/[0.08] bg-[#f5f5f7] px-8 py-10 md:px-10 md:py-12 [@media(hover:hover)]:hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
      >
        {plan.badge && (
          <p className="mb-6 text-center text-[12px] font-medium uppercase tracking-[0.06em] text-[#6e6e73]">
            {plan.badge}
          </p>
        )}
        <h3 className="mb-8 text-center text-[21px] font-semibold text-[#1d1d1f] md:text-[24px]">
          {plan.name}
        </h3>
        <ul className="mx-auto mb-10 max-w-sm space-y-4 text-left">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className="border-l-2 border-black/[0.12] pl-4 text-[15px] leading-snug text-[#6e6e73] md:text-[17px]"
            >
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <span className="btn-primary pointer-events-none text-center">Enroll</span>
        </div>
      </a>
    </div>
  );
};

export default PricingCard;
