import AudioToggle from './AudioToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <span className="font-montserrat font-light text-foreground/80 text-sm tracking-wide">
        ohm
      </span>
      <AudioToggle />
    </header>
  );
};

export default Header;
