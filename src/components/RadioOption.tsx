interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export const RadioOption = ({ name, value, label, checked, onChange }: RadioOptionProps) => {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div className={`w-4 h-4 rounded-full border transition-colors duration-200 ${
        checked ? 'border-foreground bg-foreground' : 'border-muted-foreground group-hover:border-foreground'
      }`}>
        {checked && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-background" />
          </div>
        )}
      </div>
      <span className={`text-sm transition-colors duration-200 ${
        checked ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
      }`}>
        {label}
      </span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
    </label>
  );
};
