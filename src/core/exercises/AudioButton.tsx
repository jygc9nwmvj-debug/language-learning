type Props = {
  src: string;
  label?: string;
};

export function AudioButton({ src, label = 'Listen' }: Props) {
  const play = () => {
    const audio = new Audio(src);
    void audio.play();
  };

  return (
    <button className="secondaryButton" type="button" onClick={play}>
      <span aria-hidden="true">▶</span> {label}
    </button>
  );
}
