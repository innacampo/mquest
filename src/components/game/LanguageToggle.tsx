import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      className="font-display text-xs px-2"
    >
      {lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}
    </Button>
  );
};

export default LanguageToggle;
