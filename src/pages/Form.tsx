import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FormScreen } from '@/components/FormScreen';
import { FormInput, FormTextArea } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { RadioOption } from '@/components/RadioOption';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  address: string;
  likes: string;
  listening: string;
  flower: string;
  colour: string;
  song: string;
  language: string;
  hindiUnderstanding: string;
}

const Form = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    address: '',
    likes: '',
    listening: '',
    flower: '',
    colour: '',
    song: '',
    language: '',
    hindiUnderstanding: '',
  });
  const { toast } = useToast();

  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    address: useRef<HTMLTextAreaElement>(null),
    likes: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 0) inputRefs.name.current?.focus();
      if (step === 1) inputRefs.address.current?.focus();
      if (step === 3) inputRefs.likes.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, [step]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextAction: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      nextAction();
    }
  };

  const validateStep0 = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        description: "please fill in the required fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep1 = () => {
    if (!formData.address.trim()) {
      toast({
        description: "please add your address",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = () => {
    // Store in localStorage for now (will be replaced with Supabase)
    const submissions = JSON.parse(localStorage.getItem('letterSignups') || '[]');
    submissions.push({ ...formData, submittedAt: new Date().toISOString() });
    localStorage.setItem('letterSignups', JSON.stringify(submissions));
    nextStep();
  };

  const screens = [
    // Screen 0: Basics
    <FormScreen key="basics">
      <p className="text-sm text-muted-foreground mb-8">let's start simple.</p>
      
      <FormInput
        ref={inputRefs.name}
        placeholder="what should i call you"
        value={formData.name}
        onChange={e => updateField('name', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => inputRefs.email.current?.focus())}
      />
      <FormInput
        ref={inputRefs.email}
        type="email"
        placeholder="only for letter updates"
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => inputRefs.phone.current?.focus())}
      />
      <FormInput
        ref={inputRefs.phone}
        type="tel"
        placeholder="in case the letter needs help"
        value={formData.phone}
        onChange={e => updateField('phone', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => {})}
      />
      <FormInput
        placeholder="so i know who you are (optional)"
        value={formData.instagram}
        onChange={e => updateField('instagram', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => validateStep0() && nextStep())}
      />
      
      <div className="mt-8">
        <FormButton onClick={() => validateStep0() && nextStep()}>next</FormButton>
      </div>
    </FormScreen>,

    // Screen 1: Address
    <FormScreen key="address">
      <p className="text-sm text-muted-foreground mb-2">where should the letter go</p>
      <p className="text-xs text-muted-foreground mb-8 opacity-60">
        house number, street, landmark, city, pincode.<br />
        anything that helps it reach you safely.
      </p>
      
      <FormTextArea
        ref={inputRefs.address}
        placeholder="your address"
        value={formData.address}
        onChange={e => updateField('address', e.target.value)}
      />
      
      <div className="mt-8">
        <FormButton onClick={() => validateStep1() && nextStep()}>next</FormButton>
      </div>
    </FormScreen>,

    // Screen 2: Pause
    <FormScreen key="pause">
      <div className="space-y-6">
        <p className="text-sm breathable">
          from here on, everything is optional.<br />
          this is just me trying to tune the letter to you.
        </p>
      </div>
      
      <div className="mt-12">
        <FormButton onClick={nextStep}>continue</FormButton>
      </div>
    </FormScreen>,

    // Screen 3: Cues
    <FormScreen key="cues">
      <p className="text-sm text-muted-foreground mb-8">a few things about you</p>
      
      <FormInput
        ref={inputRefs.likes}
        placeholder="films, streets, objects, silence, chaos"
        value={formData.likes}
        onChange={e => updateField('likes', e.target.value)}
      />
      <FormInput
        placeholder="genres, moods, artists"
        value={formData.listening}
        onChange={e => updateField('listening', e.target.value)}
      />
      <FormInput
        placeholder="or one you don't hate"
        value={formData.flower}
        onChange={e => updateField('flower', e.target.value)}
      />
      <FormInput
        placeholder="or one you keep coming back to"
        value={formData.colour}
        onChange={e => updateField('colour', e.target.value)}
      />
      <FormInput
        placeholder="one is enough"
        value={formData.song}
        onChange={e => updateField('song', e.target.value)}
      />
      
      <div className="mt-8 flex gap-4">
        <FormButton onClick={nextStep}>next</FormButton>
        <FormButton variant="secondary" onClick={nextStep}>skip</FormButton>
      </div>
    </FormScreen>,

    // Screen 4: Language
    <FormScreen key="language">
      <p className="text-sm text-muted-foreground mb-8">how should i write</p>
      
      <div className="mb-8">
        <p className="text-xs text-muted-foreground mb-4 opacity-60">language you're most comfortable with</p>
        <div className="space-y-1">
          {['english', 'hindi', 'both', 'something else'].map(option => (
            <RadioOption
              key={option}
              name="language"
              value={option}
              label={option}
              checked={formData.language === option}
              onChange={value => updateField('language', value)}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-xs text-muted-foreground mb-1 opacity-60">do you understand hindi</p>
        <p className="text-xs text-muted-foreground mb-4 opacity-40">this changes how i write</p>
        <div className="space-y-1">
          {['yes', 'a little', 'no'].map(option => (
            <RadioOption
              key={option}
              name="hindiUnderstanding"
              value={option}
              label={option}
              checked={formData.hindiUnderstanding === option}
              onChange={value => updateField('hindiUnderstanding', value)}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <FormButton onClick={nextStep}>next</FormButton>
      </div>
    </FormScreen>,

    // Screen 5: Closing
    <FormScreen key="closing">
      <div className="space-y-6">
        <p className="text-sm breathable">
          once you submit this,<br />
          nothing happens immediately.
        </p>
        <p className="text-sm breathable">
          sometime later,<br />
          a letter will.
        </p>
      </div>
      
      <div className="mt-12">
        <FormButton onClick={handleSubmit}>okay, write to me</FormButton>
      </div>
    </FormScreen>,

    // Screen 6: Confirmation
    <FormScreen key="confirmation">
      <div className="space-y-4">
        <p className="text-sm breathable">
          noted.<br />
          i'll take it from here.
        </p>
      </div>
    </FormScreen>,
  ];

  return (
    <div className="h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {screens[step]}
      </AnimatePresence>
    </div>
  );
};

export default Form;
