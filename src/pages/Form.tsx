import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FormScreen } from '@/components/FormScreen';
import { FormInput, FormTextArea } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { RadioOption } from '@/components/RadioOption';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { 
  signupSchema, 
  checkRateLimit, 
  recordSubmission, 
  hasAlreadySubmitted, 
  markAsSubmitted 
} from '@/lib/validation';

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

const LANGUAGE_OPTIONS = ['english', 'hindi', 'both', 'something else'] as const;
const HINDI_UNDERSTANDING_OPTIONS = ['yes', 'a little', 'no'] as const;

const Form = () => {
  const [step, setStep] = useState(() => hasAlreadySubmitted() ? -1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const likesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 0) nameRef.current?.focus();
      if (step === 1) addressRef.current?.focus();
      if (step === 3) likesRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, [step]);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, nextAction: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      nextAction();
    }
  }, []);

  const validateStep0 = useCallback(() => {
    try {
      // Validate basic fields for step 0
      const basicSchema = signupSchema.pick({ name: true, email: true, phone: true, instagram: true });
      basicSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        instagram: formData.instagram,
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          description: error.errors[0].message.toLowerCase(),
          variant: "destructive",
        });
      }
      return false;
    }
  }, [formData.name, formData.email, formData.phone, formData.instagram, toast]);

  const validateStep1 = useCallback(() => {
    try {
      const addressSchema = signupSchema.pick({ address: true });
      addressSchema.parse({ address: formData.address });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          description: error.errors[0].message.toLowerCase(),
          variant: "destructive",
        });
      }
      return false;
    }
  }, [formData.address, toast]);

  const nextStep = useCallback(() => setStep(prev => prev + 1), []);

  const handleSubmit = useCallback(async () => {
    // Check rate limit
    const { allowed, remainingSeconds } = checkRateLimit();
    if (!allowed) {
      toast({
        description: `please wait ${remainingSeconds} seconds before trying again`,
        variant: "destructive",
      });
      return;
    }

    // Validate all fields
    try {
      const validatedData = signupSchema.parse(formData);
      
      setIsSubmitting(true);
      
      const { error } = await supabase.from('signups').insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        instagram: validatedData.instagram || null,
        address: validatedData.address,
        likes: validatedData.likes || null,
        listening: validatedData.listening || null,
        flower: validatedData.flower || null,
        colour: validatedData.colour || null,
        song: validatedData.song || null,
        language: validatedData.language || null,
        hindi_comfort: validatedData.hindiUnderstanding || null,
      });

      if (error) throw error;
      
      // Record submission for rate limiting and duplicate prevention
      recordSubmission();
      markAsSubmitted();
      
      nextStep();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          description: error.errors[0].message.toLowerCase(),
          variant: "destructive",
        });
      } else {
        toast({
          description: "something went wrong. please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, nextStep, toast]);

  const handleInstagramOpen = useCallback(() => {
    window.open('https://instagram.com/teendandiyan', '_blank');
  }, []);

  // Already submitted screen
  const alreadySubmittedScreen = (
    <FormScreen key="already-submitted">
      <div className="space-y-6">
        <p className="text-sm breathable">
          you've already signed up.<br />
          i'll take it from here.
        </p>
      </div>
      
      <div className="mt-12">
        <FormButton onClick={handleInstagramOpen}>
          tell me you signed up ;0
        </FormButton>
      </div>
    </FormScreen>
  );

  const screens = useMemo(() => [
    // Screen 0: Basics
    <FormScreen key="basics">
      <p className="text-sm text-muted-foreground mb-8">let's start simple.</p>
      
      <FormInput
        ref={nameRef}
        placeholder="what should i call you"
        value={formData.name}
        onChange={e => updateField('name', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => emailRef.current?.focus())}
        maxLength={100}
      />
      <FormInput
        ref={emailRef}
        type="email"
        placeholder="your best email"
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => phoneRef.current?.focus())}
        maxLength={255}
      />
      <FormInput
        ref={phoneRef}
        type="tel"
        placeholder="your phone number (india post needs it)"
        value={formData.phone}
        onChange={e => updateField('phone', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => {})}
        maxLength={20}
      />
      <FormInput
        placeholder="your instagram username"
        value={formData.instagram}
        onChange={e => updateField('instagram', e.target.value)}
        onKeyDown={e => handleKeyDown(e, () => validateStep0() && nextStep())}
        maxLength={50}
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
        ref={addressRef}
        placeholder="your address"
        value={formData.address}
        onChange={e => updateField('address', e.target.value)}
        maxLength={500}
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
      <p className="text-sm text-muted-foreground mb-8">a few things you like</p>
      
      <FormInput
        ref={likesRef}
        placeholder="films, streets, objects"
        value={formData.likes}
        onChange={e => updateField('likes', e.target.value)}
        maxLength={200}
      />
      <FormInput
        placeholder="genres, moods, artists"
        value={formData.listening}
        onChange={e => updateField('listening', e.target.value)}
        maxLength={200}
      />
      <FormInput
        placeholder="flowers? any flower you like."
        value={formData.flower}
        onChange={e => updateField('flower', e.target.value)}
        maxLength={100}
      />
      <FormInput
        placeholder="colour you end up observing the most"
        value={formData.colour}
        onChange={e => updateField('colour', e.target.value)}
        maxLength={50}
      />
      <FormInput
        placeholder="fave song(s)"
        value={formData.song}
        onChange={e => updateField('song', e.target.value)}
        maxLength={200}
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
          {LANGUAGE_OPTIONS.map(option => (
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
          {HINDI_UNDERSTANDING_OPTIONS.map(option => (
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
      
      <div className="mt-12">
        <FormButton 
          onClick={handleInstagramOpen}
        >
          tell me you signed up ;0
        </FormButton>
      </div>
    </FormScreen>,
  ], [formData, updateField, handleKeyDown, validateStep0, validateStep1, nextStep, handleSubmit, handleInstagramOpen]);

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <AnimatePresence mode="wait">
        {step === -1 ? alreadySubmittedScreen : screens[step]}
      </AnimatePresence>
    </div>
  );
};

export default Form;
