import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="mb-6">
        {label && (
          <label className="block text-sm text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-transparent border-b border-border py-3 text-foreground focus:border-foreground transition-colors duration-200 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export const FormTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="mb-6">
        {label && (
          <label className="block text-sm text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-transparent border-b border-border py-3 text-foreground focus:border-foreground transition-colors duration-200 resize-none ${className}`}
          rows={4}
          {...props}
        />
      </div>
    );
  }
);

FormTextArea.displayName = 'FormTextArea';
