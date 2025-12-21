import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FormButton } from '@/components/FormButton';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track visit
    supabase.from('visits').insert({}).then(() => {});
  }, []);

  const handleStart = () => {
    navigate('/form');
  };

  return (
    <div className="screen overflow-y-auto">
      <Header />
      <div className="flex-1 flex flex-col justify-center py-8 pt-16">
        <div className="space-y-8 breathable text-sm leading-relaxed">
          <p>
            hi, i'm ohm.<br />
            i take photos and post some of them on the internet.<br />
            i rant.<br />
            i shitpost, mostly.<br />
            i write.
          </p>

          <p>and i want to write a letter for you.</p>

          <p>
            i've been wanting to do this for a long time.<br />
            i'm doing it now, i guess.
          </p>

          <p>
            once a month, i'll choose a few people at random.<br />
            five, maybe less.
          </p>

          <p>
            i'll write to you.<br />
            i'll send it to your address.<br />
            and that's it.
          </p>

          <p>
            you can read it and feel anything.<br />
            you can keep it in your scrapbook or throw it in the dustbin.
          </p>

          <p>
            but when you're a little older and narrating your story,<br />
            you'll be able to say<br />
            yeah, i've received written letters.
          </p>

          <p>
            you can write back to me or not.<br />
            a reply is not required.
          </p>

          <div className="space-y-2">
            <p>what is required is this:</p>
            <p>
              when you receive your letter,<br />
              go to your favourite place where you can sit quietly.<br />
              open it.<br />
              read it.
            </p>
          </div>

          <p>
            my words rarely make sense to people.<br />
            but if they do to you,<br />
            you can sign up.
          </p>

          <p>
            also, this might stop anytime.<br />
            or it might grow slowly.<br />
            i don't know yet.
          </p>

          <p>i just know i want to try.</p>

          <p>:)</p>
        </div>

        <div className="mt-12">
          <FormButton onClick={handleStart}>
            i want a written letter
          </FormButton>
        </div>
      </div>
    </div>
  );
};

export default Landing;
