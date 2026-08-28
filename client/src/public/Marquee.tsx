const MARKS = [
  'Ford',
  'RAM',
  'Dodge',
  'Chevrolet',
  'GMC',
  'Jeep',
  'Toyota',
  'Nissan',
  'Volvo',
  'Freightliner',
  'Kenworth',
  'Peterbilt',
  'Cummins',
  'Detroit Diesel',
  'Honda',
  'Yamaha',
  'Suzuki',
  'Harley-Davidson',
  'Mercury',
  'Yamaha Marine',
];

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <div className="marquee__run" aria-hidden={hidden ? 'true' : undefined}>
      {MARKS.map((mark) => (
        <span key={mark} className="marquee__item">
          {mark}
          <i className="marquee__dot" />
        </span>
      ))}
    </div>
  );
}

/** Bandeau des marques, défilement continu — la seconde piste évite la coupure. */
export function Marquee() {
  return (
    <section className="marquee">
      <div className="marquee__track">
        <Run />
        <Run hidden />
      </div>
    </section>
  );
}
