import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { BookOpen, Users, Brain, Star, ShieldCheck, GraduationCap, Pencil, Briefcase, Building, MessageCircle } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800/50">
                <ShieldCheck className="w-4 h-4" /> Plateforme officielle approuvée
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Le réseau<span className="text-blue-600 dark:text-blue-500"> de l'excellence académique</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Connectez-vous avec à un réseau d'étudiant et de professionnels pour partager, échanger et se former. Accédez à des milliers de ressources exclusives, trouvez le mentor idéal et décrochez les opportunités qui propulseront votre avenir.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-8 text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-blue-600 hover:bg-blue-700 text-white">
                    Rejoindre gratuitement
                  </Button>
                </Link>
                <Link to="/login" className="text-sm font-bold leading-6 text-slate-900 dark:text-white group hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Déjà membre ? Se connecter <span aria-hidden="true" className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Right Image Container - Animated */}
            <div className="relative mt-12 lg:mt-0 animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-blue-900/20 animate-[pulse_10s_ease-in-out_infinite] group">
                <img
                  src="https://media.istockphoto.com/id/1480342397/fr/photo/%C3%A9tudiants-amis-et-groupe-%C3%A9tudiant-avec-un-ordinateur-portable-au-parc-ext%C3%A9rieur-bourse.jpg?s=612x612&w=0&k=20&c=tYsi_fR0vo3_ZFtEoKXfKgPh5u9sX4zC2Rmg1z5qrF0="
                  alt="Diplômés heureux célébrant leur réussite"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 dark:from-slate-900/80 to-transparent"></div>
              </div>

              {/* Decorative tags */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl dark:shadow-black/50 border border-transparent dark:border-slate-700 flex items-center gap-4 animate-[bounce_5s_infinite]">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">IA Intégrée</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Match parfait à 98%</p>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 lg:-right-12 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl dark:shadow-black/50 border border-transparent dark:border-slate-700 flex items-center gap-4 animate-[bounce_6s_infinite] delay-1000">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                  <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">+10k Membres</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Réseau d'excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 dark:bg-blue-900/40 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="mx-auto flex max-w-xs flex-col gap-y-2">
              <dt className="text-base leading-7 text-blue-100 dark:text-blue-200">Étudiants et professionnels</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">10.5k+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-2">
              <dt className="text-base leading-7 text-blue-100 dark:text-blue-200">Documents validés</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">5,000+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-2">
              <dt className="text-base leading-7 text-blue-100 dark:text-blue-200">Mentors certifiés</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">350+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-2">
              <dt className="text-base leading-7 text-blue-100 dark:text-blue-200">Taux de placement (Stage/Bourse)</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">92%</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 sm:py-32 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-bold leading-7 text-blue-600 dark:text-blue-400 uppercase tracking-wide">Périmètre fonctionnel</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Tout pour votre réussite académique
            </p>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Notre écosystème réunit les outils les plus performants pour garantir que chaque membre puisse atteindre ses objectifs.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Bibliothèque collaborative
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Partagez et consultez des fiches de révision, annales et cours validés par l'équipe pédagogique. Profitez de l'intelligence collective de milliers de pairs.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  Réseau & mentorat
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Trouvez des parrains académiques et professionnels (Chercheurs, Ingénieurs, Cadres) pour vous guider dans votre orientation avec des conseils concrets.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                    <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  LeRéseau-Match (IA)
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Notre puissant assistant IA analyse votre dossier et vous suggère instantanément les meilleures bourses, offres de stages et opportunités ciblées.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Devenez un Mentor certifié
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Rejoignez notre communauté de mentors certifiés et partagez votre expertise avec la prochaine génération d'étudiants.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Propulser votre institution
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Développez votre visibilité et accédez à un vivier exceptionnel de talents qualifiés. Attirez les meilleurs étudiants, valorisez vos programmes et renforcez votre marque académique auprès de la communauté.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                    <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  Offrir des opportunités
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Publiez des offres de stage, d'alternance ou d'emploi directement auprès des étudiants les plus qualifiés. Devenez une référence pour les talents de demain et recrutez en toute sérénité.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <Pencil className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Publier et valoriser
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Partagez vos succès, vos actualités et vos réalisations auprès de toute la communauté. Renforcez votre image d'acteur clé dans le paysage académique et professionnel.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-slate-900 dark:text-white mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Discuter dans un forum d'orientation
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">Poser des questions, donner votre avis, échanger et trouver des réponses avec les autres membres de la communauté sur des sujets qui vous intéressent.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-slate-950 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center mb-16">
            <h2 className="text-lg font-bold leading-8 tracking-tight text-blue-600 dark:text-blue-400">La force du réseau</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Ce que disent nos membres</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Fatoumata S.", role: "Titulaire Bourse Master", text: "Grâce à l'IA de Matchmaking, j'ai trouvé en 2 jours une bourse spécifique à mon domaine de recherche. C'est incroyable !", rating: 5 },
              { name: "Marc K.", role: "Consultant & Mentor", text: "Le système de mentorat est extrêmement bien pensé. Accompagner la jeune génération est une vraie fierté pour moi.", rating: 5 },
              { name: "Élise Dubois", role: "Major de Promotion L3", text: "Les annales validées par la plateforme m'ont permis d'optimiser mes révisions pour mes partiels. Indispensable !", rating: 4 }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover" style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=User+${i + 1}&background=cbd5e1&color=64748b)` }}></div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="bg-blue-900 dark:bg-indigo-950 relative overflow-hidden py-20 px-6 lg:px-8 text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <GraduationCap className="h-16 w-16 text-white/50 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-6">
            Prêt à faire partie de l'élite académique engagée ?
          </h2>
          <p className="text-lg text-blue-100 dark:text-indigo-200 mb-10 max-w-2xl mx-auto">
            Ne laissez plus vos opportunités au hasard. Rejoignez un réseau structuré, ambitieux et bienveillant qui valorise vos talents.
          </p>
          <Link to="/register">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg shadow-xl hover:scale-105 transition-all bg-white text-blue-900 hover:bg-slate-50 font-bold border-0">
              Rejoindre gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
