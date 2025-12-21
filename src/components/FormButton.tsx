import { ButtonHTMLAttributes, ReactNode } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export const FormButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: FormButtonProps) => {
  const baseStyles = 'py-3 px-6 text-sm transition-opacity duration-200 disabled:opacity-40';
  
  const variants = {
    primary: 'bg-foreground text-background',
    secondary: 'bg-transparent text-muted-foreground',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
