const translations: Record<string, Record<string, string>> = {
  fr: {
    platform: 'Plateforme de cours',
    logout: 'Déconnexion',
    videos: 'Vidéos',
    no_videos: 'Aucune vidéo pour le moment.',
    views: 'Vues',
    uploaded_by: 'Publié par',
    loading: 'Chargement...',
    admin: 'Admin',
    manage_videos: 'Gérer les vidéos',
    delete: 'Supprimer',
    open: 'Ouvrir',
    title: 'Titre',
    description: 'Description',
    upload: 'Téléverser',
    video_url: 'URL de la vidéo (YouTube ou lien de fichier)',
    or_upload: 'Ou téléverser un fichier MP4',
    thumbnail_url: "URL de la miniature (facultatif)",
    or_upload_thumb: 'Ou téléverser une miniature PNG',
    delete_confirm: 'Supprimer cette vidéo ?',
    likes: 'Likes',
    like: 'Aimer',
    theme_dark: 'Sombre',
    theme_light: 'Clair',
    lang_fr: 'Français',
    lang_ar: 'العربية'
  },
  ar: {
    platform: 'منصة الدورات',
    logout: 'تسجيل الخروج',
    videos: 'مقاطع الفيديو',
    no_videos: 'لا توجد فيديوهات حتى الآن.',
    views: 'المشاهدات',
    uploaded_by: 'نشر بواسطة',
    loading: 'جاري التحميل...',
    admin: 'المشرف',
    manage_videos: 'إدارة الفيديوهات',
    delete: 'حذف',
    open: 'فتح',
    title: 'العنوان',
    description: 'الوصف',
    upload: 'رفع',
    video_url: 'رابط الفيديو (يوتيوب أو رابط ملف)',
    or_upload: 'أو رفع ملف MP4',
    thumbnail_url: 'رابط الصورة المصغرة (اختياري)',
    or_upload_thumb: 'أو رفع صورة مصغرة PNG',
    delete_confirm: 'هل تريد حذف هذا الفيديو؟',
    likes: 'الإعجابات',
    like: 'أعجبني',
    theme_dark: 'داكن',
    theme_light: 'فاتح',
    lang_fr: 'Français',
    lang_ar: 'العربية'
  }
}

export function t(key: string) {
  try{
    const lang = (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'fr'
    return translations[lang]?.[key] || translations['fr'][key] || key
  }catch{ return translations['fr'][key] || key }
}

export function setLang(lang: string){ if (typeof window !== 'undefined') localStorage.setItem('lang', lang) }

export function getLang(){ return (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'fr' }
