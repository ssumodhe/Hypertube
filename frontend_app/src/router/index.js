import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'
import VueLocalStorage from 'vue-localstorage'
import MultiLanguage from 'vue-multilanguage'

import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'
import Movie from '@/components/video'
import NotFound from '@/components/404NotFound'

Vue.use(Router)
Vue.use(vueResource)
Vue.use(VueLocalStorage)
Vue.use(MultiLanguage, {
  default: 'en',
  en: {
    welcome: 'Welcome, {name}.',
      // Login-signup
    signup: 'Sign Up',
    email: 'Email',
    username: 'Username',
    first_name: 'First Name',
    last_name: 'Last Name',
    password: 'Password',
    msg_pswd: 'Your password needs to be at least 8 chars long. <br> With lower and upper cases and digits only.',
    confirm_password: 'Confirm password',
    btn_signup: 'Sign Me Up!',
      // Login-signin
    signin: 'Sign In',
    with: 'With the following :',
    or: 'Or here :',
    remember_me: 'Remember Me!',
    forgotten_pswd: 'Forgot your password?',
    btn_signin: 'Sign Me In!',
      // Video
    msg_ad: 'Ad : Your video will play after this ad.',
    msg_cmt: 'Add a comment... Share With Us :) ',
    btn_share: 'Share',
    prev_cmt: 'Previous comments',
    commented : ' commented ',
    no_cmt: 'No comments yet! Be the first to share ! ;)',
      // Home
    new: ' New',
    prev: 'Previous',
    next: 'Next',
    watch: ' Watch',
    all_we_got: 'That\'s all we\'ve got !',
      // Searchbar
    looking_for: 'Are you looking for something in particular ?',
      // App (NavBar)
    home: 'Home',
    profile: 'Profile',
    log_out: 'Log Out',
      // User
    msg_modif: 'Click on any item to modify your data.',
    old_pswd: 'Old password',
    new_pswd: 'New password',
      // Uplaod-file
    msg_upload: 'Drag and drop your profile picture here',

  },
  fr: {
    welcome: 'Bienvenue, {name}.',
      // Login-signup
    signup: 'S\'inscrire',
    email: 'Email',
    username: 'Pseudo',
    first_name: 'Prénom',
    last_name: 'Nom',
    password: 'Mot de passe',
    msg_pswd: 'Votre mot de passe doit contenir au minimum 8 caractères. <br> Avec uniquement des minuscules, majuscules et chiffres.',
    confirm_password: 'Confirmer mot de passe',
    btn_signup: 'S\'inscrire!',
      // Login-signin
    signin: 'Se connecter',
    with: 'Avec :',
    or: 'Ou alors :',
    remember_me: 'Se souvenir de moi!',
    forgotten_pswd: 'Mot de passe oublié?',
    btn_signin: 'Se connecter!',
      // Video
    msg_ad: 'Pub: Votre vidéo commencera après cette publicité.',
    msg_cmt: 'Partagez votre impression, ajoutez un commentaire :) ',
    btn_share: 'Partager',
    prev_cmt: 'Commentaires précédents',
    commented : ' a commenté ',
    no_cmt: 'Pas encore de commentaires! Soyez le premier à partager ! ;)',
      // Home
    new: ' Nouveau',
    prev: 'Précédent',
    next: 'Suivant',
    watch: ' Regarder',
    all_we_got: 'Voilà tout ce que nous ayons !',
      // Searchbar
    looking_for: 'Cherchez vous quelque chose ?',
      // App (NavBar)
    home: 'Accueil',
    profile: 'Compte',
    log_out: 'Déconnexion',
      // User
    msg_modif: 'Cliquez sur vos informations pour en modifier la valeur',
    old_pswd: 'Ancien mot de passe',
    new_pswd: 'Nouveau mot de passe',
      // Upload-file
    msg_upload: 'Ajoutez votre photo de profil ici.',
  },
  it: {
    welcome: 'Benvenuto, {name}.',
      // Login-signup
    signup: 'Registro',
    email: 'Email',
    username: 'Soprannome',
    first_name: 'Conome',
    last_name: 'Nome',
    password: 'Password',
    msg_pswd: 'La tua password deve contenere almeno 8 caratteri. <br> Con solo lettere minuscole, maiuscole e numeri.',
    confirm_password: 'Conferma password',
    btn_signup: 'Registro!',
      // Login-signin
    signin: 'Il login',
    with: 'Con :',
    or: 'O :',
    remember_me: 'Ricordati di me',
    forgotten_pswd: 'Hai dimenticato la password?',
    btn_signin: 'Il login!',
      // Video
    msg_ad: 'Pub: il tuo video inizierà dopo questo annuncio.',
    msg_cmt: 'Condividi la tua impressione, aggiungi un commento :) ',
    btn_share: 'Suddividere',
    prev_cmt: 'Commenti precedenti',
    commented : ' ha commentato ',
    no_cmt: 'Ancora nessun commento! Sii il primo a condividere! ;)',
      // Home
    new: ' Nuovo',
    prev: 'precedente',
    next: 'Seguente',
    watch: ' Guardare',
    all_we_got: 'Questo è tutto ciò che abbiamo!',
      // Searchbar
    looking_for: 'Stai cercando qualcosa in particolare ?',
      // App (NavBar)
    home: 'Accoglienza',
    profile: 'Profilo',
    log_out: 'Esci',
      // User
    msg_modif: 'Clicca sulle tue informazioni per cambiare il valore',
    old_pswd: 'Vecchia password',
    new_pswd: 'Nuova password',
      // Upload-file
    msg_upload: 'Aggiungi la tua immagine del profilo qui.',
  },
  es: {
    welcome: 'Bienvenida, {name}.',
      // Login-signup
    signup: 'Inscribirse',
    email: 'Email',
    username: 'Apodo',
    first_name: 'Nombre',
    last_name: 'Apellido',
    password: 'Contraseña',
    msg_pswd: 'La contraseña debe tener al menos 8 caracteres. <br> Con solo minúsculas, mayúsculas y números.',
    confirm_password: 'Confirmar la contraseña',
    btn_signup: '¡Inscribirs!',
      // Login-signin
    signin: 'Conectarse',
    with: 'Con :',
    or: 'O :',
    remember_me: 'Recuérdame',
    forgotten_pswd: '¿Contraseña olvidada?',
    btn_signin: '¡Conectarse!',
      // Video
    msg_ad: 'Pub: su video comenzará después de este anuncio.',
    msg_cmt: 'Comparta su impresión, agregue un comentario :) ',
    btn_share: 'Compartir',
    prev_cmt: 'Comentarios anteriores',
    commented : ' comentó ',
    no_cmt: 'No hay comentarios todavía ¡Sé el primero en compartir! ;)',
      // Home
    new: ' Nuevo',
    prev: 'Anterior',
    next: 'Próximo',
    watch: ' Mirar',
    all_we_got: 'Eso es todo lo que tenemos !',
      // Searchbar
    looking_for: '¿Estás buscando algo?',
      // App (NavBar)
    home: 'Inicio',
    profile: 'Perfil',
    log_out: 'Salir',
      // User
    msg_modif: 'Haga clic en su información para modificar su valor',
    old_pswd: 'Antigua contraseña',
    new_pswd: 'Nuevo contraseña',
      // Upload-file
    msg_upload: 'Agrega tu foto de perfil aquí.',
  },
  de: {
    welcome: 'Willkommen, {name}.',
      // Login-signup
    signup: 'Registrieren',
    email: 'Email',
    username: 'Spitzname',
    first_name: 'Vorname',
    last_name: 'Name',
    password: 'Passwort',
    msg_pswd: 'Ihr Passwort muss mindestens 8 Zeichen enthalten. <br> Mit nur Kleinbuchstaben, Großbuchstaben und Zahlen.',
    confirm_password: 'Passwort bestätigen',
    btn_signup: 'Registrieren!',
      // Login-signin
    signin: 'Einloggen',
    with: 'Mit :',
    or: 'Oder :',
    remember_me: 'Erinnere mich an mich!',
    forgotten_pswd: 'Passwort vergessen?',
    btn_signin: 'Einloggen!',
      // Video
    msg_ad: 'Pub: Dein Video beginnt nach dieser Werbung.',
    msg_cmt: 'Teilen Sie Ihre Impression, fügen Sie einen Kommentar hinzu :) ',
    btn_share: 'Aktie',
    prev_cmt: 'Vorige Kommentare',
    commented : ' kommentierte ',
    no_cmt: 'Noch keine Kommentare! Sei der Erste, der teilt ! ;)',
      // Home
    new: ' Neu',
    prev: 'Früher',
    next: 'Folgende',
    watch: ' Aussehen',
    all_we_got: 'Das ist alles was wir haben !',
      // Searchbar
    looking_for: 'Suchst du etwas?',
      // App (NavBar)
    home: 'Startseite',
    profile: 'Profil',
    log_out: 'Austragen',
      // User
    msg_modif: 'Klicken Sie auf Ihre Informationen, um den Wert zu ändern',
    old_pswd: 'Altes Passwort',
    new_pswd: 'Neues Passwort',
      // Upload-file
    msg_upload: 'Fügen Sie Ihr Profilbild hier hinzu.',
  },

})


export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user/:username',
      name: 'user',
      component: User
    },
    {
      path: '/video/:which',
      name: 'movie',
      component: Movie
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    }
  ],
  mode: 'history'
  // to avoid # in url
})
