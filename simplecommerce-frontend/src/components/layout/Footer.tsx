export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-low px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-stack-lg md:grid-cols-3">
        <div className="space-y-stack-md">
          <h2 className="font-headline-xl text-headline-xl tracking-widest text-on-surface">
            IVOIRE
          </h2>
          <p className="max-w-xs font-body-md text-on-surface-variant">
            Zamansız tasarım ve etik üretim ilkeleriyle oluşturulmuş modern gardırop kürasyonu.
          </p>
          <div className="flex space-x-4 pt-4 text-secondary">
            <a className="transition-colors hover:text-primary" href="#">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-stack-lg">
          <div className="space-y-4">
            <h4 className="font-label-sm text-label-sm text-on-surface">MÜŞTERİ HİZMETLERİ</h4>
            <ul className="space-y-2 font-body-md text-on-surface-variant">
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  İletişim
                </a>
              </li>
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  Kargo
                </a>
              </li>
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  İade
                </a>
              </li>
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  SSS
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-sm text-label-sm text-on-surface">KURUMSAL</h4>
            <ul className="space-y-2 font-body-md text-on-surface-variant">
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  Sürdürülebilirlik
                </a>
              </li>
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  Dergi
                </a>
              </li>
              <li>
                <a className="underline-offset-4 transition-opacity hover:text-primary hover:underline" href="#">
                  Bülten
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between md:text-right">
          <div className="space-y-2">
            <p className="font-label-sm text-label-sm uppercase text-on-surface">
              Bizi Takip Edin
            </p>
            <p className="font-body-md text-on-surface-variant">@ivoire_boutique</p>
          </div>
          <p className="mt-stack-lg font-label-sm text-label-sm text-on-secondary-fixed-variant">
            © 2026 IVOIRE. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
