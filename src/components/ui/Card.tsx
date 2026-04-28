import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-md border border-gray-100
        ${hoverable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
