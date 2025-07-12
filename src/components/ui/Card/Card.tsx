import React from 'react';
import './Card.scss';

interface CardProps {
  children: React.ReactNode;
  isOwn?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, isOwn }) => {
  return <div className={`card ${isOwn ? 'card--own' : ''}`}>{children}</div>;
};
