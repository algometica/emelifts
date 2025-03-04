const PricingCard = ({ plan }) => {
    return (
      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"  // Make the link fill the card
      >
        <div className="dark-card rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
          <div className="p-6 flex-grow">  {/* flex-grow makes the content fill available space */}
            <h3 className="text-2xl font-semibold mb-2 dark-card-title">
              {plan.name}
            </h3>
            
            <ul className="mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-gray-300 dark-card-text">{feature}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-700 text-center">
            <span className="dark-card-link font-semibold hover:text-pink-300 transition-colors duration-200">
              Learn More
            </span>
          </div>
        </div>
      </a>
    );
  };
  
  export default PricingCard;