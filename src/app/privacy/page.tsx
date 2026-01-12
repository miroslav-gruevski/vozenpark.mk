'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Header } from '@/components/Header';
import { getTranslations, getLanguageFromStorage, setLanguageToStorage, languages } from '@/lib/i18n';
import type { Language } from '@/types';

// Translations for privacy policy page
const translations: Record<string, Record<Language, string>> = {
  pageTitle: {
    en: 'Privacy Policy',
    mk: 'Правила за приватност',
    sq: 'Politika e Privatësisë',
    tr: 'Gizlilik Politikası',
    sr: 'Правила приватности',
  },
  lastUpdated: {
    en: 'Last updated: January 12, 2026',
    mk: 'Последно ажурирање: 12 јануари 2026',
    sq: 'Përditësuar së fundi: 12 janar 2026',
    tr: 'Son güncelleme: 12 Ocak 2026',
    sr: 'Последње ажурирање: 12. јануар 2026.',
  },
  // Section 1 - Introduction
  section1Title: {
    en: '1. Introduction',
    mk: '1. Вовед',
    sq: '1. Hyrje',
    tr: '1. Giriş',
    sr: '1. Увод',
  },
  section1Content: {
    en: 'VozenPark.mk ("we", "us" or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal data when you use our vehicle registration management web application.',
    mk: 'VozenPark.mk („ние", „нас" или „наш") е посветен на заштита на вашата приватност. Овие Правила за приватност објаснуваат како ги собираме, користиме, споделуваме и заштитуваме вашите лични податоци кога ја користите нашата веб апликација за управување со регистрација на возила.',
    sq: 'VozenPark.mk ("ne", "neve" ose "jonë") është i përkushtuar për mbrojtjen e privatësisë tuaj. Kjo Politikë e Privatësisë shpjegon se si i mbledhim, përdorim, ndajmë dhe mbrojmë të dhënat tuaja personale kur përdorni aplikacionin tonë web për menaxhimin e regjistrimit të automjeteve.',
    tr: 'VozenPark.mk ("biz", "bize" veya "bizim") gizliliğinizi korumaya kararlıdır. Bu Gizlilik Politikası, araç kayıt yönetimi web uygulamamızı kullandığınızda kişisel verilerinizi nasıl topladığımızı, kullandığımızı, paylaştığımızı ve koruduğumuzu açıklar.',
    sr: 'VozenPark.mk („ми", „нас" или „наш") је посвећен заштити ваше приватности. Ова Правила приватности објашњавају како прикупљамо, користимо, делимо и штитимо ваше личне податке када користите нашу веб апликацију за управљање регистрацијом возила.',
  },
  // Section 2 - Data We Collect
  section2Title: {
    en: '2. Data We Collect',
    mk: '2. Податоци што ги собираме',
    sq: '2. Të Dhënat që Mbledhim',
    tr: '2. Topladığımız Veriler',
    sr: '2. Подаци које прикупљамо',
  },
  section2Content: {
    en: 'We collect the following types of data:',
    mk: 'Ги собираме следниве видови податоци:',
    sq: 'Ne mbledhim llojet e mëposhtme të të dhënave:',
    tr: 'Aşağıdaki veri türlerini topluyoruz:',
    sr: 'Прикупљамо следеће врсте података:',
  },
  accountData: {
    en: 'Account data: Email address, first and last name, company name',
    mk: 'Податоци за сметка: Е-маил адреса, име и презиме, име на фирма',
    sq: 'Të dhënat e llogarisë: Adresa e emailit, emri dhe mbiemri, emri i kompanisë',
    tr: 'Hesap verileri: E-posta adresi, ad ve soyad, şirket adı',
    sr: 'Подаци о налогу: Е-маил адреса, име и презиме, назив фирме',
  },
  vehicleData: {
    en: 'Vehicle data: Vehicle name, license plate, registration expiry date, chassis number, responsible person',
    mk: 'Податоци за возила: Име на возило, регистарска таблица, датум на истек на регистрација, број на шасија, одговорно лице',
    sq: 'Të dhënat e automjeteve: Emri i automjetit, targa, data e skadimit të regjistrimit, numri i shasisë, personi përgjegjës',
    tr: 'Araç verileri: Araç adı, plaka, kayıt bitiş tarihi, şasi numarası, sorumlu kişi',
    sr: 'Подаци о возилима: Назив возила, регистарска таблица, датум истека регистрације, број шасије, одговорно лице',
  },
  technicalData: {
    en: 'Technical data: IP address, browser type, access time',
    mk: 'Технички податоци: IP адреса, тип на прелистувач, време на пристап',
    sq: 'Të dhënat teknike: Adresa IP, lloji i shfletuesit, koha e hyrjes',
    tr: 'Teknik veriler: IP adresi, tarayıcı türü, erişim zamanı',
    sr: 'Технички подаци: IP адреса, тип прегледача, време приступа',
  },
  communicationData: {
    en: 'Communication data: Your messages and requests sent via contact forms',
    mk: 'Податоци за комуникација: Вашите пораки и барања испратени преку контакт форми',
    sq: 'Të dhënat e komunikimit: Mesazhet dhe kërkesat tuaja të dërguara përmes formularëve të kontaktit',
    tr: 'İletişim verileri: İletişim formları aracılığıyla gönderilen mesaj ve talepleriniz',
    sr: 'Подаци о комуникацији: Ваше поруке и захтеви послати путем контакт форми',
  },
  // Section 3 - How We Use Your Data
  section3Title: {
    en: '3. How We Use Your Data',
    mk: '3. Како ги користиме вашите податоци',
    sq: '3. Si i Përdorim të Dhënat Tuaja',
    tr: '3. Verilerinizi Nasıl Kullanıyoruz',
    sr: '3. Како користимо ваше податке',
  },
  section3Content: {
    en: 'We use your data to:',
    mk: 'Вашите податоци ги користиме за:',
    sq: 'Ne i përdorim të dhënat tuaja për:',
    tr: 'Verilerinizi şu amaçlarla kullanıyoruz:',
    sr: 'Ваше податке користимо за:',
  },
  useCase1: {
    en: 'Providing vehicle registration management service',
    mk: 'Обезбедување услуга за управување со регистрација на возила',
    sq: 'Ofrimin e shërbimit të menaxhimit të regjistrimit të automjeteve',
    tr: 'Araç kayıt yönetimi hizmeti sunma',
    sr: 'Пружање услуге управљања регистрацијом возила',
  },
  useCase2: {
    en: 'Sending automatic reminders about registration expiry via email',
    mk: 'Испраќање автоматски потсетници за истек на регистрација преку е-маил',
    sq: 'Dërgimin e kujtesave automatike për skadimin e regjistrimit nëpërmjet emailit',
    tr: 'Kayıt bitiş tarihi hakkında e-posta ile otomatik hatırlatıcılar gönderme',
    sr: 'Слање аутоматских подсетника о истеку регистрације путем е-маила',
  },
  useCase3: {
    en: 'Authentication and security of your account',
    mk: 'Автентикација и безбедност на вашата сметка',
    sq: 'Autentifikimin dhe sigurinë e llogarisë tuaj',
    tr: 'Hesabınızın kimlik doğrulaması ve güvenliği',
    sr: 'Аутентификацију и безбедност вашег налога',
  },
  useCase4: {
    en: 'Improving our service and user experience',
    mk: 'Подобрување на нашата услуга и корисничко искуство',
    sq: 'Përmirësimin e shërbimit tonë dhe përvojës së përdoruesit',
    tr: 'Hizmetimizi ve kullanıcı deneyimini iyileştirme',
    sr: 'Побољшање наше услуге и корисничког искуства',
  },
  useCase5: {
    en: 'Communicating with you about your account or our services',
    mk: 'Комуникација со вас за вашата сметка или нашите услуги',
    sq: 'Komunikimin me ju rreth llogarisë tuaj ose shërbimeve tona',
    tr: 'Hesabınız veya hizmetlerimiz hakkında sizinle iletişim kurma',
    sr: 'Комуникацију са вама о вашем налогу или нашим услугама',
  },
  // Section 4 - Legal Basis
  section4Title: {
    en: '4. Legal Basis for Processing',
    mk: '4. Правна основа за обработка',
    sq: '4. Baza Ligjore për Përpunimin',
    tr: '4. İşleme için Yasal Dayanak',
    sr: '4. Правни основ за обраду',
  },
  section4Content: {
    en: 'We process your data based on:',
    mk: 'Вашите податоци ги обработуваме врз основа на:',
    sq: 'Ne i përpunojmë të dhënat tuaja bazuar në:',
    tr: 'Verilerinizi şu temellerde işliyoruz:',
    sr: 'Ваше податке обрађујемо на основу:',
  },
  legalBasis1: {
    en: 'Contract performance: Processing is necessary for providing the service you requested',
    mk: 'Извршување договор: Обработката е неопходна за обезбедување на услугата што ја побаравте',
    sq: 'Ekzekutimi i kontratës: Përpunimi është i nevojshëm për ofrimin e shërbimit që keni kërkuar',
    tr: 'Sözleşme ifası: Talep ettiğiniz hizmeti sunmak için işleme gereklidir',
    sr: 'Извршење уговора: Обрада је неопходна за пружање услуге коју сте затражили',
  },
  legalBasis2: {
    en: 'Legitimate interest: Improving and securing our service',
    mk: 'Легитимен интерес: Подобрување и безбедност на нашата услуга',
    sq: 'Interesi legjitim: Përmirësimi dhe siguria e shërbimit tonë',
    tr: 'Meşru menfaat: Hizmetimizi iyileştirme ve güvenliğini sağlama',
    sr: 'Легитимни интерес: Побољшање и безбедност наше услуге',
  },
  legalBasis3: {
    en: 'Consent: When your explicit consent is required',
    mk: 'Согласност: Кога е потребна вашата изречна согласност',
    sq: 'Pëlqimi: Kur kërkohet pëlqimi juaj i qartë',
    tr: 'Onay: Açık onayınız gerektiğinde',
    sr: 'Пристанак: Када је потребан ваш изричити пристанак',
  },
  // Section 5 - Data Sharing
  section5Title: {
    en: '5. Data Sharing',
    mk: '5. Споделување податоци',
    sq: '5. Ndarja e të Dhënave',
    tr: '5. Veri Paylaşımı',
    sr: '5. Дељење података',
  },
  section5Content: {
    en: 'We do not sell your personal data. We only share data with:',
    mk: 'Не ги продаваме вашите лични податоци. Податоците ги споделуваме само со:',
    sq: 'Ne nuk i shesim të dhënat tuaja personale. Ne i ndajmë të dhënat vetëm me:',
    tr: 'Kişisel verilerinizi satmıyoruz. Verileri yalnızca şunlarla paylaşıyoruz:',
    sr: 'Не продајемо ваше личне податке. Податке делимо само са:',
  },
  dataSharing1: {
    en: 'Database providers: For data storage and authentication',
    mk: 'Провајдери на бази на податоци: За складирање податоци и автентикација',
    sq: 'Ofruesit e bazës së të dhënave: Për ruajtjen e të dhënave dhe autentifikimin',
    tr: 'Veritabanı sağlayıcıları: Veri depolama ve kimlik doğrulama için',
    sr: 'Провајдери база података: За складиштење података и аутентификацију',
  },
  dataSharing2: {
    en: 'Hosting providers: For application hosting',
    mk: 'Провајдери за хостинг: За хостирање на апликацијата',
    sq: 'Ofruesit e hostimit: Për hostimin e aplikacionit',
    tr: 'Hosting sağlayıcıları: Uygulama barındırma için',
    sr: 'Провајдери за хостинг: За хостовање апликације',
  },
  dataSharing3: {
    en: 'Email service providers: For sending email notifications',
    mk: 'Провајдери за е-маил услуги: За испраќање е-маил известувања',
    sq: 'Ofruesit e shërbimit të emailit: Për dërgimin e njoftimeve me email',
    tr: 'E-posta hizmet sağlayıcıları: E-posta bildirimleri göndermek için',
    sr: 'Провајдери е-маил услуга: За слање е-маил обавештења',
  },
  // Section 6 - Data Security
  section6Title: {
    en: '6. Data Security',
    mk: '6. Безбедност на податоци',
    sq: '6. Siguria e të Dhënave',
    tr: '6. Veri Güvenliği',
    sr: '6. Безбедност података',
  },
  section6Content: {
    en: 'We implement technical and organizational measures to protect your data, including:',
    mk: 'Применуваме технички и организациски мерки за заштита на вашите податоци, вклучувајќи:',
    sq: 'Ne zbatojmë masa teknike dhe organizative për të mbrojtur të dhënat tuaja, duke përfshirë:',
    tr: 'Verilerinizi korumak için teknik ve organizasyonel önlemler uyguluyoruz:',
    sr: 'Примењујемо техничке и организационе мере за заштиту ваших података, укључујући:',
  },
  security1: {
    en: 'Data encryption in transit (HTTPS/TLS)',
    mk: 'Енкрипција на податоци при пренос (HTTPS/TLS)',
    sq: 'Kriptimi i të dhënave gjatë transferimit (HTTPS/TLS)',
    tr: 'Aktarımda veri şifreleme (HTTPS/TLS)',
    sr: 'Енкрипција података у преносу (HTTPS/TLS)',
  },
  security2: {
    en: 'Secure authentication',
    mk: 'Безбедна автентикација',
    sq: 'Autentifikim i sigurt',
    tr: 'Güvenli kimlik doğrulama',
    sr: 'Безбедна аутентификација',
  },
  security3: {
    en: 'Role-based data access restrictions',
    mk: 'Ограничен пристап до податоци врз основа на улоги',
    sq: 'Kufizime të qasjes në të dhëna bazuar në role',
    tr: 'Rol tabanlı veri erişim kısıtlamaları',
    sr: 'Ограничења приступа подацима на основу улога',
  },
  security4: {
    en: 'Regular security audits',
    mk: 'Редовни безбедносни проверки',
    sq: 'Auditime të rregullta sigurie',
    tr: 'Düzenli güvenlik denetimleri',
    sr: 'Редовне безбедносне провере',
  },
  // Section 7 - Data Retention
  section7Title: {
    en: '7. Data Retention',
    mk: '7. Чување на податоци',
    sq: '7. Ruajtja e të Dhënave',
    tr: '7. Veri Saklama',
    sr: '7. Чување података',
  },
  section7Content: {
    en: 'We retain your data as long as you have an active account. After closing your account, data is deleted within 30 days, unless legal regulations require longer retention.',
    mk: 'Вашите податоци ги чуваме додека имате активна сметка. По затворање на сметката, податоците се бришат во рок од 30 дена, освен ако законските прописи бараат подолго чување.',
    sq: 'Ne i ruajmë të dhënat tuaja për aq kohë sa keni një llogari aktive. Pas mbylljes së llogarisë, të dhënat fshihen brenda 30 ditëve, përveç nëse rregulloret ligjore kërkojnë ruajtje më të gjatë.',
    tr: 'Aktif bir hesabınız olduğu sürece verilerinizi saklıyoruz. Hesabınızı kapattıktan sonra veriler 30 gün içinde silinir, yasal düzenlemeler daha uzun saklama gerektirmedikçe.',
    sr: 'Ваше податке чувамо док год имате активан налог. Након затварања налога, подаци се бришу у року од 30 дана, осим ако законски прописи захтевају дуже чување.',
  },
  // Section 8 - Your Rights
  section8Title: {
    en: '8. Your Rights',
    mk: '8. Ваши права',
    sq: '8. Të Drejtat Tuaja',
    tr: '8. Haklarınız',
    sr: '8. Ваша права',
  },
  section8Content: {
    en: 'You have the following rights:',
    mk: 'Имате следниве права:',
    sq: 'Ju keni të drejtat e mëposhtme:',
    tr: 'Aşağıdaki haklara sahipsiniz:',
    sr: 'Имате следећа права:',
  },
  right1: {
    en: 'Right of access: Request a copy of your data',
    mk: 'Право на пристап: Побарајте копија од вашите податоци',
    sq: 'E drejta e qasjes: Kërkoni një kopje të të dhënave tuaja',
    tr: 'Erişim hakkı: Verilerinizin bir kopyasını talep edin',
    sr: 'Право приступа: Затражите копију ваших података',
  },
  right2: {
    en: 'Right to rectification: Correct inaccurate data',
    mk: 'Право на исправка: Исправете неточни податоци',
    sq: 'E drejta e korrigjimit: Korrigjoni të dhënat e pasakta',
    tr: 'Düzeltme hakkı: Yanlış verileri düzeltin',
    sr: 'Право на исправку: Исправите нетачне податке',
  },
  right3: {
    en: 'Right to erasure: Request deletion of your data',
    mk: 'Право на бришење: Побарајте бришење на вашите податоци',
    sq: 'E drejta e fshirjes: Kërkoni fshirjen e të dhënave tuaja',
    tr: 'Silme hakkı: Verilerinizin silinmesini talep edin',
    sr: 'Право на брисање: Затражите брисање ваших података',
  },
  right4: {
    en: 'Right to restriction: Restrict how your data is used',
    mk: 'Право на ограничување: Ограничете како се користат вашите податоци',
    sq: 'E drejta e kufizimit: Kufizoni mënyrën e përdorimit të të dhënave tuaja',
    tr: 'Kısıtlama hakkı: Verilerinizin nasıl kullanıldığını kısıtlayın',
    sr: 'Право на ограничење: Ограничите начин коришћења ваших података',
  },
  right5: {
    en: 'Right to portability: Receive data in a machine-readable format',
    mk: 'Право на преносливост: Добијте податоци во машински читлив формат',
    sq: 'E drejta e portabilitetit: Merrni të dhënat në format të lexueshëm nga makina',
    tr: 'Taşınabilirlik hakkı: Verileri makine tarafından okunabilir formatta alın',
    sr: 'Право на преносивост: Добијте податке у машински читљивом формату',
  },
  right6: {
    en: 'Right to object: Object to data processing',
    mk: 'Право на приговор: Поднесете приговор на обработка на податоци',
    sq: 'E drejta e kundërshtimit: Kundërshtoni përpunimin e të dhënave',
    tr: 'İtiraz hakkı: Veri işlemeye itiraz edin',
    sr: 'Право на приговор: Уложите приговор на обраду података',
  },
  rightsContact: {
    en: 'To exercise these rights, contact us at the email address below.',
    mk: 'За остварување на овие права, контактирајте нè на е-маил адресата подолу.',
    sq: 'Për të ushtruar këto të drejta, na kontaktoni në adresën e emailit më poshtë.',
    tr: 'Bu hakları kullanmak için aşağıdaki e-posta adresinden bizimle iletişime geçin.',
    sr: 'За остваривање ових права, контактирајте нас на е-маил адреси испод.',
  },
  // Section 9 - Cookies
  section9Title: {
    en: '9. Cookies',
    mk: '9. Колачиња',
    sq: '9. Cookies',
    tr: '9. Çerezler',
    sr: '9. Колачићи',
  },
  section9Content: {
    en: 'We only use essential cookies for the application to work:',
    mk: 'Користиме само неопходни колачиња за работа на апликацијата:',
    sq: 'Ne përdorim vetëm cookies thelbësore për funksionimin e aplikacionit:',
    tr: 'Uygulamanın çalışması için yalnızca gerekli çerezleri kullanıyoruz:',
    sr: 'Користимо само неопходне колачиће за рад апликације:',
  },
  cookie1: {
    en: 'Authentication cookies: To maintain your login session',
    mk: 'Колачиња за автентикација: За одржување на вашата сесија за најава',
    sq: 'Cookies autentifikimi: Për të mbajtur sesionin tuaj të hyrjes',
    tr: 'Kimlik doğrulama çerezleri: Oturum açma oturumunuzu sürdürmek için',
    sr: 'Колачићи за аутентификацију: За одржавање ваше сесије пријаве',
  },
  cookie2: {
    en: 'Security cookies: To protect against attacks',
    mk: 'Безбедносни колачиња: За заштита од напади',
    sq: 'Cookies sigurie: Për t\'u mbrojtur nga sulmet',
    tr: 'Güvenlik çerezleri: Saldırılara karşı koruma için',
    sr: 'Безбедносни колачићи: За заштиту од напада',
  },
  noCookieTracking: {
    en: 'We do not use cookies for tracking or advertising.',
    mk: 'Не користиме колачиња за следење или рекламирање.',
    sq: 'Ne nuk përdorim cookies për gjurmim ose reklamim.',
    tr: 'İzleme veya reklam için çerez kullanmıyoruz.',
    sr: 'Не користимо колачиће за праћење или оглашавање.',
  },
  // Section 10 - Policy Changes
  section10Title: {
    en: '10. Policy Changes',
    mk: '10. Промени на правилата',
    sq: '10. Ndryshimet e Politikës',
    tr: '10. Politika Değişiklikleri',
    sr: '10. Промене правила',
  },
  section10Content: {
    en: 'We reserve the right to modify this Privacy Policy. You will be notified of significant changes via email or in-app notification.',
    mk: 'Го задржуваме правото за измена на овие Правила за приватност. За значајни промени ќе бидете известени преку е-маил или известување во апликацијата.',
    sq: 'Ne rezervojmë të drejtën për të modifikuar këtë Politikë të Privatësisë. Ju do të njoftoheni për ndryshimet e rëndësishme përmes emailit ose njoftimit në aplikacion.',
    tr: 'Bu Gizlilik Politikasını değiştirme hakkını saklı tutuyoruz. Önemli değişiklikler hakkında e-posta veya uygulama içi bildirim yoluyla bilgilendirileceksiniz.',
    sr: 'Задржавамо право измене ових Правила приватности. О значајним променама бићете обавештени путем е-маила или обавештења у апликацији.',
  },
  // Section 11 - Contact
  section11Title: {
    en: '11. Contact',
    mk: '11. Контакт',
    sq: '11. Kontakti',
    tr: '11. İletişim',
    sr: '11. Контакт',
  },
  section11Content: {
    en: 'For all privacy and data protection questions, contact us:',
    mk: 'За сите прашања за приватност и заштита на податоци, контактирајте нè:',
    sq: 'Për të gjitha pyetjet rreth privatësisë dhe mbrojtjes së të dhënave, na kontaktoni:',
    tr: 'Tüm gizlilik ve veri koruma soruları için bizimle iletişime geçin:',
    sr: 'За сва питања о приватности и заштити података, контактирајте нас:',
  },
  email: {
    en: 'Email:',
    mk: 'Е-маил:',
    sq: 'Email:',
    tr: 'E-posta:',
    sr: 'Е-маил:',
  },
  allRightsReserved: {
    en: '© 2026 VozenPark. All rights reserved.',
    mk: '© 2026 VozenPark. Сите права задржани.',
    sq: '© 2026 VozenPark. Të gjitha të drejtat e rezervuara.',
    tr: '© 2026 VozenPark. Tüm hakları saklıdır.',
    sr: '© 2026 VozenPark. Сва права задржана.',
  },
  // Footer
  home: {
    en: 'Home',
    mk: 'Почетна',
    sq: 'Ballina',
    tr: 'Ana Sayfa',
    sr: 'Почетна',
  },
  pricing: {
    en: 'Pricing',
    mk: 'Цени',
    sq: 'Çmimet',
    tr: 'Fiyatlar',
    sr: 'Цене',
  },
  login: {
    en: 'Login',
    mk: 'Најава',
    sq: 'Hyrje',
    tr: 'Giriş',
    sr: 'Пријава',
  },
};

export default function PrivacyPage() {
  const theme = useTheme();
  const [language, setLanguage] = useState<Language>('mk');

  useEffect(() => {
    setLanguage(getLanguageFromStorage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLanguageToStorage(lang);
  };

  const txt = (key: string) => translations[key]?.[language] || translations[key]?.en || key;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header language={language} onLanguageChange={handleLanguageChange} />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Title */}
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight={700} 
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' } }}
        >
          {txt('pageTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {txt('lastUpdated')}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Section 1 - Introduction */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section1Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section1Content')}
          </Typography>
        </Box>

        {/* Section 2 - Data We Collect */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section2Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section2Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1"><strong>{txt('accountData').split(':')[0]}:</strong> {txt('accountData').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('vehicleData').split(':')[0]}:</strong> {txt('vehicleData').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('technicalData').split(':')[0]}:</strong> {txt('technicalData').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('communicationData').split(':')[0]}:</strong> {txt('communicationData').split(':')[1]}</Typography></li>
          </Box>
        </Box>

        {/* Section 3 - How We Use Your Data */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section3Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section3Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1">{txt('useCase1')}</Typography></li>
            <li><Typography variant="body1">{txt('useCase2')}</Typography></li>
            <li><Typography variant="body1">{txt('useCase3')}</Typography></li>
            <li><Typography variant="body1">{txt('useCase4')}</Typography></li>
            <li><Typography variant="body1">{txt('useCase5')}</Typography></li>
          </Box>
        </Box>

        {/* Section 4 - Legal Basis */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section4Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section4Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1"><strong>{txt('legalBasis1').split(':')[0]}:</strong> {txt('legalBasis1').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('legalBasis2').split(':')[0]}:</strong> {txt('legalBasis2').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('legalBasis3').split(':')[0]}:</strong> {txt('legalBasis3').split(':')[1]}</Typography></li>
          </Box>
        </Box>

        {/* Section 5 - Data Sharing */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section5Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section5Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1"><strong>{txt('dataSharing1').split(':')[0]}:</strong> {txt('dataSharing1').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('dataSharing2').split(':')[0]}:</strong> {txt('dataSharing2').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('dataSharing3').split(':')[0]}:</strong> {txt('dataSharing3').split(':')[1]}</Typography></li>
          </Box>
        </Box>

        {/* Section 6 - Data Security */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section6Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section6Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1">{txt('security1')}</Typography></li>
            <li><Typography variant="body1">{txt('security2')}</Typography></li>
            <li><Typography variant="body1">{txt('security3')}</Typography></li>
            <li><Typography variant="body1">{txt('security4')}</Typography></li>
          </Box>
        </Box>

        {/* Section 7 - Data Retention */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section7Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section7Content')}
          </Typography>
        </Box>

        {/* Section 8 - Your Rights */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section8Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section8Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1"><strong>{txt('right1').split(':')[0]}:</strong> {txt('right1').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('right2').split(':')[0]}:</strong> {txt('right2').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('right3').split(':')[0]}:</strong> {txt('right3').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('right4').split(':')[0]}:</strong> {txt('right4').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('right5').split(':')[0]}:</strong> {txt('right5').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('right6').split(':')[0]}:</strong> {txt('right6').split(':')[1]}</Typography></li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {txt('rightsContact')}
          </Typography>
        </Box>

        {/* Section 9 - Cookies */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section9Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section9Content')}
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><Typography variant="body1"><strong>{txt('cookie1').split(':')[0]}:</strong> {txt('cookie1').split(':')[1]}</Typography></li>
            <li><Typography variant="body1"><strong>{txt('cookie2').split(':')[0]}:</strong> {txt('cookie2').split(':')[1]}</Typography></li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {txt('noCookieTracking')}
          </Typography>
        </Box>

        {/* Section 10 - Policy Changes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section10Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section10Content')}
          </Typography>
        </Box>

        {/* Section 11 - Contact */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {txt('section11Title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {txt('section11Content')}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {txt('email')} <a href="mailto:info@vozenpark.mk" style={{ color: theme.palette.primary.main }}>info@vozenpark.mk</a>
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {txt('allRightsReserved')}
        </Typography>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#FFFFFF', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center" 
            spacing={2}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                <Box
                  component="img"
                  src="/VozenPark_logo.svg"
                  alt="VozenPark"
                  sx={{ height: 20 }}
                />
                <Typography variant="body1" fontWeight={500} color="text.primary" sx={{ lineHeight: 1 }}>
                  VozenPark.mk
                </Typography>
              </Stack>
            </Link>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" color="text.secondary" component={Link} href="/" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                {txt('home')}
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/pricing" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                {txt('pricing')}
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/login" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                {txt('login')}
              </Typography>
              <Typography variant="body2" color="primary.main" fontWeight={500} component={Link} href="/privacy" sx={{ textDecoration: 'none' }}>
                {txt('pageTitle')}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {txt('allRightsReserved')}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
