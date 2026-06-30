const PricingCard = ({ plan, dark = false, bgClass }) => {
  const cardBg = bgClass ?? (dark ? 'bg-[#1d1d1f]' : 'bg-[#f5f5f7]');
  const isColored = dark || !!bgClass;
  const badgeColor = isColored ? 'text-white/40' : 'text-[#6e6e73]';
  const headingColor = isColored ? 'text-white' : 'text-[#1d1d1f]';
  const priceColor = isColored ? 'text-white/80' : 'text-[#1d1d1f]';
  const metaColor = isColored ? 'text-white/40' : 'text-[#6e6e73]';
  const featureColor = isColored ? 'text-white/60' : 'text-[#6e6e73]';
  const borderColor = isColored ? 'border-white/[0.18]' : 'border-black/[0.12]';
  const cardBorder = isColored ? 'border-white/[0.15]' : 'border-black/[0.08]';
  const btnClass = isColored ? 'btn-primary-dark' : 'btn-primary';

  return (
    <div className="relative">
      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${plan.cta ?? 'Enroll'} in ${plan.name}`}
        className={`block rounded-[18px] border ${cardBorder} ${cardBg} px-8 py-10 md:px-10 md:py-12 [@media(hover:hover)]:hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]`}
      >
        {plan.badge && (
          <p className={`mb-6 text-center text-[12px] font-medium uppercase tracking-[0.06em] ${badgeColor}`}>
            {plan.badge}
          </p>
        )}
        <h3 className={`mb-2 text-center text-[21px] font-semibold ${headingColor} md:text-[24px]`}>
          {plan.name}
        </h3>
        {plan.price && (
          <p className={`mb-1 text-center text-[15px] font-medium ${priceColor}`}>{plan.price}</p>
        )}
        {plan.meta && (
          <p className={`mb-8 text-center text-[13px] ${metaColor}`}>{plan.meta}</p>
        )}
        {!plan.price && <div className="mb-8" />}
        <ul className="mx-auto mb-10 max-w-sm space-y-4 text-left">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className={`border-l-2 ${borderColor} pl-4 text-[15px] leading-snug ${featureColor} md:text-[17px]`}
            >
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <span className={`${btnClass} pointer-events-none text-center`}>{plan.cta ?? 'Enroll'}</span>
        </div>
      </a>
    </div>
  );
};

export default PricingCard;
